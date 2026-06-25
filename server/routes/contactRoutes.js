import express from "express";
import { submitContact, getContacts, getContact, replyContact, updateContactStatus, deleteContact } from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { contactLimiter } from "../middleware/rateLimitMiddleware.js";
import { contactRules, validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/", contactLimiter, contactRules, validate, submitContact);       // Public
router.get("/", protect, adminOnly, getContacts);                              // Admin
router.get("/:id", protect, adminOnly, getContact);                            // Admin
router.post("/:id/reply", protect, adminOnly, replyContact);                   // Admin
router.patch("/:id/status", protect, adminOnly, updateContactStatus);          // Admin
router.delete("/:id", protect, adminOnly, deleteContact);                      // Admin

export default router;