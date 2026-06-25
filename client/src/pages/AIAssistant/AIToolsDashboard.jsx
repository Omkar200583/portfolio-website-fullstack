import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  FileText,
  ScanSearch,
  Mic,
  Compass,
  ArrowRight,
} from "lucide-react";

const TOOLS = [
  {
    id: "chat",
    title: "AI Chat Assistant",
    desc: "Get help with coding, career questions, and general doubts from an AI that responds like ChatGPT.",
    icon: MessageSquare,
    path: "/ai-tools/chat",
    accent: "#4AA8FF",
  },
  {
    id: "resume-builder",
    title: "Resume Builder",
    desc: "Turn your raw details into a clean, ATS-friendly, job-ready resume with strong action verbs.",
    icon: FileText,
    path: "/ai-tools/resume-builder",
    accent: "#7FC8FF",
  },
  {
    id: "resume-analyzer",
    title: "Resume Analyzer",
    desc: "Get an ATS score, strengths, weaknesses, missing keywords, and job role match for your resume.",
    icon: ScanSearch,
    path: "/ai-tools/resume-analyzer",
    accent: "#3FE0D0",
  },
  {
    id: "mock-interview",
    title: "Mock Interview",
    desc: "Practice technical interviews with scored feedback on correctness, communication, and depth.",
    icon: Mic,
    path: "/ai-tools/mock-interview",
    accent: "#4AA8FF",
  },
  {
    id: "career-guide",
    title: "Career Guide AI",
    desc: "Get a step-by-step roadmap — skills, projects, timeline, and job roles — for your career goal.",
    icon: Compass,
    path: "/ai-tools/career-guide",
    accent: "#3FE0D0",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.09,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function AIToolsDashboard() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full text-[#E6E8EB] font-[Inter] overflow-y-auto no-scrollbar">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }

        /* Shimmer sweep on card hover */
        .tool-card::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.025) 40%,
            rgba(255,255,255,0.055) 50%,
            rgba(255,255,255,0.025) 60%,
            transparent 100%
          );
          transform: skewX(-15deg);
          transition: left 0.65s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
          z-index: 5;
          border-radius: inherit;
        }
        .tool-card:hover::after {
          left: 140%;
        }
      `}</style>

      {/* Subtle contained glow (doesn't overflow panels) */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#4AA8FF]/[0.06] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-[#3FE0D0]/[0.04] blur-[90px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 sm:mb-10 px-2"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] sm:text-xs font-medium tracking-[0.15em] text-[#7A8394] uppercase mb-4"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#4AA8FF] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#4AA8FF]" />
            </span>
            AI Toolkit
          </motion.span>
          <h2 className="font-display font-bold tracking-tight text-2xl sm:text-3xl lg:text-4xl text-white">
            AI Tools{" "}
            <span className="bg-gradient-to-r from-[#4AA8FF] via-[#7FC8FF] to-[#3FE0D0] bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
          <p className="mt-2.5 text-[#7A8394] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            A suite of AI-powered tools for career growth — chat, resume building, analysis, mock interviews, and roadmaps.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-3 sm:px-0">
          {TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5, scale: 1.012 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => navigate(tool.path)}
                className="tool-card group relative p-5 sm:p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden cursor-pointer transition-colors duration-300 hover:border-[#4AA8FF]/25"
                style={{
                  boxShadow: "0 2px 12px -4px rgba(0,0,0,0.3)",
                }}
              >
                {/* Hover radial glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${tool.accent}18, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center mb-4 border border-white/[0.08] bg-[#0B0C10]/80 transition-all duration-400 group-hover:scale-110 group-hover:-rotate-2"
                    style={{
                      color: tool.accent,
                      "--glow-color": `${tool.accent}66`,
                    }}
                  >
                    <Icon size={19} strokeWidth={1.8} />
                  </div>

                  <h3 className="font-display text-base sm:text-[17px] font-bold text-white mb-1.5">
  {tool.title}
</h3>
                  <p className="text-xs sm:text-[13px] text-[#7A8394] leading-relaxed mb-4">
                    {tool.desc}
                  </p>

                  <span
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#9AA4B2] transition-colors duration-300 group-hover:text-[#3FE0D0]"
                  >
                    Open tool
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}