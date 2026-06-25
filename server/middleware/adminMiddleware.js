import { sendError } from "../utils/response.js";

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return sendError(res, "Access denied. Admins only.", 403);
};