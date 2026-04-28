import type { Response } from "express";
import prisma from "../utils/db.util.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const listMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const orders = await prisma.order.findMany({
    ...(req.user?.role === "ADMIN" ? {} : { where: { userId } }),
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      product: { include: { track: true, vhsDesign: true, user: { select: { id: true, name: true, email: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ data: orders });
};

export const listMyLibrary = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const [orders, ownProducts] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        product: { include: { track: true, vhsDesign: true, user: { select: { id: true, name: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { userId, isPublished: true },
      include: { track: true, vhsDesign: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const purchasedItems = orders
    .filter((order) => order.product)
    .map((order) => ({ id: `order-${order.id}`, source: "PURCHASED", purchasedAt: order.createdAt, product: order.product }));
  const ownItems = ownProducts.map((product) => ({ id: `created-${product.id}`, source: "CREATED", purchasedAt: product.updatedAt, product }));
  const deduped = Array.from(new Map([...ownItems, ...purchasedItems].map((item) => [item.product.id, item])).values());

  return res.json({ data: deduped });
};

export const buyProduct = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const productId = req.params.productId;
  if (!productId) return res.status(400).json({ message: "Product id is required" });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isPublished || product.availability !== "AVAILABLE") {
    return res.status(404).json({ message: "Product not found" });
  }
  if (product.userId === userId) {
    return res.status(409).json({ message: "Your own music is already in your library" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.credits < product.price) {
    return res.status(402).json({
      message: "Not enough credits",
      credits: user.credits,
      required: product.price,
    });
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        productId: product.id,
        price: product.price,
        status: "PAID",
      },
      include: { product: { include: { track: true, vhsDesign: true } } },
    });

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: product.price,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        credits: true,
      },
    });

    return { order, user: updatedUser };
  });

  return res.status(201).json({
    message: "Purchase completed",
    data: result.order,
    user: result.user,
  });
};
