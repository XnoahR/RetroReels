import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

const passwordHash = await bcrypt.hash("password", 10);

const catalogProducts = [
  [1, "Moechakka Fire", "Ellen Joe", "Pop", "J-Pop", "VHS", 22, 5, "2:48", "/music/ã€ã‚¼ãƒ³ã‚¼ãƒ­ã€‘ãƒ¢ã‚¨ãƒãƒ£ãƒƒã‚«ãƒ•ã‚¡ã‚¤ã‚¢   ã‚¨ãƒ¬ãƒ³ãƒ»ã‚¸ãƒ§ãƒ¼ï¼ˆCVï¼šè‹¥å±±è©©éŸ³ï¼‰cover - 128.mp3", "/ejm3.jpg", "bg-black", "border-white", "bg-red-500", "bg-gray-500"],
  [2, "Put Your Head on My Shoulder", "Hu Tao", "Chill", "Lo-fi", "Cassette", 18, 4, "3:12", "/music/Hu Tao - Put Your Head on My Shoulder.mp3", "/ht.png", "bg-red-800", "border-red-400", "bg-red-300", "bg-red-100"],
  [3, "Liquid-Formed Sadness", "Lime", "Pop", "City Pop", "VHS", 26, 5, "3:40", "/music/ChiliChill - My Sadness is Liquid-Formed  Japanese Cover - 128.mp3", "/pasan.jpg", "bg-purple-800", "border-purple-400", "bg-purple-300", "bg-purple-100"],
  [4, "I Can't Stop The Loneliness", "ANRI", "Pop", "City Pop", "Vinyl", 32, 5, "4:18", "/music/ANRI - I Can't Stop The Loneliness - 128-1.mp3", "/her.jpg", "bg-sky-800", "border-sky-400", "bg-sky-300", "bg-sky-100"],
  [5, "Wanderlust", "Metric", "Rock", "Indie", "Cassette", 20, 4, "3:31", "/music/[Metric] - Wanderlust - 128.mp3", "/skizo.jpg", "bg-gray-800", "border-gray-400", "bg-black", "bg-gray-100"],
  [6, "Yoru Tape", "Night Archive", "Chill", "Lo-fi", "VHS", 16, 4, "2:56", "/music/Hu Tao - Put Your Head on My Shoulder.mp3", "/Yoru.jpeg", "bg-bay-leaf-900", "border-bay-leaf-300", "bg-bay-leaf-500", "bg-bay-leaf-700"],
  [7, "It's You", "Hu Tao", "Pop", "Dream Pop", "Vinyl", 30, 5, "3:34", "/music/Ali Gatie - It's You  cover by Hu Tao (AI Cover) - 128.mp3", "/download (1).jpeg", "bg-rose-950", "border-rose-300", "bg-rose-400", "bg-pink-100"],
  [8, "As The World Caves In", "Hu Tao", "Ballad", "Alt Ballad", "VHS", 24, 5, "3:38", "/music/As The World Caves In - Matt Maltese - Cover Hu Tao - Sub EspaÃ±ol - 256.mp3", "/download (11).jpg", "bg-zinc-950", "border-red-300", "bg-red-400", "bg-stone-200"],
  [9, "Falling", "Hu Tao", "Ballad", "Pop Ballad", "Cassette", 21, 4, "3:57", "/music/Harry Styles - Falling cover by Hu Tao (AI Cover).mp3", "/htlast.jpg", "bg-orange-950", "border-orange-300", "bg-amber-300", "bg-orange-100"],
  [10, "505", "Hu Tao", "Rock", "Alt Rock", "Vinyl", 28, 5, "4:13", "/music/hu tao - 505 (voice ai) - 128.mp3", "/kyomoto.jpg", "bg-slate-950", "border-emerald-300", "bg-emerald-400", "bg-slate-200"],
  [11, "Kukatakan Dengan Indah", "Hu Tao", "Pop", "Indo Pop", "VHS", 23, 4, "4:45", "/music/Hu Tao - Kukatakan Dengan Indah (Ai Cover) - 128.mp3", "/oguri.jpeg", "bg-teal-950", "border-teal-300", "bg-cyan-300", "bg-teal-100"],
  [12, "Semua Tentangmu", "Hu Tao", "Pop", "Indo Pop", "Cassette", 19, 4, "4:22", "/music/Hu Tao - Semua Tentangmu (Ai Cover) - 128.mp3", "/subaruhoshino.jpeg", "bg-fuchsia-950", "border-fuchsia-300", "bg-pink-300", "bg-fuchsia-100"],
  [13, "Separuh Aku", "Hu Tao", "Rock", "Indo Rock", "Vinyl", 27, 5, "4:20", "/music/Hu Tao - Separuh Aku (Ai Cover) - 128.mp3", "/download (11).jpeg", "bg-neutral-950", "border-yellow-300", "bg-yellow-400", "bg-neutral-100"],
  [14, "Lebih Dari Bintang", "Hu Tao", "Electronic", "Synth Pop", "VHS", 25, 4, "3:52", "/music/Lebih Dari Bintang - Hu tao ( Ai Genshin).mp3", "/download (12).jpg", "bg-indigo-950", "border-indigo-300", "bg-violet-300", "bg-indigo-100"],
  [15, "Mariposa", "Hu Tao", "Pop", "Dream Pop", "Cassette", 22, 5, "3:30", "/music/Mariposa - Peach Tree Rascals  cover by Hu Tao (AI Cover) - 128.mp3", "/d96e88a4-ce32-4e49-8f13-257aa58e4d0b.jpg", "bg-pink-950", "border-pink-300", "bg-lime-300", "bg-pink-100"],
  [16, "Monokrom", "Hu Tao", "Acoustic", "Indie Folk", "Vinyl", 29, 5, "3:35", "/music/monokrom - Hu Tao Ai Cover.mp3", "/download (11).jpg", "bg-stone-950", "border-stone-200", "bg-stone-400", "bg-stone-100"],
  [17, "December", "Raiden", "Pop", "Winter Pop", "Cassette", 20, 4, "4:05", "/music/Raiden - December (Ai Cover) - 128.mp3", "/her.jpg", "bg-cyan-950", "border-cyan-200", "bg-sky-300", "bg-cyan-100"],
  [18, "Somewhere Only We Know", "Hu Tao", "Acoustic", "Piano Cover", "VHS", 24, 5, "3:49", "/music/Somewhere Only We Know-Keane-Cover IA Hu Tao-Sub espaÃ±ol - 128.mp3", "/Yoru.jpeg", "bg-emerald-950", "border-emerald-300", "bg-emerald-400", "bg-green-100"],
  [19, "No. 1 Party Anthem", "Arctic Monkeys", "Rock", "Indie Rock", "Vinyl", 35, 5, "4:03", "/music/No. 1 Party Anthem.mp3", "/no1partyanthem.png", "bg-zinc-950", "border-zinc-500", "bg-zinc-300", "bg-zinc-100"],
] as const;

async function main() {
  console.log("Seeding users, VHS designs, and catalog...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@retroreels.test" },
    update: { passwordHash, role: "ADMIN", credits: 1000 },
    create: {
      name: "Retro Admin",
      email: "admin@retroreels.test",
      passwordHash,
      role: "ADMIN",
      credits: 1000,
      settings: { create: {} },
    },
  });

  await prisma.user.upsert({
    where: { email: "user@retroreels.test" },
    update: { passwordHash, role: "USER", credits: 1000 },
    create: {
      name: "Retro User",
      email: "user@retroreels.test",
      passwordHash,
      role: "USER",
      credits: 1000,
      settings: { create: {} },
    },
  });

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

  console.log("Seed complete.");
  console.log("Admin: admin@retroreels.test / password");
  console.log("User: user@retroreels.test / password");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
