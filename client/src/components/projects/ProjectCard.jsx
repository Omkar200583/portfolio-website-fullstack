// ═══════════════════════════════════════════════════════════════
//  PROJECT CARD (Admin/Duplicate) — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const GitHubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ProjectCard = ({ project, index = 0 }) => {
  const navigate = useNavigate();
  const {
    _id, title, shortDescription, description,
    category, techStack = [], demoUrl, githubUrl,
    thumbnail, featured, status,
  } = project;

  const handleCardClick = (e) => {
    if (e.target.closest("a")) return;
    navigate(`/projects/${_id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleCardClick}
      className="group relative rounded-2xl border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-[0_20px_50px_-15px_rgba(212,175,55,0.15)] flex flex-col cursor-pointer"
    >
      <div className="relative h-40 overflow-hidden bg-[#0A0A0A]">
        {thumbnail?.url ? (
          <img src={thumbnail.url} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#666666] text-xs font-mono uppercase tracking-widest">
            {category || "project"}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

        <div className="absolute top-3 right-3 flex gap-2">
          {featured && (
            <span className="text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-full bg-[#D4AF37]/15 text-[#F0D060] border border-[#D4AF37]/30">
              Featured
            </span>
          )}
          {status && (
            <span className={`text-[10px] font-mono uppercase tracking-wide px-2 py-1 rounded-full border ${
              status === "completed"
                ? "bg-green-500/15 text-green-400 border-green-500/30"
                : status === "in-progress"
                ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                : "bg-gray-500/15 text-gray-400 border-gray-500/30"
            }`}>
              {status}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {category && (
          <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#F0D060] mb-2">
            {category}
          </span>
        )}
        <h3 className="font-display text-lg font-bold text-[#FFFFFF] mb-2 transition-colors duration-300 group-hover:text-[#D4AF37]">
          {title}
        </h3>
        <p className="text-sm text-[#A3A3A3] leading-relaxed mb-4 flex-1 line-clamp-2">
          {shortDescription || description}
        </p>

        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {techStack.slice(0, 4).map((t) => (
              <span key={t} className="text-xs font-mono text-[#F0D060] bg-[#D4AF37]/[0.08] px-2.5 py-1 rounded-full border border-[#D4AF37]/15">
                {t}
              </span>
            ))}
            {techStack.length > 4 && (
              <span className="text-xs font-mono text-[#666666] bg-[#FFFFFF]/[0.03] px-2.5 py-1 rounded-full border border-[#FFFFFF]/[0.06]">
                +{techStack.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-4 pt-3 border-t border-[#D4AF37]/10 mt-auto">
          {demoUrl && (
            <a href={demoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-sm text-[#FFFFFF] hover:text-[#D4AF37] transition-colors duration-250">
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-sm text-[#FFFFFF] hover:text-[#F0D060] transition-colors duration-250">
              <GitHubIcon size={14} /> Source
            </a>
          )}
          {!demoUrl && !githubUrl && (
            <span className="text-xs text-[#666666] italic">Click to view details</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;