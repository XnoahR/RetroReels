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
const sellableAvailability = ["AVAILABLE", "SOLD_OUT", "WITHDRAWN"];
const getPagination = (req: AuthenticatedRequest, fallbackTake = 12) => {
  const skip = Math.max(Number(req.query.skip) || 0, 0);
  const take = Math.min(Math.max(Number(req.query.take) || fallbackTake, 1), 40);
  return { skip, take };
};

const pagedResponse = <T>(items: T[], skip: number, take: number) => {
  const hasMore = items.length > take;
  const data = hasMore ? items.slice(0, take) : items;
  return {
    data,
    pagination: {
      skip,
      take,
      nextSkip: skip + data.length,
      hasMore,
    },
  };
};

export const listProducts = async (req: AuthenticatedRequest, res: Response) => {
  const includeUnpublished = req.user?.role === "ADMIN" && req.query.includeUnpublished === "true";
  const skip = Math.max(Number(req.query.skip) || 0, 0);
  const take = Math.min(Math.max(Number(req.query.take) || 16, 1), 40);
  const shouldPage = req.query.skip !== undefined || req.query.take !== undefined;

  const products = await prisma.product.findMany({
    ...(includeUnpublished ? {} : { where: { isPublished: true, availability: "AVAILABLE" } }),
    include: productInclude,
    orderBy: { updatedAt: "desc" },
    ...(shouldPage ? { skip, take: take + 1 } : {}),
  });

  if (!shouldPage) return res.json({ data: products });

  const hasMore = products.length > take;
  const page = hasMore ? products.slice(0, take) : products;

  return res.json({
    data: page,
    pagination: {
      skip,
      take,
      nextSkip: skip + page.length,
      hasMore,
    },
  });
};

export const getProduct = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Product id is required" });

  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  if (!product || ((!product.isPublished || product.availability !== "AVAILABLE") && req.user?.role !== "ADMIN" && product.userId !== req.user?.id)) {
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
    availability,
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
    availability: availability || "AVAILABLE",
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

export const listMyProducts = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const { skip, take } = getPagination(req, 12);

  const products = await prisma.product.findMany({
    where: { userId },
    include: {
      ...productInclude,
      _count: { select: { orders: true } },
      musicSubmissions: true,
    },
    orderBy: { updatedAt: "desc" },
    skip,
    take: take + 1,
  });

  return res.json(pagedResponse(products, skip, take));
};

export const listMyProductSales = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const { skip, take } = getPagination(req, 10);

  const where = { product: { userId } };
  const [orders, totalOrders, revenue] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        product: { include: { track: true, vhsDesign: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: take + 1,
    }),
    prisma.order.count({ where }),
    prisma.order.aggregate({ where, _sum: { price: true } }),
  ]);

  return res.json({
    ...pagedResponse(orders, skip, take),
    summary: { revenue: revenue._sum.price || 0, orders: totalOrders },
  });
};

export const updateProductAvailability = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Product id is required" });

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (req.user?.role !== "ADMIN" && product.userId !== req.user?.id) {
    return res.status(403).json({ message: "You can only manage your own music" });
  }

  const availability = String(req.body.availability || "").toUpperCase();
  if (!sellableAvailability.includes(availability)) {
    return res.status(400).json({ message: "availability must be AVAILABLE, SOLD_OUT, or WITHDRAWN" });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      availability,
      isPublished: availability === "AVAILABLE",
    },
    include: productInclude,
  });

  return res.json({ message: "Product availability updated", data: updated });
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Product id is required" });

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.user?.role !== "ADMIN" && product.userId !== req.user?.id) {
    return res.status(403).json({ message: "You can only delete your own products" });
  }

  const orderCount = await prisma.order.count({ where: { productId: id } });
  if (orderCount > 0) {
    return res.status(409).json({ message: "Music with buyers cannot be deleted. Mark it sold out or withdrawn instead." });
  }

  await prisma.product.delete({ where: { id } });
  return res.json({ message: "Product deleted" });
};
