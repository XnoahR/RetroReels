import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import VhsRouter from "./routers/vhs.router.js";
import AuthRouter from "./routers/auth.router.js";
import ProductRouter from "./routers/product.router.js";
import OrderRouter from "./routers/order.router.js";
import UserPreferencesRouter from "./routers/user-preferences.router.js";
import CarouselRouter from "./routers/carousel.router.js";
import CartRouter from "./routers/cart.router.js";
import SocialRouter from "./routers/social.router.js";
import AdminRouter from "./routers/admin.router.js";
import MusicSubmissionRouter from "./routers/music-submission.router.js";
import { getJwtSecret } from "./utils/auth.util.js";

dotenv.config();
getJwtSecret();

const app = express();

app.use(cors({
  origin: 'https://retroreels.endea4.id',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/vhs", VhsRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/cart", CartRouter);
app.use("/api/me", UserPreferencesRouter);
app.use("/api/carousel", CarouselRouter);
app.use("/api/social", SocialRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/music-submissions", MusicSubmissionRouter);

app.use("/vhs", VhsRouter);
app.use("/auth", AuthRouter);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
