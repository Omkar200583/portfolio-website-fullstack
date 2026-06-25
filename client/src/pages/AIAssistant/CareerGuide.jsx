import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  Loader2,
  ListChecks,
  Map,
  FolderGit2,
  Clock,
  Briefcase,
  Lightbulb,
  AlertCircle,
  Download,
} from "lucide-react";
import { careerGuideAI } from "../../services/aiService";
import { generateCareerPDF } from "../../utils/careerPdfGenerator";

const SUGGESTIONS = [
  "Become a Full Stack MERN Developer",
  "Transition into Backend Development with Node.js",
  "Become an AI/ML Engineer",
  "Become a DevOps Engineer",
];

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ─── Empty State Component ─── */
function EmptyState({ message }) {
  return (
    <p className="text-xs text-[#5B6470] italic flex items-center gap-1.5">
      <AlertCircle size={12} className="shrink-0" />
      {message}
    </p>
  );
}

export default function CareerGuide() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e, overrideGoal) => {
    if (e?.preventDefault) e.preventDefault();
    const value = overrideGoal ?? goal;
    if (!value.trim()) {
      setError("Please enter a career goal.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    setGoal(value);

    try {
      const data = await careerGuideAI(value);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── PDF Download Handler ─── */
  const handleDownloadPDF = () => {
    if (!result) return;
    setDownloading(true);
    try {
      generateCareerPDF(result, goal);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  /* ─── Safely check if data exists ─── */
  const hasData = result && (
    (result.requiredSkills?.length > 0) ||
    result.timeline ||
    (result.jobRoles?.length > 0) ||
    (result.roadmap?.length > 0) ||
    (result.projects?.length > 0) ||
    (result.tips?.length > 0)
  );

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

      {/* ── Background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#101216] to-[#15181D]" />
      <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#4AA8FF]/[0.08] blur-[140px] glow-float" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#3FE0D0]/[0.06] blur-[130px] glow-float-2" />

      <div className="relative z-10 container mx-auto max-w-4xl">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#9AA4B2] uppercase mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#4AA8FF] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4AA8FF]" />
            </span>
            AI Tool
          </span>
          <h1 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-white">
            Career{" "}
            <span className="bg-gradient-to-r from-[#4AA8FF] via-[#7FC8FF] to-[#3FE0D0] bg-clip-text text-transparent">
              Guide AI
            </span>
          </h1>
          <p className="mt-4 text-[#9AA4B2] text-base sm:text-lg max-w-2xl mx-auto">
            Enter a career goal and get a practical, step-by-step roadmap — skills, projects, timeline, and roles.
          </p>
        </motion.div>

        {/* ── Input ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] mb-10"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="goal" className="block text-xs font-medium tracking-[0.12em] text-[#9AA4B2] uppercase mb-2">
                Your Career Goal
              </label>
              <input
                id="goal"
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Become a Full Stack MERN Developer"
                className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E6E8EB] placeholder:text-[#5B6470] focus:border-[#4AA8FF]/50 focus:ring-2 focus:ring-[#4AA8FF]/20 focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSubmit(null, s)}
                  className="text-xs font-mono text-[#7FC8FF] bg-[#4AA8FF]/[0.08] px-3 py-1.5 rounded-full border border-[#4AA8FF]/20 hover:border-[#3FE0D0]/40 hover:text-[#3FE0D0] hover:bg-[#3FE0D0]/[0.08] transition-colors duration-300"
                >
                  {s}
                </button>
              ))}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm text-red-400"
              >
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </motion.p>
            )}

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
                  Generating Roadmap...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Roadmap
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* ── Loading State ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center text-center gap-3 text-[#9AA4B2] py-16">
            <Loader2 size={28} className="animate-spin text-[#4AA8FF]" />
            <p className="text-sm">Mapping out your roadmap...</p>
          </div>
        )}

        {/* ── Empty/Idle State ── */}
        {!loading && !result && (
          <div className="flex flex-col items-center justify-center text-center gap-3 text-[#9AA4B2] py-16">
            <Compass size={32} className="text-[#5B6470]" />
            <p className="text-sm max-w-xs">
              Enter your goal above and click "Generate Roadmap" to see your personalized career plan.
            </p>
          </div>
        )}

        {/* ── Fallback: API returned but data was completely empty ── */}
        {!loading && result && !hasData && (
          <div className="flex flex-col items-center justify-center text-center gap-3 text-[#9AA4B2] py-16">
            <AlertCircle size={32} className="text-[#F2A65A]" />
            <p className="text-sm max-w-sm">
              The AI couldn't generate a structured roadmap for this goal. Try rephrasing or choosing a suggestion above.
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            RESULTS
            ══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {!loading && hasData && (
            <motion.div
              key="career-results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* ── Download PDF Button (top-right) ── */}
              <motion.div variants={itemVariants} className="flex justify-end">
                <motion.button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  whileHover={{ scale: downloading ? 1 : 1.04 }}
                  whileTap={{ scale: downloading ? 1 : 0.96 }}
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-medium text-[#E6E8EB] hover:border-[#4AA8FF]/40 hover:bg-[#4AA8FF]/[0.06] hover:text-white transition-all duration-300 disabled:opacity-50"
                >
                  {downloading ? (
                    <Loader2 size={16} className="animate-spin text-[#4AA8FF]" />
                  ) : (
                    <Download size={16} className="text-[#3FE0D0]" />
                  )}
                  {downloading ? "Generating PDF..." : "Download PDF"}
                </motion.button>
              </motion.div>

              {/* ── Top Row: Skills + Timeline + Roles ── */}
              <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-4">
                <SummaryCard
                  icon={<ListChecks size={18} />}
                  title="Required Skills"
                  accent="#4AA8FF"
                >
                  {result.requiredSkills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.requiredSkills.map((skill, i) => (
                        <span
                          key={`skill-${i}-${skill}`}
                          className="text-xs font-mono text-[#7FC8FF] bg-[#4AA8FF]/[0.08] px-2.5 py-1 rounded-full border border-[#4AA8FF]/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No skills listed" />
                  )}
                </SummaryCard>

                <SummaryCard icon={<Clock size={18} />} title="Timeline" accent="#3FE0D0">
                  {result.timeline ? (
                    <p className="text-sm text-[#9AA4B2] leading-relaxed">{result.timeline}</p>
                  ) : (
                    <EmptyState message="No timeline provided" />
                  )}
                </SummaryCard>

                <SummaryCard icon={<Briefcase size={18} />} title="Job Roles" accent="#7FC8FF">
                  {result.jobRoles?.length > 0 ? (
                    <ul className="space-y-1.5">
                      {result.jobRoles.map((role, i) => (
                        <li key={`role-${i}-${role}`} className="text-sm text-[#9AA4B2]">
                          {role}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState message="No roles listed" />
                  )}
                </SummaryCard>
              </motion.div>

              {/* ── Learning Roadmap ── */}
              {result.roadmap?.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl p-6 sm:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
                >
                  <h3 className="font-display text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Map size={18} className="text-[#4AA8FF]" />
                    Learning Roadmap
                  </h3>
                  <div className="relative">
                    <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />
                    <div className="space-y-6">
                      {result.roadmap.map((step, idx) => (
                        <motion.div
                          key={`step-${idx}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.08 }}
                          className="relative flex gap-4 pl-9"
                        >
                          <div className="absolute left-0 top-0.5 w-8 h-8 rounded-full bg-[#0B0C10] border border-[#4AA8FF]/30 flex items-center justify-center text-xs font-display font-bold text-[#4AA8FF] shrink-0">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-display text-sm font-semibold text-white mb-1">{step.step}</h4>
                            <p className="text-sm text-[#9AA0B2] leading-relaxed">{step.detail}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Projects + Tips ── */}
              <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
                <SummaryCard icon={<FolderGit2 size={18} />} title="Projects to Build" accent="#3FE0D0">
                  {result.projects?.length > 0 ? (
                    <ul className="space-y-2">
                      {result.projects.map((proj, idx) => (
                        <li
                          key={`proj-${idx}`}
                          className="text-sm text-[#9AA4B2] leading-relaxed pl-3 border-l-2"
                          style={{ borderColor: "#3FE0D040" }}
                        >
                          {proj}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState message="No projects suggested" />
                  )}
                </SummaryCard>

                <SummaryCard icon={<Lightbulb size={18} />} title="Tips for Success" accent="#F2A65A">
                  {result.tips?.length > 0 ? (
                    <ul className="space-y-2">
                      {result.tips.map((tip, idx) => (
                        <li
                          key={`tip-${idx}`}
                          className="text-sm text-[#9AA4B2] leading-relaxed pl-3 border-l-2"
                          style={{ borderColor: "#F2A65A40" }}
                        >
                          {tip}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState message="No tips provided" />
                  )}
                </SummaryCard>
              </motion.div>

              {/* ── Bottom Download Button ── */}
              <motion.div variants={itemVariants} className="flex justify-center pt-4 pb-8">
                <motion.button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  whileHover={{ scale: downloading ? 1 : 1.03 }}
                  whileTap={{ scale: downloading ? 1 : 0.97 }}
                  className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#4AA8FF] to-[#3FE0D0] text-[#0B0C10] font-display font-semibold text-sm hover:shadow-[0_0_28px_rgba(74,168,255,0.45)] transition-shadow duration-300 disabled:opacity-50"
                >
                  {downloading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  {downloading ? "Generating PDF..." : "Download Full Roadmap as PDF"}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─── Summary Card Wrapper ─── */
function SummaryCard({ icon, title, accent, children }) {
  return (
    <div className="rounded-2xl p-5 border border-white/10 bg-white/[0.02] backdrop-blur-xl h-full">
      <h3 className="font-display text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <span style={{ color: accent }}>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}