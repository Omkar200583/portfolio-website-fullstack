// backend/routes/aiLeads.js
import express from "express";
import { protect } from "../middleware/auth.js";
import { canAccessAdmin } from "../middleware/admin.js"; // if you have role checks

const router = express.Router();

// GET /api/admin/ai-leads — Admin only
router.get("/admin/ai-leads", protect, async (req, res) => {
  try {
    // Import your AI Lead model
    const AILead = (await import("../models/AILead.js")).default;
    
    const leads = await AILead.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;