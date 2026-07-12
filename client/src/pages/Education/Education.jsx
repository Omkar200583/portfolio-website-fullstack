// ═══════════════════════════════════════════════════════════════
//  EDUCATION — Premium Black & Gold Timeline
// ═══════════════════════════════════════════════════════════════
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, BookOpen } from 'lucide-react';

const EDUCATION_DATA = [
  {
    id: 1,
    degree: 'B.Sc. Computer Science',
    institution: 'Savitribai Phule Pune University',
    startDate: '2022-08-01',
    endDate: '2025-05-30',
    location: 'Pune, Maharashtra',
    description: 'Built a strong foundation in data structures, algorithms, and software engineering. Completed 6+ full stack projects spanning authentication systems and e-commerce platforms.',
    highlights: ['Data Structures & Algorithms', 'Software Engineering', 'Web Development', '6+ Full Stack Projects'],
    current: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
};

export default function Education() {
  return (
    <section id="education" className="relative w-full overflow-hidden bg-[#0A0A0A] text-[#FFFFFF] py-24 px-4 sm:px-6 font-[Inter]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        @keyframes floatGlow { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -30px) scale(1.06); } }
        .glow-float { animation: floatGlow 14s ease-in-out infinite; }
        @keyframes floatGlow2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-24px, 24px) scale(1.04); } }
        .glow-float-2 { animation: floatGlow2 18s ease-in-out infinite; }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0D0D0D]" />
      <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#D4AF37]/[0.06] blur-[140px] glow-float" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#F0D060]/[0.04] blur-[130px] glow-float-2" />

      <div className="relative z-10 container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#A3A3A3] uppercase mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            Academic Journey
          </span>
          <h2 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF]">
            Education &{' '}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C847] to-[#F0D060] bg-clip-text text-transparent">
              Qualifications
            </span>
          </h2>
        </motion.div>

        {/* Education Timeline */}
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {EDUCATION_DATA.map((edu, index) => (
            <motion.div key={edu.id} variants={itemVariants}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl transition-all duration-400 hover:border-[#D4AF37]/30 hover:shadow-[0_20px_50px_-15px_rgba(212,175,55,0.2)] overflow-hidden"
              >
                {/* Hover Gradient Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent" />

                <div className="relative z-10">
                  {/* Icon & Status */}
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#D4AF37]/[0.12] border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/[0.18] transition-all duration-300">
                      <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37]" />
                    </div>
                    {edu.current && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#F0D060] border border-[#D4AF37]/20">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Degree Title */}
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#FFFFFF] mb-1 transition-colors duration-300 group-hover:text-[#D4AF37]">
                    {edu.degree}
                  </h3>

                  {/* Institution */}
                  <h4 className="text-sm sm:text-base text-[#E8C847] mb-4 flex items-center gap-2 flex-wrap">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                    {edu.institution}
                  </h4>

                  {/* Date & Location */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#A3A3A3] mb-4 font-mono">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D4AF37]/60" />
                      {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#D4AF37]/60" />
                        {edu.location}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p className="text-sm sm:text-base text-[#A3A3A3] leading-relaxed mb-5">
                      {edu.description}
                    </p>
                  )}

                  {/* Highlights */}
                  {edu.highlights && edu.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {edu.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-[#D4AF37]/[0.08] border border-[#D4AF37]/15 text-[#F0D060] transition-all duration-300 group-hover:bg-[#D4AF37]/[0.15] group-hover:border-[#D4AF37]/30"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-14 p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl"
        >
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#FFFFFF] mb-4">Key Achievements</h3>
          <ul className="space-y-3 text-sm sm:text-base text-[#A3A3A3]">
            <li className="flex items-start gap-3">
              <span className="text-[#D4AF37] font-bold mt-0.5">✓</span>
              <span>Strong foundation in data structures, algorithms, and software engineering principles</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#D4AF37] font-bold mt-0.5">✓</span>
              <span>Completed 6+ full stack projects across authentication systems and e-commerce platforms</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#D4AF37] font-bold mt-0.5">✓</span>
              <span>Practical experience with modern web technologies and development best practices</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}