import React, { useState, useEffect, useRef } from "react";
import { Upload, Link as LinkIcon, X, FileText, Loader2 } from "lucide-react";
import {
  RESEARCH_STATUS_OPTIONS,
  RESEARCH_TYPE_OPTIONS,
  uploadResearchFile,
} from "../../../services/researchService";

const emptyForm = {
  title: "",
  type: "research-paper",
  shortDescription: "",
  abstract: "",
  authors: "",
  supervisor: "",
  publication: "",
  publisher: "",
  year: "",
  status: "Published",
  registrationId: "",
  bookTitle: "",
  chapterNumber: "",
  isbn: "",
  researchArea: "",
  keywords: "",
  technologies: "",
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

const inputClass =
  "w-full px-3 py-2 text-[13px] rounded-md bg-[#08080c] border border-white/[0.06] text-white placeholder-gray-600 focus:border-cyan-500/30 focus:outline-none transition-colors";
const labelClass = "block text-[11px] font-medium text-gray-400 mb-1.5";
const errorClass = "text-[10px] text-red-400 mt-1";
const hintClass = "text-gray-600";
const sectionClass =
  "text-[11px] font-semibold text-cyan-400 uppercase tracking-wide pt-2 border-t border-white/[0.06]";

const listToString = (v) => (Array.isArray(v) ? v.join(", ") : v || "");
const stringToList = (v) =>
  String(v || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/* ---------- Upload OR link field (image / pdf) ---------- */
const UploadField = ({ label, name, value, onChange, accept, kind }) => {
  const [mode, setMode] = useState("link");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setUploading(true);
    try {
      const url = await uploadResearchFile(file);
      onChange({ target: { name, value: url } });
    } catch (ex) {
      setErr(ex.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const tab = (m, Icon, text) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors ${
        mode === m
          ? "bg-cyan-500/15 text-cyan-400"
          : "text-gray-500 hover:text-gray-300"
      }`}
    >
      <Icon className="w-3 h-3" /> {text}
    </button>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className={`${labelClass} mb-0`}>{label}</label>
        <div className="flex gap-1">
          {tab("link", LinkIcon, "Link")}
          {tab("upload", Upload, "Upload")}
        </div>
      </div>

      {mode === "link" ? (
        <input
          name={name}
          type="url"
          value={value}
          onChange={onChange}
          className={inputClass}
          placeholder="https://..."
        />
      ) : (
        <label className="flex items-center justify-center gap-2 px-3 py-3 rounded-md border border-dashed border-white/[0.12] text-[12px] text-gray-400 hover:border-cyan-500/40 hover:text-cyan-400 cursor-pointer transition-colors">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> Choose {kind === "pdf" ? "PDF" : "image"}
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {err && <p className={errorClass}>{err}</p>}

      {value && (
        <div className="mt-2 flex items-center gap-2 p-2 rounded-md bg-white/[0.03] border border-white/[0.06]">
          {kind === "image" ? (
            <img
              src={value}
              alt=""
              className="w-10 h-10 rounded object-cover bg-black"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
          )}
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="flex-1 min-w-0 text-[11px] text-cyan-400 truncate hover:underline"
          >
            {value}
          </a>
          <button
            type="button"
            onClick={() => onChange({ target: { name, value: "" } })}
            className="p-1 text-gray-500 hover:text-red-400"
            title="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, hint, error, children }) => (
  <div>
    <label className={labelClass}>
      {label} {hint && <span className={hintClass}>{hint}</span>}
    </label>
    {children}
    {error && <p className={errorClass}>{error}</p>}
  </div>
);

const ResearchForm = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        ...emptyForm,
        ...initialData,
        year: initialData.year ?? "",
        authors: listToString(initialData.authors),
        researchArea: listToString(initialData.researchArea),
        keywords: listToString(initialData.keywords),
        technologies: listToString(initialData.technologies),
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const isChapter = form.type === "book-chapter";

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!stringToList(form.authors).length) e.authors = "At least one author is required";
    if (form.year !== "" && (Number(form.year) < 1900 || Number(form.year) > 2100))
      e.year = "Enter a valid year";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.({
      ...form,
      year: form.year === "" ? null : Number(form.year),
      authors: stringToList(form.authors),
      researchArea: stringToList(form.researchArea),
      keywords: stringToList(form.keywords),
      technologies: stringToList(form.technologies),
    });
  };

  const input = (name, props = {}) => (
    <input
      name={name}
      value={form[name]}
      onChange={handleChange}
      className={inputClass}
      {...props}
    />
  );

  const textarea = (name, rows, placeholder) => (
    <textarea
      name={name}
      rows={rows}
      value={form[name]}
      onChange={handleChange}
      className={`${inputClass} resize-y`}
      placeholder={placeholder}
    />
  );

  const two = "grid grid-cols-1 sm:grid-cols-2 gap-4";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className={two}>
        <Field label="Type">
          <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
            {RESEARCH_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            {RESEARCH_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={<>Title <span className="text-red-400">*</span></>} error={errors.title}>
        {input("title", { type: "text", placeholder: "Title of the paper / chapter" })}
      </Field>

      <Field
        label={<>Authors <span className="text-red-400">*</span></>}
        hint="(comma separated)"
        error={errors.authors}
      >
        {input("authors", { type: "text", placeholder: "Author One, Author Two, Omkar Jadhav" })}
      </Field>

      <div className={two}>
        <Field label="Supervisor">{input("supervisor", { type: "text" })}</Field>
        <Field label="Year" error={errors.year}>
          {input("year", { type: "number", placeholder: "2025" })}
        </Field>
      </div>

      <Field label="Short Description" hint="(shown on cards, max 600 chars)">
        <textarea
          name="shortDescription"
          rows={2}
          maxLength={600}
          value={form.shortDescription}
          onChange={handleChange}
          className={`${inputClass} resize-y`}
          placeholder="One or two lines for the card..."
        />
      </Field>

      <Field label="Abstract">{textarea("abstract", 5, "Abstract...")}</Field>

      <p className={sectionClass}>Publication details</p>

      <div className={two}>
        <Field label={isChapter ? "Book Series / Publication" : "Journal / Conference"}>
          {input("publication", { type: "text", placeholder: "Journal or conference name" })}
        </Field>
        <Field label="Publisher">
          {input("publisher", { type: "text", placeholder: "IEEE / Springer" })}
        </Field>
      </div>

      <div className={two}>
        <Field label="DOI">{input("doi", { type: "text", placeholder: "10.1234/xxxxx" })}</Field>
        <Field label="Registration / Manuscript ID">
          {input("registrationId", { type: "text" })}
        </Field>
      </div>

      {isChapter && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Book Title">{input("bookTitle", { type: "text" })}</Field>
          <Field label="Chapter No.">{input("chapterNumber", { type: "text" })}</Field>
          <Field label="ISBN">{input("isbn", { type: "text" })}</Field>
        </div>
      )}

      <p className={sectionClass}>Classification</p>

      <div className={two}>
        <Field label="Research Area" hint="(comma separated)">
          {input("researchArea", { type: "text", placeholder: "NLP, Healthcare AI" })}
        </Field>
        <Field label="Keywords" hint="(comma separated)">
          {input("keywords", { type: "text", placeholder: "BERT, Sentiment Analysis" })}
        </Field>
      </div>

      <Field label="Technologies" hint="(comma separated)">
        {input("technologies", { type: "text", placeholder: "Python, PyTorch, React" })}
      </Field>

      <p className={sectionClass}>Content</p>

      <Field label="Research Problem">{textarea("researchProblem", 3)}</Field>
      <Field label="Methodology">{textarea("methodology", 3)}</Field>
      <Field label="Findings">{textarea("findings", 3)}</Field>
      {isChapter && <Field label="Chapter Summary / Content">{textarea("chapterContent", 4)}</Field>}

      <p className={sectionClass}>Files &amp; links</p>

      <UploadField
        label="Thumbnail / Photo"
        name="thumbnail"
        kind="image"
        accept="image/png,image/jpeg,image/webp"
        value={form.thumbnail}
        onChange={handleChange}
      />

      <UploadField
        label="PDF"
        name="pdfUrl"
        kind="pdf"
        accept="application/pdf"
        value={form.pdfUrl}
        onChange={handleChange}
      />

      <div className={two}>
        <Field label={isChapter ? "Chapter URL" : "Paper (live) URL"}>
          {input(isChapter ? "chapterUrl" : "paperUrl", { type: "url", placeholder: "https://..." })}
        </Field>
        <Field label="Publication URL">
          {input("publicationUrl", { type: "url", placeholder: "https://..." })}
        </Field>
      </div>

      <Field label="Publisher URL">
        {input("publisherUrl", { type: "url", placeholder: "https://..." })}
      </Field>

      <div className="flex flex-wrap gap-5 pt-1">
        <label className="flex items-center gap-2 text-[12px] text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            name="visible"
            checked={!!form.visible}
            onChange={handleChange}
            className="accent-cyan-500"
          />
          Visible on website
        </label>
        <label className="flex items-center gap-2 text-[12px] text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={!!form.featured}
            onChange={handleChange}
            className="accent-cyan-500"
          />
          Featured
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-white/[0.06]">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold text-black bg-gradient-to-r from-cyan-400 to-cyan-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : initialData ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-[13px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ResearchForm;
