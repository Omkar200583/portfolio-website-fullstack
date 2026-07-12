// ─────────────────────────────────────────────────────────────────────────────
// statsService.js
// Same pattern as analyticsService.js — talks to your existing backend/axios
// instance. Drop this in src/services/statsService.js
// ─────────────────────────────────────────────────────────────────────────────
import api from "./api"; // ← use whatever your existing axios instance is called
// If you don't have one yet, replace with: import axios from "axios";
// and swap `api.get` below for `axios.get(`${import.meta.env.VITE_API_URL}/...`)`

export const statsService = {
  // GET /api/stats  →  { projectsShipped, internships, techStacks, ownership }
  getAboutStats: () => api.get("/stats/about"),

  // GET /api/projects/count  →  { count }
  getProjectsCount: () => api.get("/projects/count"),
};

export default statsService;