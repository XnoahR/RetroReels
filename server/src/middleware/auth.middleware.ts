import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken, type AuthTokenPayload } from "../utils/auth.util.js";

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    req.user = verifyAuthToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!token) {
    next();
    return;
  }

  try {
    req.user = verifyAuthToken(token);
  } catch {
    delete req.user;
  }

  next();
};
