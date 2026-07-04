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
  mongo: process.env.MONGODB_URI ? "FOUND" : "MISSING",
});

// -----------------------------
// CORS CONFIG
// -----------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests from Postman/curl or server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error(`❌ CORS blocked for origin: ${origin}`);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// -----------------------------
// MIDDLEWARE
// -----------------------------
app.use(helmet());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(morgan("dev"));
app.use(requestLogger);

// -----------------------------
// STATIC FILES
// -----------------------------
app.use("/uploads", express.static("uploads"));

// -----------------------------
// ROUTES
// -----------------------------
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

// -----------------------------
// HEALTH CHECK
// -----------------------------
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    allowedOrigins,
  });
});

// -----------------------------
// ERROR HANDLING
// -----------------------------
app.use(notFound);
app.use(errorHandler);

// -----------------------------
// START SERVER ONLY AFTER DB CONNECTS
// -----------------------------
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log("CWD:", process.cwd());
      console.log("ENV FILE CHECK:");
      console.log("MONGODB:", process.env.MONGODB_URI ? "FOUND" : "MISSING");
      console.log("GROQ:", process.env.GROQ_API_KEY ? "FOUND" : "MISSING");
      console.log("CLIENT_URL:", process.env.CLIENT_URL || "not set");
      console.log("ALLOWED ORIGINS:", allowedOrigins);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;