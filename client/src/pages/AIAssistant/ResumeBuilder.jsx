import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Copy,
  Download,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { generateResume } from "../../services/aiService";

const emptyExperience = () => ({ role: "", company: "", duration: "", details: "" });
const emptyProject = () => ({ title: "", details: "" });

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    name: "",
    title: "",
    summary: "",
    skills: "",
    education: "",
  });
  const [experience, setExperience] = useState([emptyExperience()]);
  const [projects, setProjects] = useState([emptyProject()]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resume, setResume] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateExperience = (idx, field, value) => {
    setExperience((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const updateProject = (idx, field, value) => {
    setProjects((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const addExperience = () => setExperience((prev) => [...prev, emptyExperience()]);
  const removeExperience = (idx) =>
    setExperience((prev) => prev.filter((_, i) => i !== idx));

  const addProject = () => setProjects((prev) => [...prev, emptyProject()]);
  const removeProject = (idx) => setProjects((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.summary || !form.skills) {
      setError("Please fill in at least your name, summary, and skills.");
      return;
    }

    setError("");
    setLoading(true);
    setResume("");

    try {
      const details = {
        name: form.name,
        title: form.title,
        summary: form.summary,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        experience: experience.filter((e) => e.role || e.company),
        projects: projects.filter((p) => p.title),
        education: form.education,
      };

      const { resume: result } = await generateResume(details);
      setResume(result);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resume);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([resume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.name || "resume"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#0B0C10] text-[#E6E8EB] min-h-screen py-24 px-4 sm:px-6 font-[Inter]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }

        @keyframes floatGlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.06); }
        }
        .glow-float { animation: floatGlow 14s ease-in-out infinite; }

        @keyframes floatGlow2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-24px, 24px) scale(1.04); }
        }
        .glow-float-2 { animation: floatGlow2 18s ease-in-out infinite; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#101216] to-[#15181D]" />
      <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#4AA8FF]/[0.08] blur-[140px] glow-float" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#3FE0D0]/[0.06] blur-[130px] glow-float-2" />

      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#9AA4B2] uppercase mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#4AA8FF] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4AA8FF]" />
            </span>
            AI Tool
          </span>
          <h1 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-white">
            Resume{" "}
            <span className="bg-gradient-to-r from-[#4AA8FF] via-[#7FC8FF] to-[#3FE0D0] bg-clip-text text-transparent">
              Builder
            </span>
          </h1>
          <p className="mt-4 text-[#9AA4B2] text-base sm:text-lg max-w-2xl mx-auto">
            Enter your details and get a clean, ATS-friendly, job-ready resume.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* LEFT — Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Basic info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Omkar Nilkanth Jadhav" required />
                <Field label="Target Title" name="title" value={form.title} onChange={handleChange} placeholder="Full Stack Developer" />
              </div>

              <TextArea
                label="Professional Summary"
                name="summary"
                value={form.summary}
                onChange={handleChange}
                placeholder="2-3 sentences about your background and focus..."
                rows={3}
                required
              />

              <Field
                label="Skills (comma-separated)"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="Node.js, Express, React, PostgreSQL, JWT, OAuth 2.0"
                required
              />

              {/* Experience */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-medium tracking-[0.12em] text-[#9AA4B2] uppercase">
                    Experience
                  </label>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="text-xs font-mono text-[#7FC8FF] hover:text-[#3FE0D0] flex items-center gap-1 transition-colors"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="rounded-xl border border-white/10 bg-[#0B0C10] p-4 space-y-3 relative">
                      {experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="absolute top-3 right-3 text-[#9AA4B2] hover:text-red-400 transition-colors"
                          aria-label="Remove experience"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, "role", e.target.value)}
                          placeholder="Role (e.g. Full Stack Intern)"
                          className="w-full bg-[#101216] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, "company", e.target.value)}
                          placeholder="Company"
                          className="w-full bg-[#101216] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300"
                        />
                      </div>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExperience(idx, "duration", e.target.value)}
                        placeholder="Duration (e.g. Jun 2025 - Feb 2026)"
                        className="w-full bg-[#101216] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300"
                      />
                      <textarea
                        rows={2}
                        value={exp.details}
                        onChange={(e) => updateExperience(idx, "details", e.target.value)}
                        placeholder="Key achievements / responsibilities..."
                        className="w-full bg-[#101216] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300 resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-medium tracking-[0.12em] text-[#9AA4B2] uppercase">
                    Projects
                  </label>
                  <button
                    type="button"
                    onClick={addProject}
                    className="text-xs font-mono text-[#7FC8FF] hover:text-[#3FE0D0] flex items-center gap-1 transition-colors"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {projects.map((proj, idx) => (
                    <div key={idx} className="rounded-xl border border-white/10 bg-[#0B0C10] p-4 space-y-3 relative">
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProject(idx)}
                          className="absolute top-3 right-3 text-[#9AA4B2] hover:text-red-400 transition-colors"
                          aria-label="Remove project"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(idx, "title", e.target.value)}
                        placeholder="Project title"
                        className="w-full bg-[#101216] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300"
                      />
                      <textarea
                        rows={2}
                        value={proj.details}
                        onChange={(e) => updateProject(idx, "details", e.target.value)}
                        placeholder="What it does, tech used, impact..."
                        className="w-full bg-[#101216] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300 resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <TextArea
                label="Education"
                name="education"
                value={form.education}
                onChange={handleChange}
                placeholder="B.Sc. Computer Science, Savitribai Phule Pune University"
                rows={2}
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                transition={{ duration: 0.25 }}
                className="w-full bg-gradient-to-r from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10] font-display font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_28px_rgba(74,168,255,0.45)] transition-shadow duration-300 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Resume
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* RIGHT — Output */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#0B0C10] border border-white/10 flex items-center justify-center text-[#4AA8FF]">
                  <FileText size={18} />
                </div>
                <h3 className="font-display font-semibold text-white">Generated Resume</h3>
              </div>

              {resume && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border border-white/10 text-[#9AA4B2] hover:text-[#4AA8FF] hover:border-[#4AA8FF]/40 transition-colors duration-300"
                  >
                    {copied ? <CheckCircle2 size={14} className="text-[#3FE0D0]" /> : <Copy size={14} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border border-white/10 text-[#9AA4B2] hover:text-[#3FE0D0] hover:border-[#3FE0D0]/40 transition-colors duration-300"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 rounded-xl border border-white/10 bg-[#0B0C10] p-5 overflow-y-auto min-h-[320px] max-h-[640px]">
              {loading && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-[#9AA4B2]">
                  <Loader2 size={28} className="animate-spin text-[#4AA8FF]" />
                  <p className="text-sm">Crafting your ATS-friendly resume...</p>
                </div>
              )}

              {!loading && !resume && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-[#9AA4B2]">
                  <FileText size={32} className="text-[#5B6470]" />
                  <p className="text-sm max-w-xs">
                    Fill in your details and click "Generate Resume" — your formatted resume will appear here.
                  </p>
                </div>
              )}

              {!loading && resume && (
                <pre className="text-sm text-[#E6E8EB] leading-relaxed whitespace-pre-wrap font-[Inter]">
                  {resume}
                </pre>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, value, onChange, placeholder, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium tracking-[0.12em] text-[#9AA4B2] uppercase mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300"
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange, placeholder, rows = 3, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium tracking-[0.12em] text-[#9AA4B2] uppercase mb-2">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300 resize-none"
      />
    </div>
  );
}
