import express from "express";
import {
  deleteExclusiveFeature,
  getAnalytics,
  getExclusiveFeature,
  listExclusiveFeatures,
  listMusicSubmissions,
  updateExclusiveFeature,
  updateMusicSubmission,
  upsertExclusiveFeature,
} from "../controllers/admin.controller.js";
import { optionalAuth, requireAdmin, requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/exclusive/current", optionalAuth, getExclusiveFeature);
router.get("/exclusive", requireAuth, requireAdmin, listExclusiveFeatures);
router.post("/exclusive", requireAuth, requireAdmin, upsertExclusiveFeature);
router.patch("/exclusive/:id", requireAuth, requireAdmin, updateExclusiveFeature);
router.delete("/exclusive/:id", requireAuth, requireAdmin, deleteExclusiveFeature);

router.get("/music-submissions", requireAuth, requireAdmin, listMusicSubmissions);
router.patch("/music-submissions/:id", requireAuth, requireAdmin, updateMusicSubmission);

router.get("/analytics", requireAuth, requireAdmin, getAnalytics);

export default router;
