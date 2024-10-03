import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token) {
    return next(
      res.status(401).json({
        message: "You have no access to this page!",
      })
    );
  }

  let decoded;
  try {
    decoded = await jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return next(
      res.status(401).json({
        message: "Invalid Token",
      })
    );
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      res.status(401).json({
        message: "User not Found!",
      })
    );
  }

  req.user = currentUser;
  next();
};

const permissionAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          message: "Forbidden User",
        })
      );
    }
    next()
  };
};

export {authMiddleware, permissionAccess};
