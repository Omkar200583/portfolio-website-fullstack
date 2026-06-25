// ═══════════════════════════════════════════════════════════════
//  ADMIN CERTIFICATES & OFFER LETTERS — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, Save, X, ExternalLink, Upload, XCircle, Award, FileText, Filter } from "lucide-react";
import { certificateService } from "../../../services/certificateService";

const EMPTY = { title: "", issuer: "", issueDate: "", credentialUrl: "", image: null, type: "certificate" };
const TABS = [
  { id: "all", label: "All Documents" },
  { id: "certificate", label: "Certificates" },
  { id: "offer_letter", label: "Offer Letters" },
];

/* ─── Premium Form Component ─── */
const CertForm = ({ cert, onSaved, onCancel }) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (cert) {
      setForm({ 
        title: cert.title || "", 
        issuer: cert.issuer || "", 
        issueDate: cert.issueDate ? cert.issueDate.split("T")[0] : "", 
        credentialUrl: cert.credentialUrl || "", 
        image: null,
        type: cert.type || "certificate" 
      });
      if (cert.image?.url) {
        setImagePreview(cert.image.url);
        setImageFile(null);
      }
    }
  }, [cert]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }
    setError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const removeImage = () => { setImageFile(null); setImagePreview(""); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (imageFile) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("issuer", form.issuer);
        fd.append("issueDate", form.issueDate);
        fd.append("credentialUrl", form.credentialUrl);
        fd.append("type", form.type);
        fd.append("image", imageFile);
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        if (cert?._id) await certificateService.update(cert._id, fd, config);
        else await certificateService.create(fd, config);
      } else {
        const payload = { ...form };
        if (!payload.image) delete payload.image;
        if (cert?._id) await certificateService.update(cert._id, payload);
        else await certificateService.create(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full bg-[#0A0A0A] border border-[#D4AF37]/15 rounded-xl px-4 py-3 text-[#FFFFFF] text-sm placeholder:text-[#525252] focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#111111] border border-[#D4AF37]/15 rounded-2xl p-6 md:p-8 mb-10 shadow-2xl shadow-black/50 backdrop-blur-sm"
    >
      <h2 className="text-xl font-bold text-[#FFFFFF] mb-6 font-['Space_Grotesk']">
        {cert ? "Edit Document" : "Add New Document"}
      </h2>
      
      {error && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="hover:text-red-300 transition"><XCircle className="w-4 h-4" /></button>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Type Selector */}
        <div className="mb-6">
          <label className="text-xs text-[#A3A3A3] mb-2 block font-medium tracking-wide uppercase">Document Type *</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              onClick={() => setForm({ ...form, type: "certificate" })}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 text-sm font-semibold ${
                form.type === "certificate" 
                  ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#F0D060] shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                  : "border-[#333333] bg-[#0A0A0A] text-[#666666] hover:border-[#555555]"
              }`}
            >
              <Award size={18} /> Certificate
            </button>
            <button 
              type="button" 
              onClick={() => setForm({ ...form, type: "offer_letter" })}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 text-sm font-semibold ${
                form.type === "offer_letter" 
                  ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#F0D060] shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                  : "border-[#333333] bg-[#0A0A0A] text-[#666666] hover:border-[#555555]"
              }`}
            >
              <FileText size={18} /> Offer Letter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div className="sm:col-span-2">
            <label className="text-xs text-[#A3A3A3] mb-1.5 block font-medium">Title *</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} placeholder="AWS Solutions Architect" />
          </div>
          <div>
            <label className="text-xs text-[#A3A3A3] mb-1.5 block font-medium">Issuer / Company *</label>
            <input required value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className={inp} placeholder="Amazon Web Services" />
          </div>
          <div>
            <label className="text-xs text-[#A3A3A3] mb-1.5 block font-medium">Issue Date *</label>
            <input required type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} className={inp} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-[#A3A3A3] mb-1.5 block font-medium">Credential / Verify URL</label>
            <input type="url" value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} className={inp} placeholder="https://credly.com/..." />
          </div>
          
          {/* Image Upload */}
          <div className="sm:col-span-2">
            <label className="text-xs text-[#A3A3A3] mb-2 block font-medium">Document Image</label>
            {imagePreview ? (
              <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] rounded-xl border border-[#D4AF37]/15">
                <div className="w-28 h-20 rounded-lg bg-[#171717] border border-[#D4AF37]/10 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#FFFFFF] font-medium truncate">{imageFile ? imageFile.name : "Current image"}</p>
                  <p className="text-xs text-[#666666] mt-0.5">{imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : "From server"}</p>
                </div>
                <button type="button" onClick={removeImage} className="p-2 text-[#666666] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"><XCircle className="w-5 h-5" /></button>
              </div>
            ) : (
              <div
                onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                  dragOver ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-[#333333] hover:border-[#D4AF37]/50 hover:bg-[#171717]/50"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition ${dragOver ? "bg-[#D4AF37]/10" : "bg-[#171717]"}`}>
                  <Upload className={`w-5 h-5 transition ${dragOver ? "text-[#D4AF37]" : "text-[#555555]"}`} />
                </div>
                <div className="text-center">
                  <p className="text-sm text-[#A3A3A3]"><span className="text-[#D4AF37] font-medium">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-[#525252] mt-1">PNG, JPG, SVG, WebP (max 5MB)</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files[0])} className="hidden" />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            type="submit" 
            disabled={loading} 
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F0D060] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] text-[#0A0A0A] font-bold px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Saving..." : <><Save className="w-4 h-4" />{cert ? "Update" : "Create"}</>}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="flex items-center gap-2 bg-[#171717] border border-[#333333] text-[#A3A3A3] hover:text-white hover:border-[#555555] px-6 py-3 rounded-xl transition-all duration-300"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

/* ─── Main Admin Component ─── */
const AdminCertificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCert, setEditCert] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await certificateService.getAll();
      setCerts(res.data?.data || res.data?.certificates || []);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    try { await certificateService.delete(id); fetch(); } 
    catch (e) { alert("Delete failed"); }
  };

  const filteredCerts = activeTab === "all" ? certs : certs.filter(c => c.type === activeTab);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 md:p-10 font-['Inter']">
      <style>{`
        .font-display { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white font-display tracking-tight">
            Documents &{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F0D060] bg-clip-text text-transparent">Credentials</span>
          </h1>
          <p className="text-[#666666] mt-1 text-sm font-mono">{certs.length} total entries</p>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setEditCert(null); setShowForm(true); }} 
          className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F0D060] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] text-[#0A0A0A] font-bold px-6 py-3 rounded-xl transition-all duration-300"
        >
          <Plus className="w-5 h-5" /> Add Document
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 p-1.5 bg-[#111111] rounded-xl border border-[#222222] w-fit">
        <Filter size={14} className="text-[#525252] ml-3 mr-1" />
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-[#D4AF37]/15 text-[#F0D060] shadow-sm"
                : "text-[#666666] hover:text-[#AAAAAA] hover:bg-[#1A1A1A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Modal / Inline */}
      <AnimatePresence>
        {showForm && (
          <CertForm
            cert={editCert}
            onSaved={() => { setShowForm(false); setEditCert(null); fetch(); }}
            onCancel={() => { setShowForm(false); setEditCert(null); }}
          />
        )}
      </AnimatePresence>

      {/* Grid List */}
      {loading ? (
        <div className="flex justify-center py-20 text-[#555555] font-mono text-sm animate-pulse">Loading documents...</div>
      ) : filteredCerts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#222222] rounded-2xl">
          <FileText size={40} className="text-[#222222] mx-auto mb-4" />
          <p className="text-[#555555] font-medium">No documents found in this category.</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredCerts.map((c) => (
              <motion.div
                layout
                key={c._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-[#111111] border border-[#222222] rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-400 hover:shadow-[0_10px_40px_-15px_rgba(212,175,55,0.15)]"
              >
                {/* Image */}
                {c.image?.url ? (
                  <div className="relative h-40 overflow-hidden bg-[#0A0A0A]">
                    <img src={c.image.url} alt={c.title} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="h-40 bg-[#0A0A0A] flex items-center justify-center text-[#333333]">
                    {c.type === 'offer_letter' ? <FileText size={40} /> : <Award size={40} />}
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {/* Type Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border mb-3 ${
                    c.type === 'offer_letter' 
                      ? "bg-[#D4AF37]/10 text-[#F0D060] border-[#D4AF37]/20" 
                      : "bg-white/5 text-[#A3A3A3] border-white/10"
                  }`}>
                    {c.type === 'offer_letter' ? <FileText size={10} /> : <Award size={10} />}
                    {c.type === 'offer_letter' ? "Offer Letter" : "Certificate"}
                  </span>

                  <h3 className="font-bold text-[#FFFFFF] mb-1 text-sm leading-tight line-clamp-2">{c.title}</h3>
                  <p className="text-[#888888] text-xs mb-3">{c.issuer}</p>
                  
                  {c.issueDate && (
                    <p className="text-[#555555] text-[11px] font-mono mb-4">
                      Issued: {new Date(c.issueDate).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#1A1A1A] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {c.credentialUrl && (
                      <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="p-2 text-[#555555] hover:text-[#D4AF37] transition rounded-lg hover:bg-[#D4AF37]/5" title="Verify">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button type="button" onClick={() => { setEditCert(c); setShowForm(true); }} className="p-2 text-[#555555] hover:text-white transition rounded-lg hover:bg-white/5" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(c._id)} className="p-2 text-[#555555] hover:text-red-400 transition rounded-lg hover:bg-red-400/5 ml-auto" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default AdminCertificates;