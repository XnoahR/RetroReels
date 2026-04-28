import type { Response } from "express";
import prisma from "../utils/db.util.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

const submissionInclude = {
  product: { include: { track: true, vhsDesign: true } },
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

const allowedFormats = new Set(["VHS", "Cassette", "Vinyl"]);
const normalizeFormat = (format?: string) => (format && allowedFormats.has(format) ? format : "VHS");

export const listMyMusicSubmissions = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const { skip, take } = getPagination(req);

  const submissions = await prisma.musicSubmission.findMany({
    where: { userId },
    include: submissionInclude,
    orderBy: { createdAt: "desc" },
    skip,
    take: take + 1,
  });

  return res.json(pagedResponse(submissions, skip, take));
};

export const createMusicSubmission = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const { title, artist, genre, format, audioUrl, coverUrl, note, price, baseColor, borderColor, discColor, sideColor } = req.body;
  if (!title || !artist || !audioUrl) {
    return res.status(400).json({ message: "title, artist, and audioUrl are required" });
  }

  const submission = await prisma.musicSubmission.create({
    data: {
      userId,
      title,
      artist,
      genre: genre || null,
      format: normalizeFormat(format),
      audioUrl,
      coverUrl: coverUrl || null,
      note: note || null,
      price: Number(price) || 20,
      status: "PENDING",
      baseColor: baseColor || null,
      borderColor: borderColor || null,
      discColor: discColor || null,
      sideColor: sideColor || null,
    },
    include: submissionInclude,
  });

  return res.status(201).json({ message: "Music submitted for review", data: submission });
};

export const updateMyMusicSubmission = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const id = req.params.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  if (!id) return res.status(400).json({ message: "Submission id is required" });

  const submission = await prisma.musicSubmission.findUnique({ where: { id } });
  if (!submission) return res.status(404).json({ message: "Submission not found" });
  if (submission.userId !== userId) return res.status(403).json({ message: "You can only edit your own submissions" });
  if (submission.status === "ACCEPTED") {
    return res.status(409).json({ message: "Accepted music cannot be edited. Manage availability from catalog instead." });
  }

  const { title, artist, genre, format, audioUrl, coverUrl, note, price, baseColor, borderColor, discColor, sideColor } = req.body;
  const data: any = {
    title,
    artist,
    genre,
    format: format === undefined ? undefined : normalizeFormat(format),
    audioUrl,
    coverUrl,
    note,
    price: price === undefined ? undefined : Number(price),
    baseColor,
    borderColor,
    discColor,
    sideColor,
    status: "PENDING",
    adminNote: null,
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  const updated = await prisma.musicSubmission.update({
    where: { id },
    data,
    include: submissionInclude,
  });

  return res.json({ message: "Submission updated and sent back to review", data: updated });
};

export const deleteMyMusicSubmission = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const id = req.params.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  if (!id) return res.status(400).json({ message: "Submission id is required" });

  const submission = await prisma.musicSubmission.findUnique({ where: { id } });
  if (!submission) return res.status(404).json({ message: "Submission not found" });
  if (submission.userId !== userId) return res.status(403).json({ message: "You can only delete your own submissions" });
  if (submission.status === "ACCEPTED") {
    return res.status(409).json({ message: "Accepted music cannot be deleted. Mark it sold out or withdrawn instead." });
  }

  await prisma.musicSubmission.delete({ where: { id } });
  return res.json({ message: "Submission deleted" });
};
