// src/pages/admin/AdminSkills.jsx
import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit, Save, X, Upload, XCircle } from "lucide-react";
import { skillService } from "../../../services/skillService";
// ❌ REMOVED: import axios from "axios";

const CATEGORIES = ["frontend", "backend", "database", "devops", "tools", "languages", "frameworks", "other"];
const EMPTY = { name: "", category: "frontend", proficiency: 80, color: "#06B6D4", yearsOfExperience: 0, featured: false, icon: "", image: "" };

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ SINGLE fetch function using skillService (not raw axios)
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await skillService.getAll();
      const data = res.data;
      
      let list = null;
      if (Array.isArray(data?.data?.skills)) {
        list = data.data.skills;
      } else if (Array.isArray(data?.skills)) {
        list = data.skills;
      } else if (Array.isArray(data?.data)) {
        list = data.data;
      } else if (Array.isArray(data)) {
        list = data;
      }
      
      setSkills(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SINGLE useEffect calling fetchSkills
  useEffect(() => {
    fetchSkills();
  }, []);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, SVG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setError("");
    setImageFile(file);
    setForm({ ...form, image: "" });
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setForm({ ...form, image: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("category", form.category);
        formData.append("proficiency", form.proficiency);
        formData.append("color", form.color);
        formData.append("yearsOfExperience", form.yearsOfExperience);
        formData.append("featured", form.featured);
        if (form.icon) formData.append("icon", form.icon);
        formData.append("image", imageFile);

        const config = { headers: { "Content-Type": "multipart/form-data" } };

        if (editing) {
          await skillService.update(editing, formData, config);
        } else {
          await skillService.create(formData, config);
        }
      } else {
        if (editing) {
          await skillService.update(editing, form);
        } else {
          await skillService.create(form);
        }
      }

      setEditing(null);
      setForm(EMPTY);
      setShowAdd(false);
      removeImage();
      fetchSkills(); // ✅ Use the correct function name
    } catch (e) {
      setError(e.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await skillService.delete(id);
      fetchSkills(); // ✅ Use the correct function name
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const startEdit = (s) => {
    setEditing(s._id);
    setForm({
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      color: s.color,
      yearsOfExperience: s.yearsOfExperience,
      featured: s.featured,
      icon: s.icon || "",
      image: s.image || "",
    });
    if (s.image) {
      setImagePreview(s.image);
      setImageFile(null);
    } else {
      setImagePreview("");
      setImageFile(null);
    }
    setShowAdd(true);
  };

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowAdd(false);
    setError("");
    removeImage();
  };

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const inp = "w-full bg-black border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Skills</h1>
        <button
          onClick={() => { cancel(); setShowAdd(true); }}
          className="flex items-center gap-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black px-5 py-2.5 rounded-lg font-bold transition"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {showAdd && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-5">{editing ? "Edit Skill" : "New Skill"}</h2>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded text-sm mb-4 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")}><XCircle className="w-4 h-4" /></button>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs text-gray-400 mb-1 block">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} placeholder="React" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inp}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Proficiency %</label>
              <input type="number" min={0} max={100} value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: +e.target.value })} className={inp} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded border border-gray-700 cursor-pointer bg-black" />
                <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inp} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Years Exp</label>
              <input type="number" min={0} value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: +e.target.value })} className={inp} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-cyan-400" />
                <span className="text-sm text-gray-400">Featured</span>
              </label>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-2 block">Skill Image</label>
            
            {imagePreview ? (
              <div className="flex items-center gap-4 p-4 bg-black rounded-xl border border-gray-700">
                <div className="w-16 h-16 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-12 h-12 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {imageFile ? imageFile.name : "Current image"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : "From server"}
                  </p>
                </div>
                <button onClick={removeImage} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                  dragOver ? "border-cyan-400 bg-cyan-400/5" : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition ${dragOver ? "bg-cyan-400/10" : "bg-gray-800"}`}>
                  <Upload className={`w-5 h-5 transition ${dragOver ? "text-cyan-400" : "text-gray-500"}`} />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    <span className="text-cyan-400 font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-600 mt-1">PNG, JPG, SVG, WebP (max 5MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.name} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-lg transition disabled:opacity-50">
              {saving ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editing ? "Update" : "Create"}
            </button>
            <button onClick={cancel} className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat}>
              <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-medium">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catSkills.map((skill) => (
                  <div key={skill._id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 group transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {skill.image ? (
                          <div className="w-9 h-9 rounded-lg bg-black border border-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={skill.image} alt={skill.name} className="w-6 h-6 object-contain" />
                            <div className="w-3 h-3 rounded-full hidden" style={{ backgroundColor: skill.color }} />
                          </div>
                        ) : (
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: skill.color }} />
                        )}
                        <h3 className="font-bold text-white">{skill.name}</h3>
                        {skill.featured && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">★</span>}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => startEdit(skill)} className="p-1.5 text-gray-500 hover:text-white"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(skill._id)} className="p-1.5 text-gray-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${skill.proficiency}%`, backgroundColor: skill.color }} />
                      </div>
                      <span className="text-sm font-mono text-gray-400 shrink-0">{skill.proficiency}%</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-gray-600 text-xs">{skill.yearsOfExperience} yr{skill.yearsOfExperience !== 1 ? "s" : ""}</p>
                      {skill.image && <span className="text-xs text-cyan-500/60">● has image</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSkills;