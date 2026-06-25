import express from "express";
import { createSkill, getSkills, getSkill, updateSkill, deleteSkill } from "../controllers/skillController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { uploadProject } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getSkills);
router.get("/:id", getSkill);
router.post("/", protect, adminOnly, uploadProject.single("image"), createSkill);
router.put("/:id", protect, adminOnly, uploadProject.single("image"), updateSkill);
router.delete("/:id", protect, adminOnly, deleteSkill);

export default router;