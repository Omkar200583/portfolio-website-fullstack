// ═══════════════════════════════════════════════════════════════
//  EXPERIENCE — Premium Black & Gold
// ═══════════════════════════════════════════════════════════════
import { motion } from "framer-motion";
import { Award, Briefcase } from "lucide-react";

const experience = [
  {
    role: "Web Development Intern",
    org: "CodSoft",
    period: "2025",
    desc: "Completed multiple web development tasks using React, JavaScript, and modern UI practices.",
  },
  {
    role: "Web Development Intern",
    org: "Prodigy InfoTech",
    period: "2025",
    desc: "Built and deployed responsive web applications as part of a remote internship program.",
  },
];

const certifications = [
  "Java Programming",
  "React.js Development",
  "Data Science Fundamentals",
  "Full Stack Web Development",
];

export default function Experience() {
  return (
    <>
      <section id="experience" className="section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#D4AF37] text-sm tracking-[3px] mb-2 uppercase font-medium">Experience</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-[#FFFFFF]">Where I've worked</h2>

          <div className="space-y-4">
            {experience.map((e, i) => (
              <motion.div
                key={e.role + e.org}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl p-5 flex gap-4 border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-lg font-medium text-[#FFFFFF]">{e.role}</h3>
                    <span className="text-sm text-[#D4AF37]">&middot; {e.org}</span>
                    <span className="text-xs text-[#666666]">({e.period})</span>
                  </div>
                  <p className="text-sm text-[#A3A3A3] mt-1">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="certifications" className="section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#D4AF37] text-sm tracking-[3px] mb-2 uppercase font-medium">Certifications</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-[#FFFFFF]">Credentials</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {certifications.map((c, i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-lg p-4 flex items-center gap-3 border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl"
              >
                <Award size={20} className="text-[#F0D060] shrink-0" />
                <span className="text-[#FFFFFF] text-sm">{c}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}