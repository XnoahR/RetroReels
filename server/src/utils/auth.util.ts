import jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }

  return secret;
};

export const signAuthToken = (payload: AuthTokenPayload) => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "1d" });
};

export const verifyAuthToken = (token: string) => {
  return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
};
