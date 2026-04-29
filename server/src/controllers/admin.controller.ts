import type { Response } from "express";
import prisma from "../utils/db.util.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

const productInclude = {
  vhsDesign: true,
  track: true,
  user: { select: { id: true, name: true, email: true } },
};

const submissionInclude = {
  user: { select: { id: true, name: true, email: true, avatarUrl: true } },
  product: { include: productInclude },
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

const getPagination = (req: AuthenticatedRequest) => {
  const skip = Math.max(Number(req.query.skip) || 0, 0);
  const take = Math.min(Math.max(Number(req.query.take) || 12, 1), 40);
  return { skip, take };
};

const pagedResponse = <T>(items: T[], skip: number, take: number) => {
  const hasMore = items.length > take;
  const data = hasMore ? items.slice(0, take) : items;
  return { data, pagination: { skip, take, nextSkip: skip + data.length, hasMore } };
};

const designFromSubmission = (submission: {
  title: string;
  baseColor?: string | null;
  borderColor?: string | null;
  discColor?: string | null;
  sideColor?: string | null;
}) => ({
  name: `${submission.title} Studio Design`,
  titleBackgroundColor: "bg-red-500",
  baseColor: submission.baseColor || "bg-zinc-950",
  borderColor: submission.borderColor || "border-zinc-500",
  discColor: submission.discColor || "bg-zinc-300",
  sideColor: submission.sideColor || "bg-zinc-100",
});

export const getExclusiveFeature = async (_req: AuthenticatedRequest, res: Response) => {
  const feature = await prisma.exclusiveFeature.findFirst({
    where: { isActive: true },
    include: { product: { include: productInclude } },
    orderBy: { updatedAt: "desc" },
  });

  if (feature) return res.json({ data: feature });

  const fallbackProduct = await prisma.product.findFirst({
    where: { isPublished: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });

  return res.json({
    data: fallbackProduct
      ? {
          id: "fallback-exclusive",
          productId: fallbackProduct.id,
          label: "Exclusive Premiere",
          description: "A limited shelf feature for late-night listening, warm headphones, and one more rewind before the catalog opens.",
          isActive: true,
          product: fallbackProduct,
        }
      : null,
  });
};

export const listExclusiveFeatures = async (_req: AuthenticatedRequest, res: Response) => {
  const features = await prisma.exclusiveFeature.findMany({
    include: { product: { include: productInclude } },
    orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
  });

  return res.json({ data: features });
};

export const upsertExclusiveFeature = async (req: AuthenticatedRequest, res: Response) => {
  const { productId, label, description, isActive } = req.body;

  if (!productId) return res.status(400).json({ message: "productId is required" });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ message: "Product not found" });

  const feature = await prisma.$transaction(async (tx) => {
    if (isActive !== false) {
      await tx.exclusiveFeature.updateMany({ data: { isActive: false } });
    }

    return tx.exclusiveFeature.create({
      data: {
        productId,
        label: label || "Exclusive Premiere",
        description: description || null,
        isActive: isActive ?? true,
      },
      include: { product: { include: productInclude } },
    });
  });

  return res.status(201).json({ message: "Exclusive feature saved", data: feature });
};

export const updateExclusiveFeature = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Exclusive feature id is required" });

  const { productId, label, description, isActive } = req.body;
  if (productId) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: "Product not found" });
  }

  const feature = await prisma.$transaction(async (tx) => {
    if (isActive === true) await tx.exclusiveFeature.updateMany({ where: { id: { not: id } }, data: { isActive: false } });

    return tx.exclusiveFeature.update({
      where: { id },
      data: {
        productId,
        label,
        description,
        isActive,
      },
      include: { product: { include: productInclude } },
    });
  });

  return res.json({ message: "Exclusive feature updated", data: feature });
};

export const deleteExclusiveFeature = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Exclusive feature id is required" });

  await prisma.exclusiveFeature.delete({ where: { id } });
  return res.json({ message: "Exclusive feature deleted" });
};

export const listMusicSubmissions = async (req: AuthenticatedRequest, res: Response) => {
  const { skip, take } = getPagination(req);
  const submissions = await prisma.musicSubmission.findMany({
    where: { status: "PENDING" },
    include: submissionInclude,
    orderBy: { createdAt: "desc" },
    skip,
    take: take + 1,
  });

  return res.json(pagedResponse(submissions, skip, take));
};

export const updateMusicSubmission = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Submission id is required" });

  const { status, adminNote } = req.body;
  if (!["PENDING", "ACCEPTED", "REVISION", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Valid status is required" });
  }

  const existing = await prisma.musicSubmission.findUnique({
    where: { id },
    include: { product: true },
  });
  if (!existing) return res.status(404).json({ message: "Submission not found" });

  const submission = await prisma.$transaction(async (tx) => {
    let productId = existing.productId;

    if (status === "ACCEPTED") {
      let designId = existing.product?.designId;
      const designData = designFromSubmission(existing);

      if (designId) {
        await tx.vHSDesign.update({
          where: { id: designId },
          data: designData,
        });
      } else {
        const design = await tx.vHSDesign.create({ data: designData });
        designId = design.id;
      }

      const productData = {
        artist: existing.artist,
        title: existing.title,
        genre: existing.genre,
        subGenre: "User Upload",
        format: existing.format || "VHS",
        rating: 0,
        duration: "3:00",
        price: existing.price || 20,
        description: existing.note || "Approved community upload from Retro Reels Studio.",
        image: existing.coverUrl || "/RR.png",
        previewUrl: existing.audioUrl,
        isPublished: true,
        availability: "AVAILABLE",
        track: {
          upsert: {
            create: {
              title: existing.title,
              audioUrl: existing.audioUrl,
            },
            update: {
              title: existing.title,
              audioUrl: existing.audioUrl,
            },
          },
        },
      };

      if (productId) {
        await tx.product.update({
          where: { id: productId },
          data: { designId, ...productData },
        });
      } else {
        const product = await tx.product.create({
          data: {
            userId: existing.userId,
            designId,
            ...productData,
            track: {
              create: {
                title: existing.title,
                audioUrl: existing.audioUrl,
              },
            },
          },
        });
        productId = product.id;
      }
    }

    if (status !== "ACCEPTED" && productId) {
      await tx.product.update({
        where: { id: productId },
        data: { isPublished: false, availability: status === "REVISION" ? "WITHDRAWN" : "SOLD_OUT" },
      });
    }

    return tx.musicSubmission.update({
      where: { id },
      data: { status, adminNote: adminNote || null, productId },
      include: submissionInclude,
    });
  });

  return res.json({ message: "Submission updated", data: submission });
};

export const getAnalytics = async (_req: AuthenticatedRequest, res: Response) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      orderBy: { createdAt: "asc" },
      include: { product: true },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      select: { genre: true, format: true },
    }),
  ]);

  const monthlyRevenue = new Map<string, number>();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    monthlyRevenue.set(d.toLocaleString("default", { month: "short" }), 0);
  }

  for (const order of orders) {
    const month = order.createdAt.toLocaleString("default", { month: "short" });
    monthlyRevenue.set(month, (monthlyRevenue.get(month) || 0) + order.price);
  }

  const genreCounts = new Map<string, number>();
  const formatCounts = new Map<string, number>();

  for (const product of products) {
    if (product.genre) {
      genreCounts.set(product.genre, (genreCounts.get(product.genre) || 0) + 1);
    }
    if (product.format) {
      formatCounts.set(product.format, (formatCounts.get(product.format) || 0) + 1);
    }
  }

  return res.json({
    data: {
      revenue: Array.from(monthlyRevenue.entries()).map(([label, value]) => ({ label, value })),
      genres: Array.from(genreCounts.entries())
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6),
      formats: Array.from(formatCounts.entries()).map(([label, value]) => ({ label, value })),
    },
  });
};
