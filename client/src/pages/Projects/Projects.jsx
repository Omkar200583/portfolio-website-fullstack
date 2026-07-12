// ═══════════════════════════════════════════════════════════════
// PROJECTS — Premium Black & Gold (3 Grid + Popup Modals)
// ═══════════════════════════════════════════════════════════════
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  FolderOpen,
  Layers,
  X,
  ExternalLink,
  Tag,
  CheckCircle2,
} from "lucide-react";

import { projectService } from "../../services/projectService";
import ProjectCard from "../../components/projects/ProjectCard";

const INITIAL_PROJECT_COUNT = 3;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// ─── GitHub Icon (lucide-react doesn't export "Github") ──────
const GitHubIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// ─── Project Details Modal ────────────────────────────────────
function ProjectDetailsModal({ project, onClose }) {
  if (!project) return null;

  const techStack = project.technologies || project.techStack || [];
  const features = project.features || [];
  const imageUrl =
    project.thumbnail?.url ||
    project.thumbnail ||
    project.image ||
    project.imageUrl ||
    "";
  const githubLink = project.githubUrl || project.github || "";
  const demoLink = project.demoUrl || project.liveUrl || "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#111111] rounded-3xl border border-[#D4AF37]/20 overflow-hidden flex flex-col"
      >
        {/* ── Image ── */}
        {imageUrl && (
          <div className="relative w-full h-56 sm:h-72 bg-[#0A0A0A] overflow-hidden shrink-0">
            <img
              src={imageUrl}
              alt={project.title || project.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
          </div>
        )}

        {/* ── Close Button ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-[#A3A3A3] hover:text-white hover:border-[#D4AF37]/40 transition"
        >
          <X size={16} />
        </button>

        {/* ── Content ── */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-modal-scroll space-y-6 flex-1">
          {/* Title */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {project.title || project.name}
            </h3>
            {project.subtitle && (
              <p className="mt-1 text-[#D4AF37] text-sm">
                {project.subtitle}
              </p>
            )}
            {project.category && (
              <span className="inline-block mt-2 text-[10px] font-mono uppercase tracking-[0.12em] text-[#F0D060] bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                {project.category}
              </span>
            )}
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-[#A3A3A3] leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
              {project.description}
            </p>
          )}

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
                <Tag size={14} className="text-[#D4AF37]" />
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37]"
                  >
                    {typeof tech === "string" ? tech : tech.name || tech.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {features.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
                <CheckCircle2 size={14} className="text-[#D4AF37]" />
                Key Features
              </h4>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-[#A3A3A3]"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                    {typeof feature === "string"
                      ? feature
                      : feature.title || feature.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          {(githubLink || demoLink) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition text-sm"
                >
                  <GitHubIcon size={16} />
                  Source Code
                </a>
              )}
              {demoLink && (
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-medium hover:bg-[#F0D060] transition text-sm"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // ── Fetch Projects ──
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getAll({ limit: 50 });
        setProjects(res.data?.data || []);
      } catch (err) {
        console.error("Project loading failed", err);
        setError("Couldn't load projects right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ── Escape Key ──
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") {
        setShowAllModal(false);
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  // ── Lock Scroll ──
  useEffect(() => {
    const locked = showAllModal || selectedProject;
    document.body.style.overflow = locked ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAllModal, selectedProject]);

  const displayedProjects = projects.slice(0, INITIAL_PROJECT_COUNT);
  const moreProjects = projects.slice(INITIAL_PROJECT_COUNT);
  const hasMore = projects.length > INITIAL_PROJECT_COUNT;

  const openDetails = (project) => {
    setSelectedProject(project);
  };

  return (
    <>
      <style>{`
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
        .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
        .custom-modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 999px;
        }
      `}</style>

      {/* ══════════════════ SECTION ══════════════════ */}
      <section
        id="projects"
        className="relative overflow-hidden py-24 bg-[#0A0A0A]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0D0D0D]" />
        <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#D4AF37]/[0.06] blur-[140px] glow-float" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#F0D060]/[0.04] blur-[130px] glow-float-2" />

        <div className="relative z-10 container mx-auto max-w-6xl px-5">
          {/* ── Heading ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/5 text-xs tracking-[0.18em] uppercase text-[#A3A3A3]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              Portfolio
            </span>
            <h2 className="mt-6 font-display font-bold text-5xl text-white">
              Things I've{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F0D060]">
                Built
              </span>
            </h2>
            <p className="mt-4 text-[#A3A3A3] max-w-2xl mx-auto">
              A selection of full stack apps, clones, and tools.
            </p>
          </motion.div>

          {/* ── Loading / Error / Empty ── */}
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
            </div>
          ) : error ? (
            <p className="text-center text-red-400 py-20">{error}</p>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-[#A3A3A3]">
              <FolderOpen size={35} />
              <p>No projects available</p>
            </div>
          ) : (
            <>
              {/* ── 3-Card Grid ── */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {displayedProjects.map((project, index) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    index={index}
                    onClick={() => openDetails(project)}
                  />
                ))}
              </motion.div>

              {/* ── View All Button ── */}
              {hasMore && (
                <div className="flex justify-center mt-14">
                  <motion.button
                    onClick={() => setShowAllModal(true)}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-[#D4AF37]/30 text-white hover:text-[#D4AF37] transition"
                  >
                    <Layers size={18} />
                    View All Projects
                    <span className="text-xs px-2 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                      +{moreProjects.length}
                    </span>
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ══════════════════ ALL PROJECTS MODAL ══════════════════ */}
      <AnimatePresence>
        {showAllModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/80 backdrop-blur"
            onClick={() => setShowAllModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[90vh] bg-[#111111] rounded-3xl border border-[#D4AF37]/20 overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-[#D4AF37]/10">
                <h3 className="text-xl font-bold text-white">
                  All Projects
                </h3>
                <button
                  onClick={() => setShowAllModal(false)}
                  className="text-[#A3A3A3] hover:text-[#D4AF37]"
                >
                  <X />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-modal-scroll">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {moreProjects.map((project, index) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      index={index}
                      onClick={() => {
                        setShowAllModal(false);
                        setTimeout(() => openDetails(project), 200);
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════ PROJECT DETAILS MODAL ══════════════════ */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailsModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}