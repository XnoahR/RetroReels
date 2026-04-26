import type { Response } from "express";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import prisma from "../utils/db.util.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

const socialPostInclude = (userId?: string) => ({
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatarUrl: true,
    },
  },
  product: {
    include: {
      track: true,
      vhsDesign: true,
    },
  },
  comments: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
  likes: userId
    ? {
        where: { userId },
        select: { id: true },
      }
    : {
        select: { id: true },
      },
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
});

const formatPost = (post: any, userId?: string) => ({
  ...post,
  isLiked: Boolean(userId && post.likes?.length),
  likes: undefined,
});

const imageUploadDir = path.resolve(process.cwd(), "../client/public/image-upload");
const allowedImageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const safeSlug = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9.-]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 48);

export const listSocialPosts = async (req: AuthenticatedRequest, res: Response) => {
  const channel = typeof req.query.channel === "string" ? req.query.channel : undefined;
  const sort = typeof req.query.sort === "string" ? req.query.sort : "latest";
  const userId = req.user?.id;
  const query: any = {
    include: socialPostInclude(userId),
    orderBy: sort === "popular"
      ? [{ likes: { _count: "desc" } }, { comments: { _count: "desc" } }, { createdAt: "desc" }]
      : { createdAt: "desc" },
  };

  if (channel && channel !== "All Signals") {
    query.where = { channel };
  }

  const posts = await prisma.socialPost.findMany(query);

  return res.json({ data: posts.map((post) => formatPost(post, userId)) });
};

export const getSocialProfile = async (req: AuthenticatedRequest, res: Response) => {
  const profileUserId = req.params.userId;
  if (!profileUserId) return res.status(400).json({ message: "User id is required" });

  const viewerId = req.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: profileUserId },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatarUrl: true,
      role: true,
      credits: true,
    },
  });

  if (!user) return res.status(404).json({ message: "Profile not found" });

  const [posts, likedPosts, products] = await Promise.all([
    prisma.socialPost.findMany({
      where: { userId: profileUserId },
      include: socialPostInclude(viewerId),
      orderBy: { createdAt: "desc" },
    }),
    prisma.socialPost.findMany({
      where: {
        likes: {
          some: { userId: profileUserId },
        },
      },
      include: socialPostInclude(viewerId),
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { userId: profileUserId, isPublished: true },
      include: {
        track: true,
        vhsDesign: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return res.json({
    data: {
      user,
      posts: posts.map((post) => formatPost(post, viewerId)),
      likedPosts: likedPosts.map((post) => formatPost(post, viewerId)),
      products,
    },
  });
};

export const createSocialPost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const body = typeof req.body.body === "string" ? req.body.body.trim() : "";
  const productId = typeof req.body.productId === "string" && req.body.productId.trim() ? req.body.productId.trim() : undefined;
  const imageUrl = typeof req.body.imageUrl === "string" && req.body.imageUrl.trim() ? req.body.imageUrl.trim() : undefined;
  const channel = typeof req.body.channel === "string" && req.body.channel.trim() ? req.body.channel.trim() : "Listening Wall";

  if (!body && !productId && !imageUrl) {
    return res.status(400).json({ message: "Post needs text, an album, or an image" });
  }

  if (productId) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isPublished) {
      return res.status(404).json({ message: "Product not found" });
    }
  }

  const post = await prisma.socialPost.create({
    data: {
      userId,
      productId,
      imageUrl,
      channel,
      body: body || "Shared a drop.",
    },
    include: socialPostInclude(userId),
  });

  return res.status(201).json({ message: "Post created", data: formatPost(post, userId) });
};

export const updateSocialPost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const postId = req.params.postId;
  if (!postId) return res.status(400).json({ message: "Post id is required" });

  const existing = await prisma.socialPost.findUnique({ where: { id: postId } });
  if (!existing) return res.status(404).json({ message: "Post not found" });
  if (existing.userId !== userId && req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "You can only edit your own posts" });
  }

  const body = typeof req.body.body === "string" ? req.body.body.trim() : "";
  const productId = typeof req.body.productId === "string" && req.body.productId.trim() ? req.body.productId.trim() : null;
  const imageUrl = typeof req.body.imageUrl === "string" && req.body.imageUrl.trim() ? req.body.imageUrl.trim() : null;
  const channel = typeof req.body.channel === "string" && req.body.channel.trim() ? req.body.channel.trim() : existing.channel;

  if (!body && !productId && !imageUrl) {
    return res.status(400).json({ message: "Post needs text, an album, or an image" });
  }

  if (productId) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isPublished) {
      return res.status(404).json({ message: "Product not found" });
    }
  }

  const post = await prisma.socialPost.update({
    where: { id: postId },
    data: {
      body: body || "Shared a drop.",
      productId,
      imageUrl,
      channel,
    },
    include: socialPostInclude(userId),
  });

  return res.json({ message: "Post updated", data: formatPost(post, userId) });
};

export const deleteSocialPost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const postId = req.params.postId;
  if (!postId) return res.status(400).json({ message: "Post id is required" });

  const existing = await prisma.socialPost.findUnique({ where: { id: postId } });
  if (!existing) return res.status(404).json({ message: "Post not found" });
  if (existing.userId !== userId && req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "You can only delete your own posts" });
  }

  await prisma.socialPost.delete({ where: { id: postId } });

  return res.json({ message: "Post deleted" });
};

export const uploadSocialImage = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const dataUrl = typeof req.body.dataUrl === "string" ? req.body.dataUrl : "";
  const originalName = typeof req.body.fileName === "string" ? req.body.fileName : "upload";
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/);

  if (!match) {
    return res.status(400).json({ message: "Upload a JPG, PNG, WEBP, or GIF image" });
  }

  const mimeType = match[1];
  const base64 = match[2];
  const extension = allowedImageTypes[mimeType];
  if (!extension) {
    return res.status(400).json({ message: "Unsupported image type" });
  }

  const buffer = Buffer.from(base64, "base64");
  if (buffer.byteLength > 5 * 1024 * 1024) {
    return res.status(400).json({ message: "Image must be 5MB or smaller" });
  }

  await mkdir(imageUploadDir, { recursive: true });

  const nameBase = safeSlug(originalName.replace(/\.[^.]+$/, "")) || "upload";
  const fileName = `${Date.now()}-${userId.slice(0, 8)}-${nameBase}.${extension}`;
  await writeFile(path.join(imageUploadDir, fileName), buffer);

  return res.status(201).json({
    message: "Image uploaded",
    data: {
      imageUrl: `/image-upload/${fileName}`,
    },
  });
};

export const toggleSocialPostLike = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const postId = req.params.postId;
  if (!postId) return res.status(400).json({ message: "Post id is required" });

  const post = await prisma.socialPost.findUnique({ where: { id: postId } });
  if (!post) return res.status(404).json({ message: "Post not found" });

  const existing = await prisma.socialPostLike.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.socialPostLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.socialPostLike.create({ data: { userId, postId } });
  }

  const updated = await prisma.socialPost.findUnique({
    where: { id: postId },
    include: socialPostInclude(userId),
  });

  return res.json({
    message: existing ? "Like removed" : "Post liked",
    data: formatPost(updated, userId),
  });
};

export const createSocialComment = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const postId = req.params.postId;
  const body = typeof req.body.body === "string" ? req.body.body.trim() : "";
  if (!postId) return res.status(400).json({ message: "Post id is required" });
  if (!body) return res.status(400).json({ message: "Comment is required" });

  const post = await prisma.socialPost.findUnique({ where: { id: postId } });
  if (!post) return res.status(404).json({ message: "Post not found" });

  await prisma.socialComment.create({
    data: {
      userId,
      postId,
      body,
    },
  });

  const updated = await prisma.socialPost.findUnique({
    where: { id: postId },
    include: socialPostInclude(userId),
  });

  return res.status(201).json({ message: "Comment added", data: formatPost(updated, userId) });
};
