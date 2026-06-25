import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Star, StarOff, ExternalLink } from "lucide-react";
import { projectService } from "../../../services/projectService";
import ProjectFormModal from "./ProjectFormModal";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectService.getAll({ page, limit: 10, search });
      setProjects(res.data.data);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, [page, search]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    setDeleting(id);
    try {
      await projectService.delete(id);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await projectService.toggleFeatured(id);
      fetchProjects();
    } catch (err) {
      alert("Failed to update");
    }
  };

  const handleSaved = () => {
    setShowModal(false);
    setEditProject(null);
    fetchProjects();
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total</p>
        </div>
        <button
          onClick={() => { setEditProject(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-lg transition"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search projects..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4 hidden md:table-cell">Category</th>
              <th className="px-6 py-4 hidden lg:table-cell">Stack</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No projects found</td></tr>
            ) : projects.map((p) => (
              <tr key={p._id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {p.thumbnail?.url && (
                      <img src={p.thumbnail.url} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-gray-800" />
                    )}
                    <div>
                      <p className="font-medium text-white group-hover:text-cyan-400 transition-colors">{p.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{p.shortDescription}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 rounded capitalize">{p.category}</span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {p.techStack?.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">{t}</span>
                    ))}
                    {(p.techStack?.length || 0) > 3 && (
                      <span className="text-xs text-gray-600">+{p.techStack.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded border ${
                    p.status === "completed"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {p.demoUrl && (
                      <a href={p.demoUrl} target="_blank" rel="noreferrer" className="p-2 text-gray-500 hover:text-cyan-400 transition">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleToggleFeatured(p._id)}
                      className={`p-2 transition ${p.featured ? "text-yellow-400" : "text-gray-500 hover:text-yellow-400"}`}
                    >
                      {p.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { setEditProject(p); setShowModal(true); }} className="p-2 text-gray-500 hover:text-white transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="p-2 text-gray-500 hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 10 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-40">Prev</button>
          <span className="px-4 py-2 text-gray-400 text-sm">Page {page} of {Math.ceil(total / 10)}</span>
          <button disabled={page >= Math.ceil(total / 10)} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-40">Next</button>
        </div>
      )}

      {showModal && (
        <ProjectFormModal
          project={editProject}
          onClose={() => { setShowModal(false); setEditProject(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default AdminProjects;