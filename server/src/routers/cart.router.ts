import express from "express";
import {
  addCartItem,
  checkoutCart,
  listCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listCart);
router.post("/checkout", checkoutCart);
router.post("/:productId", addCartItem);
router.patch("/:productId", updateCartItem);
router.delete("/:productId", removeCartItem);

export default router;
