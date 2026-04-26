import express from "express";
import cors from "cors";
import VhsRouter from "./routers/vhs.router.js";
import AuthRouter from "./routers/auth.router.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/vhs", VhsRouter);
app.use("/auth", AuthRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});