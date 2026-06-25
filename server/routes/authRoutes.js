// backend/routes/authRoutes.js
import express from "express";
import { register, login, logout, getMe, updateProfile, changePassword, refreshToken } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../middleware/uploadMiddleware.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";
import { registerRules, loginRules, validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, registerRules, validate, register);
router.post("/login", authLimiter, loginRules, validate, login);

// ✅ ONLY ONE refresh route - using the controller
router.post("/refresh", refreshToken);

router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/profile", protect, uploadAvatar.single("avatar"), updateProfile);
router.put("/change-password", protect, changePassword);

export default router;