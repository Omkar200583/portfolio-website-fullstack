import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, Grid3X3 } from "lucide-react";
import api from "../../services/api"; // path तुझ्या file location नुसार adjust कर

const iconMap = {
  "Node.js": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
  "Express.js": "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
  "React.js": "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  React: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  MongoDB: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg",
  PostgreSQL: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
  MySQL: "https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg",
  Java: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
  JavaScript: "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg",
  "Tailwind CSS": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
  "Git & GitHub": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-icon.svg",
  Postman: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman_%28software%29.png",
  Python: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
  "Three.js": "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg",
};

const accents = [
  { accent: "#D4AF37", accentSoft: "rgba(212,175,55,0.25)", bar: "from-[#D4AF37] to-[#F0D060]" },
  { accent: "#F0D060", accentSoft: "rgba(240,208,96,0.25)", bar: "from-[#F0D060] to-[#D4AF37]" },
  { accent: "#E8C847", accentSoft: "rgba(232,200,71,0.25)", bar: "from-[#E8C847] to-[#F0D060]" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.94 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 14 },
  },
};

const INITIAL_SKILL_COUNT = 9;

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/skills");
        const data = res.data;

        let list = [];
        if (Array.isArray(data?.data?.skills)) list = data.data.skills;
        else if (Array.isArray(data?.skills)) list = data.skills;
        else if (Array.isArray(data?.data)) list = data.data;
        else if (Array.isArray(data)) list = data;

        setSkills(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const safeSkills = Array.isArray(skills) ? skills : [];
  const displayedSkills = safeSkills.slice(0, INITIAL_SKILL_COUNT);
  const moreSkills = safeSkills.slice(INITIAL_SKILL_COUNT);
  const hasMore = safeSkills.length > INITIAL_SKILL_COUNT;

  const renderCard = (skill, index) => {
    const style = accents[index % accents.length];
    const iconUrl = skill.image || iconMap[skill.name];
    const levelStr =
      skill.level || skill.proficiency
        ? `${skill.level || skill.proficiency}%`
        : "0%";

    return (
      <motion.div
        key={skill._id || skill.name || index}
        className="group relative p-6 sm:p-7 rounded-2xl border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl overflow-hidden transition-colors duration-300"
        style={{ "--accent": style.accent }}
        variants={cardVariants}
        whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{
            background: `radial-gradient(120% 100% at 50% 0%, ${style.accentSoft}, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px ${style.accentSoft}` }}
        />

        <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 bg-[#0A0A0A] rounded-full flex items-center justify-center border border-[#D4AF37]/10 group-hover:border-[var(--accent)]/60 transition-all duration-300 shadow-lg">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={skill.name}
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <span className="text-2xl font-bold text-[var(--accent)]">
              {skill.name?.[0]}
            </span>
          )}
        </div>

        <div className="relative z-10 text-center">
          <h3 className="font-display text-sm sm:text-base font-semibold text-[#FFFFFF] mb-3 transition-colors duration-300 group-hover:text-[var(--accent)]">
            {skill.name}
          </h3>

          <div className="w-full h-1.5 bg-[#D4AF37]/10 rounded-full overflow-hidden mb-2">
            <motion.div
              className={`h-full bg-gradient-to-r ${style.bar} rounded-full`}
              initial={{ width: 0 }}
              whileInView={{ width: levelStr }}
              viewport={{ once: true }}
              transition={{
                duration: 1.1,
                delay: 0.3 + index * 0.06,
                ease: "easeOut",
              }}
            />
          </div>

          <div className="flex justify-center gap-3 text-xs font-mono text-[#A3A3A3] group-hover:text-[#FFFFFF] transition-colors">
            <span>{levelStr}</span>
            {skill.yearsOfExperience && <span>{skill.yearsOfExperience} yrs</span>}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0A0A0A]">
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

          .custom-modal-scroll::-webkit-scrollbar { width: 4px; }
          .custom-modal-scroll::-webkit-scrollbar-track { background: transparent; }
          .custom-modal-scroll::-webkit-scrollbar-thumb {
            background: rgba(212,175,55,0.3);
            border-radius: 999px;
          }
        `}</style>

        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0D0D0D]" />
        <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#D4AF37]/[0.06] blur-[140px] glow-float" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#F0D060]/[0.04] blur-[130px] glow-float-2" />

        <div className="relative z-10 container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#A3A3A3] uppercase mb-5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-70 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
              </span>
              Expertise
            </span>

            <h2 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF]">
              Technical{" "}
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C847] to-[#F0D060] bg-clip-text text-transparent">
                Skill Set
              </span>
            </h2>

            <p className="mt-4 text-[#A3A3A3] text-base sm:text-lg max-w-2xl mx-auto">
              Technologies and tools I use to bring products to life.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
            </div>
          ) : safeSkills.length === 0 ? (
            <p className="text-center text-[#A3A3A3] text-lg py-24">
              No skills added yet.
            </p>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                {displayedSkills.map((skill, index) => renderCard(skill, index))}
              </motion.div>

              {hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex justify-center mt-14"
                >
                  <motion.button
                    onClick={() => setShowModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] font-display font-semibold text-sm text-[#FFFFFF] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/[0.06] hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-300"
                  >
                    <Grid3X3 size={18} className="text-[#D4AF37]" />
                    View All Skills
                    <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-[#D4AF37]/10 text-[#D4AF37]">
                      +{moreSkills.length}
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

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
              className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl border border-[#D4AF37]/15 bg-[#111111] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#D4AF37]/10">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    More Technologies
                  </h3>
                  <p className="text-xs text-[#737373] mt-1 font-mono">
                    {moreSkills.length} additional skills in my arsenal
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

              <div className="p-6 overflow-y-auto flex-grow custom-modal-scroll">
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {moreSkills.map((skill, index) => renderCard(skill, index))}
                </motion.div>
              </div>

              <div
                className="h-[2px] w-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Skills;