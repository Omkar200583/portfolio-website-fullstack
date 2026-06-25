import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/response.js";

// @desc    Get all projects
// @route   GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, featured, search, sort = "-createdAt" } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    if (search) filter.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];

    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendPaginated(res, projects, total, Number(page), Number(limit));
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
export const getProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { slug: req.params.id }] },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!project) return sendError(res, "Project not found", 404);
    return sendSuccess(res, project);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Create project
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.techStack === "string") data.techStack = JSON.parse(data.techStack);
    if (typeof data.tags === "string") data.tags = JSON.parse(data.tags);

    if (req.files) {
      if (req.files.thumbnail) data.thumbnail = { url: req.files.thumbnail[0].path, publicId: req.files.thumbnail[0].filename };
      if (req.files.images) data.images = req.files.images.map((f) => ({ url: f.path, publicId: f.filename }));
    }

    const project = await Project.create(data);
    return sendSuccess(res, project, "Project created", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.techStack === "string") data.techStack = JSON.parse(data.techStack);
    if (typeof data.tags === "string") data.tags = JSON.parse(data.tags);

    if (req.files) {
      if (req.files.thumbnail) data.thumbnail = { url: req.files.thumbnail[0].path, publicId: req.files.thumbnail[0].filename };
      if (req.files.images) data.images = req.files.images.map((f) => ({ url: f.path, publicId: f.filename }));
    }

    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!project) return sendError(res, "Project not found", 404);
    return sendSuccess(res, project, "Project updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, "Project not found", 404);

    // Delete images from Cloudinary
    if (project.thumbnail?.publicId) await cloudinary.uploader.destroy(project.thumbnail.publicId);
    for (const img of project.images || []) {
      if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
    }

    await project.deleteOne();
    return sendSuccess(res, null, "Project deleted");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Toggle featured
// @route   PATCH /api/projects/:id/featured
export const toggleFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return sendError(res, "Project not found", 404);
    project.featured = !project.featured;
    await project.save();
    return sendSuccess(res, project, `Project ${project.featured ? "featured" : "unfeatured"}`);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};