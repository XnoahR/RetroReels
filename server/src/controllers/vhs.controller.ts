import prisma from "../utils/db.util.js";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

interface IVhsDesign {
  name: string;
  titleBackgroundColor: string;
  baseColor: string;
  borderColor: string;
  discColor: string;
  sideColor: string;
}

const GetVhsDesign = async (req: Request, res: Response)=> {
    try {
        const result = await prisma.vHSDesign.findMany()

        return res.status(200).json({message:"Success", data: result})
    } catch (error) {
        console.error("Get VHS design error:", error)
        return res.status(500).json({ message: "Failed to load VHS designs" })
    }
}

const CreateVHSDesign = async (
  req: Request<{}, {}, IVhsDesign>,
  res: Response
) => {
  const body = req.body;

  const result = await prisma.vHSDesign.create({
    data: body,
  });

  return res.status(201).json({ message: "Success", data: result });
};

const ReadVHSDesign = {};

const presetSelect = {
  id: true,
  userId: true,
  name: true,
  baseColor: true,
  borderColor: true,
  discColor: true,
  sideColor: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
};

const normalizePresetBody = (body: any) => ({
  name: body.name || "Untitled Tape",
  baseColor: body.baseColor || "bg-zinc-950",
  borderColor: body.borderColor || "border-zinc-300",
  discColor: body.discColor || "bg-zinc-300",
  sideColor: body.sideColor || "bg-zinc-100",
});

const ListMyTapeDesigns = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const designs = await prisma.tapeDesignPreset.findMany({
    where: { userId },
    select: presetSelect,
    orderBy: { updatedAt: "desc" },
  });

  return res.json({ data: designs });
};

const CreateTapeDesign = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const design = await prisma.tapeDesignPreset.create({
    data: {
      userId,
      ...normalizePresetBody(req.body),
      isPublic: Boolean(req.body.isPublic),
    },
    select: presetSelect,
  });

  return res.status(201).json({ message: "Tape design saved", data: design });
};

const UpdateTapeDesign = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const id = req.params.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  if (!id) return res.status(400).json({ message: "Design id is required" });

  const existing = await prisma.tapeDesignPreset.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: "Tape design not found" });
  if (existing.userId !== userId) return res.status(403).json({ message: "You can only edit your own tape designs" });

  const design = await prisma.tapeDesignPreset.update({
    where: { id },
    data: {
      ...normalizePresetBody({ ...existing, ...req.body }),
      isPublic: req.body.isPublic === undefined ? existing.isPublic : Boolean(req.body.isPublic),
    },
    select: presetSelect,
  });

  return res.json({ message: "Tape design updated", data: design });
};

const DeleteTapeDesign = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const id = req.params.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  if (!id) return res.status(400).json({ message: "Design id is required" });

  const existing = await prisma.tapeDesignPreset.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: "Tape design not found" });
  if (existing.userId !== userId) return res.status(403).json({ message: "You can only delete your own tape designs" });

  await prisma.tapeDesignPreset.delete({ where: { id } });
  return res.json({ message: "Tape design deleted" });
};

const ShareTapeDesign = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const id = req.params.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  if (!id) return res.status(400).json({ message: "Design id is required" });

  const existing = await prisma.tapeDesignPreset.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: "Tape design not found" });
  if (existing.userId !== userId) return res.status(403).json({ message: "You can only share your own tape designs" });

  const design = await prisma.tapeDesignPreset.update({
    where: { id },
    data: { isPublic: true },
    select: presetSelect,
  });

  return res.json({ message: "Tape design share enabled", data: design });
};

const GetSharedTapeDesign = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ message: "Design id is required" });

  const design = await prisma.tapeDesignPreset.findFirst({
    where: { id, isPublic: true },
    select: presetSelect,
  });

  if (!design) return res.status(404).json({ message: "Shared tape design not found" });
  return res.json({ data: design });
};

export {
  CreateTapeDesign,
  CreateVHSDesign,
  DeleteTapeDesign,
  GetSharedTapeDesign,
  GetVhsDesign,
  ListMyTapeDesigns,
  ReadVHSDesign,
  ShareTapeDesign,
  UpdateTapeDesign,
};
