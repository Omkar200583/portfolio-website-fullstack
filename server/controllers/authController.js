import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../config/jwt.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { logger } from "../utils/logger.js";

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return sendError(res, "Email already registered", 400);

    const user = await User.create({ name, email, password });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    return sendSuccess(res, { user, accessToken, refreshToken }, "Registration successful", 201);
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, "Invalid email or password", 401);
    }
    if (!user.isActive) return sendError(res, "Account is deactivated", 401);

    user.lastLogin = new Date();
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    return sendSuccess(res, { user, accessToken, refreshToken }, "Login successful");
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return sendError(res, error.message, 500);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return sendError(res, "Refresh token required", 400);

    const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) return sendError(res, "Invalid refresh token", 401);

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save();

    return sendSuccess(res, { accessToken, refreshToken: newRefreshToken }, "Token refreshed");
  } catch (error) {
    return sendError(res, "Invalid or expired refresh token", 401);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    return sendSuccess(res, null, "Logged out successfully");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  return sendSuccess(res, req.user, "User fetched");
};

// @desc    Update profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const update = { name, bio };
    if (req.file) update.avatar = req.file.path;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true });
    return sendSuccess(res, user, "Profile updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(currentPassword))) return sendError(res, "Current password incorrect", 400);

    user.password = newPassword;
    await user.save();
    return sendSuccess(res, null, "Password changed successfully");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};