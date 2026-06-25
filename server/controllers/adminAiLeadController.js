import AiLead from "../models/AiLead.js"; // Make sure this path matches your model

// @desc    Get all AI tool leads
// @route   GET /api/admin/ai-leads
export const getAiLeads = async (req, res) => {
  try {
    const leads = await AiLead.find().sort({ createdAt: -1 });
    res.json({ success: true, data: leads });
  } catch (error) {
    console.error("Error fetching AI leads:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};