import express from "express";
import {
  addFavorite,
  addPlaylistItem,
  createPlaylist,
  deletePlaylist,
  getSettings,
  listFavorites,
  listPlaylists,
  removeFavorite,
  removePlaylistItem,
  updatePlaylist,
  updateSettings,
} from "../controllers/user-preferences.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/settings", getSettings);
router.patch("/settings", updateSettings);

router.get("/favorites", listFavorites);
router.post("/favorites/:productId", addFavorite);
router.delete("/favorites/:productId", removeFavorite);

router.get("/playlists", listPlaylists);
router.post("/playlists", createPlaylist);
router.patch("/playlists/:playlistId", updatePlaylist);
router.delete("/playlists/:playlistId", deletePlaylist);
router.post("/playlists/:playlistId/items/:productId", addPlaylistItem);
router.delete("/playlists/:playlistId/items/:productId", removePlaylistItem);

export default router;
