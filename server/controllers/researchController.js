import mongoose from "mongoose";
import Research from "../models/Research.js";

const asStringArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((v) => String(v).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
};

const buildPayload = (body = {}) => {
  const payload = {};

  const stringFields = [
    "title",
    "shortDescription",
    "abstract",
    "supervisor",
    "publication",
    "publisher",
    "registrationId",
    "bookTitle",
    "chapterNumber",
    "isbn",
    "researchProblem",
    "methodology",
    "findings",
    "chapterContent",
    "doi",
    "paperUrl",
    "chapterUrl",
    "publicationUrl",
    "publisherUrl",
    "pdfUrl",
    "thumbnail",
  ];

  stringFields.forEach((key) => {
    if (body[key] !== undefined) {
      payload[key] = String(body[key] ?? "").trim();
    }
  });

  const arrayFields = [
    "authors",
    "researchArea",
    "keywords",
    "technologies",
  ];

  arrayFields.forEach((key) => {
    if (body[key] !== undefined) {
      payload[key] = asStringArray(body[key]);
    }
  });

  if (body.type !== undefined) {
    payload.type = body.type;
  }

  if (body.status !== undefined) {
    payload.status = body.status;
  }

  if (body.year !== undefined) {
    const y = Number(body.year);

    payload.year =
      body.year === "" ||
      body.year === null ||
      Number.isNaN(y)
        ? null
        : y;
  }

  if (body.featured !== undefined) {
    payload.featured =
      body.featured === true ||
      body.featured === "true";
  }

  if (body.visible !== undefined) {
    payload.visible =
      body.visible !== false &&
      body.visible !== "false";
  }

  return payload;
};

const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// =====================================
// PUBLIC
// =====================================

export const getPublicResearch = async (req, res) => {
  try {
    const filter = {
      visible: true,
    };

    if (req.query.type && req.query.type !== "all") {
      filter.type = req.query.type;
    }

    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    const items = await Research.find(filter).sort({
      year: -1,
      createdAt: -1,
    });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("getPublicResearch:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load publications",
    });
  }
};

export const getFeaturedResearch = async (req, res) => {
  try {
    const items = await Research.find({
      visible: true,
      featured: true,
    })
      .sort({
        year: -1,
        createdAt: -1,
      })
      .limit(6);

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("getFeaturedResearch:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load featured publications",
    });
  }
};

export const getResearchById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    const item = await Research.findOne({
      _id: req.params.id,
      visible: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("getResearchById:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load publication",
    });
  }
};

// =====================================
// ADMIN
// =====================================

export const getAllResearchAdmin = async (req, res) => {
  try {
    const items = await Research.find({}).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("getAllResearchAdmin:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load publications",
    });
  }
};

export const getResearchByIdAdmin = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    const item = await Research.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("getResearchByIdAdmin:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load publication",
    });
  }
};

export const createResearch = async (req, res) => {
  try {
    const payload = buildPayload(req.body);

    if (!payload.title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const item = await Research.create(payload);

    res.status(201).json({
      success: true,
      data: item,
      message: "Publication created",
    });
  } catch (error) {
    console.error("createResearch:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create publication",
    });
  }
};

export const updateResearch = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    const payload = buildPayload(req.body);

    const item = await Research.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    res.json({
      success: true,
      data: item,
      message: "Publication updated",
    });
  } catch (error) {
    console.error("updateResearch:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to update publication",
    });
  }
};

export const deleteResearch = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    const item = await Research.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    res.json({
      success: true,
      message: "Publication deleted",
    });
  } catch (error) {
    console.error("deleteResearch:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete publication",
    });
  }
};

export const toggleVisibility = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    const item = await Research.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    item.visible = !item.visible;

    await item.save();

    res.json({
      success: true,
      data: item,
      message: `Visibility set to ${item.visible}`,
    });
  } catch (error) {
    console.error("toggleVisibility:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update visibility",
    });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    const item = await Research.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Publication not found",
      });
    }

    item.featured = !item.featured;

    await item.save();

    res.json({
      success: true,
      data: item,
      message: `Featured set to ${item.featured}`,
    });
  } catch (error) {
    console.error("toggleFeatured:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update featured",
    });
  }
};

export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const url =
    req.file.path ||
    req.file.secure_url ||
    req.file.url;

  if (!url) {
    return res.status(500).json({
      success: false,
      message: "The uploaded file URL is unavailable",
    });
  }

  return res.status(201).json({
    success: true,
    data: {
      url,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
};