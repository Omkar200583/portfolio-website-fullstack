import rateLimit from "express-rate-limit";

const make = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  });

/** General API – 300 requests / 15 min */
export const apiLimiter = make(15, 300, "Too many requests, please try again later.");

/** Auth endpoints – 20 attempts / 15 min */
export const authLimiter = make(15, 20, "Too many authentication attempts, please try again later.");

/** AI endpoints – 50 requests / 15 min */
export const aiLimiter = make(15, 50, "Too many AI requests, please try again later.");

/** Contact form – 5 submissions / 60 min */
export const contactLimiter = make(60, 5, "Too many contact form submissions, please try again later.");