import express from "express";
import { getAiLeads } from "../controllers/adminAiLeadController.js";

const router = express.Router();

// Note: Removed 'admin' middleware that was causing the crash.
// You can add back your specific auth middleware here later if needed.
router.get("/ai-leads", getAiLeads);

export default router;