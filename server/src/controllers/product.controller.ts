import type { Response } from "express";
import prisma from "../utils/db.util.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

const productInclude = {
  vhsDesign: true,
  track: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

const ensureDefaultDesign = async () => {
  const existing = await prisma.vHSDesign.findFirst();
  if (existing) return existing;

  return prisma.vHSDesign.create({
    data: {
      name: "Default Tape",
      titleBackgroundColor: "bg-red-500",
      baseColor: "bg-black",
      borderColor: "border-white",
      discColor: "bg-red-500",
      sideColor: "bg-gray-500",
    },
  });
};

const getRequestUserId = (req: AuthenticatedRequest) => req.user?.id;

export const listProducts = async (req: AuthenticatedRequest, res: Response) => {
  const includeUnpublished = req.user?.role === "ADMIN" && req.query.includeUnpublished === "true";
  const products = await prisma.product.findMany({
    ...(includeUnpublished ? {} : { where: { isPublished: true } }),
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });

  return res.json({ data: products });
};

export const getProduct = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Product id is required" });

  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  if (!product || (!product.isPublished && req.user?.role !== "ADMIN")) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json({ data: product });
};

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  const userId = getRequestUserId(req);
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const {
    artist,
    title,
    genre,
    subGenre,
    format,
    rating,
    duration,
    price,
    description,
    image,
    previewUrl,
    audioUrl,
    designId,
    isPublished,
  } = req.body;

  if (!artist || !title || price === undefined || !description || !image) {
    return res.status(400).json({ message: "artist, title, price, description, and image are required" });
  }

  const design = designId ? null : await ensureDefaultDesign();
  const data: any = {
    userId,
    designId: designId || design!.id,
    artist,
    title,
    genre,
    subGenre,
    format,
    rating: Number.isInteger(rating) ? rating : 0,
    duration,
    price: Number(price),
    description,
    image,
    previewUrl,
    isPublished: isPublished ?? true,
  };

  if (audioUrl) {
    data.track = {
      create: {
        title,
        audioUrl,
      },
    };
  }

  const product = await prisma.product.create({
    data,
    include: productInclude,
  });

  return res.status(201).json({ message: "Product created", data: product });
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Product id is required" });

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.user?.role !== "ADMIN" && product.userId !== req.user?.id) {
    return res.status(403).json({ message: "You can only update your own products" });
  }

  const { audioUrl, ...body } = req.body;
  const data: any = {
    ...body,
    price: body.price === undefined ? undefined : Number(body.price),
    rating: body.rating === undefined ? undefined : Number(body.rating),
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  if (audioUrl) {
    data.track = {
      upsert: {
        create: { title: body.title || product.title, audioUrl },
        update: { title: body.title || product.title, audioUrl },
      },
    };
  }

  const updated = await prisma.product.update({
    where: { id },
    data,
    include: productInclude,
  });

  return res.json({ message: "Product updated", data: updated });
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Product id is required" });

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.user?.role !== "ADMIN" && product.userId !== req.user?.id) {
    return res.status(403).json({ message: "You can only delete your own products" });
  }

  await prisma.product.delete({ where: { id } });
  return res.json({ message: "Product deleted" });
};
