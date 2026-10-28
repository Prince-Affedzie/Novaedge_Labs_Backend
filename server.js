import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import postRoutes from "./routes/posts.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL.split(",") }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/posts", postRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

await mongoose.connect(process.env.MONGO_URI);
app.listen(process.env.PORT, () => console.log(`API on :${process.env.PORT}`));