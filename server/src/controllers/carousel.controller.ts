import type { Response } from "express";
import prisma from "../utils/db.util.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const listCarouselSlides = async (req: AuthenticatedRequest, res: Response) => {
  const includeUnpublished = req.user?.role === "ADMIN" && req.query.includeUnpublished === "true";
  const slides = await prisma.carouselSlide.findMany({
    ...(includeUnpublished ? {} : { where: { isPublished: true } }),
    include: { product: true },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  });

  return res.json({ data: slides });
};

export const createCarouselSlide = async (req: AuthenticatedRequest, res: Response) => {
  const { productId, title, subtitle, image, ctaLabel, ctaHref, position, isPublished } = req.body;

  if (!title || !image) {
    return res.status(400).json({ message: "title and image are required" });
  }

  const slide = await prisma.carouselSlide.create({
    data: {
      productId: productId || null,
      title,
      subtitle,
      image,
      ctaLabel,
      ctaHref,
      position: position === undefined ? 0 : Number(position),
      isPublished: isPublished ?? true,
    },
  });

  return res.status(201).json({ message: "Carousel slide created", data: slide });
};

export const updateCarouselSlide = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Carousel slide id is required" });

  const { position, ...body } = req.body;
  const data: any = {
    ...body,
    productId: body.productId || null,
    position: position === undefined ? undefined : Number(position),
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  const slide = await prisma.carouselSlide.update({
    where: { id },
    data,
  });

  return res.json({ message: "Carousel slide updated", data: slide });
};

export const deleteCarouselSlide = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Carousel slide id is required" });

  await prisma.carouselSlide.delete({ where: { id } });
  return res.json({ message: "Carousel slide deleted" });
};
