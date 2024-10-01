import express from "express";
import {
  getVideoTape,
  createVideoTape,
} from "../controllers/VideoTapeController.js";
const router = express.Router();

router.get("/list", getVideoTape);
router.post("/store", createVideoTape);
// router.patch("/update");
// router.delete("/delete");

export default router;
