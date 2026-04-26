import type { Response } from "express";
import prisma from "../utils/db.util.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getSettings = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  return res.json({ data: settings });
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const { quality, hardwareNoise, crossfade, theme, volume } = req.body;
  const data: any = {
    quality,
    hardwareNoise,
    crossfade,
    theme,
    volume: volume === undefined ? undefined : Number(volume),
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) delete data[key];
  });

  const settings = await prisma.userSettings.upsert({
    where: { userId },
    update: data,
    create: {
      userId,
      ...data,
    },
  });

  return res.json({ message: "Settings saved", data: settings });
};

export const listFavorites = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { product: { include: { track: true, vhsDesign: true } } },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ data: favorites });
};

export const addFavorite = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const productId = req.params.productId;
  if (!productId) return res.status(400).json({ message: "Product id is required" });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isPublished) {
    return res.status(404).json({ message: "Product not found" });
  }

  const favorite = await prisma.favorite.upsert({
    where: { userId_productId: { userId, productId: product.id } },
    update: {},
    create: { userId, productId: product.id },
    include: { product: { include: { track: true, vhsDesign: true } } },
  });

  return res.status(201).json({ message: "Favorite saved", data: favorite });
};

export const removeFavorite = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const productId = req.params.productId;
  if (!productId) return res.status(400).json({ message: "Product id is required" });

  await prisma.favorite.deleteMany({
    where: { userId, productId },
  });

  return res.json({ message: "Favorite removed" });
};

export const listPlaylists = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  const playlists = await prisma.playlist.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: { include: { track: true, vhsDesign: true } } },
        orderBy: { position: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return res.json({ data: playlists });
};

export const createPlaylist = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });

  if (!req.body.name) {
    return res.status(400).json({ message: "Playlist name is required" });
  }

  const playlist = await prisma.playlist.create({
    data: {
      userId,
      name: req.body.name,
      description: req.body.description,
    },
  });

  return res.status(201).json({ message: "Playlist created", data: playlist });
};

export const updatePlaylist = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const playlistId = req.params.playlistId;
  if (!playlistId) return res.status(400).json({ message: "Playlist id is required" });

  const playlist = await prisma.playlist.updateMany({
    where: { id: playlistId, userId },
    data: {
      name: req.body.name,
      description: req.body.description,
    },
  });

  if (playlist.count === 0) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  return res.json({ message: "Playlist updated" });
};

export const deletePlaylist = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const playlistId = req.params.playlistId;
  if (!playlistId) return res.status(400).json({ message: "Playlist id is required" });

  const playlist = await prisma.playlist.deleteMany({
    where: { id: playlistId, userId },
  });

  if (playlist.count === 0) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  return res.json({ message: "Playlist deleted" });
};

export const addPlaylistItem = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const playlistId = req.params.playlistId;
  const productId = req.params.productId;
  if (!playlistId) return res.status(400).json({ message: "Playlist id is required" });
  if (!productId) return res.status(400).json({ message: "Product id is required" });

  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId },
  });

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isPublished) {
    return res.status(404).json({ message: "Product not found" });
  }

  const purchased = await prisma.order.findFirst({
    where: { userId, productId: product.id },
  });

  if (!purchased) {
    return res.status(403).json({ message: "Buy this music before adding it to a playlist" });
  }

  const requestedPosition = req.body?.position;
  const updateData: any = {};
  if (requestedPosition !== undefined) {
    updateData.position = Number(requestedPosition);
  }

  const item = await prisma.playlistItem.upsert({
    where: {
      playlistId_productId: {
        playlistId: playlist.id,
        productId: product.id,
      },
    },
    update: updateData,
    create: {
      playlistId: playlist.id,
      productId: product.id,
      position: requestedPosition === undefined ? 0 : Number(requestedPosition),
    },
  });

  return res.status(201).json({ message: "Track added to playlist", data: item });
};

export const removePlaylistItem = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const playlistId = req.params.playlistId;
  const productId = req.params.productId;
  if (!playlistId) return res.status(400).json({ message: "Playlist id is required" });
  if (!productId) return res.status(400).json({ message: "Product id is required" });

  const playlist = await prisma.playlist.findFirst({
    where: { id: playlistId, userId },
  });

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  await prisma.playlistItem.deleteMany({
    where: { playlistId: playlist.id, productId },
  });

  return res.json({ message: "Track removed from playlist" });
};
