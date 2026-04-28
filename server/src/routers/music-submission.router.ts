import express from "express";
import {
  createMusicSubmission,
  deleteMyMusicSubmission,
  listMyMusicSubmissions,
  updateMyMusicSubmission,
} from "../controllers/music-submission.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", requireAuth, listMyMusicSubmissions);
router.post("/", requireAuth, createMusicSubmission);
router.patch("/:id", requireAuth, updateMyMusicSubmission);
router.delete("/:id", requireAuth, deleteMyMusicSubmission);

export default router;
