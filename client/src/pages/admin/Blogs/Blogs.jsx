// src/pages/admin/Blogs.jsx
import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit, Save, X, Search, Upload, XCircle, Eye, EyeOff } from "lucide-react";
import blogService from "../../../services/blogService";

const EMPTY = {
  title: "",
  excerpt: "",
  category: "",
  tags: "",
  content: "",
  status: "draft",
  thumbnail: "",
};

const CATEGORIES = [
  "Frontend Development",
  "Backend Development",
  "Full Stack",
  "DevOps",
  "UI/UX Design",
  "Mobile Development",
  "Database",
  "Security",
  "Other",
];

const BlogForm = ({ blog, onSaved, onCancel }) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (blog) {
      setForm({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        category: blog.category || "",
        tags: blog.tags ? (Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags) : "",
        content: blog.content || "",
        status: blog.status || "draft",
        thumbnail: blog.thumbnail || "",
      });
      if (blog.thumbnail) {
        setThumbnailPreview(blog.thumbnail);
        setThumbnailFile(null);
      }
    }
  }, [blog]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setError("");
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setThumbnailPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
    setForm({ ...form, thumbnail: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res;

      if (thumbnailFile) {
        // Has image file — use FormData
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("excerpt", form.excerpt);
        formData.append("category", form.category);
        formData.append("tags", form.tags);
        formData.append("content", form.content);
        formData.append("status", form.status);
        formData.append("thumbnail", thumbnailFile);

        const config = {
          headers: { "Content-Type": "multipart/form-data" },
        };

        if (blog?._id) {
          res = await blogService.update(blog._id, formData, config);
        } else {
          res = await blogService.create(formData, config);
        }
      } else {
        // No image — send as JSON
        const payload = { ...form };
        // Convert comma-separated tags to array
        if (typeof payload.tags === "string") {
          payload.tags = payload.tags.split(",").map((t) => t.trim()).filter(Boolean);
        }
        // Remove empty thumbnail to avoid CastError
        if (!payload.thumbnail) delete payload.thumbnail;

        if (blog?._id) {
          res = await blogService.update(blog._id, payload);
        } else {
          res = await blogService.create(payload);
        }
      }

      onSaved(res?.data?.data || res?.data);
    } catch (err) {
      console.error("Blog save error:", err);
      setError(err?.response?.data?.message || err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition";

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
      <h2 className="text-lg font-bold text-white mb-5">
        {blog ? "Edit Blog" : "Add Blog"}
      </h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inp}
              placeholder="Implementing JWT Authentication..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Excerpt</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className={inp}
              placeholder="Brief summary of the blog post..."
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inp}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className={inp}
              placeholder="jwt, nodejs, express"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inp}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Thumbnail</label>
            {thumbnailPreview ? (
              <div className="flex items-center gap-3 p-3 bg-black rounded-lg border border-gray-700">
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-16 h-12 object-cover rounded"
                />
                <span className="text-xs text-gray-400 flex-1 truncate">
                  {thumbnailFile ? thumbnailFile.name : "Current"}
                </span>
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="text-gray-500 hover:text-red-400"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-4 border border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-800/50 transition"
              >
                <Upload className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-500">Click to upload</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Content *</label>
            <textarea
              required
              rows={10}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={inp}
              placeholder="Write your blog content here..."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !form.title}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-lg disabled:opacity-50 transition"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {blog ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [search, setSearch] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogService.getAll();
      const data = res.data;

      let list = null;
      if (Array.isArray(data?.data)) {
        list = data.data;
      } else if (Array.isArray(data?.blogs)) {
        list = data.blogs;
      } else if (Array.isArray(data)) {
        list = data;
      }

      setBlogs(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Fetch blogs error:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await blogService.delete(id);
      fetchBlogs();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filtered = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Blogs</h1>
          <p className="text-gray-500 text-sm mt-1">{blogs.length} total</p>
        </div>
        <button
          onClick={() => {
            setEditBlog(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition"
        >
          <Plus className="w-4 h-4" /> Add Blog
        </button>
      </div>

      {showForm && (
        <BlogForm
          blog={editBlog}
          onSaved={() => {
            setShowForm(false);
            setEditBlog(null);
            fetchBlogs();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditBlog(null);
          }}
        />
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blogs..."
          className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-4">
                Title
              </th>
              <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-4">
                Category
              </th>
              <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-4">
                Status
              </th>
              <th className="text-right text-xs text-gray-500 uppercase tracking-wider px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-500">
                  No blogs found
                </td>
              </tr>
            ) : (
              filtered.map((blog) => (
                <tr
                  key={blog._id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {blog.thumbnail ? (
                        <img
                          src={blog.thumbnail}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-600 text-xs">
                          No img
                        </div>
                      )}
                      <div>
                        <p className="text-white text-sm font-medium truncate max-w-[300px]">
                          {blog.title}
                        </p>
                        <p className="text-gray-600 text-xs mt-0.5">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                      {blog.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        blog.status === "published"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {blog.status === "published" ? (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditBlog(blog);
                          setShowForm(true);
                        }}
                        className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded text-white transition"
                      >
                        <Edit className="w-3 h-3 inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded transition"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBlogs;