import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ScanSearch,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  KeySquare,
  Lightbulb,
  Target,
  Upload,
} from "lucide-react";
import { analyzeResume } from "../../services/aiService";

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/plain") {
      setError("For best results, paste your resume text directly. Only .txt file upload is supported here.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText(ev.target.result);
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError("Please paste your resume text to analyze.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeResume(resumeText, targetRole);
      setResult(data);
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor =
    result?.atsScore >= 75 ? "#3FE0D0" : result?.atsScore >= 50 ? "#4AA8FF" : "#F2A65A";

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

        @keyframes drawCircle {
          from { stroke-dashoffset: var(--circumference); }
          to { stroke-dashoffset: var(--offset); }
        }
        .score-ring {
          animation: drawCircle 1.2s ease-out forwards;
        }
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
              Analyzer
            </span>
          </h1>
          <p className="mt-4 text-[#9AA4B2] text-base sm:text-lg max-w-2xl mx-auto">
            Get an ATS score, strengths, weaknesses, missing keywords, and a job role match — like a real ATS scan.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* LEFT — Input */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            <form onSubmit={handleSubmit} className="space-y-5 h-full flex flex-col">
              <div>
                <label htmlFor="targetRole" className="block text-xs font-medium tracking-[0.12em] text-[#9AA4B2] uppercase mb-2">
                  Target Job Role (optional)
                </label>
                <input
                  id="targetRole"
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Backend Developer"
                  className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="resumeText" className="block text-xs font-medium tracking-[0.12em] text-[#9AA4B2] uppercase">
                    Resume Text
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-mono text-[#7FC8FF] hover:text-[#3FE0D0] cursor-pointer transition-colors">
                    <Upload size={13} />
                    Upload .txt
                    <input type="file" accept=".txt" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
                <textarea
                  id="resumeText"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your full resume text here..."
                  className="flex-1 w-full min-h-[320px] bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300 resize-none font-mono"
                />
              </div>

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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze Resume
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
            className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
          >
            {loading && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center gap-3 text-[#9AA4B2]">
                <Loader2 size={28} className="animate-spin text-[#4AA8FF]" />
                <p className="text-sm">Running ATS-style analysis...</p>
              </div>
            )}

            {!loading && !result && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center gap-3 text-[#9AA4B2]">
                <ScanSearch size={32} className="text-[#5B6470]" />
                <p className="text-sm max-w-xs">
                  Paste your resume and click "Analyze Resume" — your ATS report will appear here.
                </p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-7">
                {/* ATS Score ring */}
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={scoreColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        style={{
                          "--circumference": `${2 * Math.PI * 42}`,
                          "--offset": `${2 * Math.PI * 42 * (1 - result.atsScore / 100)}`,
                        }}
                        className="score-ring"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-2xl font-bold text-white">{result.atsScore}</span>
                      <span className="text-[10px] text-[#9AA4B2] uppercase tracking-wide">ATS Score</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white mb-1 flex items-center gap-2">
                      <Target size={16} className="text-[#4AA8FF]" />
                      Job Role Match
                    </h3>
                    <p className="text-sm text-[#9AA4B2] leading-relaxed">{result.jobRoleMatch}</p>
                  </div>
                </div>

                {/* Strengths */}
                <ReportBlock
                  icon={<CheckCircle2 size={16} className="text-[#3FE0D0]" />}
                  title="Strengths"
                  items={result.strengths}
                  accent="#3FE0D0"
                />

                {/* Weaknesses */}
                <ReportBlock
                  icon={<XCircle size={16} className="text-[#F2A65A]" />}
                  title="Weaknesses"
                  items={result.weaknesses}
                  accent="#F2A65A"
                />

                {/* Missing keywords */}
                <div>
                  <h3 className="font-display text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <KeySquare size={16} className="text-[#7FC8FF]" />
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords?.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs font-mono text-[#7FC8FF] bg-[#4AA8FF]/[0.08] px-2.5 py-1 rounded-full border border-[#4AA8FF]/20"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                <ReportBlock
                  icon={<Lightbulb size={16} className="text-[#4AA8FF]" />}
                  title="Improvements"
                  items={result.improvements}
                  accent="#4AA8FF"
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ReportBlock({ icon, title, items, accent }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="font-display text-sm font-semibold text-white mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="text-sm text-[#9AA4B2] leading-relaxed pl-3 border-l-2"
            style={{ borderColor: `${accent}40` }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
