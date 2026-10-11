import { useState } from "react";
import {
  createResearch,
  updateResearch,
  RESEARCH_STATUS_OPTIONS,
} from "../../../services/researchService";
import { IconX } from "../../../components/research/researchIcons";

const EMPTY = {
  type: "research-paper",
  title: "",
  shortDescription: "",
  abstract: "",
  authors: [],
  supervisor: "",
  publication: "",
  publisher: "",
  year: "",
  status: "Published",
  registrationId: "",
  bookTitle: "",
  chapterNumber: "",
  isbn: "",
  researchArea: [],
  keywords: [],
  technologies: [],
  researchProblem: "",
  methodology: "",
  findings: "",
  chapterContent: "",
  doi: "",
  paperUrl: "",
  chapterUrl: "",
  publicationUrl: "",
  publisherUrl: "",
  pdfUrl: "",
  thumbnail: "",
  featured: false,
  visible: true,
};

const URL_FIELDS = ["publicationUrl", "publisherUrl", "pdfUrl", "paperUrl", "chapterUrl", "thumbnail"];

const isValidUrl = (u) => {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const normalizeInitial = (item) => ({
  ...EMPTY,
  ...item,
  year: item.year ?? "",
  authors: item.authors || [],
  researchArea: item.researchArea || [],
  keywords: item.keywords || [],
  technologies: item.technologies || [],
});

/* ── small building blocks ─────────────────────────────────────────────── */

const Field = ({ label, required, error, full, children }) => (
  <div className={`rf-field${full ? " full" : ""}`}>
    <label>
      {label}
      {required && <span className="rf-req"> *</span>}
    </label>
    {children}
    {error && <span className="rf-error">{error}</span>}
  </div>
);

const ToggleRow = ({ label, hint, checked, onChange }) => (
  <div className="rf-toggle-row">
    <div>
      <span className="rf-toggle-label">{label}</span>
      {hint && <span className="rf-toggle-hint">{hint}</span>}
    </div>
    <button
      type="button"
      className={`ar-switch${checked ? " on" : ""}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span className="knob" />
    </button>
  </div>
);

function TagInput({ values, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  const addFromDraft = () => {
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    onChange([...new Set([...values, ...parts])]);
    setDraft("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addFromDraft();
    } else if (e.key === "Backspace" && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="rf-tags">
      {values.map((v) => (
        <span key={v} className="rf-tag">
          {v}
          <button
            type="button"
            className="rf-tag-x"
            onClick={() => onChange(values.filter((x) => x !== v))}
            aria-label={`Remove ${v}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="rf-tag-input"
        value={draft}
        placeholder={values.length ? "Add more…" : placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={addFromDraft}
      />
    </div>
  );
}

/* ── main form ─────────────────────────────────────────────────────────── */

export default function ResearchForm({ initial, onClose, onSaved, showToast }) {
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = useState(() => (initial ? normalizeInitial(initial) : EMPTY));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const isPaper = form.type === "research-paper";

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";

    const y = String(form.year).trim();
    if (y) {
      const n = Number(y);
      if (!Number.isFinite(n) || n < 1900 || n > 2100) {
        e.year = "Enter a valid year (1900–2100)";
      }
    }

    URL_FIELDS.forEach((k) => {
      if (form[k] && !isValidUrl(form[k])) {
        e[k] = "Enter a valid URL starting with http:// or https://";
      }
    });

    if (form.doi && /\s/.test(form.doi.trim())) e.doi = "DOI cannot contain spaces";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        year: String(form.year).trim() === "" ? null : Number(form.year),
      };
      if (isEdit) await updateResearch(initial._id, payload);
      else await createResearch(payload);
      onSaved(isEdit ? "Publication updated successfully" : "Publication created successfully");
    } catch (err) {
      showToast(err?.message || "Failed to save publication", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ar-overlay" role="dialog" aria-modal="true">
      <div className="ar-modal form">
        <div className="ar-modal-head">
          <h2>{isEdit ? "Edit Publication" : "Add Publication"}</h2>
          <button className="ar-icon-btn" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
        </div>

        <form className="rf-grid" onSubmit={handleSubmit} noValidate>
          {/* ── TYPE (first field) ── */}
          <Field label="Publication Type" required full error={errors.type}>
            <div className="rf-segment">
              <button
                type="button"
                className={isPaper ? "active" : ""}
                onClick={() => set("type", "research-paper")}
              >
                Research Paper
              </button>
              <button
                type="button"
                className={!isPaper ? "active" : ""}
                onClick={() => set("type", "book-chapter")}
              >
                Book Chapter
              </button>
            </div>
          </Field>

          {/* ── BASICS ── */}
          <span className="rf-section">Basics</span>

          <Field label="Title" required full error={errors.title}>
            <input
              className="input"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Full publication title"
            />
          </Field>

          <Field label="Short Description" full>
            <textarea
              className="input"
              rows={2}
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              placeholder="1–2 sentence summary shown on cards"
            />
          </Field>

          <Field label="Abstract" full>
            <textarea
              className="input"
              rows={4}
              value={form.abstract}
              onChange={(e) => set("abstract", e.target.value)}
              placeholder="Full abstract"
            />
          </Field>

          {/* ── PEOPLE ── */}
          <span className="rf-section">Authors</span>

          <Field label="Authors" full>
            <TagInput
              values={form.authors}
              onChange={(v) => set("authors", v)}
              placeholder="Type a name and press Enter (e.g. Omkar Jadhav)"
            />
          </Field>

          <Field label="Supervisor">
            <input
              className="input"
              value={form.supervisor}
              onChange={(e) => set("supervisor", e.target.value)}
              placeholder="e.g. Dr. Sunil Mahajan"
            />
          </Field>

          <Field label="Status">
            <select
              className="input"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {RESEARCH_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          {/* ── PUBLICATION DETAILS ── */}
          <span className="rf-section">Publication Details</span>

          <Field label="Publication / Venue">
            <input
              className="input"
              value={form.publication}
              onChange={(e) => set("publication", e.target.value)}
              placeholder="e.g. IJIRT + INSIGHT 2026"
            />
          </Field>

          <Field label="Publisher">
            <input
              className="input"
              value={form.publisher}
              onChange={(e) => set("publisher", e.target.value)}
              placeholder="Publisher name"
            />
          </Field>

          <Field label="Year" error={errors.year}>
            <input
              className="input"
              type="number"
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder="e.g. 2026"
              min="1900"
              max="2100"
            />
          </Field>

          <Field label="DOI" error={errors.doi}>
            <input
              className="input"
              value={form.doi}
              onChange={(e) => set("doi", e.target.value)}
              placeholder="Leave empty if not available"
            />
          </Field>

          {/* ── RESEARCH PAPER SPECIFIC ── */}
          {isPaper && (
            <>
              <span className="rf-section">Research Paper Details</span>

              <Field label="Registration ID">
                <input
                  className="input"
                  value={form.registrationId}
                  onChange={(e) => set("registrationId", e.target.value)}
                  placeholder="e.g. 208560"
                />
              </Field>

              <Field label="Research Problem" full>
                <textarea
                  className="input"
                  rows={3}
                  value={form.researchProblem}
                  onChange={(e) => set("researchProblem", e.target.value)}
                />
              </Field>

              <Field label="Methodology" full>
                <textarea
                  className="input"
                  rows={3}
                  value={form.methodology}
                  onChange={(e) => set("methodology", e.target.value)}
                />
              </Field>

              <Field label="Findings / Contribution" full>
                <textarea
                  className="input"
                  rows={3}
                  value={form.findings}
                  onChange={(e) => set("findings", e.target.value)}
                />
              </Field>
            </>
          )}

          {/* ── BOOK CHAPTER SPECIFIC ── */}
          {!isPaper && (
            <>
              <span className="rf-section">Book Chapter Details</span>

              <Field label="Book Title">
                <input
                  className="input"
                  value={form.bookTitle}
                  onChange={(e) => set("bookTitle", e.target.value)}
                />
              </Field>

              <Field label="Chapter Number">
                <input
                  className="input"
                  value={form.chapterNumber}
                  onChange={(e) => set("chapterNumber", e.target.value)}
                  placeholder="e.g. Chapter 5"
                />
              </Field>

              <Field label="ISBN">
                <input
                  className="input"
                  value={form.isbn}
                  onChange={(e) => set("isbn", e.target.value)}
                  placeholder="Leave empty if not available"
                />
              </Field>

              <Field label="Chapter Content / Summary" full>
                <textarea
                  className="input"
                  rows={3}
                  value={form.chapterContent}
                  onChange={(e) => set("chapterContent", e.target.value)}
                />
              </Field>
            </>
          )}

          {/* ── CATEGORIZATION ── */}
          <span className="rf-section">Categorization</span>

          <Field label="Research Areas" full>
            <TagInput
              values={form.researchArea}
              onChange={(v) => set("researchArea", v)}
              placeholder="e.g. Artificial Intelligence"
            />
          </Field>

          <Field label="Keywords" full>
            <TagInput
              values={form.keywords}
              onChange={(v) => set("keywords", v)}
              placeholder="Press Enter to add"
            />
          </Field>

          <Field label="Technologies / Models" full>
            <TagInput
              values={form.technologies}
              onChange={(v) => set("technologies", v)}
              placeholder="e.g. DistilBERT"
            />
          </Field>

          {/* ── LINKS ── */}
          <span className="rf-section">
            Links — only buttons for filled URLs will appear publicly
          </span>

          <Field label={isPaper ? "Paper URL" : "Chapter URL"} error={isPaper ? errors.paperUrl : errors.chapterUrl}>
            <input
              className="input"
              value={isPaper ? form.paperUrl : form.chapterUrl}
              onChange={(e) => set(isPaper ? "paperUrl" : "chapterUrl", e.target.value)}
              placeholder="https://…"
            />
          </Field>

          <Field label="PDF URL" error={errors.pdfUrl}>
            <input
              className="input"
              value={form.pdfUrl}
              onChange={(e) => set("pdfUrl", e.target.value)}
              placeholder="https://… (enables Download PDF button)"
            />
          </Field>

          <Field label="Publication URL" error={errors.publicationUrl}>
            <input
              className="input"
              value={form.publicationUrl}
              onChange={(e) => set("publicationUrl", e.target.value)}
              placeholder="https://…"
            />
          </Field>

          <Field label="Publisher URL" error={errors.publisherUrl}>
            <input
              className="input"
              value={form.publisherUrl}
              onChange={(e) => set("publisherUrl", e.target.value)}
              placeholder="https://…"
            />
          </Field>

          <Field label="Thumbnail URL" error={errors.thumbnail} full>
            <input
              className="input"
              value={form.thumbnail}
              onChange={(e) => set("thumbnail", e.target.value)}
              placeholder="https://… (optional image)"
            />
            {form.thumbnail && isValidUrl(form.thumbnail) && (
              <img
                src={form.thumbnail}
                alt="Thumbnail preview"
                className="rf-thumb-preview"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            )}
          </Field>

          {/* ── VISIBILITY ── */}
          <span className="rf-section">Visibility</span>

          <div className="rf-field full">
            <ToggleRow
              label="Featured"
              hint="Show in the featured section on the Home page (must also be Visible)"
              checked={form.featured}
              onChange={(v) => set("featured", v)}
            />
            <ToggleRow
              label="Visible"
              hint="Show publicly on /research. Turn OFF to hide from the entire public portfolio."
              checked={form.visible}
              onChange={(v) => set("visible", v)}
            />
          </div>

          {/* ── ACTIONS ── */}
          <div className="rf-actions full">
            <button type="button" className="btn-ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Publication"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}