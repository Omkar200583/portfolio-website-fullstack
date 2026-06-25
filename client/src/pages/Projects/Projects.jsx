// ═══════════════════════════════════════════════════════════════
//  PROJECTS — Premium Black & Gold (3-Grid + Popup Modal)
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, FolderOpen, Layers, X } from "lucide-react";
import { projectService } from "../../services/projectService";
import ProjectCard from "../../components/projects/ProjectCard";

const INITIAL_PROJECT_COUNT = 3; // Show exactly 3 projects

const containerVariants = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try { 
        const res = await projectService.getAll({ limit: 50 }); 
        setProjects(res.data?.data || []); 
      }
      catch (err) { 
        console.error("Failed to fetch projects:", err);
        setError("Couldn't load projects right now."); 
      }
      finally { setLoading(false); }
    };
    fetchProjects();
  }, []);

  const displayedProjects = projects.slice(0, INITIAL_PROJECT_COUNT);
  const moreProjects = projects.slice(INITIAL_PROJECT_COUNT);
  const hasMore = projects.length > INITIAL_PROJECT_COUNT;

  return (
    <>
      <section id="projects" className="relative w-full overflow-hidden bg-[#0A0A0A] text-[#FFFFFF] py-24 px-4 sm:px-6 font-[Inter]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
          .font-display { font-family: 'Space Grotesk', sans-serif; }
          @keyframes floatGlow { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -30px) scale(1.06); } }
          .glow-float { animation: floatGlow 14s ease-in-out infinite; }
          @keyframes floatGlow2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-24px, 24px) scale(1.04); } }
          .glow-float-2 { animation: floatGlow2 18s ease-in-out infinite; }
          /* Custom scrollbar for modal */
          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-track { background: transparent; }
          .custom-modal-scroll::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 999px; }
        `}</style>

        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0D0D0D]" />
        <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#D4AF37]/[0.06] blur-[140px] glow-float" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#F0D060]/[0.04] blur-[130px] glow-float-2" />

        <div className="relative z-10 container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#A3A3A3] uppercase mb-5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-70 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
              </span>
              Portfolio
            </span>
            <h2 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF]">
              Things I've{" "}
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C847] to-[#F0D060] bg-clip-text text-transparent">Built</span>
            </h2>
            <p className="mt-4 text-[#A3A3A3] text-base sm:text-lg max-w-2xl mx-auto">A selection of full stack apps, clones, and tools — pulled live from the project database.</p>
          </motion.div>

          {/* States */}
          {loading ? (
            <div className="flex justify-center py-24"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>
          ) : error ? (
            <p className="text-center text-red-400 text-sm py-16">{error}</p>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center gap-3 text-[#A3A3A3] py-24">
              <FolderOpen size={32} className="text-[#666666]" />
              <p className="text-sm">No projects added yet — check back soon.</p>
            </div>
          ) : (
            <>
              {/* Main Grid (Exactly 3 Projects) */}
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {displayedProjects.map((p, i) => (
                  <ProjectCard key={p._id} project={p} index={i} />
                ))}
              </motion.div>

              {/* View All Button */}
              {hasMore && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex justify-center mt-14"
                >
                  <motion.button
                    onClick={() => setShowModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] font-display font-semibold text-sm text-[#FFFFFF] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/[0.06] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-300"
                  >
                    <Layers size={18} className="text-[#D4AF37]" />
                    View All Projects
                    <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                      +{moreProjects.length}
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          POPUP MODAL — Remaining Projects
         ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[85vh] rounded-2xl border border-[#D4AF37]/15 bg-[#111111] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#D4AF37]/10">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    All Projects
                  </h3>
                  <p className="text-xs text-[#737373] mt-1 font-mono">
                    {moreProjects.length} additional projects in my portfolio
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl border border-[#D4AF37]/10 bg-[#0A0A0A] text-[#A3A3A3] hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-colors"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Modal Body (Scrollable Grid) */}
              <div className="p-6 overflow-y-auto flex-grow custom-modal-scroll">
                <motion.div 
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {moreProjects.map((p, i) => (
                    <ProjectCard key={p._id} project={p} index={i} />
                  ))}
                </motion.div>
              </div>

              {/* Gold accent line at bottom */}
              <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}