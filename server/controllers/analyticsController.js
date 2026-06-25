import Analytics from "../models/Analytics.js";
import Project from "../models/Project.js";
import Blog from "../models/Blog.js";
import Contact from "../models/Contact.js";
import Interview from "../models/Interview.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const trackEvent = async (req, res) => {
  try {
    const { event, page, metadata } = req.body;
    await Analytics.create({
      event, page, metadata,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      referrer: req.headers.referer,
      userId: req.user?._id,
      sessionId: req.headers["x-session-id"],
    });
    return sendSuccess(res, null, "Event tracked");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [
      totalProjects, totalBlogs, totalContacts, unreadContacts,
      totalInterviews, recentVisits, pageViews,
    ] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      Contact.countDocuments(),
      Contact.countDocuments({ status: "unread" }),
      Interview.countDocuments(),
      Analytics.countDocuments({ event: "page_view", timestamp: { $gte: thirtyDaysAgo } }),
      Analytics.aggregate([
        { $match: { event: "page_view", timestamp: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$page", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),
    ]);

    // Daily visits last 30 days
    const dailyVisits = await Analytics.aggregate([
      { $match: { event: "page_view", timestamp: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    return sendSuccess(res, {
      stats: { totalProjects, totalBlogs, totalContacts, unreadContacts, totalInterviews, recentVisits },
      pageViews,
      dailyVisits,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { from, to, event } = req.query;
    const filter = {};
    if (event) filter.event = event;
    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = new Date(from);
      if (to) filter.timestamp.$lte = new Date(to);
    }
    const data = await Analytics.find(filter).sort("-timestamp").limit(1000);
    return sendSuccess(res, data);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};