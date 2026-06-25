// ═══════════════════════════════════════════════════════════════
//  MAIN LAYOUT — Clean & Simple Scroll Indicator
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import AIAssistant from "../pages/AIAssistant/AIAssistant";

import "../index.css";

/* ─── Section Data ─── */
const SECTIONS = [
  { id: "home", short: "H" },
  { id: "about", short: "A" },
  { id: "skills", short: "S" },
  { id: "projects", short: "P" },
  { id: "experience", short: "E" },
  { id: "contact", short: "C" },
];

/* ═══════════════════════════════════════════════════════════════
   1. SCROLL INDICATOR — Simple dots + thin progress line
   ═══════════════════════════════════════════════════════════════ */
function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredSection, setHoveredSection] = useState(null);
  const [visible, setVisible] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > 200);

      const scrollBottom = document.documentElement.scrollHeight - y - window.innerHeight;
      setNearBottom(scrollBottom < 200);

      const pos = y + window.innerHeight * 0.35;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= pos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && !nearBottom && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed right-5 top-1/2 -translate-y-1/2 z-[999] hidden lg:flex flex-col items-center gap-0"
        >
          {/* Track line */}
          <div className="relative w-px h-[280px]">
            {/* Background track */}
            <div className="absolute inset-0 bg-white/[0.06] rounded-full" />

            {/* Active progress */}
            <motion.div
              className="absolute top-0 left-0 w-px rounded-full bg-[#D4AF37]/40 origin-top"
              style={{ height: "100%", scaleY: smoothProgress }}
            />

            {/* Section dots */}
            {SECTIONS.map((section, i) => {
              const topPercent = (i / (SECTIONS.length - 1)) * 100;
              const isActive = activeSection === section.id;
              const isHovered = hoveredSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  onMouseEnter={() => setHoveredSection(section.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className="absolute left-1/2 -translate-x-1/2 outline-none cursor-pointer"
                  style={{ top: `${topPercent}%`, transform: "translate(-50%, -50%)" }}
                  aria-label={`Go to ${section.id}`}
                >
                  {/* Dot */}
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? 6 : 4,
                      height: isActive ? 6 : 4,
                      background: isActive ? "#D4AF37" : isHovered ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.15)",
                    }}
                  />

                  {/* Label on hover/active */}
                  <AnimatePresence>
                    {(isActive || isHovered) && (
                      <motion.span
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded"
                        style={{
                          color: isActive ? "#D4AF37" : "#737373",
                          background: "rgba(10,10,10,0.9)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {section.id}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. SCROLL PROGRESS — Thin line under navbar
   ═══════════════════════════════════════════════════════════════ */
function ScrollProgressMini() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-[64px] left-0 right-0 h-px z-[9998] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), rgba(212,175,55,0.5), rgba(212,175,55,0.3), transparent)",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. BACK TO TOP — Bottom-left button
   ═══════════════════════════════════════════════════════════════ */
function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0, rotate: 90 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 left-8 z-[999] w-10 h-10 rounded-full flex items-center justify-center group cursor-pointer outline-none transition-all duration-300"
          style={{
            background: "rgba(23,23,23,0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp
            size={14}
            className="text-[#D4AF37] transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LAYOUT
   ═══════════════════════════════════════════════════════════════ */
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans">
      <ScrollProgressMini />
      <ScrollIndicator />

      <Navbar />

      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      <BackToTop />
      <AIAssistant />
      <Footer />
    </div>
  );
};

export default MainLayout;