import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendError } from "../utils/response.js";

const getToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
};

export const protect = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return sendError(res, "Not authorized, no token", 401);
    }

    if (!process.env.JWT_SECRET) {
      return sendError(res, "JWT secret is not configured", 500);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );

    if (!req.user) {
      return sendError(res, "User not found", 401);
    }

    if (req.user.isActive === false) {
      return sendError(res, "User account is inactive", 401);
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return sendError(res, "Not authorized, invalid token", 401);
  }
};

export const protectAdmin = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return sendError(res, "Not authorized, no token", 401);
    }

    if (!process.env.JWT_SECRET) {
      return sendError(res, "JWT secret is not configured", 500);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return sendError(res, "Admin user not found", 401);
    }

    if (user.isActive === false) {
      return sendError(res, "User account is inactive", 401);
    }

    const isAdmin =
      user.isAdmin === true ||
      user.role === "admin" ||
      user.role === "Admin";

    if (!isAdmin) {
      return sendError(res, "Admin access required", 403);
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Admin authentication error:", error.message);

    return sendError(res, "Not authorized, invalid token", 401);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token || !process.env.JWT_SECRET) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );
  } catch (error) {
    req.user = null;
  }

  next();
};