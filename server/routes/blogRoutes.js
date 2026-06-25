import express from "express";
import { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, likeBlog } from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { uploadBlog } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlog);
router.post("/", protect, adminOnly, uploadBlog.single("thumbnail"), createBlog);
router.put("/:id", protect, adminOnly, uploadBlog.single("thumbnail"), updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);
router.post("/:id/like", likeBlog);

export default router;