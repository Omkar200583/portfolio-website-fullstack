// ═══════════════════════════════════════════════════════════════
//  HERO — Premium Black & Gold (Enhanced Profile Circle)
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, ArrowRight, Download, Square } from "lucide-react";
import ResumeModal from "../ResumeModal/ResumeModal";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const NAME = "Omkar Nilkanth Jadhav";
const ROLE = "Full Stack Developer | Software Engineer | MERN Specialist";

const SUMMARY =
  "Results-driven Computer Science graduate specializing in secure backend systems and scalable full stack applications. Experienced in building production-grade REST APIs with Node.js and Express, implementing JWT and OAuth 2.0 authentication, and designing efficient PostgreSQL, MySQL, and MongoDB data layers — backed by hands-on internship and project experience across the MERN stack.";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Orbiting Dot Component ─── */
function OrbitDot({
  size = 6,
  duration = 12,
  delay = 0,
  radius,
  color = "#D4AF37",
  containerSize,
}) {
  const r = radius ?? containerSize * 0.5;
  return (
    <span
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}40`,
        top: "50%",
        left: "50%",
        marginTop: -size / 2,
        marginLeft: -size / 2,
        animation: `orbitSpin ${duration}s linear ${delay}s infinite`,
        "--orbit-r": `${r}px`,
      }}
    />
  );
}

/* ─── Sparkle Component ─── */
function Sparkle({
  x,
  y,
  delay,
  duration = 3,
  size = 4,
  color = "#D4AF37",
}) {
  return (
    <span
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: color,
        borderRadius: "50%",
        boxShadow: `0 0 6px ${color}, 0 0 12px ${color}50`,
        animation: `sparklePulse ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

/* ─── Enhanced Profile Circle ─── */
function ProfileCircle({ src, alt }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ w: rect.width, h: rect.height });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  const sparkles = [
    { x: 8, y: 15, delay: 0, size: 3, color: "#D4AF37" },
    { x: 92, y: 20, delay: 0.8, size: 4, color: "#F0D060" },
    { x: 15, y: 85, delay: 1.6, size: 3, color: "#E8C847" },
    { x: 88, y: 80, delay: 0.4, size: 5, color: "#D4AF37" },
    { x: 50, y: 5, delay: 2.0, size: 3, color: "#F5E08A" },
    { x: 3, y: 50, delay: 1.2, size: 4, color: "#D4AF37" },
    { x: 97, y: 50, delay: 0.6, size: 3, color: "#F0D060" },
    { x: 40, y: 96, delay: 1.8, size: 4, color: "#E8C847" },
    { x: 70, y: 3, delay: 2.4, size: 3, color: "#D4AF37" },
    { x: 25, y: 40, delay: 0.2, size: 2, color: "#F5E08A" },
    { x: 78, y: 60, delay: 1.0, size: 2, color: "#D4AF37" },
    { x: 35, y: 12, delay: 2.8, size: 3, color: "#F0D060" },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-[280px] sm:w-[340px] lg:w-[400px] aspect-square"
      style={{ perspective: "800px" }}
    >
      <style>{`
        /* ── Orbit Spin ── */
        @keyframes orbitSpin {
          from { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
        }

        /* ── Sparkle Pulse ── */
        @keyframes sparklePulse {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          50%      { opacity: 1; transform: scale(1); }
        }

        /* ── Gradient Border Rotation ── */
        @keyframes borderRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── Soft Glow Breathing ── */
        @keyframes glowBreathe {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.65; transform: scale(1.04); }
        }

        /* ── Inner Ring Pulse ── */
        @keyframes innerRingPulse {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 0.55; }
        }

        /* ── Second Glow Drift ── */
        @keyframes glowDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(12px, -18px) scale(1.06); }
          66%      { transform: translate(-10px, 14px) scale(0.97); }
        }

        /* ── Color Shift on Border ── */
        @keyframes colorShift {
          0%   { filter: hue-rotate(0deg); }
          50%  { filter: hue-rotate(15deg); }
          100% { filter: hue-rotate(0deg); }
        }

        .border-rotate       { animation: borderRotate 8s linear infinite; }
        .border-rotate-rev   { animation: borderRotate 12s linear infinite reverse; }
        .glow-breathe        { animation: glowBreathe 5s ease-in-out infinite; }
        .glow-drift          { animation: glowDrift 10s ease-in-out infinite; }
        .inner-ring-pulse    { animation: innerRingPulse 4s ease-in-out infinite; }
        .color-shift         { animation: colorShift 6s ease-in-out infinite; }
      `}</style>

      {/* ═══ DEEPEST BACKGROUND GLOW ═══ */}
      <div
        className="absolute rounded-full glow-breathe color-shift"
        style={{
          inset: "-18%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(240,208,96,0.08) 40%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* ═══ SECOND GLOW LAYER (drifting) ═══ */}
      <div
        className="absolute rounded-full glow-drift"
        style={{
          inset: "-12%",
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(212,175,55,0.12) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      {/* ═══ SPARKLE PARTICLES ═══ */}
      {sparkles.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}

      {/* ═══ OUTER ORBIT RING — Rotating Gradient Border ═══ */}
      <div
        className="absolute rounded-full border-rotate color-shift"
        style={{
          inset: "-4.5%",
          padding: "3px",
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg, #D4AF37, #F5E08A, #D4AF37, #B8941F, #F0D060, #D4AF37, transparent 80%, #D4AF37)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: 0.7,
        }}
      />

      {/* ═══ MIDDLE ORBIT RING — Reverse rotation, thinner ═══ */}
      <div
        className="absolute rounded-full border-rotate-rev"
        style={{
          inset: "-2.5%",
          padding: "1.5px",
          borderRadius: "50%",
          background:
            "conic-gradient(from 120deg, transparent 20%, #F0D060 40%, #D4AF37 50%, transparent 60%, transparent 80%, #E8C847 90%, transparent)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: 0.4,
        }}
      />

      {/* ═══ INNER RING PULSE ═══ */}
      <div
        className="absolute rounded-full inner-ring-pulse"
        style={{
          inset: "-1.5%",
          border: "1px solid rgba(212,175,55,0.3)",
        }}
      />

      {/* ═══ ORBITING DOTS ═══ */}
      <OrbitDot
        size={7}
        duration={10}
        delay={0}
        radius={dimensions.w * 0.52}
        color="#D4AF37"
        containerSize={dimensions.w}
      />
      <OrbitDot
        size={5}
        duration={14}
        delay={-5}
        radius={dimensions.w * 0.54}
        color="#F0D060"
        containerSize={dimensions.w}
      />
      <OrbitDot
        size={4}
        duration={18}
        delay={-9}
        radius={dimensions.w * 0.50}
        color="#E8C847"
        containerSize={dimensions.w}
      />
      <OrbitDot
        size={3}
        duration={22}
        delay={-3}
        radius={dimensions.w * 0.56}
        color="#F5E08A"
        containerSize={dimensions.w}
      />

      {/* ═══ MAIN IMAGE CIRCLE ═══ */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{
          border: "2px solid rgba(212,175,55,0.25)",
          boxShadow: `
            0 0 0 1px rgba(212,175,55,0.08),
            0 25px 60px -15px rgba(0,0,0,0.8),
            0 0 80px -20px rgba(212,175,55,0.2),
            inset 0 0 60px -30px rgba(212,175,55,0.1)
          `,
          transformStyle: "preserve-3d",
          rotateY: mousePos.x * 8,
          rotateX: -mousePos.y * 8,
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Image */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top"
          style={{
            transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            transform: `scale(${1 + Math.abs(mousePos.x) * 0.03 + Math.abs(mousePos.y) * 0.03})`,
          }}
        />

        {/* Overlay gradients */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at ${50 + mousePos.x * 20}% ${50 + mousePos.y * 20}%, rgba(212,175,55,0.12) 0%, transparent 50%),
              linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 35%),
              linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, transparent 25%)
            `,
            transition: "background 0.4s ease",
          }}
        />

        {/* Inner rim light */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: "inset 0 0 40px -15px rgba(212,175,55,0.15)",
          }}
        />
      </motion.div>

      {/* ═══ FLOATING CREDENTIAL CHIP ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <div
          className="px-5 py-2.5 rounded-2xl flex items-center gap-2.5 whitespace-nowrap"
          style={{
            background: "rgba(23,23,23,0.92)",
            backdropFilter: "blur(16px) saturate(1.4)",
            WebkitBackdropFilter: "blur(16px) saturate(1.4)",
            border: "1px solid rgba(212,175,55,0.15)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.05)",
          }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-60 animate-ping" />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #F0D060)",
                boxShadow: "0 0 8px rgba(212,175,55,0.6)",
              }}
            />
          </span>
          <span className="text-xs font-semibold text-[#FFFFFF] tracking-wide">
            Open to Work
          </span>
          <span
            className="w-px h-3.5"
            style={{ background: "rgba(212,175,55,0.2)" }}
          />
          <span className="text-[11px] text-[#A3A3A3] font-mono tracking-wider">
            2026
          </span>
        </div>
      </motion.div>

      {/* ═══ TOP FLOATING TECH CHIP ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-4 sm:-top-5 right-2 sm:right-4 z-20"
      >
        <div
          className="px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap"
          style={{
            background: "rgba(23,23,23,0.88)",
            backdropFilter: "blur(14px) saturate(1.3)",
            WebkitBackdropFilter: "blur(14px) saturate(1.3)",
            border: "1px solid rgba(212,175,55,0.12)",
            boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
          }}
        >
          <span
            className="text-sm"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #F0D060)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}
          >
            {"</>"}
          </span>
          <span className="text-[11px] text-[#CCCCCC] font-medium">
            MERN Stack
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN HERO COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Hero() {
  // const [speaking, setSpeaking] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  // const handleSpeak = () => {
  //   if (!("speechSynthesis" in window)) return;
  //   window.speechSynthesis.cancel();
  //   if (speaking) {
  //     setSpeaking(false);
  //     return;
  //   }
  //   const utter = new SpeechSynthesisUtterance(SUMMARY);
  //   utter.onstart = () => setSpeaking(true);
  //   utter.onend = () => setSpeaking(false);
  //   window.speechSynthesis.speak(utter);
  // };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] text-[#FFFFFF] flex items-center font-[Inter]">
      <style>{`
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
      `}</style>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0D0D0D]" />

      {/* Ambient gold glow blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[560px] h-[560px] rounded-full bg-[#D4AF37]/[0.06] blur-[140px] glow-float" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-[#F0D060]/[0.04] blur-[130px] glow-float-2" />

      <div className="relative z-10 container mx-auto px-6 sm:px-10 lg:px-16 py-24 grid lg:grid-cols-[1.15fr_1fr] gap-14 lg:gap-20 items-center max-w-7xl">
        {/* LEFT — Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-7"
        >
          {/* Status badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
            </span>
            <span className="text-xs font-medium tracking-[0.18em] text-[#A3A3A3] uppercase">
              Available for full-time / freelance
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-bold tracking-tight text-5xl sm:text-6xl lg:text-[4.25rem] leading-[1.05] text-[#FFFFFF]"
          >
            {NAME}
          </motion.h1>

          {/* Role */}
          <motion.p
            variants={itemVariants}
            className="font-display font-semibold text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-[#D4AF37] via-[#E8C847] to-[#F0D060] bg-clip-text text-transparent"
          >
            {ROLE}
          </motion.p>

          {/* Summary */}
          <motion.p
            variants={itemVariants}
            className="text-[#A3A3A3] text-base sm:text-lg leading-relaxed max-w-xl"
          >
            {SUMMARY}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 pt-2"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="group px-6 py-3.5 rounded-xl bg-[#D4AF37] text-[#0A0A0A] font-display font-semibold text-sm flex items-center gap-2 shadow-[0_0_0_0_rgba(212,175,55,0)] hover:shadow-[0_0_32px_rgba(212,175,55,0.4)] transition-shadow duration-300"
            >
              View Projects
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.a>

            <motion.button
              onClick={() => setResumeOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="px-6 py-3.5 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] font-display font-semibold text-sm text-[#FFFFFF] flex items-center gap-2 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/[0.06] transition-all duration-300"
            >
              <Download size={16} />
              Download Resume
            </motion.button>

            {/* <motion.button
              onClick={handleSpeak}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="px-6 py-3.5 rounded-xl border border-[#F0D060]/15 bg-[#F0D060]/[0.03] font-display font-semibold text-sm text-[#FFFFFF] flex items-center gap-2 hover:border-[#F0D060]/50 hover:text-[#F0D060] hover:bg-[#F0D060]/[0.06] transition-all duration-300"
            >
              {speaking ? (
                <Square size={15} className="fill-current" />
              ) : (
                <Volume2 size={16} />
              )}
              {speaking ? "Stop" : "Listen Intro"}
            </motion.button> */}


          </motion.div>

          {/* Social links */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-6 pt-3"
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#A3A3A3] text-sm font-medium hover:text-[#D4AF37] transition-colors duration-250"
            >
              <FaGithub size={30} />
              GitHub
            </a>
            <span className="w-px h-4 bg-[#D4AF37]/15" />
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#A3A3A3] text-sm font-medium hover:text-[#D4AF37] transition-colors duration-250"
            >
              <FaLinkedin size={30} />
              LinkedIn
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT — Enhanced Profile Circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2,
          }}
          className="flex justify-center lg:justify-end"
        >
          <ProfileCircle src="/images/Photo.png" alt={NAME} />
        </motion.div>
      </div>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  );
}