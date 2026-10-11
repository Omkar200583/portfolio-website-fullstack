import React, { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

import Hero from "../../components/hero/Hero";
import About from "../About/About";
import Skills from "../Skills/Skills";
import Projects from "../Projects/Projects";
import Research from "../Research/Research";
import Experience from "../Experience/Experience";
import Contact from "../Contact/Contact";


import useMotionDistance from "../../animations/useMotionDistance";
import { EASE } from "../../animations/variants";

const SECTION_PADDING =
  "py-8 sm:py-10 md:py-14 px-4 sm:px-8 md:px-16";

export function SectionTransition({
  children,
  id,
  className = "",
  delay = 0,
  alternateBg = false,
  isLast = false,
}) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.08,
    margin: "0px 0px -40px 0px",
  });

  const reduceMotion = useReducedMotion();
  const motionDistance = useMotionDistance();

  const visible = reduceMotion || isInView;

  return (
    <section
      id={id}
      ref={ref}
      className={[
        "relative isolate w-full",
        "overflow-x-clip",
        className,
      ].join(" ")}
      style={{
        paddingBottom: isLast ? 32 : undefined,
        scrollMarginTop: "80px",
      }}
    >
      {alternateBg && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "color-mix(in srgb, var(--bg-secondary) 45%, transparent)",
          }}
        />
      )}

      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 12%, transparent), transparent)",
        }}
      />

      <motion.div
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: motionDistance * 0.35,
              }
        }
        animate={
          visible
            ? {
                opacity: 1,
                y: 0,
              }
            : {
                opacity: 0,
                y: motionDistance * 0.35,
              }
        }
        transition={{
          duration: reduceMotion ? 0 : 0.65,
          delay: reduceMotion ? 0 : delay,
          ease: EASE,
        }}
        className="relative z-10 w-full"
      >
        {children}
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="relative w-full overflow-x-clip bg-[var(--bg)] text-[var(--text)]">


      <section
        id="home"
        className="relative w-full"
        style={{
          scrollMarginTop: "80px",
        }}
      >
        <Hero />
      </section>

      <SectionTransition
        id="about"
        className={SECTION_PADDING}
      >
        <About />
      </SectionTransition>

      <SectionTransition
        id="skills"
        className={SECTION_PADDING}
        delay={0.05}
        alternateBg
      >
        <Skills />
      </SectionTransition>

      <SectionTransition
        id="projects"
        className={SECTION_PADDING}
        delay={0.05}
      >
        <Projects />
      </SectionTransition>

      <SectionTransition
        id="research"
        className={SECTION_PADDING}
        delay={0.05}
        alternateBg
      >
        <Research />
      </SectionTransition>

      <SectionTransition
        id="experience"
        className={SECTION_PADDING}
        delay={0.05}
      >
        <Experience />
      </SectionTransition>

      <SectionTransition
        id="contact"
        className={SECTION_PADDING}
        delay={0.05}
        alternateBg
        isLast
      >
        <Contact />
      </SectionTransition>
    </main>
  );
}