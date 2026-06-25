// server/routes/analyticsRoutes.js
import { Router } from "express";
import {
  trackEvent,
  getDashboardStats,
  getAnalytics,
} from "../controllers/analyticsController.js";
import Analytics from "../models/Analytics.js";

const router = Router();

// Public — visitors aren't logged in
router.post("/track", trackEvent);

// Dashboard stats
router.get("/dashboard", getDashboardStats);

// Raw events with filters
router.get("/events", getAnalytics);

// Traffic sources
router.get("/traffic", async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const data = await Analytics.aggregate([
      { $match: { event: "page_view", timestamp: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $cond: [
              { $regexMatch: { input: { $ifNull: ["$referrer", ""] }, regex: /^https?:\/\/(www\.)?google/ } },
              "Google",
              {
                $cond: [
                  { $regexMatch: { input: { $ifNull: ["$referrer", ""] }, regex: /^https?:\/\/(www\.)?linkedin/ } },
                  "LinkedIn",
                  {
                    $cond: [
                      { $regexMatch: { input: { $ifNull: ["$referrer", ""] }, regex: /^https?:\/\/github/ } },
                      "GitHub",
                      { $cond: [{ $eq: [{ $ifNull: ["$referrer", ""] }, ""] }, "Direct", "Other"] },
                    ],
                  },
                ],
              },
            ],
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    return res.json({ success: true, data: data.map((d) => ({ source: d._id, count: d.count })) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Recent activity
router.get("/activity", async (req, res) => {
  try {
    const data = await Analytics.find().sort({ timestamp: -1 }).limit(20).select("event page timestamp -_id").lean();
    const now = new Date();
    const activity = data.map((item) => {
      const diff = now - new Date(item.timestamp);
      let time;
      if (diff < 60000) time = "just now";
      else if (diff < 3600000) time = `${Math.floor(diff / 60000)} min ago`;
      else if (diff < 86400000) time = `${Math.floor(diff / 3600000)} hr ago`;
      else time = `${Math.floor(diff / 86400000)} days ago`;
      return { type: item.event, page: item.page || "/", time };
    });
    return res.json({ success: true, data: activity });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;