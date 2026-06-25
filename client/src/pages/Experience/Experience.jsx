// ═══════════════════════════════════════════════════════════════
//  EXPERIENCE (Public) — Premium Black & Gold Timeline
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Briefcase, ExternalLink, FileBadge } from "lucide-react";
import experienceService from "../../services/experienceService";

// ⚠️ FALLBACK DATA: If your API fails, it will show this so your site never looks broken.
// Delete this array once your backend is 100% connected and working!
const FALLBACK_EXPERIENCE = [
  {
    _id: "fallback-1",
    title: "Full Stack Development Intern",
    company: "Athenura",
    startDate: "2026-03-01",
    endDate: "",
    current: true,
    location: "Pune, India",
    description: "Engineered a secure authentication system using JWT and OAuth 2.0, implemented Email OTP verification and bcrypt password hashing, and built optimized session management workflows.",
    certificateUrl: ""
  },
  {
    _id: "fallback-2",
    title: "Full Stack Development Intern",
    company: "SkillEcted",
    startDate: "2025-06-01",
    endDate: "2026-02-28",
    current: false,
    location: "Remote",
    description: "Developed 10+ responsive web pages, designed and executed CRUD operations on MySQL databases, and collaborated with a 5-member team using Git/GitHub.",
    certificateUrl: ""
  },
  {
    _id: "fallback-3",
    title: "B.Sc. Computer Science",
    company: "Savitribai Phule Pune University",
    startDate: "2022-08-01",
    endDate: "2025-05-30",
    current: false,
    location: "Pune, Maharashtra",
    description: "Built a strong foundation in data structures, algorithms, and software engineering, completing 6+ full stack projects spanning authentication systems and e-commerce platforms.",
    certificateUrl: ""
  }
];

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "";

export default function Experience() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await experienceService.getAll();
        const data = res.data?.data || res.data?.experiences || res.data || [];
        
        // If API returns a valid array with items, use it. Otherwise, use fallback.
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
        } else {
          setJobs(FALLBACK_EXPERIENCE);
        }
      } catch (err) {
        console.error("API Failed, using fallback experience:", err);
        setJobs(FALLBACK_EXPERIENCE); // Fallback to hardcoded data so UI doesn't break
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);

  return (
    <section id="experience" className="relative w-full overflow-hidden bg-[#0A0A0A] text-[#FFFFFF] py-24 px-4 sm:px-6 font-[Inter]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        
        @keyframes floatGlow { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -30px) scale(1.06); } }
        .glow-float { animation: floatGlow 14s ease-in-out infinite; }
        @keyframes floatGlow2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-24px, 24px) scale(1.04); } }
        .glow-float-2 { animation: floatGlow2 18s ease-in-out infinite; }
        
        @keyframes nodePing {
          0% { transform: scale(1); opacity: 0.6; box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
          70% { transform: scale(2.5); opacity: 0; box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
          100% { transform: scale(2.5); opacity: 0; box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }

        @keyframes lineGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        .timeline-line-animate {
          transform-origin: top;
          animation: lineGrow 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes shineSweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .btn-shine:hover .shine-effect { animation: shineSweep 0.7s ease-out forwards; }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0D0D0D]" />
      <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#D4AF37]/[0.06] blur-[140px] glow-float" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#F0D060]/[0.04] blur-[130px] glow-float-2" />

      <div className="relative z-10 container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#A3A3A3] uppercase mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            Career Path
          </span>
          <h2 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF]">
            Experience{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C847] to-[#F0D060] bg-clip-text text-transparent">Timeline</span>
          </h2>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
          </div>
        ) : (
          /* Timeline Container */
          <div className="relative">
            {/* Animated Center Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 bg-[#D4AF37]/10 overflow-hidden">
              <div className="absolute inset-0 w-full bg-gradient-to-b from-[#D4AF37]/60 via-[#D4AF37]/20 to-transparent timeline-line-animate" />
            </div>

            {jobs.map((job, idx) => {
              const isLeft = idx % 2 === 0;
              const isCurrent = job.current || !job.endDate;
              const hasCertificate = job.certificateUrl || job.offerLetterUrl;

              return (
                <motion.div
                  key={job._id || idx}
                  // ✅ FIX: Using whileInView instead of manual ref checking
                  initial={{ opacity: 0, y: 50, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.7, 
                    delay: idx * 0.15, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className={`relative flex flex-col md:flex-row items-start mb-12 last:mb-0 ${
                    isLeft ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Node */}
                  <div className="absolute left-4 md:left-1/2 top-8 -translate-x-1/2 z-10 flex items-center justify-center">
                    {isCurrent && (
                      <span 
                        className="absolute w-4 h-4 rounded-full border border-[#D4AF37]"
                        style={{ animation: "nodePing 2s cubic-bezier(0, 0, 0.2, 1) infinite" }}
                      />
                    )}
                    <div 
                      className={`relative w-4 h-4 rounded-full border-[3px] border-[#0A0A0A] transition-all duration-500 ${
                        isCurrent 
                          ? "bg-[#F0D060] shadow-[0_0_16px_rgba(240,208,96,0.7)]" 
                          : "bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                      }`}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="pl-12 md:pl-0 md:w-1/2 md:px-8 w-full">
                    <motion.div 
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="group relative rounded-2xl p-6 border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl transition-all duration-400 hover:border-[#D4AF37]/30 hover:shadow-[0_20px_50px_-15px_rgba(212,175,55,0.2)] overflow-hidden"
                    >
                      {/* Hover Gradient Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent" />

                      <div className="relative z-10">
                        {/* Date & Status Badge */}
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                          <span className="text-xs font-mono tracking-[0.12em] text-[#F0D060] uppercase">
                            {formatDate(job.startDate)} – {job.endDate ? formatDate(job.endDate) : "Present"}
                          </span>
                          
                          {isCurrent && (
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#F0D060] border border-[#D4AF37]/20">
                              Active
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-lg sm:text-xl font-bold text-[#FFFFFF] mb-1 transition-colors duration-300 group-hover:text-[#D4AF37]">
                          {job.title}
                        </h3>

                        {/* Company & Location */}
                        <h4 className="text-sm sm:text-base text-[#A3A3A3] mb-4 flex items-center flex-wrap gap-x-2 gap-y-1">
                          <span className="text-[#E8C847]">{job.company}</span>
                          {job.location && (
                            <>
                              <span className="text-[#525252]">·</span>
                              <span>{job.location}</span>
                            </>
                          )}
                        </h4>

                        {/* Description */}
                        {job.description && (
                          <p className="text-sm text-[#A3A3A3] leading-relaxed mb-4">
                            {job.description}
                          </p>
                        )}

                        {/* Conditional: View Certificate / Offer Letter Button */}
                        {hasCertificate && (
                          <motion.a
                            href={job.certificateUrl || job.offerLetterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-shine relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/[0.05] text-xs font-medium text-[#F0D060] hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/[0.1] hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300"
                          >
                            <span className="shine-effect absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent translate-x-[-100%]" />
                            <FileBadge size={14} className="relative z-10" />
                            <span className="relative z-10">View Offer Letter</span>
                            <ExternalLink size={12} className="relative z-10 opacity-50" />
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}