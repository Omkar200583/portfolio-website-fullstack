import "dotenv/config";
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
import statsRoutes from "./routes/statsRoutes.js";


const app = express();

const PORT = process.env.PORT || 5000;


// =====================================
// CORS CONFIGURATION
// =====================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5500",

  // Vercel Frontend
  "https://portfolio-website-fullstack-mu.vercel.app",

  process.env.CLIENT_URL
].filter(Boolean);



const corsOptions = {

  origin: (origin, callback) => {

    // Allow Postman and backend requests
    if (!origin) {
      return callback(null, true);
    }


    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }


    console.error(
      "❌ CORS blocked:",
      origin
    );


    return callback(
      new Error(
        `CORS blocked: ${origin}`
      )
    );

  },


  credentials: true,


  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],


  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]

};



// =====================================
// MIDDLEWARE
// =====================================


app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);


app.use(cors(corsOptions));


app.options(
  "*",
  cors(corsOptions)
);



app.use(
  express.json({
    limit: "50mb"
  })
);



app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb"
  })
);



app.use(
  morgan("dev")
);



app.use(requestLogger);



// =====================================
// STATIC FILES
// =====================================

app.use(
  "/uploads",
  express.static("uploads")
);



// =====================================
// API ROUTES
// =====================================


app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/projects",
  projectRoutes
);


app.use(
  "/api/skills",
  skillRoutes
);


app.use(
  "/api/blog",
  blogRoutes
);


app.use(
  "/api/certificates",
  certificateRoutes
);


app.use(
  "/api/experience",
  experienceRoutes
);


app.use(
  "/api/contact",
  contactRoutes
);


app.use(
  "/api/ai",
  aiRoutes
);


app.use(
  "/api/analytics",
  analyticsRoutes
);


app.use(
  "/api/users",
  userRoutes
);


app.use(
  "/api/speech",
  speechRoutes
);


app.use(
  "/api/ai-otp",
  aiOtpRoutes
);


app.use(
  "/api/admin",
  adminRoutes
);


app.use(
  "/api/stats",
  statsRoutes
);



// =====================================
// HEALTH CHECK
// =====================================


app.get(
  "/api/health",
  (req, res) => {

    res.json({

      status: "ok",

      environment:
      process.env.NODE_ENV,

      clientUrl:
      process.env.CLIENT_URL,

      allowedOrigins

    });

  }
);



// Optional root route for Render health check

app.get(
  "/",
  (req, res) => {

    res.json({
      message: "Portfolio Backend API Running 🚀"
    });

  }
);



// =====================================
// ERROR HANDLING
// =====================================


app.use(
  notFound
);


app.use(
  errorHandler
);



// =====================================
// START SERVER
// =====================================


const startServer = async () => {

  try {

    await connectDB();


    app.listen(
      PORT,
      () => {

        logger.info(
          `Server running on port ${PORT}`
        );


        console.log(
          "NODE_ENV:",
          process.env.NODE_ENV
        );


        console.log(
          "CLIENT_URL:",
          process.env.CLIENT_URL
        );


        console.log(
          "ALLOWED ORIGINS:",
          allowedOrigins
        );

      }
    );


  } catch (error) {


    console.error(
      "Server startup failed:",
      error.message
    );


    process.exit(1);

  }

};



startServer();


export default app;