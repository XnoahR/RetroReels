import express from "express";
import {
  createCarouselSlide,
  deleteCarouselSlide,
  listCarouselSlides,
  updateCarouselSlide,
} from "../controllers/carousel.controller.js";
import { optionalAuth, requireAdmin, requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", optionalAuth, listCarouselSlides);
router.post("/", requireAuth, requireAdmin, createCarouselSlide);
router.patch("/:id", requireAuth, requireAdmin, updateCarouselSlide);
router.delete("/:id", requireAuth, requireAdmin, deleteCarouselSlide);

export default router;
