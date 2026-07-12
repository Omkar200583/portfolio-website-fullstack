// ═══════════════════════════════════════════════════════════════
//  HERO — Premium Black & Gold (PERFECTLY CENTERED IMAGE & ORBITS)
//  ✅ Fixed: Image centering, orbit alignment, responsive sizing
//  ✅ Fixed: overflow-hidden on section so bleeding glow blobs no
//     longer inflate page scroll height (was causing "extra scroll
//     needed" on every page that includes Hero)
//  ✅ Fixed: GitHub/LinkedIn links now point to real profiles
//     (previously "https://github.com" / "https://linkedin.com",
//     mismatched with the correct links used in Contact.jsx)
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, ArrowRight, Download, Square } from "lucide-react";
import ResumeModal from "../ResumeModal/ResumeModal";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { smoothScrollToElement } from "../../utils/smoothScroll.js";

const NAME = "Omkar Nilkanth Jadhav";
const ROLE = "Full Stack Developer | Software Engineer | MERN Specialist";
const GITHUB_URL = "https://github.com/Omkar200583";
const LINKEDIN_URL = "https://linkedin.com/in/omkar-jadhav-6915052a1";

const SUMMARY =
  "Results-driven Computer Science graduate specializing in secure backend systems and scalable full stack applications. Experienced in building production-grade REST APIs with Node.js and Express, implementing JWT and OAuth 2.0 authentication, and designing efficient PostgreSQL, MySQL, and MongoDB data layers — backed by hands-on internship and project experience across the MERN stack.";

// ═══════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
      duration: 0.6
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.2,
    },
  },
};

// ═══════════════════════════════════════════════════════════════
// ORBITING DOT COMPONENT (PERFECTLY CENTERED)
// ═══════════════════════════════════════════════════════════════
function OrbitDot({
  size = 6,
  duration = 12,
  delay = 0,
  radius,
  color = "#D4AF37",
}) {
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
        "--orbit-r": `${radius}px`,
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// SPARKLE COMPONENT
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// PROFILE CIRCLE WITH PERFECT IMAGE CENTERING
// ═══════════════════════════════════════════════════════════════
function ProfileCircle({ src, alt }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Use the smaller dimension to ensure square
        const size = Math.min(rect.width, rect.height);
        setContainerSize(size);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    const timer = setTimeout(updateSize, 150);

    return () => {
      window.removeEventListener("resize", updateSize);
      clearTimeout(timer);
    };
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

  // ✅ Calculate orbit radii based on container size
  const orbitRadii = containerSize > 0 ? {

      orbit1: containerSize * 0.40,
      orbit2: containerSize * 0.43,
      orbit3: containerSize * 0.37,
      orbit4: containerSize * 0.46,

  } : { orbit1: 0, orbit2: 0, orbit3: 0, orbit4: 0 };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-[clamp(350px,80vw,430px)] aspect-square mx-auto flex items-center justify-center"
      style={{ perspective: "600px" }}
    >
      <style>{`
        @keyframes orbitSpin {
          from {
            transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg);
          }
        }

        @keyframes sparklePulse {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          50%      { opacity: 1; transform: scale(1); }
        }

        @keyframes borderRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes glowBreathe {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.65; transform: scale(1.04); }
        }

        @keyframes innerRingPulse {
          0%, 100% { opacity: 0.25; }
          50%      { opacity: 0.55; }
        }

        @keyframes glowDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(12px, -18px) scale(1.06); }
          66%      { transform: translate(-10px, 14px) scale(0.97); }
        }

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
          inset: "-12%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(240,208,96,0.08) 40%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* ═══ SECOND GLOW LAYER ═══ */}
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

      {/* ═══ OUTER ORBIT RING ═══ */}
      <div
        className="absolute rounded-full border-rotate color-shift"
        style={{
          inset: "-1.5%",
          padding: "4px",
          borderRadius: "100%",
          background:
            "conic-gradient(from 0deg, #D4AF37, #F5E08A, #D4AF37, #B8941F, #F0D060, #D4AF37, transparent 80%, #D4AF37)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: 0.7,
        }}
      />

      {/* ═══ MIDDLE ORBIT RING ═══ */}
      <div
        className="absolute rounded-full border-rotate-rev"
        style={{
          inset: "-0.8%",
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
          inset: "-0.9%",
          border: "1px solid rgba(212,175,55,0.3)",
        }}
      />

      {/* ═══ ORBITING DOTS (PERFECTLY CENTERED) ═══ */}
      {containerSize > 0 && (
        <div className="hidden xs:block sm:block absolute inset-0">
          {/* First orbit - largest, golden */}
          <OrbitDot
            size={7}
            duration={22}
            delay={0}
            radius={orbitRadii.orbit1}
            color="#D4AF37"
          />

          {/* Second orbit - medium, light gold */}
          <OrbitDot
            size={5}
            duration={26}
            delay={-7}
            radius={orbitRadii.orbit2}
            color="#F0D060"
          />

          {/* Third orbit - smaller, cream */}
          <OrbitDot
            size={4}
            duration={30}
            delay={-15}
            radius={orbitRadii.orbit3}
            color="#E8C847"
          />

          {/* Fourth orbit - tiny, pale gold */}
          <OrbitDot
            size={3}
            duration={34}
            delay={-4}
            radius={orbitRadii.orbit4}
            color="#F5E08A"
          />
        </div>
      )}

      {/* ═══ MAIN IMAGE CIRCLE (PERFECTLY CENTERED) ═══ */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center"
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
        {/* ═══ PROFILE IMAGE - PERFECTLY CENTERED & SCALED ═══ */}
        {!imageError ? (
  <img
    src={src}
    alt={alt}
    onLoad={() => setImageLoaded(true)}
    onError={() => setImageError(true)}
    className="w-full h-full rounded-full"
    style={{
      objectFit: "cover",        // Fills the circle edge-to-edge, no empty space
      objectPosition: "center 20%",  // Biases the crop toward the face/head
      opacity: imageLoaded ? 1 : 0.5,
      transition: "0.3s ease",
    }}
  />
) : (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#111111]">
            <div className="text-center">
              <div className="text-5xl">👤</div>
              <p className="text-xs text-[#A3A3A3] mt-2">
                Profile Photo
              </p>
              <p className="text-[10px] text-[#696969] mt-1 px-2 break-words">
                {src}
              </p>
            </div>
          </div>
        )}

        {/* Overlay gradients */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: `
              radial-gradient(circle at ${80 + mousePos.x * 30}% ${80 + mousePos.y * 30}%, rgba(212,175,55,0.12) 0%, transparent 20%),
              linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 35%),
              linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, transparent 25%)
            `,
            transition: "background 0.6s ease",
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
        transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 z-20 w-max max-w-[90%]"
      >
        <div
          className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl flex items-center gap-2 sm:gap-2.5 whitespace-nowrap"
          style={{
            background: "rgba(23,23,23,0.92)",
            backdropFilter: "blur(16px) saturate(1.4)",
            WebkitBackdropFilter: "blur(16px) saturate(1.4)",
            border: "1px solid rgba(212,175,55,0.15)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.05)",
          }}
        >
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-60 animate-ping" />
            <span
              className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #F0D060)",
                boxShadow: "0 0 8px rgba(212,175,55,0.6)",
              }}
            />
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-[#FFFFFF] tracking-wide">
            Open to Work
          </span>
          <span
            className="w-px h-3.5 shrink-0"
            style={{ background: "rgba(212,175,55,0.2)" }}
          />
          <span className="text-[10px] sm:text-[11px] text-[#A3A3A3] font-mono tracking-wider">
            2026
          </span>
        </div>
      </motion.div>

      {/* ═══ TOP FLOATING TECH CHIP ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-3 sm:-top-5 right-0 sm:right-4 z-20"
      >
        <div
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
          style={{
            background: "rgba(23,23,23,0.88)",
            backdropFilter: "blur(14px) saturate(1.3)",
            WebkitBackdropFilter: "blur(14px) saturate(1.3)",
            border: "1px solid rgba(212,175,55,0.12)",
            boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
          }}
        >
          <span
            className="text-xs sm:text-sm"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #F0D060)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}
          >
            {"</>"}
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#CCCCCC] font-medium">
            MERN Stack
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN HERO COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Hero() {
  const [resumeOpen, setResumeOpen] = useState(false);

  // ✅ CENTRALIZED IMAGE PATH - UPDATE THIS
  const profileImagePath = "/images/Photo.png";

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#0A0A0A] text-[#FFFFFF] flex items-center justify-center font-[Inter]">
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
      <div className="absolute top-[-5%] sm:top-[-10%] right-[-10%] sm:right-[-5%] w-[280px] sm:w-[560px] h-[280px] sm:h-[560px] rounded-full bg-[#D4AF37]/[0.06] blur-[80px] sm:blur-[140px] glow-float pointer-events-none" />
      <div className="absolute bottom-[-10%] sm:bottom-[-15%] left-[-15%] sm:left-[-10%] w-[240px] sm:w-[480px] h-[240px] sm:h-[480px] rounded-full bg-[#F0D060]/[0.04] blur-[70px] sm:blur-[130px] glow-float-2 pointer-events-none" />

      {/* Main Content Grid */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 sm:gap-12 lg:gap-20 items-center">
            {/* LEFT — Text Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5 sm:space-y-7 order-2 lg:order-1 text-center lg:text-left"
            >
              {/* Status Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] backdrop-blur-sm max-w-full mx-auto lg:mx-0"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-70 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]" />
                </span>
                <span className="text-[10px] sm:text-xs font-medium tracking-[0.08em] sm:tracking-[0.18em] text-[#A3A3A3] uppercase whitespace-normal">
                  Available for full-time / freelance
                </span>
              </motion.div>

              {/* Name */}
              <motion.h1
                variants={itemVariants}
                className="font-display font-bold tracking-tight text-3xl sm:text-5xl lg:text-6xl leading-tight lg:leading-[1.05] text-[#FFFFFF] break-words"
              >
                {NAME}
              </motion.h1>

              {/* Role */}
              <motion.p
                variants={itemVariants}
                className="font-display font-semibold text-lg sm:text-2xl lg:text-3xl bg-gradient-to-r from-[#D4AF37] via-[#E8C847] to-[#F0D060] bg-clip-text text-transparent"
              >
                {ROLE}
              </motion.p>

              {/* Summary */}
              <motion.p
                variants={itemVariants}
                className="text-[#A3A3A3] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                {SUMMARY}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 justify-center lg:justify-start"
              >
                <motion.a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("projects");
                    smoothScrollToElement(el, 72, 650);
                    window.history.pushState(null, "", "#projects");
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="group px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#D4AF37] text-[#0A0A0A] font-display font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_32px_rgba(212,175,55,0)] hover:shadow-[0_0_32px_rgba(212,175,55,0.4)] transition-shadow duration-300 w-full sm:w-auto"
                >
                  View Projects
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </motion.a>

                <motion.button
                  onClick={() => setResumeOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.03] font-display font-semibold text-sm sm:text-base text-[#FFFFFF] flex items-center justify-center gap-2 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/[0.08] transition-all duration-300 w-full sm:w-auto"
                >
                  <Download size={18} />
                  Download Resume
                </motion.button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center lg:justify-start gap-5 sm:gap-6 pt-3 sm:pt-4"
              >
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#A3A3A3] text-sm font-medium hover:text-[#D4AF37] transition-colors duration-250 group"
                >
                  <FaGithub size={26} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden xs:inline">GitHub</span>
                </a>
                <span className="w-px h-4 bg-[#D4AF37]/15" />
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#A3A3A3] text-sm font-medium hover:text-[#D4AF37] transition-colors duration-250 group"
                >
                  <FaLinkedin size={26} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden xs:inline">LinkedIn</span>
                </a>
              </motion.div>
            </motion.div>

            {/* RIGHT — Enhanced Profile Circle */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center items-center order-1 lg:order-2 mb-8 lg:mb-0"
            >
              <ProfileCircle src={profileImagePath} alt={NAME} />
            </motion.div>
          </div>
        </div>
      </div>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  );
}