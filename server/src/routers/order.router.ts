import express from "express";
import { buyProduct, listMyOrders } from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, listMyOrders);
router.post("/buy/:productId", requireAuth, buyProduct);

export default router;
