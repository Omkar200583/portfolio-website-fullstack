import express from "express";
import { createCertificate, getCertificates, updateCertificate, deleteCertificate } from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { uploadProject } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, uploadProject.single("image"), createCertificate);
router.get("/", getCertificates);
router.put("/:id", protect, adminOnly, uploadProject.single("image"), updateCertificate);
router.delete("/:id", protect, adminOnly, deleteCertificate);

export default router;