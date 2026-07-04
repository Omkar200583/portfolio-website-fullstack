// ═══════════════════════════════════════════════════════════════
//  ABOUT — Premium Black & Gold (Enhanced Animations)
//  Location: src/pages/About/About.jsx
// ═══════════════════════════════════════════════════════════════
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";

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

const STATS = [
  { value: "6+", label: "Projects Shipped" },
  { value: "2", label: "Internships" },
  { value: "4+", label: "Tech Stacks" },
  { value: "100%", label: "Ownership" },
];

/* ─── Floating Particle ─── */
function Particle({ delay, x, y, size, duration, opacity }) {
  return (
    <span
      className="absolute rounded-full pointer-events-none"
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

/* ─── Animated Corner Accent ─── */
function CornerAccent({ position }) {
  const styles = {
    "top-left": {
      top: "-1px", left: "-1px",
      borderTop: "2px solid #D4AF37",
      borderLeft: "2px solid #D4AF37",
      borderTopLeftRadius: "16px",
      width: "48px", height: "48px",
    },
    "top-right": {
      top: "-1px", right: "-1px",
      borderTop: "2px solid #D4AF37",
      borderRight: "2px solid #D4AF37",
      borderTopRightRadius: "16px",
      width: "48px", height: "48px",
    },
    "bottom-left": {
      bottom: "-1px", left: "-1px",
      borderBottom: "2px solid #D4AF37",
      borderLeft: "2px solid #D4AF37",
      borderBottomLeftRadius: "16px",
      width: "48px", height: "48px",
    },
    "bottom-right": {
      bottom: "-1px", right: "-1px",
      borderBottom: "2px solid #D4AF37",
      borderRight: "2px solid #D4AF37",
      borderBottomRightRadius: "16px",
      width: "48px", height: "48px",
    },
  };
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute"
      style={styles[position]}
    />
  );
}

/* ─── Skill Tag with Progress ─── */
function SkillTag({ name, level, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden rounded-full px-4 py-2 border transition-all duration-400 cursor-default"
        style={{
          borderColor: "rgba(212,175,55,0.15)",
          background: "rgba(212,175,55,0.04)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)";
          e.currentTarget.style.background = "rgba(212,175,55,0.1)";
          e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)";
          e.currentTarget.style.background = "rgba(212,175,55,0.04)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span
          className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
          style={{
            background: "linear-gradient(90deg, rgba(212,175,55,0.12), rgba(240,208,96,0.06))",
            width: isInView ? `${level}%` : "0%",
          }}
        />
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-xs font-mono text-[#F0D060]">{name}</span>
          <span className="text-[10px] font-mono text-[#D4AF37]/50 tabular-nums">
            {isInView ? `${level}%` : "—"}
          </span>
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ value, label, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.55,
        delay: 0.5 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative group"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-5 text-center border transition-all duration-400"
        style={{
          borderColor: "rgba(212,175,55,0.08)",
          background: "rgba(23,23,23,0.5)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)";
          e.currentTarget.style.background = "rgba(212,175,55,0.05)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(212,175,55,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(212,175,55,0.08)";
          e.currentTarget.style.background = "rgba(23,23,23,0.5)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] transition-all duration-500 group-hover:w-full w-0"
          style={{
            background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
          }}
        />
        <div
          className="text-3xl sm:text-4xl font-display font-bold mb-1"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #F0D060)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {value}
        </div>
        <div className="text-[11px] tracking-[0.15em] text-[#737373] uppercase font-medium">
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
    <div ref={ref} className="relative w-full h-px my-8 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)",
        }}
      />
      <motion.div
        className="absolute top-0 left-0 h-full"
        style={{
          width: "80px",
          background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
          boxShadow: "0 0 12px rgba(212,175,55,0.4)",
        }}
        initial={{ x: "-80px" }}
        animate={isInView ? { x: "calc(100% + 80px)" } : { x: "-80px" }}
        transition={{
          duration: 1.8,
          delay: delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ABOUT COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const scrollY = useMotionValue(0);
  const glowOffset = useTransform(scrollY, [0, 600], [0, -60]);
  const glowSpring = useSpring(glowOffset, { stiffness: 80, damping: 30 });

  useEffect(() => {
    const onScroll = () => scrollY.set(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollY]);

  const particles = [
    { delay: 0, x: 5, y: 10, size: 4, duration: 7, opacity: 0.5 },
    { delay: 1.2, x: 92, y: 15, size: 3, duration: 9, opacity: 0.4 },
    { delay: 0.6, x: 15, y: 80, size: 5, duration: 8, opacity: 0.35 },
    { delay: 2.0, x: 88, y: 75, size: 3, duration: 11, opacity: 0.45 },
    { delay: 0.3, x: 50, y: 5, size: 4, duration: 10, opacity: 0.3 },
    { delay: 1.8, x: 3, y: 45, size: 3, duration: 12, opacity: 0.4 },
    { delay: 0.9, x: 96, y: 50, size: 4, duration: 8.5, opacity: 0.35 },
    { delay: 2.5, x: 40, y: 95, size: 3, duration: 9.5, opacity: 0.4 },
    { delay: 1.5, x: 70, y: 8, size: 5, duration: 7.5, opacity: 0.3 },
    { delay: 0.4, x: 25, y: 35, size: 2, duration: 13, opacity: 0.5 },
    { delay: 2.2, x: 78, y: 60, size: 3, duration: 10.5, opacity: 0.35 },
    { delay: 1.0, x: 60, y: 88, size: 4, duration: 8, opacity: 0.3 },
  ];

  const revealLine = (delay = 0) => ({
    initial: { opacity: 0, y: 18, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true },
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0A0A0A] text-[#FFFFFF] min-h-screen flex items-center py-28 px-4 sm:px-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
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

        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          25% { transform: translateY(-20px) translateX(8px) scale(1.2); }
          50% { transform: translateY(-35px) translateX(-5px) scale(0.8); opacity: 0.2; }
          75% { transform: translateY(-15px) translateX(12px) scale(1.1); }
        }

        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }

        @keyframes borderSweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .grid-pulse { animation: gridPulse 8s ease-in-out infinite; }
      `}</style>

      {/* ── Background Layers ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0D0D0D]" />

      <motion.div
        className="absolute w-[560px] h-[560px] rounded-full bg-[#D4AF37]/[0.06] blur-[140px] glow-float"
        style={{ top: "-10%", right: "-5%", y: glowSpring }}
      />
      <motion.div
        className="absolute w-[480px] h-[480px] rounded-full bg-[#F0D060]/[0.04] blur-[130px] glow-float-2"
        style={{ bottom: "-15%", left: "-10%", y: glowSpring }}
      />

      <div
        className="absolute inset-0 grid-pulse"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* ── Main Content ── */}
      <div className="relative z-10 container mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-14">
          <motion.span
            {...revealLine(0)}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] backdrop-blur-sm text-xs font-medium tracking-[0.18em] text-[#A3A3A3] uppercase mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            About Me
          </motion.span>

          <motion.h2
            {...revealLine(0.1)}
            className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF]"
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
            className="h-[2px] mt-5 rounded-full"
            style={{
              background: "linear-gradient(90deg, #D4AF37, transparent)",
            }}
          />
        </div>

        {/* ── Main Card ── */}
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
                "linear-gradient(var(--border-angle, 0deg), rgba(212,175,55,0.3), transparent 40%, transparent 60%, rgba(240,208,96,0.2))",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              animation: "borderSweep 6s linear infinite",
              backgroundSize: "200% auto",
            }}
          />

          <div
            className="relative rounded-2xl p-8 md:p-12 border border-[#D4AF37]/10 bg-[#171717]/40 backdrop-blur-xl"
            style={{
              boxShadow:
                "0 20px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.03)",
            }}
          >
            <CornerAccent position="top-left" />
            <CornerAccent position="top-right" />
            <CornerAccent position="bottom-left" />
            <CornerAccent position="bottom-right" />

            <motion.p
              {...revealLine(0.35)}
              className="text-base sm:text-lg text-[#A3A3A3] leading-[1.8] mb-5"
            >
              I'm{" "}
              <span className="text-[#FFFFFF] font-semibold">
                Omkar Nilkanth Jadhav
              </span>
              , a Computer Science undergraduate from Pune, Maharashtra, and a
              results-driven Full Stack Developer. I specialize in building
              secure, scalable web applications using the MERN stack and
              PostgreSQL/MySQL — turning complex problems into clean, functional,
              production-grade software.
            </motion.p>

            <motion.p
              {...revealLine(0.45)}
              className="text-base sm:text-lg text-[#A3A3A3] leading-[1.8] mb-2"
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
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-2"
            >
              {STATS.map((stat, i) => (
                <StatCard key={stat.label} {...stat} index={i} />
              ))}
            </motion.div>

            <AnimatedDivider delay={0.8} />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <h3 className="text-xs font-medium tracking-[0.18em] text-[#A3A3A3] uppercase">
                  Tech Stack
                </h3>
                <div
                  className="flex-1 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(212,175,55,0.15), transparent)",
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {STACK.map((skill, i) => (
                  <SkillTag key={skill.name} {...skill} index={i} />
                ))}
              </div>
            </motion.div>

            <AnimatedDivider delay={1.0} />

            {/* ✅ FIXED: Using Link from react-router-dom instead of href="#" */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/contact">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="group relative inline-block px-7 py-3.5 rounded-xl bg-[#D4AF37] text-[#0A0A0A] font-display font-semibold text-sm overflow-hidden cursor-pointer"
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

              <Link to="/projects">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="inline-block px-7 py-3.5 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] font-display font-semibold text-sm text-[#FFFFFF] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/[0.06] transition-all duration-300 cursor-pointer"
                >
                  View Projects
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
