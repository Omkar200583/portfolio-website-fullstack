import express from "express";
import { getProjects, getProject, createProject, updateProject, deleteProject, toggleFeatured } from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { uploadProject } from "../middleware/uploadMiddleware.js";

const router = express.Router();

const upload = uploadProject.fields([{ name: "thumbnail", maxCount: 1 }, { name: "images", maxCount: 5 }]);

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", protect, adminOnly, upload, createProject);
router.put("/:id", protect, adminOnly, upload, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);
router.patch("/:id/featured", protect, adminOnly, toggleFeatured);

export default router;