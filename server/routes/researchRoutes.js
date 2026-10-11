import express from "express";

import {
  getPublicResearch,
  getFeaturedResearch,
  getResearchById,
  getAllResearchAdmin,
  getResearchByIdAdmin,
  createResearch,
  updateResearch,
  deleteResearch,
  toggleVisibility,
  toggleFeatured,
  uploadFile,
} from "../controllers/researchController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";

import {
  uploadResearchFile,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES

router.get("/", getPublicResearch);

router.get("/featured", getFeaturedResearch);

router.get("/:id", getResearchById);

// ADMIN READ ROUTES

router.get(
  "/admin/all",
  protectAdmin,
  getAllResearchAdmin
);

router.get(
  "/admin/:id",
  protectAdmin,
  getResearchByIdAdmin
);

// ADMIN FILE UPLOAD

router.post(
  "/upload",
  protectAdmin,
  uploadResearchFile,
  uploadFile
);

// ADMIN CREATE

router.post(
  "/",
  protectAdmin,
  createResearch
);

// ADMIN UPDATE

router.put(
  "/:id",
  protectAdmin,
  updateResearch
);

// ADMIN DELETE

router.delete(
  "/:id",
  protectAdmin,
  deleteResearch
);

// ADMIN VISIBILITY

router.patch(
  "/:id/visibility",
  protectAdmin,
  toggleVisibility
);

// ADMIN FEATURED STATUS

router.patch(
  "/:id/featured",
  protectAdmin,
  toggleFeatured
);

export default router;