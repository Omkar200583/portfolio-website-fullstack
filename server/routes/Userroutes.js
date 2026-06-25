import express from "express";
import { getUsers, getUserDetails, updateUser, deleteUser, resetAIUsage } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// All routes are admin-only
router.use(protect, adminOnly);

router.get("/", getUsers);
router.get("/:id", getUserDetails);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/reset-usage", resetAIUsage);

export default router;