// ─────────────────────────────────────────────────────────────────────────────
// analyticsService.js  — REAL API with mock fallback ONLY for dev
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Set to "mock" ONLY during UI development without a running backend
// Set to "api" when backend is running — this is the REAL mode
let currentMethod = "api";

const API_ENDPOINTS = {
  dashboard: `${API_BASE}/analytics/dashboard`,
  events: `${API_BASE}/analytics/events`,
  track: `${API_BASE}/analytics/track`,
  traffic: `${API_BASE}/analytics/traffic`,
  activity: `${API_BASE}/analytics/activity`,
};

// ─── API METHODS (REAL) ─────────────────────────────────────────────────────
const apiMethods = {
  getDashboard: async () => {
    const res = await fetch(API_ENDPOINTS.dashboard, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Dashboard API ${res.status}`);
    return res.json();
  },

  getOverview: async () => {
    const res = await fetch(API_ENDPOINTS.dashboard, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Overview API ${res.status}`);
    const json = await res.json();
    return { data: json.data?.stats || json.stats || {} };
  },

  getTrafficSources: async () => {
    const res = await fetch(API_ENDPOINTS.traffic, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Traffic API ${res.status}`);
    return res.json();
  },

  getActivity: async () => {
    const res = await fetch(API_ENDPOINTS.activity, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Activity API ${res.status}`);
    return res.json();
  },

  trackEvent: async (event, page, metadata = {}) => {
    await fetch(API_ENDPOINTS.track, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, page, metadata }),
    });
  },
};

// ─── MOCK METHODS (dev only) ────────────────────────────────────────────────
const mockMethods = {
  getDashboard: async () => {
    await new Promise((r) => setTimeout(r, 400));
    return {
      data: {
        stats: { totalProjects: 0, totalBlogs: 0, totalContacts: 0, unreadContacts: 0, totalInterviews: 0, recentVisits: 0 },
        pageViews: [],
        dailyVisits: [],
      },
    };
  },
  getOverview: async () => ({ data: {} }),
  getTrafficSources: async () => ({ data: [] }),
  getActivity: async () => ({ data: [] }),
  trackEvent: async () => {},
};

// ─── PICK METHOD ────────────────────────────────────────────────────────────
const methods = currentMethod === "api" ? apiMethods : mockMethods;

// ─── MAIN EXPORT ────────────────────────────────────────────────────────────
export const analyticsService = {
  getDashboard: () => methods.getDashboard(),
  getOverview: () => methods.getOverview(),
  getTrafficSources: () => methods.getTrafficSources(),
  getActivity: () => methods.getActivity(),
};

// ─── TRACKERS ───────────────────────────────────────────────────────────────
export const trackPageView = (path) => {
  if (currentMethod === "api") {
    methods.trackEvent("page_view", path, { referrer: document.referrer });
  } else {
    console.log("[Mock] Page view:", path);
  }
};

export const trackEvent = (eventName, path = "", metadata = {}) => {
  if (currentMethod === "api") {
    methods.trackEvent(eventName, path, metadata);
  } else {
    console.log("[Mock] Event:", eventName, path);
  }
};

export default analyticsService;