import express from "express";
import { buyProduct, listMyLibrary, listMyOrders } from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, listMyOrders);
router.get("/library", requireAuth, listMyLibrary);
router.post("/buy/:productId", requireAuth, buyProduct);

export default router;
