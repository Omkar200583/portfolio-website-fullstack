import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X, Calendar, MapPin, Loader2, AlertCircle } from "lucide-react";
import experienceService from "../../../services/experienceService";

const EMPTY = { 
  company: "", 
  title: "", 
  startDate: "", 
  endDate: "", 
  location: "", 
  type: "full-time", 
  description: "",
  current: false,
};

const TYPES = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
  { value: "contract", label: "Contract" },
];

const ExpForm = ({ exp, onSaved, onCancel }) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (exp) {
      setForm({ 
        company: exp.company || "", 
        title: exp.title || "", 
        startDate: exp.startDate ? exp.startDate.split("T")[0] : "", 
        endDate: exp.endDate ? exp.endDate.split("T")[0] : "", 
        location: exp.location || "", 
        type: exp.type || "full-time", 
        description: exp.description || "",
        current: exp.current || !exp.endDate,
      });
    }
  }, [exp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const payload = {
        title: form.title,
        company: form.company,
        startDate: form.startDate,
        type: form.type,
        description: form.description,
        current: form.current,
      };
      
      if (!form.current && form.endDate) payload.endDate = form.endDate;
      if (form.location) payload.location = form.location;

      if (exp?._id) {
        await experienceService.update(exp._id, payload);
      } else {
        await experienceService.create(payload);
      }
      
      onSaved();
    } catch (err) {
      console.error("Save error:", err);
      const msg = err?.response?.data?.message || err?.message || "Save failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition";
  const inpOff = "w-full bg-black/40 border border-gray-800 rounded-lg px-4 py-3 text-gray-600 text-sm cursor-not-allowed";

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
      <h2 className="text-lg font-bold text-white mb-5">
        {exp ? "Edit Experience" : "Add Experience"}
      </h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Title / Role *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inp}
              placeholder="Full Stack Developer"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Company *</label>
            <input
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className={inp}
              placeholder="Google"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Start Date *</label>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className={inp}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              End Date <span className="text-gray-600">(leave empty if current)</span>
            </label>
            <input
              type="date"
              value={form.endDate}
              disabled={form.current}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className={form.current ? inpOff : inp}
            />
          </div>

          {/* Currently Working Here */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.current}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      current: e.target.checked,
                      endDate: e.target.checked ? "" : form.endDate,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-green-500 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform shadow" />
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                I currently work here
              </span>
              {form.current && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                  Present
                </span>
              )}
            </label>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={inp}
              placeholder="San Francisco, CA"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className={inp}
            >
              {TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-gray-400 mb-1 block">Description *</label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inp}
              placeholder="Describe your role, responsibilities, and achievements..."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !form.title || !form.company || !form.startDate}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-lg disabled:opacity-50 transition"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {exp ? "Update" : "Create"}
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

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editExp, setEditExp] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await experienceService.getAll();
      const data = res.data?.data || res.data?.experiences || res.data || [];
      setExperiences(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Fetch error:", e);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience entry?")) return;
    try {
      await experienceService.delete(id);
      fetch();
    } catch (e) {
      alert("Delete failed: " + (e?.response?.data?.message || e?.message));
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Experience</h1>
          <p className="text-gray-500 text-sm mt-1">{experiences.length} entries</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditExp(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {showForm && (
        <ExpForm
          exp={editExp}
          onSaved={() => { setShowForm(false); setEditExp(null); fetch(); }}
          onCancel={() => { setShowForm(false); setEditExp(null); }}
        />
      )}

      <div className="space-y-4 relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-800" />
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>No experience entries yet</p>
            <p className="text-sm mt-2">Click "Add Experience" to get started</p>
          </div>
        ) : (
          experiences.map((exp) => {
            const isCurrent = exp.current || !exp.endDate;
            return (
              <div key={exp._id} className="relative pl-12 group">
                {/* Green pulsing dot for current, cyan for past */}
                <div
                  className={`absolute left-[11px] top-5 w-4 h-4 rounded-full ring-4 ring-[#0B0C10] ${
                    isCurrent ? "bg-green-500 animate-pulse" : "bg-cyan-500"
                  }`}
                />
                <div className={`bg-gray-900 border p-6 rounded-xl transition ${
                  isCurrent ? "border-green-500/20 hover:border-green-500/40" : "border-gray-800 hover:border-gray-700"
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Title + Current badge */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                        {isCurrent && (
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-cyan-400 font-medium mt-1">{exp.company}</p>
                      <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(exp.startDate)}
                          <span className="mx-0.5">–</span>
                          {isCurrent ? (
                            <span className="text-green-400 font-medium">Present</span>
                          ) : (
                            formatDate(exp.endDate)
                          )}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </span>
                        )}
                        <span className="text-xs bg-gray-800 px-2 py-0.5 rounded capitalize">
                          {exp.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition ml-4">
                      <button
                        type="button"
                        onClick={() => { setEditExp(exp); setShowForm(true); }}
                        className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded text-white transition"
                      >
                        <Edit className="w-3 h-3 inline mr-1" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(exp._id)}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded transition"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminExperience;