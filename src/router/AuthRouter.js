import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);
router.get("/users",getUser);

export default router;