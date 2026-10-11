// ═══════════════════════════════════════════════════════════════
//  ABOUT — Premium Black & Gold (no gaps, no shadows, no orbs)
//  Location: src/pages/About/About.jsx
// ═══════════════════════════════════════════════════════════════
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { statsService } from "../../services/statsService"; // adjust path if needed

const STACK = [
  { name: "React.js", level: 90 },
  { name: "Node.js", level: 88 },
  { name: "Express.js", level: 85 },
  { name: "PostgreSQL", level: 82 },
  { name: "MySQL", level: 80 },
  { name: "MongoDB", level: 84 },
  { name: "JWT / OAuth 2.0", level: 86 },
  { name: "Tailwind CSS", level: 92 },
];

const DEFAULT_STATS = [
  { value: "6+", label: "Projects Shipped" },
  { value: "2", label: "Internships" },
  { value: "4+", label: "Tech Stacks" },
  { value: "100%", label: "Ownership" },
];

/* ─── Floating Particle (hidden on mobile) ─── */
function Particle({ delay, x, y, size, duration, opacity }) {
  return (
    <span
      className="absolute rounded-full pointer-events-none hidden sm:block"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: `radial-gradient(circle, rgba(212,175,55,${opacity}) 0%, transparent 70%)`,
        animation: `particleFloat ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

/* ─── Corner Accent ─── */
function CornerAccent({ position }) {
  const styles = {
    "top-left": {
      top: "-1px", left: "-1px",
      borderTop: "2px solid #D4AF37", borderLeft: "2px solid #D4AF37",
      borderTopLeftRadius: "16px",
    },
    "top-right": {
      top: "-1px", right: "-1px",
      borderTop: "2px solid #D4AF37", borderRight: "2px solid #D4AF37",
      borderTopRightRadius: "16px",
    },
    "bottom-left": {
      bottom: "-1px", left: "-1px",
      borderBottom: "2px solid #D4AF37", borderLeft: "2px solid #D4AF37",
      borderBottomLeftRadius: "16px",
    },
    "bottom-right": {
      bottom: "-1px", right: "-1px",
      borderBottom: "2px solid #D4AF37", borderRight: "2px solid #D4AF37",
      borderBottomRightRadius: "16px",
    },
  };
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute w-8 h-8 sm:w-12 sm:h-12"
      style={styles[position]}
    />
  );
}

/* ─── Skill Tag ─── */
function SkillTag({ name, level, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 border transition-all duration-300 cursor-default"
        style={{
          borderColor: "rgba(212,175,55,0.15)",
          background: "rgba(212,175,55,0.04)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)";
          e.currentTarget.style.background = "rgba(212,175,55,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)";
          e.currentTarget.style.background = "rgba(212,175,55,0.04)";
        }}
      >
        <span
          className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            background: "linear-gradient(90deg, rgba(212,175,55,0.12), rgba(240,208,96,0.06))",
            width: isInView ? `${level}%` : "0%",
          }}
        />
        <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] sm:text-xs font-mono text-[#F0D060]">{name}</span>
          <span className="text-[9px] sm:text-[10px] font-mono text-[#D4AF37]/50 tabular-nums">
            {isInView ? `${level}%` : "—"}
          </span>
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ value, label, index, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.5 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-3.5 sm:p-5 text-center border transition-all duration-300"
        style={{
          borderColor: "rgba(212,175,55,0.08)",
          background: "rgba(23,23,23,0.5)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)";
          e.currentTarget.style.background = "rgba(212,175,55,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)";
          e.currentTarget.style.background = "rgba(23,23,23,0.5)";
        }}
      >
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] transition-all duration-500 group-hover:w-full w-0"
          style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
        />
        <div
          className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-1"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #F0D060)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: loading ? 0.4 : 1,
          }}
        >
          {value}
        </div>
        <div className="text-[9px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.15em] text-[#737373] uppercase font-medium">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Animated Divider ─── */
function AnimatedDivider({ delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative w-full h-px my-5 sm:my-6 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)" }}
      />
      <motion.div
        className="absolute top-0 left-0 h-full"
        style={{
          width: "80px",
          background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
        }}
        initial={{ x: "-80px" }}
        animate={isInView ? { x: "calc(100% + 80px)" } : { x: "-80px" }}
        transition={{ duration: 1.8, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ABOUT COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function About() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const res = await statsService.getAboutStats();
        const data = res?.data?.data || res?.data;
        if (!cancelled && data?.stats?.length) setStats(data.stats);
      } catch (err) {
        console.warn("Falling back to default About stats:", err.message);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const particles = [
    { delay: 0, x: 5, y: 10, size: 4, duration: 7, opacity: 0.5 },
    { delay: 1.2, x: 92, y: 15, size: 3, duration: 9, opacity: 0.4 },
    { delay: 0.6, x: 15, y: 80, size: 5, duration: 8, opacity: 0.35 },
    { delay: 2.0, x: 88, y: 75, size: 3, duration: 11, opacity: 0.45 },
    { delay: 0.3, x: 50, y: 5, size: 4, duration: 10, opacity: 0.3 },
    { delay: 1.8, x: 3, y: 45, size: 3, duration: 12, opacity: 0.4 },
    { delay: 0.9, x: 96, y: 50, size: 4, duration: 8.5, opacity: 0.35 },
    { delay: 2.5, x: 40, y: 95, size: 3, duration: 9.5, opacity: 0.4 },
  ];

  const revealLine = (delay = 0) => ({
    initial: { opacity: 0, y: 18, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    // No id (Home's SectionTransition already owns id="about").
    // No min-h-screen / py-* / bg — Home controls spacing and background,
    // so there is no stacked gap and no dark box behind the section.
    <div
      className="relative w-full overflow-hidden text-[#FFFFFF]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }

        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          25% { transform: translateY(-20px) translateX(8px) scale(1.2); }
          50% { transform: translateY(-35px) translateX(-5px) scale(0.8); opacity: 0.2; }
          75% { transform: translateY(-15px) translateX(12px) scale(1.1); }
        }
        @keyframes borderSweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      <div className="relative z-10 container mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
          <motion.span
            {...revealLine(0)}
            className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] text-[10px] sm:text-xs font-medium tracking-[0.1em] sm:tracking-[0.18em] text-[#A3A3A3] uppercase mb-4 sm:mb-5 max-w-full"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            About Me
          </motion.span>

          <motion.h2
            {...revealLine(0.1)}
            className="font-display font-bold tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[#FFFFFF]"
          >
            Who{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #D4AF37, #E8C847, #F0D060, #E8C847, #D4AF37)",
                backgroundSize: "200% auto",
                animation: "borderSweep 4s linear infinite",
              }}
            >
              I Am
            </span>
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-[2px] mt-4 rounded-full"
            style={{ background: "linear-gradient(90deg, #D4AF37, transparent)" }}
          />
        </div>

        {/* Main Card — gold border only, no box-shadow */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              padding: "1px",
              background:
                "linear-gradient(90deg, rgba(212,175,55,0.35), transparent 40%, transparent 60%, rgba(240,208,96,0.25))",
              backgroundSize: "200% auto",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              animation: "borderSweep 6s linear infinite",
            }}
          />

          <div className="relative rounded-2xl p-5 sm:p-8 md:p-10 border border-[#D4AF37]/15 bg-[#171717]/40">
            <CornerAccent position="top-left" />
            <CornerAccent position="top-right" />
            <CornerAccent position="bottom-left" />
            <CornerAccent position="bottom-right" />

            <motion.p
              {...revealLine(0.35)}
              className="text-sm sm:text-base md:text-lg text-[#A3A3A3] leading-[1.7] sm:leading-[1.8] mb-4 sm:mb-5"
            >
              I'm{" "}
              <span className="text-[#FFFFFF] font-semibold">Omkar Nilkanth Jadhav</span>
              , a Computer Science undergraduate from Pune, Maharashtra, and a
              results-driven Full Stack Developer. I specialize in building
              secure, scalable web applications using the MERN stack and
              PostgreSQL/MySQL — turning complex problems into clean, functional,
              production-grade software.
            </motion.p>

            <motion.p
              {...revealLine(0.45)}
              className="text-sm sm:text-base md:text-lg text-[#A3A3A3] leading-[1.7] sm:leading-[1.8]"
            >
              My expertise spans React.js, Node.js, Express.js, and SQL, backed by
              a strong foundation in data structures, algorithms, and software
              engineering best practices. Across two internships and 6+ full stack
              and frontend projects, I've built authentication systems with JWT,
              OAuth 2.0, Email OTP, and bcrypt, designed RESTful APIs, and shipped
              responsive UIs — and I enjoy owning the full cycle of software
              creation.
            </motion.p>

            <AnimatedDivider delay={0.6} />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4"
            >
              {stats.map((stat, i) => (
                <StatCard key={stat.label} {...stat} index={i} loading={statsLoading} />
              ))}
            </motion.div>

            <AnimatedDivider delay={0.8} />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <h3 className="text-[10px] sm:text-xs font-medium tracking-[0.12em] sm:tracking-[0.18em] text-[#A3A3A3] uppercase whitespace-nowrap">
                  Tech Stack
                </h3>
                <div
                  className="flex-1 h-px"
                  style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.15), transparent)" }}
                />
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {STACK.map((skill, i) => (
                  <SkillTag key={skill.name} {...skill} index={i} />
                ))}
              </div>
            </motion.div>

            <AnimatedDivider delay={1.0} />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
            >
              <Link to="/contact" className="w-full sm:w-auto">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="group relative flex sm:inline-flex items-center justify-center w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#D4AF37] text-[#0A0A0A] font-display font-semibold text-sm overflow-hidden cursor-pointer"
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)",
                      backgroundSize: "200% 100%",
                      animation: "borderSweep 1.5s linear infinite",
                    }}
                  />
                  <span className="relative z-10">Get In Touch</span>
                </motion.span>
              </Link>

              <Link to="/projects" className="w-full sm:w-auto">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="flex sm:inline-flex items-center justify-center w-full sm:w-auto px-7 py-3.5 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] font-display font-semibold text-sm text-[#FFFFFF] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/[0.06] transition-all duration-300 cursor-pointer"
                >
                  View Projects
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}