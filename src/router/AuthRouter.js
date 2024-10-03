import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
} from "../controllers/AuthController.js";
import {authMiddleware, permissionAccess} from '../middlewares/AuthMiddleware.js'


const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);
router.get("/users",authMiddleware, getUser);
router.get("/joe",authMiddleware, permissionAccess('admin'), (req,res) =>{
  res.send('Hey Joe!')
})


export default router;