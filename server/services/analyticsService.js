import Analytics from "../models/Analytics.js";
import { logger } from "../utils/logger.js";

export const logEvent = async (event, page, req, metadata = {}) => {
  try {
    await Analytics.create({
      event, page, metadata,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      referrer: req.headers.referer,
      sessionId: req.headers["x-session-id"],
    });
  } catch (error) {
    logger.error(`Analytics log error: ${error.message}`);
  }
};