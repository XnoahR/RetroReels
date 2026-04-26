import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", optionalAuth, listProducts);
router.get("/:id", optionalAuth, getProduct);
router.post("/", requireAuth, createProduct);
router.patch("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;
