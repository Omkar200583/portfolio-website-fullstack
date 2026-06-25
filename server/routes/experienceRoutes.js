import express from "express";
import { getExperiences, getExperience, createExperience, updateExperience, deleteExperience } from "../controllers/experienceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { uploadAvatar } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getExperiences);
router.get("/:id", getExperience);
router.post("/", protect, adminOnly, uploadAvatar.single("companyLogo"), createExperience);
router.put("/:id", protect, adminOnly, uploadAvatar.single("companyLogo"), updateExperience);
router.delete("/:id", protect, adminOnly, deleteExperience);

export default router;