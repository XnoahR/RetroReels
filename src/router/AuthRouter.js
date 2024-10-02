import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
} from "../controllers/AuthController.js";
import authMiddleware from '../middlewares/AuthMiddleware.js'


const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);
router.get("/users",authMiddleware, getUser);

export default router;