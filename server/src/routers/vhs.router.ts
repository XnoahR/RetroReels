import express from "express";
import {
  CreateTapeDesign,
  CreateVHSDesign,
  DeleteTapeDesign,
  GetSharedTapeDesign,
  GetVhsDesign,
  ListMyTapeDesigns,
  ShareTapeDesign,
  UpdateTapeDesign,
} from "../controllers/vhs.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/presets/me", requireAuth, ListMyTapeDesigns);
router.post("/presets", requireAuth, CreateTapeDesign);
router.patch("/presets/:id", requireAuth, UpdateTapeDesign);
router.delete("/presets/:id", requireAuth, DeleteTapeDesign);
router.post("/presets/:id/share", requireAuth, ShareTapeDesign);
router.get("/shared/:id", GetSharedTapeDesign);
router.get("/", GetVhsDesign);
router.post("/", CreateVHSDesign);

export default router;
