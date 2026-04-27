import express from "express";
import {
  createSocialComment,
  createSocialPost,
  deleteSocialPost,
  getSocialDiscovery,
  getSocialPost,
  getSocialProfile,
  listSocialPosts,
  toggleSocialPostLike,
  updateSocialPost,
  uploadSocialImage,
} from "../controllers/social.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/posts", optionalAuth, listSocialPosts);
router.get("/discovery", optionalAuth, getSocialDiscovery);
router.get("/posts/:postId", optionalAuth, getSocialPost);
router.get("/profiles/:userId", optionalAuth, getSocialProfile);
router.post("/uploads", requireAuth, uploadSocialImage);
router.post("/posts", requireAuth, createSocialPost);
router.patch("/posts/:postId", requireAuth, updateSocialPost);
router.delete("/posts/:postId", requireAuth, deleteSocialPost);
router.post("/posts/:postId/like", requireAuth, toggleSocialPostLike);
router.post("/posts/:postId/comments", requireAuth, createSocialComment);

export default router;
