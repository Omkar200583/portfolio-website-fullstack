import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconPlus, IconSearch, IconTrash, IconEdit, IconExternal, IconX, IconFileText,
} from "../../../components/research/researchIcons";
import {
  getAllResearchAdmin,
  deleteResearch,
  toggleResearchVisibility,
  toggleResearchFeatured,
} from "../../../services/researchService";
import ResearchForm from "./ResearchForm";
import "./Research.css";

const toList = (data) => (Array.isArray(data) ? data : data?.data ?? []);
const statusClass = (s) => `s-${String(s || "").toLowerCase().replace(/\s+/g, "-")}`;

const Switch = ({ on, onClick, disabled, label }) => (
  <button
    type="button"
    className={`ar-switch${on ? " on" : ""}`}
    onClick={onClick}
    disabled={disabled}
    aria-pressed={on}
    aria-label={label}
  >
    <span className="knob" />
  </button>
);

export default function AdminResearch() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [visFilter, setVisFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);

  // Tiny inline toast — swap these showToast() calls for your existing
  // toast system (e.g. react-hot-toast) if you prefer.
  const showToast = (msg, type = "success") => setToast({ msg, type, id: Date.now() });
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const load = async () => {
    setLoading(true);
    try {
      setItems(toList(await getAllResearchAdmin()));
    } catch (err) {
      showToast(err?.message || "Failed to load publications", "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (visFilter === "visible" && !item.visible) return false;
      if (visFilter === "hidden" && item.visible) return false;
      if (!q) return true;
      return [item.title, item.publication, ...(item.authors || [])]
        .filter(Boolean).join(" ").toLowerCase().includes(q);
    });
  }, [items, query, typeFilter, visFilter]);

  const handleToggleVisible = async (item) => {
    setBusyId(`${item._id}:v`);
    try {
      const updated = await toggleResearchVisibility(item._id);
      const visible = updated?.visible ?? !item.visible;
      setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, visible } : i)));
      showToast(visible ? "Publication is now publicly visible" : "Publication is now hidden");
    } catch (err) {
      showToast(err?.message || "Failed to update visibility", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFeatured = async (item) => {
    setBusyId(`${item._id}:f`);
    try {
      const updated = await toggleResearchFeatured(item._id);
      const featured = updated?.featured ?? !item.featured;
      setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, featured } : i)));
      showToast(featured ? "Added to homepage featured section" : "Removed from homepage featured section");
    } catch (err) {
      showToast(err?.message || "Failed to update featured", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setBusyId(confirmDelete._id);
    try {
      await deleteResearch(confirmDelete._id);
      setItems((prev) => prev.filter((i) => i._id !== confirmDelete._id));
      showToast("Publication deleted");
    } catch (err) {
      showToast(err?.message || "Failed to delete publication", "error");
    } finally {
      setBusyId(null);
      setConfirmDelete(null);
    }
  };

  const handleView = (item) => {
    if (!item.visible) {
      showToast("This publication is hidden — enable Visible to preview it publicly", "error");
      return;
    }
    window.open(`/research/${item._id}`, "_blank", "noopener,noreferrer");
  };

  const handleSaved = (msg) => {
    setFormOpen(false);
    setEditing(null);
    load();
    showToast(msg);
  };

  return (
    <div className="ar-page">
      {/* header */}
      <div className="ar-head">
        <div>
          <h1>Research &amp; Publications</h1>
          <p>{items.length} publication{items.length === 1 ? "" : "s"} total</p>
        </div>
        <button
          className="btn-primary ar-add"
          onClick={() => { setEditing(null); setFormOpen(true); }}
        >
          <IconPlus /> Add Publication
        </button>
      </div>

      {/* toolbar */}
      <div className="ar-toolbar">
        <div className="ar-search">
          <IconSearch />
          <input
            className="input"
            placeholder="Search title, author, publication…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="research-paper">Research Papers</option>
          <option value="book-chapter">Book Chapters</option>
        </select>
        <select className="input" value={visFilter} onChange={(e) => setVisFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="visible">Visible only</option>
          <option value="hidden">Hidden only</option>
        </select>
      </div>

      {/* list */}
      {loading ? (
        <div className="ar-list">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="ar-skel" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="ar-empty">
          <IconFileText />
          <h2>{items.length === 0 ? "No publications yet" : "No results"}</h2>
          <p>
            {items.length === 0
              ? "Click “Add Publication” to create your first research paper or book chapter."
              : "Try different search terms or filters."}
          </p>
        </div>
      ) : (
        <div className="ar-list">
          <div className="ar-thead">
            <span>Title</span><span>Type</span><span>Publication</span><span>Year</span>
            <span>Status</span><span>Featured</span><span>Visible</span><span>Actions</span>
          </div>

          {filtered.map((item) => (
            <div className="ar-tr" key={item._id}>
              <div className="ar-cell ar-title-cell" data-label="Title">
                <span className="ar-title">{item.title}</span>
              </div>

              <span className="ar-cell" data-label="Type">
                <span className={`ar-type ${item.type}`}>
                  {item.type === "book-chapter" ? "Book Chapter" : "Research Paper"}
                </span>
              </span>

              <span className="ar-cell ar-pub" data-label="Publication">
                {item.publication || "—"}
              </span>

              <span className="ar-cell" data-label="Year">{item.year || "—"}</span>

              <span className="ar-cell" data-label="Status">
                <span className={`ar-status ${statusClass(item.status)}`}>{item.status || "—"}</span>
              </span>

              <span className="ar-cell" data-label="Featured">
                <Switch
                  on={Boolean(item.featured)}
                  onClick={() => handleToggleFeatured(item)}
                  disabled={busyId === `${item._id}:f`}
                  label="Toggle featured"
                />
              </span>

              <span className="ar-cell" data-label="Visible">
                <Switch
                  on={Boolean(item.visible)}
                  onClick={() => handleToggleVisible(item)}
                  disabled={busyId === `${item._id}:v`}
                  label="Toggle visibility"
                />
              </span>

              <span className="ar-cell ar-actions" data-label="Actions">
                <button className="ar-icon-btn" onClick={() => handleView(item)} title="View" aria-label="View">
                  <IconExternal />
                </button>
                <button
                  className="ar-icon-btn"
                  onClick={() => { setEditing(item); setFormOpen(true); }}
                  title="Edit"
                  aria-label="Edit"
                >
                  <IconEdit />
                </button>
                <button
                  className="ar-icon-btn danger"
                  onClick={() => setConfirmDelete(item)}
                  title="Delete"
                  aria-label="Delete"
                >
                  <IconTrash />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* form modal */}
      {formOpen && (
        <ResearchForm
          initial={editing}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={handleSaved}
          showToast={showToast}
        />
      )}

      {/* delete confirmation */}
      {confirmDelete && (
        <div className="ar-overlay" role="dialog" aria-modal="true">
          <div className="ar-modal confirm">
            <h2>Delete Publication?</h2>
            <p>Are you sure you want to delete this publication?</p>
            <p className="ar-confirm-title">“{confirmDelete.title}”</p>
            <p className="ar-confirm-note">This action cannot be undone.</p>
            <div className="ar-modal-actions">
              <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn-primary ar-danger-btn"
                onClick={handleDelete}
                disabled={busyId === confirmDelete._id}
              >
                {busyId === confirmDelete._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && (
        <div className={`ar-toast ${toast.type}`} key={toast.id}>
          {toast.type === "error" ? "⚠ " : "✔ "} {toast.msg}
        </div>
      )}
    </div>
  );
}