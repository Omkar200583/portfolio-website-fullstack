// controllers/experienceController.js
import Experience from "../models/Experience.js";
import cloudinary from "../config/cloudinary.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
    return sendSuccess(res, experiences);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return sendError(res, "Experience not found", 404);
    return sendSuccess(res, exp);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const createExperience = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Handle company logo upload
    if (req.file) {
      data.companyLogo = { 
        url: req.file.path, 
        publicId: req.file.filename 
      };
    }

    // Parse date strings properly
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    else data.endDate = null; // Current job

    const exp = await Experience.create(data);
    return sendSuccess(res, exp, "Experience created", 201);
  } catch (error) {
    console.error("Create experience error:", error);
    return sendError(res, error.message, 500);
  }
};

export const updateExperience = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Handle company logo upload
    if (req.file) {
      data.companyLogo = { 
        url: req.file.path, 
        publicId: req.file.filename 
      };
    }

    // Parse date strings properly
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate === "" || data.endDate === null || data.endDate === undefined) {
      data.endDate = null; // Current job
    } else if (data.endDate) {
      data.endDate = new Date(data.endDate);
    }

    const exp = await Experience.findByIdAndUpdate(
      req.params.id, 
      data, 
      { new: true, runValidators: true }
    );
    
    if (!exp) return sendError(res, "Experience not found", 404);
    return sendSuccess(res, exp, "Experience updated");
  } catch (error) {
    console.error("Update experience error:", error);
    return sendError(res, error.message, 500);
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return sendError(res, "Experience not found", 404);
    
    if (exp.companyLogo?.publicId) {
      await cloudinary.uploader.destroy(exp.companyLogo.publicId);
    }
    
    await exp.deleteOne();
    return sendSuccess(res, null, "Experience deleted");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};