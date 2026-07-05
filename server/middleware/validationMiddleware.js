import { body, param, query, validationResult } from "express-validator";
import { sendError } from "../utils/response.js";

/** Run after validation rules – short-circuits with 422 if any errors. */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(". ");
    return sendError(res, messages, 422);
  }
  next();
};

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const loginRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// ── Contact ───────────────────────────────────────────────────────────────────
export const contactRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("subject").trim().isLength({ min: 3 }).withMessage("Subject must be at least 3 characters"),
  body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters"),
];

// ── Project ───────────────────────────────────────────────────────────────────
export const projectRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category")
    .optional()
    .isIn(["web", "mobile", "ai", "backend", "fullstack", "other"])
    .withMessage("Invalid category"),
];

// ── Skill ─────────────────────────────────────────────────────────────────────
export const skillRules = [
  body("name").trim().notEmpty().withMessage("Skill name is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("proficiency").isInt({ min: 0, max: 100 }).withMessage("Proficiency must be 0-100"),
];

// ── Blog ──────────────────────────────────────────────────────────────────────
export const blogRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
];

// ── AI Chat ───────────────────────────────────────────────────────────────────
export const chatRules = [
  body("messages").isArray({ min: 1 }).withMessage("Messages array is required"),
  body("messages.*.role").isIn(["user", "assistant"]).withMessage("Invalid message role"),
  body("messages.*.content").trim().notEmpty().withMessage("Message content cannot be empty"),
];