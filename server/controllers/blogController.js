import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/response.js";

export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "published", category, featured, search, tag } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    if (tag) filter.tags = tag;
    if (search) filter.$or = [{ title: { $regex: search, $options: "i" } }, { excerpt: { $regex: search, $options: "i" } }];

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .populate("author", "name avatar")
      .sort("-publishedAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendPaginated(res, blogs, total, Number(page), Number(limit));
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { slug: req.params.id }] },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name avatar bio");
    if (!blog) return sendError(res, "Blog not found", 404);
    return sendSuccess(res, blog);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const createBlog = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // ✅ Add this line - set author from authenticated user
    data.author = req.user._id;
    
    // Handle thumbnail
    if (req.file) {
      data.thumbnail = {
        url: req.file.path,
        publicId: req.file.filename
      };
    } else {
      delete data.thumbnail;
    }
    
    // Handle tags - convert string to array if needed
    if (typeof data.tags === "string") {
      data.tags = data.tags.split(",").map(t => t.trim()).filter(Boolean);
    }

    // Set published date if status is published
    if (data.status === "published") {
      data.publishedAt = new Date();
    }

    const blog = await Blog.create(data);
    
    // Populate author for response
    await blog.populate("author", "name avatar");
    
    return sendSuccess(res, blog, "Blog created", 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const updateBlog = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Don't allow changing author
    delete data.author;
    
    if (req.file) {
      data.thumbnail = {
        url: req.file.path,
        publicId: req.file.filename
      };
    }
    
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    // Handle tags
    if (typeof data.tags === "string") {
      data.tags = data.tags.split(",").map(t => t.trim()).filter(Boolean);
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id, 
      data, 
      { new: true, runValidators: true }
    ).populate("author", "name avatar");
    
    if (!blog) return sendError(res, "Blog not found", 404);
    return sendSuccess(res, blog, "Blog updated");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return sendError(res, "Blog not found", 404);
    if (blog.thumbnail?.publicId) await cloudinary.uploader.destroy(blog.thumbnail.publicId);
    await blog.deleteOne();
    return sendSuccess(res, null, "Blog deleted");
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    if (!blog) return sendError(res, "Blog not found", 404);
    return sendSuccess(res, { likes: blog.likes });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};