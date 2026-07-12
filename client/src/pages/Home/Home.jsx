// ═══════════════════════════════════════════════════════════════
//  HOME — Mobile Responsive Fixes Applied
// ═══════════════════════════════════════════════════════════════
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import Hero from "../../components/hero/Hero";
import About from "../About/About";
import Skills from "../Skills/Skills";
import Projects from "../Projects/Projects";
import Experience from "../Experience/Experience";
import Contact from "../Contact/Contact";

/* ─── SectionTransition — built right here ─── */
function SectionTransition({
  children,
  id,
  className = "",
  delay = 0,
  alternateBg = false,
  isLast = false, // New prop to add bottom spacing
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    // FIX: overflow-x-hidden as a per-section safety net so any absolutely
    // positioned glow/chip inside a child section can't create horizontal
    // scroll on mobile.
    <section
      id={id}
      ref={ref}
      className={`relative w-full overflow-x-hidden ${className}`}
      style={{
        paddingBottom: isLast ? "80px" : undefined, // Extra space before footer (reduced for mobile)
        marginBottom: isLast ? "-24px" : undefined,
      }}
    >
      {/* Alternate background tint */}
      {alternateBg && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(23,23,23,0.2)" }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay }}
        />
      )}

      {/* Top fade line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.08), transparent)",
        }}
      />

      {/* Content with reveal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{
          duration: 0.6,
          delay: delay + 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Scroll-triggered corner glow — smaller on mobile */}
      <motion.div
        className="absolute -top-20 -right-20 w-24 h-24 sm:w-40 sm:h-40 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%)",
          filter: "blur(20px)",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 1, delay: delay + 0.3 }}
      />
    </section>
  );
}

/* ─── Home Page ─── */
const Home = () => {
  return (
    // FIX: global overflow-x-hidden safety net at the page root
    <div className="bg-[#0A0A0A] text-[#FFFFFF] overflow-x-hidden">
      {/* Hero — no wrapper, it has its own min-h-screen */}
      <section id="home" className="relative w-full min-h-screen">
        <Hero />
      </section>

      {/* About — reduced horizontal/vertical padding on mobile */}
      <SectionTransition
        id="about"
        className="py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16"
        delay={0}
      >
        <About />
      </SectionTransition>

      {/* Skills — alternate bg */}
      <SectionTransition
        id="skills"
        className="py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16"
        delay={0.05}
        alternateBg
      >
        <Skills />
      </SectionTransition>

      {/* Projects */}
      <SectionTransition
        id="projects"
        className="py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16"
        delay={0.05}
      >
        <Projects />
      </SectionTransition>

      {/* Experience — alternate bg */}
      <SectionTransition
        id="experience"
        className="py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16"
        delay={0.05}
        alternateBg
      >
        <Experience />
      </SectionTransition>

      {/* Contact — isLast adds extra bottom spacing */}
      <SectionTransition
        id="contact"
        className="py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16"
        delay={0.05}
        isLast={true}
      >
        <Contact />
      </SectionTransition>
    </div>
  );
};

export default Home;