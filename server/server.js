// ✅ MUST be the absolute first line to load env vars before other imports
import "dotenv/config";
import path from "path";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { requestLogger } from "./middleware/loggerMiddleware.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import speechRoutes from "./routes/speechRoutes.js";
import aiOtpRoutes from "./routes/aiOtpRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; 

const app = express();
const PORT = process.env.PORT || 5000;

console.log("ENV CHECK:", {
  groq: process.env.GROQ_API_KEY ? "FOUND" : "MISSING",
  mongo: process.env.MONGODB_URI ? "FOUND" : "MISSING"
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));
app.use(requestLogger);

// Static uploads
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/speech", speechRoutes);
app.use("/api/ai-otp", aiOtpRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

export default app;