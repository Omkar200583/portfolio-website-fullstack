import React from "react";
import { Eye, EyeOff, Pencil, Trash2, Star, ExternalLink } from "lucide-react";

export const TypeBadge = ({ type }) => (
  <span className="inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded-full border bg-white/[0.04] text-gray-400 border-white/[0.08]">
    {type === "book-chapter" ? "Book Chapter" : "Paper"}
  </span>
);

export const StatusBadge = ({ status }) => {
  const styles = {
    Published: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Accepted: "bg-green-500/10 text-green-400 border-green-500/20",
    "Under Review": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    "In Press": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded-full border ${
        styles[status] || styles.Published
      }`}
    >
      {status}
    </span>
  );
};

const Thumb = ({ src }) =>
  src ? (
    <img
      src={src}
      alt=""
      className="w-10 h-10 rounded-md object-cover bg-black shrink-0"
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  ) : (
    <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/[0.06] shrink-0" />
  );

const iconBtn =
  "p-1.5 rounded-md text-gray-500 transition-colors cursor-pointer";

const ResearchTable = ({
  papers = [],
  onEdit,
  onView,
  onDelete,
  onToggleVisibility,
  onToggleFeatured,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-16 rounded-lg bg-[#0c0c12] border border-white/[0.06] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!papers.length) {
    return (
      <div className="p-10 text-center rounded-lg bg-[#0c0c12] border border-white/[0.06]">
        <p className="text-sm text-gray-400">No research papers or chapters found.</p>
        <p className="text-xs text-gray-600 mt-1">Click "Add New" to create one.</p>
      </div>
    );
  }

  const actions = (p) => (
    <>
      <button type="button" title="View" onClick={() => onView?.(p)} className={`${iconBtn} hover:text-cyan-400 hover:bg-cyan-500/[0.06]`}>
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
      <button type="button" title="Edit" onClick={() => onEdit?.(p)} className={`${iconBtn} hover:text-cyan-400 hover:bg-cyan-500/[0.06]`}>
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        title={p.featured ? "Remove from featured" : "Mark featured"}
        onClick={() => onToggleFeatured?.(p)}
        className={`${iconBtn} hover:bg-yellow-500/[0.06] ${p.featured ? "text-yellow-400" : "hover:text-yellow-400"}`}
      >
        <Star className="w-3.5 h-3.5" fill={p.featured ? "currentColor" : "none"} />
      </button>
      <button
        type="button"
        title={p.visible ? "Hide from website" : "Show on website"}
        onClick={() => onToggleVisibility?.(p)}
        className={`${iconBtn} hover:text-cyan-400 hover:bg-cyan-500/[0.06]`}
      >
        {p.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </button>
      <button type="button" title="Delete" onClick={() => onDelete?.(p)} className={`${iconBtn} hover:text-red-400 hover:bg-red-500/10`}>
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </>
  );

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:block overflow-hidden rounded-lg bg-[#0c0c12] border border-white/[0.06]">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-[#08080c] text-gray-600 text-[10px] uppercase tracking-wide">
              <th className="text-left px-4 py-2.5 font-semibold">Title</th>
              <th className="text-left px-4 py-2.5 font-semibold">Publication</th>
              <th className="text-left px-4 py-2.5 font-semibold">Year</th>
              <th className="text-left px-4 py-2.5 font-semibold">Status</th>
              <th className="text-left px-4 py-2.5 font-semibold">Visibility</th>
              <th className="text-right px-4 py-2.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((p) => (
              <tr key={p._id} className="border-t border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Thumb src={p.thumbnail} />
                    <div className="min-w-0">
                      <p className="font-medium text-white line-clamp-1" style={{ maxWidth: 300 }}>
                        {p.title}
                      </p>
                      <TypeBadge type={p.type} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {p.publication || p.publisher || p.bookTitle || "—"}
                </td>
                <td className="px-4 py-3 text-gray-400">{p.year || "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3 text-[11px]">
                  <span className={p.visible ? "text-cyan-400" : "text-gray-600"}>
                    {p.visible ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-0.5">{actions(p)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="flex md:hidden flex-col gap-2">
        {papers.map((p) => (
          <div key={p._id} className="p-4 rounded-lg bg-[#0c0c12] border border-white/[0.06]">
            <div className="flex items-start gap-3 mb-2">
              <Thumb src={p.thumbnail} />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white leading-snug" style={{ wordBreak: "break-word" }}>
                  {p.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <TypeBadge type={p.type} />
                  <StatusBadge status={p.status} />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-600 mb-3">
              {[p.publication || p.publisher, p.year].filter(Boolean).join(" • ") || "—"}
              {" • "}
              {p.visible ? "Visible" : "Hidden"}
            </p>
            <div className="flex items-center justify-end gap-0.5 pt-2 border-t border-white/[0.04]">
              {actions(p)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ResearchTable;
