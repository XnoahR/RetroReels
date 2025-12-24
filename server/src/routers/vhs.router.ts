import express from "express";
import { CreateVHSDesign, GetVhsDesign } from "../controllers/vhs.controller.js";

const router = express.Router();

router.get("/", GetVhsDesign);
router.post("/", CreateVHSDesign);

export default router;