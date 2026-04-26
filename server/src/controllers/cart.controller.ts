import type { Response } from "express";
import prisma from "../utils/db.util.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

const cartInclude = {
  product: {
    include: {
      track: true,
      vhsDesign: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
};

export const listCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: cartInclude,
    orderBy: { createdAt: "desc" },
  });

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return res.json({ data: items, total });
};

export const addCartItem = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const productId = req.params.productId;
  if (!productId) return res.status(400).json({ message: "Product id is required" });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isPublished) {
    return res.status(404).json({ message: "Product not found" });
  }

  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity: { increment: 1 } },
    create: { userId, productId, quantity: 1 },
    include: cartInclude,
  });

  return res.status(201).json({ message: "Added to cart", data: item });
};

export const updateCartItem = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const productId = req.params.productId;
  const quantity = Number(req.body.quantity);
  if (!productId) return res.status(400).json({ message: "Product id is required" });
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  const item = await prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: { quantity },
    include: cartInclude,
  });

  return res.json({ message: "Cart updated", data: item });
};

export const removeCartItem = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const productId = req.params.productId;
  if (!productId) return res.status(400).json({ message: "Product id is required" });

  await prisma.cartItem.deleteMany({ where: { userId, productId } });
  return res.json({ message: "Removed from cart" });
};

export const checkoutCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (!items.length) return res.status(400).json({ message: "Cart is empty" });

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.credits < total) {
    return res.status(402).json({ message: "Not enough credits", credits: user.credits, required: total });
  }

  const result = await prisma.$transaction(async (tx) => {
    const orders = [];

    for (const item of items) {
      for (let count = 0; count < item.quantity; count += 1) {
        orders.push(await tx.order.create({
          data: {
            userId,
            productId: item.productId,
            price: item.product.price,
            status: "PAID",
          },
          include: { product: { include: { track: true, vhsDesign: true } } },
        }));
      }
    }

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { credits: { decrement: total } },
      select: { id: true, name: true, email: true, role: true, credits: true },
    });

    await tx.cartItem.deleteMany({ where: { userId } });
    return { orders, user: updatedUser, total };
  });

  return res.status(201).json({ message: "Checkout completed", data: result.orders, user: result.user, total: result.total });
};
