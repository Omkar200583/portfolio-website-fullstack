import User from "../models/User.js";
import Interview from "../models/Interview.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/response.js";

// @desc    Get all users
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, isActive } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search)
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password -refreshToken")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendPaginated(res, users, total, Number(page), Number(limit));
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get single user with AI stats
// @route   GET /api/users/:id
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -refreshToken");
    if (!user) return sendError(res, "User not found", 404);

    const interviews = await Interview.find({ userId: req.params.id })
      .select("jobTitle status overallScore createdAt")
      .sort("-createdAt")
      .limit(10);

    return sendSuccess(res, { user, interviews });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Update user role or active status
// @route   PUT /api/users/:id
export const updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const allowedUpdates = {};
    if (role) allowedUpdates.role = role;
    if (isActive !== undefined) allowedUpdates.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, allowedUpdates, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, user, "User updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return sendError(res, "You cannot delete your own account", 400);

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, "User not found", 404);

    // Clean up their interviews
    await Interview.deleteMany({ userId: req.params.id });

    return sendSuccess(res, null, "User deleted");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Reset a user's AI usage counters
// @route   POST /api/users/:id/reset-usage
export const resetAIUsage = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        "aiUsage.monthlyTokens": 0,
        "aiUsage.lastReset": new Date(),
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) return sendError(res, "User not found", 404);
    return sendSuccess(res, user, "AI usage reset");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};