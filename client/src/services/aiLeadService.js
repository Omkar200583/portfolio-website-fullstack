// frontend/src/services/aiLeadService.js
import api from "./api";

export const aiLeadService = {
  // Called when a visitor unlocks AI tools
  create: (data) => api.post("/ai/leads", data),

  // Used by admin "AI Tool Users" page (admin-only, protected)
  // Expected response: { data: [{ _id, name, email, tool, createdAt }, ...] }
  getAll: (params) => api.get("/admin/ai-leads", { params }),
};

export default aiLeadService;