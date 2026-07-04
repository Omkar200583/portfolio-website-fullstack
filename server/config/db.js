import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

// Track connection state
let isConnected = false;

export const connectDB = async () => {
  // Prevent multiple connections
  if (isConnected) {
    logger.warn("MongoDB already connected, skipping...");
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 2,
      
      // Timeout settings (ms)
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Buffering
      bufferCommands: false, // Disable buffering when not connected
    });

    isConnected = true;
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Connection event listeners
    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      isConnected = true;
      logger.info("MongoDB reconnected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB runtime error: ${err.message}`);
    });

  } catch (error) {
    isConnected = false;
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Graceful disconnect for testing/shutdown
export const disconnectDB = async () => {
  if (!isConnected) return;
  
  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info("MongoDB disconnected gracefully");
  } catch (error) {
    logger.error(`Error disconnecting MongoDB: ${error.message}`);
  }
};