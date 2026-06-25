// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Loader2 } from "lucide-react";
// import axios from "axios";

// // Icon mapping for common tools (falls back to first letter if not found)
// const iconMap = {
//   "Node.js": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
//   "Express.js": "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
//   "React.js": "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
//   "React": "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
//   "MongoDB": "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg",
//   "PostgreSQL": "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
//   "MySQL": "https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg",
//   "Java": "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
//   "JavaScript": "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg",
//   "Tailwind CSS": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
//   "Git & GitHub": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-icon.svg",
//   "Postman": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman_%28software%29.png",
//   "Python": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
//   "Three.js": "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg", // fallback
// };

// const accents = [
//   { accent: "#4AA8FF", accentSoft: "rgba(74,168,255,0.35)", bar: "from-[#4AA8FF] to-[#3FE0D0]" },
//   { accent: "#7FC8FF", accentSoft: "rgba(127,200,255,0.35)", bar: "from-[#7FC8FF] to-[#4AA8FF]" },
//   { accent: "#3FE0D0", accentSoft: "rgba(63,224,208,0.35)", bar: "from-[#3FE0D0] to-[#7FC8FF]" },
// ];

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
// };

// const cardVariants = {
//   hidden: { y: 40, opacity: 0, scale: 0.94 },
//   visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 110, damping: 14 } },
// };

// const Skills = () => {
//   const [skills, setSkills] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/skills");
//         const data = res.data;
//         setSkills(Array.isArray(data) ? data : data?.data || data?.skills || []);
//       } catch (error) {
//         console.error("Failed to fetch skills:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSkills();
//   }, []);

//   return (
//     <section id="skills" className="relative min-h-screen w-full overflow-hidden bg-[#0B0C10] text-[#E6E8EB] flex items-center justify-center py-24 px-4 font-[Inter]">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
//         .font-display { font-family: 'Space Grotesk', sans-serif; }
//         @keyframes floatGlow { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -30px) scale(1.06); } }
//         .glow-float { animation: floatGlow 14s ease-in-out infinite; }
//         @keyframes floatGlow2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-24px, 24px) scale(1.04); } }
//         .glow-float-2 { animation: floatGlow2 18s ease-in-out infinite; }
//       `}</style>

//       <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#101216] to-[#15181D]" />
//       <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#4AA8FF]/[0.08] blur-[140px] glow-float" />
//       <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#3FE0D0]/[0.06] blur-[130px] glow-float-2" />

//       <div className="relative z-10 container mx-auto max-w-6xl">
//         {/* Header */}
//         <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
//           <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#9AA4B2] uppercase mb-5">
//             <span className="relative flex h-2 w-2">
//               <span className="absolute inline-flex h-full w-full rounded-full bg-[#4AA8FF] opacity-70 animate-ping" />
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4AA8FF]" />
//             </span>
//             Expertise
//           </span>
//           <h2 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-white">
//             Technical{" "}
//             <span className="bg-gradient-to-r from-[#4AA8FF] via-[#7FC8FF] to-[#3FE0D0] bg-clip-text text-transparent">
//               Skill Set
//             </span>
//           </h2>
//           <p className="mt-4 text-[#9AA4B2] text-base sm:text-lg max-w-2xl mx-auto">
//             Technologies and tools I use to bring products to life.
//           </p>
//         </motion.div>

//         {/* Grid */}
//         {loading ? (
//           <div className="flex justify-center py-24">
//             <Loader2 className="w-10 h-10 animate-spin text-[#4AA8FF]" />
//           </div>
//         ) : skills.length === 0 ? (
//           <p className="text-center text-[#9AA4B2] text-lg py-24">No skills added yet.</p>
//         ) : (
//           <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
//             {skills.map((skill, index) => {
//               const style = accents[index % accents.length];
//               const iconUrl = skill.image || iconMap[skill.name];
//               const levelStr = skill.level ? `${skill.level}%` : "0%";

//               return (
//                 <motion.div key={skill._id} className="group relative p-6 sm:p-7 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden transition-colors duration-300" style={{ "--accent": style.accent }} variants={cardVariants} whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}>
//                   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" style={{ background: `radial-gradient(120% 100% at 50% 0%, ${style.accentSoft}, transparent 70%)` }} />
//                   <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `inset 0 0 0 1px ${style.accentSoft}` }} />

//                   <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 bg-[#0B0C10] rounded-full flex items-center justify-center border border-white/10 group-hover:border-[var(--accent)]/60 transition-all duration-300 shadow-lg">
//                     {iconUrl ? (
//                       <img src={iconUrl} alt={skill.name} className="w-8 h-8 sm:w-9 sm:h-9 object-contain transition-transform duration-500 group-hover:scale-110" />
//                     ) : (
//                       <span className="text-2xl font-bold text-[var(--accent)]">{skill.name?.[0]}</span>
//                     )}
//                   </div>

//                   <div className="relative z-10 text-center">
//                     <h3 className="font-display text-sm sm:text-base font-semibold text-white mb-3 transition-colors duration-300 group-hover:text-[var(--accent)]">
//                       {skill.name}
//                     </h3>
//                     <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
//                       <motion.div className={`h-full bg-gradient-to-r ${style.bar} rounded-full`} initial={{ width: 0 }} whileInView={{ width: levelStr }} viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.3 + index * 0.06, ease: "easeOut" }} />
//                     </div>
//                     <div className="flex justify-center gap-3 text-xs font-mono text-[#9AA4B2] group-hover:text-[#E6E8EB] transition-colors">
//                       <span>{levelStr}</span>
//                       {skill.experience && <span>{skill.experience} yrs</span>}
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Skills;