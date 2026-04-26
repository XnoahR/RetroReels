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
import { getJwtSecret } from "./utils/auth.util.js";

dotenv.config();
getJwtSecret();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/vhs", VhsRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/cart", CartRouter);
app.use("/api/me", UserPreferencesRouter);
app.use("/api/carousel", CarouselRouter);

app.use("/vhs", VhsRouter);
app.use("/auth", AuthRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
