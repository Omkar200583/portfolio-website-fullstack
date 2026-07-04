import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

const CATEGORIES = ["web", "mobile", "ai", "backend", "fullstack", "other"];
const STATUSES = ["completed", "in-progress", "planned"];

const ProjectFormModal = ({ project, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "web",
    status: "completed",
    demoUrl: "",
    githubUrl: "",
    featured: false,
    techStack: "",
    tags: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "",
        description: project.description || "",
        shortDescription: project.shortDescription || "",
        category: project.category || "web",
        status: project.status || "completed",
        demoUrl: project.demoUrl || "",
        githubUrl: project.githubUrl || "",
        featured: project.featured || false,
        techStack: (project.techStack || []).join(", "),
        tags: (project.tags || []).join(", "),
      });
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { default: api } = await import("../../../services/api");
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "techStack") fd.append(k, JSON.stringify(v.split(",").map(s => s.trim()).filter(Boolean)));
        else if (k === "tags") fd.append(k, JSON.stringify(v.split(",").map(s => s.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (thumbnail) fd.append("thumbnail", thumbnail);

      if (project?._id) {
        await api.put(`/projects/${project._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/projects", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      onSaved();
    } catch (err) {
      setError(err?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-xl font-bold text-white">{project ? "Edit Project" : "Add Project"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-400 mb-1.5">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} placeholder="My Awesome Project" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inp}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inp}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-400 mb-1.5">Short Description</label>
              <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inp} placeholder="One-liner for cards..." maxLength={200} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-400 mb-1.5">Full Description *</label>
              <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp} placeholder="Detailed project description..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Tech Stack (comma-separated)</label>
              <input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className={inp} placeholder="React, Node.js, MongoDB" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inp} placeholder="fullstack, ai, web" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Demo URL</label>
              <input type="url" value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} className={inp} placeholder="https://demo.example.com" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">GitHub URL</label>
              <input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className={inp} placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Thumbnail</label>
              <label className="flex items-center gap-2 cursor-pointer bg-black border border-dashed border-gray-600 hover:border-cyan-500 rounded-lg p-3 transition">
                <Upload className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 text-sm">{thumbnail ? thumbnail.name : "Choose image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setThumbnail(e.target.files[0])} />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-checked:bg-cyan-500 rounded-full transition-colors" />
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
              </label>
              <span className="text-gray-400 text-sm">Featured project</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {project ? "Update" : "Create"} Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;