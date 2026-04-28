import { PrismaClient, type User } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { catalogProducts } from "./data/catalog.js";
import { sampleUsers, userProfiles } from "./data/users.js";
import {
  extraSocialPosts,
  greenDayLikeEmails,
  livelyLikeEmails,
  livelyLikePostIds,
  retroUserPosts,
  socialInteractions,
} from "./data/social.js";

const prisma = new PrismaClient();
const passwordHash = await bcrypt.hash("password", 10);

const upsertUserSettings = (userId: string) => prisma.userSettings.upsert({
  where: { userId },
  update: {},
  create: { userId },
});

const createSeedContext = () => {
  const users = new Map<string, User>();

  const rememberUser = (user: User) => {
    users.set(user.email, user);
    return user;
  };

  const getUser = (email: string) => {
    const user = users.get(email);
    if (!user) throw new Error(`Seed user not found: ${email}`);
    return user;
  };

  return { users, rememberUser, getUser };
};

const seedAdmin = async () => prisma.user.upsert({
  where: { email: "admin@retroreels.test" },
  update: {
    name: "Retro Admin",
    passwordHash,
    role: "ADMIN",
    credits: 1000,
    bio: "Keeps the Retro Reels catalog tuned and dust-free.",
    avatarUrl: "/RR.png",
  },
  create: {
    name: "Retro Admin",
    email: "admin@retroreels.test",
    passwordHash,
    role: "ADMIN",
    credits: 1000,
    bio: "Keeps the Retro Reels catalog tuned and dust-free.",
    avatarUrl: "/RR.png",
    settings: { create: {} },
  },
});

const seedUsers = async (rememberUser: (user: User) => User) => {
  for (const profile of userProfiles) {
    const user = await prisma.user.upsert({
      where: { email: profile.email },
      update: {
        name: profile.name,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        passwordHash,
        role: "USER",
        credits: 1000,
      },
      create: {
        name: profile.name,
        email: profile.email,
        passwordHash,
        role: "USER",
        credits: 1000,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        settings: { create: {} },
      },
    });

    await upsertUserSettings(user.id);
    rememberUser(user);
  }
};

const seedCatalog = async (admin: User) => {
  for (const item of catalogProducts) {
    const [id, title, artist, genre, subGenre, format, price, rating, duration, audio, image, baseColor, borderColor, discColor, sideColor] = item;
    const design = await prisma.vHSDesign.upsert({
      where: { id: `design-${id}` },
      update: { name: `${title} Design`, titleBackgroundColor: "bg-red-500", baseColor, borderColor, discColor, sideColor },
      create: { id: `design-${id}`, name: `${title} Design`, titleBackgroundColor: "bg-red-500", baseColor, borderColor, discColor, sideColor },
    });

    await prisma.product.upsert({
      where: { id: String(id) },
      update: {
        userId: admin.id,
        designId: design.id,
        artist,
        title,
        genre,
        subGenre,
        format,
        rating,
        duration,
        price,
        description: `${title} by ${artist}, seeded from the Retro Reels public catalog.`,
        image,
        previewUrl: audio,
        isPublished: true,
        track: {
          upsert: {
            create: { title, audioUrl: audio },
            update: { title, audioUrl: audio },
          },
        },
      },
      create: {
        id: String(id),
        userId: admin.id,
        designId: design.id,
        artist,
        title,
        genre,
        subGenre,
        format,
        rating,
        duration,
        price,
        description: `${title} by ${artist}, seeded from the Retro Reels public catalog.`,
        image,
        previewUrl: audio,
        isPublished: true,
        track: { create: { title, audioUrl: audio } },
      },
    });
  }
};

const seedOrder = async (userId: string, productId: string, price: number) => prisma.order.upsert({
  where: { id: `seed-order-${userId}-${productId}` },
  update: { userId, productId, price, status: "PAID" },
  create: { id: `seed-order-${userId}-${productId}`, userId, productId, price, status: "PAID" },
});

const seedSampleUserLibrary = async (getUser: (email: string) => User) => {
  for (const sampleUser of sampleUsers) {
    const user = getUser(sampleUser.email);
    const purchasedProductIds = new Set<string>([
      ...sampleUser.purchases,
      ...sampleUser.posts.map((post) => post.productId),
      ...extraSocialPosts
        .filter(([email]) => email === sampleUser.email)
        .map(([, , productId]) => productId),
    ]);

    const purchasedProducts = await prisma.product.findMany({
      where: { id: { in: [...purchasedProductIds] } },
      select: { id: true, price: true },
    });
    const purchaseTotal = purchasedProducts.reduce((sum, product) => sum + product.price, 0);

    for (const product of purchasedProducts) {
      await seedOrder(user.id, product.id, product.price);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { credits: 1000 - purchaseTotal },
    });

    for (const productId of sampleUser.cart) {
      await prisma.cartItem.upsert({
        where: { userId_productId: { userId: user.id, productId } },
        update: { quantity: 1 },
        create: { userId: user.id, productId, quantity: 1 },
      });
    }
  }
};

const seedPost = async (post: {
  id: string;
  userId: string;
  productId: string | null;
  channel: string;
  body: string;
  imageUrl?: string | null;
}) => prisma.socialPost.upsert({
  where: { id: post.id },
  update: {
    userId: post.userId,
    productId: post.productId,
    channel: post.channel,
    body: post.body,
    imageUrl: post.imageUrl ?? null,
  },
  create: {
    id: post.id,
    userId: post.userId,
    productId: post.productId,
    channel: post.channel,
    body: post.body,
    imageUrl: post.imageUrl ?? null,
  },
});

const seedSampleUserPosts = async (getUser: (email: string) => User) => {
  for (const sampleUser of sampleUsers) {
    const user = getUser(sampleUser.email);

    for (const post of sampleUser.posts) {
      await seedPost({
        id: post.id,
        userId: user.id,
        productId: post.productId,
        channel: post.channel,
        body: post.body,
        imageUrl: "imageUrl" in post ? post.imageUrl : null,
      });
    }
  }
};

const seedExtraSocialPosts = async (getUser: (email: string) => User) => {
  for (const [email, id, productId, channel, body, imageUrl] of extraSocialPosts) {
    await seedPost({
      id,
      userId: getUser(email).id,
      productId,
      channel,
      body,
      imageUrl,
    });
  }
};

const seedRetroUserContent = async (getUser: (email: string) => User) => {
  const retroUser = getUser("user@retroreels.test");

  await seedOrder(retroUser.id, "2", 18);
  await prisma.user.update({
    where: { id: retroUser.id },
    data: { credits: 982 },
  });

  for (const post of retroUserPosts) {
    await seedPost({
      ...post,
      userId: retroUser.id,
    });
  }
};

const seedLike = (userId: string, postId: string) => prisma.socialPostLike.upsert({
  where: { userId_postId: { userId, postId } },
  update: {},
  create: { userId, postId },
});

const seedComment = (index: number, userId: string, postId: string, body: string) => prisma.socialComment.upsert({
  where: { id: `seed-comment-${index}-${userId}-${postId}` },
  update: { userId, postId, body },
  create: { id: `seed-comment-${index}-${userId}-${postId}`, userId, postId, body },
});

const seedSocialInteractions = async (getUser: (email: string) => User) => {
  for (const [index, [email, postId, comment]] of socialInteractions.entries()) {
    const user = getUser(email);
    await seedLike(user.id, postId);
    await seedComment(index, user.id, postId, comment);
  }

  for (const email of greenDayLikeEmails) {
    await seedLike(getUser(email).id, "seed-topic-green-day-1");
  }

  for (const postId of livelyLikePostIds) {
    for (const email of livelyLikeEmails) {
      await seedLike(getUser(email).id, postId);
    }
  }
};

const seedExclusiveFeature = async () => {
  await prisma.exclusiveFeature.upsert({
    where: { id: "seed-exclusive-party-anthem" },
    update: {
      productId: "19",
      label: "Exclusive Premiere",
      description: "A limited shelf feature for late-night listening, warm headphones, and one more rewind before the catalog opens.",
      isActive: true,
    },
    create: {
      id: "seed-exclusive-party-anthem",
      productId: "19",
      label: "Exclusive Premiere",
      description: "A limited shelf feature for late-night listening, warm headphones, and one more rewind before the catalog opens.",
      isActive: true,
    },
  });
};

const seedCarouselSlides = async () => {
  const slides = [
    ["seed-slide-party", "19", "No. 1 Party Anthem", "Exclusive indie-rock pressing for the late shelf.", "/no1partyanthem.png", "Listen Now", "/product/19", 1],
    ["seed-slide-community", "4", "Community Uploads", "Approved studio drops can now become buyable catalog releases.", "/wallpaper-2.png", "Open Studio", "/studio", 2],
    ["seed-slide-social", null, "Listening Wall", "See what the collectors are yapping about today.", "/wallpaper-3.png", "Join Social", "/timeline", 3],
  ] as const;

  for (const [id, productId, title, subtitle, image, ctaLabel, ctaHref, position] of slides) {
    await prisma.carouselSlide.upsert({
      where: { id },
      update: { productId, title, subtitle, image, ctaLabel, ctaHref, position, isPublished: true },
      create: { id, productId, title, subtitle, image, ctaLabel, ctaHref, position, isPublished: true },
    });
  }
};

const seedMusicSubmissions = async (getUser: (email: string) => User) => {
  const submissions = [
    ["seed-submission-dio-1", "dio@retroreels.test", "19", "Basement Party Recut", "Dio Drift", "Rock", "Vinyl", "/music/No. 1 Party Anthem.mp3", "/no1partyanthem.png", "Needs a quick loudness check before publishing.", "PENDING"],
    ["seed-submission-sari-1", "sari@retroreels.test", "12", "Semua Tentangmu Soft Demo", "Sari Static", "Indo Pop", "Cassette", "/music/Hu Tao - Semua Tentangmu (Ai Cover) - 128.mp3", "/subaruhoshino.jpeg", "Cover image is final, audio may need cleaner intro trim.", "REVISION"],
    ["seed-submission-beni-1", "beni@retroreels.test", "18", "VHS Memory Street", "Beni Bootleg", "Acoustic", "VHS", "/music/Somewhere Only We Know-Keane-Cover IA Hu Tao-Sub espaÃƒÂ±ol - 128.mp3", "/Yoru.jpeg", "Tape texture is intentional. Please review metadata.", "PENDING"],
    ["seed-submission-mika-1", "mika@retroreels.test", "4", "Midnight ANRI Shelf Rip", "Mika Cassette", "City Pop", "Vinyl", "/music/ANRI - I Can't Stop The Loneliness - 128-1.mp3", "/her.jpg", "Approved for future city-pop collection feature.", "ACCEPTED"],
  ] as const;

  for (const [id, email, productId, title, artist, genre, format, audioUrl, coverUrl, note, status] of submissions) {
    await prisma.musicSubmission.upsert({
      where: { id },
      update: {
        userId: getUser(email).id,
        productId,
        title,
        artist,
        genre,
        format,
        audioUrl,
        coverUrl,
        note,
        price: 20,
        status,
      },
      create: {
        id,
        userId: getUser(email).id,
        productId,
        title,
        artist,
        genre,
        format,
        audioUrl,
        coverUrl,
        note,
        price: 20,
        status,
      },
    });
  }
};

async function main() {
  console.log("Seeding users, VHS designs, catalog, purchases, and social posts...");

  const { rememberUser, getUser } = createSeedContext();
  const admin = rememberUser(await seedAdmin());
  await upsertUserSettings(admin.id);

  await seedUsers(rememberUser);
  await seedCatalog(admin);
  await seedSampleUserLibrary(getUser);
  await seedSampleUserPosts(getUser);
  await seedExtraSocialPosts(getUser);
  await seedRetroUserContent(getUser);
  await seedSocialInteractions(getUser);
  await seedExclusiveFeature();
  await seedCarouselSlides();
  await seedMusicSubmissions(getUser);

  console.log("Seed complete.");
  console.log("Admin: admin@retroreels.test / password");
  console.log("User: user@retroreels.test / password");
  console.log("Sample buyers: mika@retroreels.test, raka@retroreels.test, naya@retroreels.test, dio@retroreels.test, sari@retroreels.test, beni@retroreels.test / password");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
