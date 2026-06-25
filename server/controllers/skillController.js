import Skill from "../models/Skill.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getSkills = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    const skills = await Skill.find(filter).sort({ category: 1, order: 1, proficiency: -1 });

    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

    return sendSuccess(res, { skills, grouped });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return sendError(res, "Skill not found", 404);
    return sendSuccess(res, skill);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const createSkill = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Safely handle image: ONLY use the uploaded file, ignore req.body.image
    if (req.file) {
      data.image = req.file.path;
    } else {
      delete data.image; // Prevents the "{}" CastError
    }

    const skill = await Skill.create(data);
    return sendSuccess(res, skill, "Skill created", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const updateSkill = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Safely handle image: ONLY use the uploaded file, ignore req.body.image
    if (req.file) {
      data.image = req.file.path;
    } else {
      delete data.image; // Prevents the "{}" CastError
    }

    const skill = await Skill.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!skill) return sendError(res, "Skill not found", 404);
    return sendSuccess(res, skill, "Skill updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return sendError(res, "Skill not found", 404);
    return sendSuccess(res, null, "Skill deleted");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const bulkUpdateOrder = async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    await Promise.all(items.map(({ id, order }) => Skill.findByIdAndUpdate(id, { order })));
    return sendSuccess(res, null, "Order updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};