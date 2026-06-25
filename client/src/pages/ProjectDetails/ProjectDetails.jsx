// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowLeft, ExternalLink, Calendar, Tag, Layers, Star, Loader2, AlertCircle } from "lucide-react";
// import { projectService } from "../../services/projectService";

// // ✅ Custom SVG because lucide-react doesn't export "Github"
// const GithubIcon = ({ className = "" }) => (
//   <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
//     <path d="M9 18c-4.51 2-5-2-7-2" />
//   </svg>
// );

// const ProjectDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const res = await projectService.getById(id);
//         setProject(res.data?.data || res.data || res);
//       } catch (err) {
//         console.error("Failed to fetch project:", err);
//         setError("Project not found or couldn't be loaded.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchProject();
//     window.scrollTo(0, 0);
//   }, [id]);

//   if (loading) {
//     return (
//       <section className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
//         <Loader2 className="w-10 h-10 animate-spin text-[#4AA8FF]" />
//       </section>
//     );
//   }

//   if (error || !project) {
//     return (
//       <section className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center gap-4 px-4">
//         <AlertCircle className="w-12 h-12 text-red-400" />
//         <p className="text-red-400 text-lg">{error || "Project not found"}</p>
//         <button
//           onClick={() => navigate("/projects")}
//           className="mt-4 flex items-center gap-2 text-[#9AA4B2] hover:text-white transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" /> Back to Projects
//         </button>
//       </section>
//     );
//   }

//   const {
//     title,
//     description,
//     shortDescription,
//     category,
//     status,
//     techStack = [],
//     tags = [],
//     demoUrl,
//     githubUrl,
//     thumbnail,
//     featured,
//     createdAt,
//   } = project;

//   const formattedDate = createdAt
//     ? new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
//     : "";

//   return (
//     <section className="relative w-full min-h-screen overflow-hidden bg-[#0B0C10] text-[#E6E8EB]">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
//         .font-display { font-family: 'Space Grotesk', sans-serif; }
//       `}</style>

//       {/* Background effects */}
//       <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#101216] to-[#15181D]" />
//       <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#4AA8FF]/[0.06] blur-[140px]" />
//       <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#3FE0D0]/[0.04] blur-[130px]" />

//       <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

//         {/* Back button */}
//         <motion.button
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.4 }}
//           onClick={() => navigate("/projects")}
//           className="mb-10 flex items-center gap-2.5 text-[#9AA4B2] hover:text-white transition-colors group"
//         >
//           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//           <span className="text-sm font-medium">Back to Projects</span>
//         </motion.button>

//         {/* Hero Image */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//           className="relative rounded-2xl overflow-hidden border border-white/10 mb-10"
//         >
//           <div className="aspect-video bg-[#101216]">
//             {thumbnail?.url ? (
//               <img
//                 src={thumbnail.url}
//                 alt={title}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center">
//                 <span className="text-[#5B6470] text-lg font-mono uppercase tracking-widest">
//                   {category || "project"}
//                 </span>
//               </div>
//             )}
//           </div>
//           <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent" />

//           {/* Floating badges over image */}
//           <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
//             {featured && (
//               <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wide px-3 py-1.5 rounded-full bg-[#4AA8FF]/15 text-[#7FC8FF] border border-[#4AA8FF]/30 backdrop-blur-sm">
//                 <Star className="w-3 h-3 fill-current" /> Featured
//               </span>
//             )}
//             {status && (
//               <span className={`text-[10px] font-mono uppercase tracking-wide px-3 py-1.5 rounded-full border backdrop-blur-sm ${
//                 status === "completed"
//                   ? "bg-green-500/15 text-green-400 border-green-500/30"
//                   : status === "in-progress"
//                   ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
//                   : "bg-gray-500/15 text-gray-400 border-gray-500/30"
//               }`}>
//                 {status}
//               </span>
//             )}
//           </div>
//         </motion.div>

//         {/* Title & Meta */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.15 }}
//           className="mb-10"
//         >
//           {category && (
//             <span className="inline-block text-xs font-mono uppercase tracking-[0.15em] text-[#3FE0D0] mb-3">
//               {category}
//             </span>
//           )}
//           <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4">
//             {title}
//           </h1>
//           {shortDescription && (
//             <p className="text-lg sm:text-xl text-[#9AA4B2] leading-relaxed max-w-3xl">
//               {shortDescription}
//             </p>
//           )}
//           <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-[#5B6470]">
//             {formattedDate && (
//               <span className="flex items-center gap-1.5">
//                 <Calendar className="w-3.5 h-3.5" /> {formattedDate}
//               </span>
//             )}
//             {techStack.length > 0 && (
//               <span className="flex items-center gap-1.5">
//                 <Layers className="w-3.5 h-3.5" /> {techStack.length} technologies
//               </span>
//             )}
//           </div>
//         </motion.div>

//         {/* Main content grid */}
//         <div className="grid lg:grid-cols-[1fr_320px] gap-10">

//           {/* Left: Description */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.25 }}
//           >
//             <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 sm:p-8">
//               <h2 className="font-display font-bold text-xl text-white mb-5 flex items-center gap-2">
//                 <span className="w-1 h-5 rounded-full bg-[#4AA8FF]" />
//                 About This Project
//               </h2>
//               <div className="text-[#9AA4B2] leading-relaxed space-y-4 whitespace-pre-line">
//                 {description || shortDescription || "No description available for this project."}
//               </div>
//             </div>

//             {/* Full Tech Stack below description */}
//             {techStack.length > 0 && (
//               <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 sm:p-8 mt-6">
//                 <h2 className="font-display font-bold text-xl text-white mb-5 flex items-center gap-2">
//                   <span className="w-1 h-5 rounded-full bg-[#3FE0D0]" />
//                   Tech Stack
//                 </h2>
//                 <div className="flex flex-wrap gap-2.5">
//                   {techStack.map((t) => (
//                     <span
//                       key={t}
//                       className="text-sm font-mono text-[#7FC8FF] bg-[#4AA8FF]/[0.08] px-3.5 py-1.5 rounded-full border border-[#4AA8FF]/20 hover:bg-[#4AA8FF]/[0.15] transition-colors"
//                     >
//                       {t}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Tags */}
//             {tags.length > 0 && (
//               <div className="mt-6 flex flex-wrap gap-2">
//                 {tags.map((tag) => (
//                   <span
//                     key={tag}
//                     className="flex items-center gap-1 text-xs font-mono text-[#5B6470] bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06]"
//                   >
//                     <Tag className="w-3 h-3" /> {tag}
//                   </span>
//                 ))}
//               </div>
//             )}
//           </motion.div>

//           {/* Right: Sidebar */}
//           <motion.div
//             initial={{ opacity: 0, x: 30 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.35 }}
//             className="space-y-6"
//           >
//             {/* Quick Info Card */}
//             <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6">
//               <h3 className="font-display font-bold text-base text-white mb-4">Project Info</h3>
//               <div className="space-y-3.5 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-[#5B6470]">Category</span>
//                   <span className="text-[#E6E8EB] capitalize">{category || "—"}</span>
//                 </div>
//                 <div className="border-t border-white/[0.05]" />
//                 <div className="flex justify-between">
//                   <span className="text-[#5B6470]">Status</span>
//                   <span className={`capitalize font-medium ${
//                     status === "completed" ? "text-green-400" : status === "in-progress" ? "text-yellow-400" : "text-gray-400"
//                   }`}>
//                     {status || "—"}
//                   </span>
//                 </div>
//                 <div className="border-t border-white/[0.05]" />
//                 <div className="flex justify-between">
//                   <span className="text-[#5B6470]">Technologies</span>
//                   <span className="text-[#E6E8EB]">{techStack.length}</span>
//                 </div>
//                 <div className="border-t border-white/[0.05]" />
//                 <div className="flex justify-between">
//                   <span className="text-[#5B6470]">Featured</span>
//                   <span className={featured ? "text-[#4AA8FF]" : "text-[#5B6470]"}>
//                     {featured ? "Yes" : "No"}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Links Card */}
//             <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6">
//               <h3 className="font-display font-bold text-base text-white mb-4">Links</h3>
//               <div className="space-y-3">
//                 {demoUrl && (
//                   <a
//                     href={demoUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#4AA8FF]/[0.08] border border-[#4AA8FF]/20 text-[#7FC8FF] hover:bg-[#4AA8FF]/[0.15] hover:text-[#4AA8FF] transition-all group"
//                   >
//                     <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//                     <span className="text-sm font-medium">Live Demo</span>
//                     <svg className="w-3.5 h-3.5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
//                     </svg>
//                   </a>
//                 )}
//                 {githubUrl && (
//                   <a
//                     href={githubUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#3FE0D0]/[0.06] border border-[#3FE0D0]/15 text-[#3FE0D0] hover:bg-[#3FE0D0]/[0.12] transition-all group"
//                   >
//                     <GithubIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
//                     <span className="text-sm font-medium">Source Code</span>
//                     <svg className="w-3.5 h-3.5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
//                     </svg>
//                   </a>
//                 )}
//                 {!demoUrl && !githubUrl && (
//                   <p className="text-sm text-[#5B6470] italic text-center py-2">
//                     No links available
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Navigation between projects */}
//             <button
//               onClick={() => navigate("/projects")}
//               className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-[#9AA4B2] hover:text-white hover:border-white/20 transition-all text-sm"
//             >
//               <ArrowLeft className="w-4 h-4" /> View All Projects
//             </button>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProjectDetails;

// ═══════════════════════════════════════════════════════════════
//  PROJECT DETAILS — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, Tag, Layers, Star, Loader2, AlertCircle } from "lucide-react";
import { projectService } from "../../services/projectService";

const GithubIcon = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try { const res = await projectService.getById(id); setProject(res.data?.data || res.data || res); }
      catch (err) { setError("Project not found or couldn't be loaded."); }
      finally { setLoading(false); }
    };
    if (id) fetchProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <section className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></section>;
  
  if (error || !project) return (
    <section className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4 px-4">
      <AlertCircle className="w-12 h-12 text-red-400" /><p className="text-red-400 text-lg">{error || "Project not found"}</p>
      <button onClick={() => navigate("/projects")} className="mt-4 flex items-center gap-2 text-[#A3A3A3] hover:text-[#FFFFFF] transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Projects</button>
    </section>
  );

  const { title, description, shortDescription, category, status, techStack = [], tags = [], demoUrl, githubUrl, thumbnail, featured, createdAt } = project;
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "";

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#0A0A0A] text-[#FFFFFF]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap'); .font-display { font-family: 'Space Grotesk', sans-serif; }`}</style>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0D0D0D]" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#D4AF37]/[0.05] blur-[140px]" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#F0D060]/[0.03] blur-[130px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} onClick={() => navigate("/projects")}
          className="mb-10 flex items-center gap-2.5 text-[#A3A3A3] hover:text-[#FFFFFF] transition-colors group"
        ><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /><span className="text-sm font-medium">Back to Projects</span></motion.button>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/10 mb-10">
          <div className="aspect-video bg-[#171717]">
            {thumbnail?.url ? <img src={thumbnail.url} alt={title} className="w-full h-full object-cover" /> : (
              <div className="w-full h-full flex items-center justify-center"><span className="text-[#666666] text-lg font-mono uppercase tracking-widest">{category || "project"}</span></div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {featured && <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wide px-3 py-1.5 rounded-full bg-[#D4AF37]/15 text-[#F0D060] border border-[#D4AF37]/30 backdrop-blur-sm"><Star className="w-3 h-3 fill-current" /> Featured</span>}
            {status && <span className={`text-[10px] font-mono uppercase tracking-wide px-3 py-1.5 rounded-full border backdrop-blur-sm ${status === "completed" ? "bg-green-500/15 text-green-400 border-green-500/30" : status === "in-progress" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" : "bg-gray-500/15 text-gray-400 border-gray-500/30"}`}>{status}</span>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mb-10">
          {category && <span className="inline-block text-xs font-mono uppercase tracking-[0.15em] text-[#F0D060] mb-3">{category}</span>}
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#FFFFFF] leading-tight mb-4">{title}</h1>
          {shortDescription && <p className="text-lg sm:text-xl text-[#A3A3A3] leading-relaxed max-w-3xl">{shortDescription}</p>}
          <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-[#666666]">
            {formattedDate && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formattedDate}</span>}
            {techStack.length > 0 && <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {techStack.length} technologies</span>}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
            <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-sm p-6 sm:p-8">
              <h2 className="font-display font-bold text-xl text-[#FFFFFF] mb-5 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-[#D4AF37]" /> About This Project</h2>
              <div className="text-[#A3A3A3] leading-relaxed space-y-4 whitespace-pre-line">{description || shortDescription || "No description available for this project."}</div>
            </div>
            {techStack.length > 0 && (
              <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-sm p-6 sm:p-8 mt-6">
                <h2 className="font-display font-bold text-xl text-[#FFFFFF] mb-5 flex items-center gap-2"><span className="w-1 h-5 rounded-full bg-[#F0D060]" /> Tech Stack</h2>
                <div className="flex flex-wrap gap-2.5">
                  {techStack.map((t) => <span key={t} className="text-sm font-mono text-[#F0D060] bg-[#D4AF37]/[0.06] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/15 hover:bg-[#D4AF37]/[0.12] transition-colors">{t}</span>)}
                </div>
              </div>
            )}
            {tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => <span key={tag} className="flex items-center gap-1 text-xs font-mono text-[#666666] bg-[#171717]/50 px-3 py-1.5 rounded-full border border-[#D4AF37]/8"><Tag className="w-3 h-3" /> {tag}</span>)}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="space-y-6">
            <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-sm p-6">
              <h3 className="font-display font-bold text-base text-[#FFFFFF] mb-4">Project Info</h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between"><span className="text-[#666666]">Category</span><span className="text-[#FFFFFF] capitalize">{category || "—"}</span></div>
                <div className="border-t border-[#D4AF37]/8" />
                <div className="flex justify-between"><span className="text-[#666666]">Status</span><span className={`capitalize font-medium ${status === "completed" ? "text-green-400" : status === "in-progress" ? "text-yellow-400" : "text-[#666666]"}`}>{status || "—"}</span></div>
                <div className="border-t border-[#D4AF37]/8" />
                <div className="flex justify-between"><span className="text-[#666666]">Technologies</span><span className="text-[#FFFFFF]">{techStack.length}</span></div>
                <div className="border-t border-[#D4AF37]/8" />
                <div className="flex justify-between"><span className="text-[#666666]">Featured</span><span className={featured ? "text-[#D4AF37]" : "text-[#666666]"}>{featured ? "Yes" : "No"}</span></div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-sm p-6">
              <h3 className="font-display font-bold text-base text-[#FFFFFF] mb-4">Links</h3>
              <div className="space-y-3">
                {demoUrl && (
                  <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#D4AF37]/[0.06] border border-[#D4AF37]/15 text-[#F0D060] hover:bg-[#D4AF37]/[0.12] hover:text-[#D4AF37] transition-all group">
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /><span className="text-sm font-medium">Live Demo</span>
                    <svg className="w-3.5 h-3.5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                  </a>
                )}
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#F0D060]/[0.04] border border-[#F0D060]/12 text-[#F0D060] hover:bg-[#F0D060]/[0.1] transition-all group">
                    <GithubIcon className="w-4 h-4 group-hover:scale-110 transition-transform" /><span className="text-sm font-medium">Source Code</span>
                    <svg className="w-3.5 h-3.5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                  </a>
                )}
                {!demoUrl && !githubUrl && <p className="text-sm text-[#666666] italic text-center py-2">No links available</p>}
              </div>
            </div>
            <button onClick={() => navigate("/projects")} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#D4AF37]/10 bg-[#171717]/40 text-[#A3A3A3] hover:text-[#FFFFFF] hover:border-[#D4AF37]/30 transition-all text-sm cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> View All Projects
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;