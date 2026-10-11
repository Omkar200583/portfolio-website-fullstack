import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Search, AlertCircle, RefreshCw } from "lucide-react";

import ResearchTable from "../../../components/admin/Research/ResearchTable";
import ResearchModal from "../../../components/admin/Research/ResearchModal";
import ResearchPreview from "../../../components/admin/Research/ResearchPreview";
import ResearchDeleteDialog from "../../../components/admin/Research/ResearchDeleteDialog";

import researchService from "../../../services/researchService";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "research-paper", label: "Papers" },
  { value: "book-chapter", label: "Book Chapters" },
];

const ResearchManagement = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewPaper, setPreviewPaper] = useState(null);
  const [deletePaper, setDeletePaper] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await researchService.getAdminAll();
      setPapers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch research:", err);
      setPapers([]);
      setError(err?.message || "Failed to load research");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return papers.filter((p) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (!q) return true;
      const haystack = [
        p.title,
        p.publication,
        p.publisher,
        p.bookTitle,
        p.doi,
        ...(Array.isArray(p.authors) ? p.authors : []),
        ...(Array.isArray(p.keywords) ? p.keywords : []),
      ]
        .map((v) => String(v || "").toLowerCase())
        .join(" ");
      return haystack.includes(q);
    });
  }, [papers, search, typeFilter]);

  const stats = {
    total: papers.length,
    papers: papers.filter((p) => p.type === "research-paper").length,
    chapters: papers.filter((p) => p.type === "book-chapter").length,
    visible: papers.filter((p) => p.visible).length,
  };

  const handleOpenCreate = () => {
    setEditing(null);
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (paper) => {
    setEditing(paper);
    setError(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (payload) => {
    try {
      setSubmitting(true);
      setError(null);
      if (editing?._id) await researchService.update(editing._id, payload);
      else await researchService.create(payload);
      setModalOpen(false);
      setEditing(null);
      await fetchAll();
    } catch (err) {
      console.error("Failed to save:", err);
      setError(err?.message || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const runAction = async (fn, fallback) => {
    try {
      setError(null);
      await fn();
      await fetchAll();
    } catch (err) {
      console.error(fallback, err);
      setError(err?.message || fallback);
    }
  };

  const handleToggleVisibility = (paper) =>
    runAction(() => researchService.togglePublish(paper._id), "Failed to update visibility");

  const handleToggleFeatured = (paper) =>
    runAction(() => researchService.toggleFeatured(paper._id), "Failed to update featured");

  const handleConfirmDelete = async () => {
    if (!deletePaper?._id) return;
    try {
      setDeleting(true);
      setError(null);
      await researchService.delete(deletePaper._id);
      setDeletePaper(null);
      await fetchAll();
    } catch (err) {
      console.error("Failed to delete:", err);
      setError(err?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const statCard = (label, value, color = "text-white", border = "border-white/[0.06]") => (
    <div className={`p-3 rounded-lg bg-[#0c0c12] border ${border}`}>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-600 uppercase tracking-wide mt-1">{label}</p>
    </div>
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 lg:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Research &amp; Publications</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage research papers and book chapters
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={fetchAll}
            disabled={loading}
            title="Refresh"
            className="flex items-center justify-center px-3 py-2 rounded-lg text-gray-300 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-black bg-gradient-to-r from-cyan-400 to-cyan-500 hover:opacity-90 transition-opacity flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {statCard("Total", stats.total)}
        {statCard("Papers", stats.papers, "text-cyan-400", "border-cyan-500/15")}
        {statCard("Book Chapters", stats.chapters, "text-purple-400")}
        {statCard("Visible", stats.visible, "text-green-400")}
      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, publication, keyword..."
            className="w-full pl-10 pr-4 py-2.5 text-[13px] rounded-lg bg-[#0c0c12] border border-white/[0.06] text-white placeholder-gray-600 focus:border-cyan-500/30 focus:outline-none transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-[#0c0c12] border border-white/[0.06]">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setTypeFilter(f.value)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                typeFilter === f.value
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {(search.trim() || typeFilter !== "all") && (
        <p className="text-[11px] text-gray-600 -mt-3 mb-4">
          Showing {filtered.length} of {papers.length}
        </p>
      )}

      {/* ERROR */}
      {error && (
        <div className="mb-5 p-3.5 rounded-lg bg-red-500/5 border border-red-500/15 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-red-400 break-words">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-[11px] text-red-400/60 hover:text-red-400 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <ResearchTable
        papers={filtered}
        loading={loading}
        onEdit={handleOpenEdit}
        onView={setPreviewPaper}
        onDelete={setDeletePaper}
        onToggleVisibility={handleToggleVisibility}
        onToggleFeatured={handleToggleFeatured}
      />

      <ResearchModal
        open={modalOpen}
        initialData={editing}
        onSubmit={handleSubmit}
        onCancel={handleCloseModal}
        loading={submitting}
      />

      {previewPaper && (
        <ResearchPreview data={previewPaper} onClose={() => setPreviewPaper(null)} />
      )}

      <ResearchDeleteDialog
        open={!!deletePaper}
        paper={deletePaper}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletePaper(null)}
        loading={deleting}
      />
    </div>
  );
};

export default ResearchManagement;
