import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useScroll,
  useSpring,
} from "framer-motion";

import AIToolsDashboard from "../../pages/AIAssistant/AIToolsDashboard";

/* =========================
   NAVIGATION DATA
========================= */

const SECTION_LINKS = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Skills", id: "skills" },
  { name: "Projects", id: "projects" },
  { name: "Experience", id: "experience" },
  { name: "Contact", id: "contact" },
];

const PAGE_LINKS = [
  { name: "Research", path: "/research" },   // NEW ✅ — added Research
  { name: "Certificates", path: "/certificates" },
  { name: "Blog", path: "/blog" },
];

const ALL_NAV = [
  ...SECTION_LINKS.map((link) => ({ ...link, type: "section" })),
  ...PAGE_LINKS.map((link) => ({ ...link, type: "page" })),
];

const SOCIALS = [
  {
    icon: FaGithub,
    href: "https://github.com/Omkar200583",
    label: "GitHub",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/in/omkar-jadhav-6915052a1/",
    label: "LinkedIn",
  },
];

// Match actual rendered navbar height (h-16 = 64px mobile, lg:h-[72px] desktop)
const NAV_HEIGHT = 72;
const MAX_SCROLL_ATTEMPTS = 20;

/* =========================
   SCROLL TO SECTION
========================= */

function scrollToId(id) {
  const element = document.getElementById(id);

  if (!element) {
    return false;
  }

  const top =
    element.getBoundingClientRect().top +
    window.scrollY -
    NAV_HEIGHT;

  window.scrollTo({
    top,
    behavior: "smooth",
  });

  return true;
}

/* =========================
   MOBILE ANIMATION
========================= */

const mobileListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.06,
    },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================
   MENU ICON
========================= */

function MenuIcon({ isOpen }) {
  return (
    <span className="relative w-[18px] h-[14px] flex flex-col justify-between">
      <motion.span
        className="block h-[2px] w-full rounded-full bg-current origin-center"
        animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="block h-[2px] w-full rounded-full bg-current"
        animate={isOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="block h-[2px] w-full rounded-full bg-current origin-center"
        animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
}

/* =========================
   NAVBAR
========================= */

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [aiOpen, setAiOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const scrollAttemptsRef = useRef(0);

  /* =========================
     SCROLL PROGRESS
  ========================= */
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  /* =========================
     NAVBAR SCROLL EFFECT
  ========================= */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =========================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ========================= */
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  /* =========================
     ESCAPE KEY
  ========================= */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setAiOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* =========================
     LOCK BODY SCROLL
  ========================= */
  useEffect(() => {
    const shouldLockScroll = isOpen || aiOpen;
    document.body.style.overflow = shouldLockScroll ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, aiOpen]);

  /* =========================
     ACTIVE SECTION DETECTION
  ========================= */
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = SECTION_LINKS.map((link) => link.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries.filter(
          (entry) => entry.isIntersecting
        );

        if (visibleSections.length > 0) {
          visibleSections.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        threshold: 0.15,
        rootMargin: `-${NAV_HEIGHT}px 0px -45% 0px`,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  /* =========================
     SECTION CLICK — with safety against infinite loop
  ========================= */
  const handleSectionClick = (id) => {
    setIsOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      scrollAttemptsRef.current = 0;

      const tryScroll = () => {
        scrollAttemptsRef.current += 1;
        const success = scrollToId(id);

        if (!success && scrollAttemptsRef.current < MAX_SCROLL_ATTEMPTS) {
          requestAnimationFrame(tryScroll);
        }
      };

      setTimeout(tryScroll, 200);
    } else {
      scrollToId(id);
    }
  };

  /* =========================
     SOCIAL CLICK
  ========================= */
  const handleSocialClick = () => {
    setIsOpen(false);
  };

  /* =========================
     ACTIVE STATES
  ========================= */
  const isSectionActive = (id) => {
    return location.pathname === "/" && activeSection === id;
  };

  const isPageActive = (path) => location.pathname === path;

  /* =========================
     JSX
  ========================= */
  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-50 font-[Inter] transition-all duration-500 ${
          scrolled
            ? "bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-[#D4AF37]/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <style>{`
          .font-display {
            font-family: 'Space Grotesk', sans-serif;
          }

          @keyframes navGlowPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); }
            50% { box-shadow: 0 0 16px 2px rgba(212,175,55,0.15); }
          }

          .nav-ai-pulse {
            animation: navGlowPulse 3s ease-in-out infinite;
          }

          .nav-link-underline {
            position: absolute;
            left: 14px;
            right: 14px;
            bottom: 2px;
            height: 2px;
            border-radius: 2px;
            transform: scaleX(0);
            transform-origin: left;
            background: linear-gradient(90deg, rgba(212,175,55,0.5), rgba(240,208,96,0.5));
            transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          }

          .nav-link-hoverable:hover .nav-link-underline {
            transform: scaleX(1);
          }
        `}</style>

        <div className="container mx-auto max-w-8xl px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* LOGO */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link
                to="/"
                className="font-display font-bold text-lg sm:text-xl text-white tracking-tight"
              >
                OMKAR{" "}
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#F0D060] bg-clip-text text-transparent">
                  JADHAV
                </span>
              </Link>
            </motion.div>

            {/* DESKTOP NAVIGATION */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hidden lg:flex items-center gap-1"
            >
              <LayoutGroup>
                {SECTION_LINKS.map((link) => {
                  const active = isSectionActive(link.id);
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleSectionClick(link.id)}
                      className={`nav-link-hoverable relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-300 flex items-center bg-transparent border-none cursor-pointer ${
                        active
                          ? "text-[#D4AF37]"
                          : "text-[#A3A3A3] hover:text-white"
                      }`}
                    >
                      {link.name}
                      {!active && <span className="nav-link-underline" />}
                      {active && (
                        <motion.span
                          layoutId="active-nav-underline"
                          className="absolute left-[14px] right-[14px] bottom-[2px] h-[2px] rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060]"
                          style={{ boxShadow: "0 0 8px rgba(212,175,55,0.5)" }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}

                {PAGE_LINKS.map((link) => {
                  const active = isPageActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`nav-link-hoverable relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                        active
                          ? "text-[#D4AF37]"
                          : "text-[#A3A3A3] hover:text-white"
                      }`}
                    >
                      {link.name}
                      {!active && <span className="nav-link-underline" />}
                      {active && (
                        <motion.span
                          layoutId="active-nav-underline"
                          className="absolute left-[14px] right-[14px] bottom-[2px] h-[2px] rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F0D060]"
                          style={{ boxShadow: "0 0 8px rgba(212,175,55,0.5)" }}
                        />
                      )}
                    </Link>
                  );
                })}
              </LayoutGroup>
            </motion.div>

            {/* RIGHT SIDE */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hidden lg:flex items-center gap-4 pl-6 ml-2 border-l border-[#D4AF37]/15"
            >
              <motion.button
                onClick={() => setAiOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="nav-ai-pulse flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-[#A3A3A3] hover:text-[#D4AF37] border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.06] transition-all duration-300 bg-transparent cursor-pointer"
              >
                ✨ AI Tools
              </motion.button>

              <div className="flex items-center gap-3 text-[#A3A3A3]">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${label}`}
                    title={label}
                    whileHover={{ scale: 1.15, color: "#D4AF37" }}
                    whileTap={{ scale: 0.9 }}
                    className="transition-colors duration-200"
                  >
                    <Icon size={19} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* MOBILE MENU BUTTON */}
            <motion.button
              onClick={() => setIsOpen((value) => !value)}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2.5 rounded-lg text-white border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-colors bg-transparent cursor-pointer"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <MenuIcon isOpen={isOpen} />
            </motion.button>
          </div>
        </div>

        {/* SCROLL PROGRESS */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] origin-left"
          style={{
            scaleX,
            width: "100%",
            background: "linear-gradient(90deg, #D4AF37, #F0D060)",
            opacity: scrolled ? 0.7 : 0,
          }}
        />

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:hidden overflow-hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#D4AF37]/10"
            >
              <motion.div
                variants={mobileListVariants}
                initial="hidden"
                animate="visible"
                className="px-4 sm:px-6 py-4 flex flex-col gap-1"
              >
                {ALL_NAV.map((link) => {
                  const isActive =
                    link.type === "section"
                      ? isSectionActive(link.id)
                      : isPageActive(link.path);

                  if (link.type === "section") {
                    return (
                      <motion.button
                        key={link.id}
                        variants={mobileItemVariants}
                        onClick={() => handleSectionClick(link.id)}
                        whileTap={{ scale: 0.98 }}
                        className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors flex items-center border-l-2 text-left w-full bg-transparent cursor-pointer ${
                          isActive
                            ? "text-[#D4AF37] bg-[#D4AF37]/[0.08] border-[#D4AF37]"
                            : "text-[#A3A3A3] hover:text-white hover:bg-white/[0.03] border-transparent"
                        }`}
                      >
                        {link.name}
                      </motion.button>
                    );
                  }

                  return (
                    <motion.div key={link.path} variants={mobileItemVariants}>
                      <Link
                        to={link.path}
                        className={`block px-3 py-3 rounded-lg text-sm font-medium transition-colors border-l-2 ${
                          isActive
                            ? "text-[#D4AF37] bg-[#D4AF37]/[0.08] border-[#D4AF37]"
                            : "text-[#A3A3A3] hover:text-white hover:bg-white/[0.03] border-transparent"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.button
                  variants={mobileItemVariants}
                  onClick={() => {
                    setIsOpen(false);
                    setAiOpen(true);
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 px-3 py-3 rounded-lg text-sm font-medium text-[#D4AF37] border border-[#D4AF37]/20 mt-1 cursor-pointer"
                  style={{ background: "rgba(212,175,55,0.06)" }}
                >
                  ✨ AI Tools
                </motion.button>

                <motion.div
                  variants={mobileItemVariants}
                  className="flex items-center gap-5 px-3 pt-4 mt-2 border-t border-[#D4AF37]/10 text-[#A3A3A3]"
                >
                  {SOCIALS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${label}`}
                      title={label}
                      onClick={handleSocialClick}
                      className="flex items-center gap-2 text-sm hover:text-[#D4AF37] transition-colors"
                    >
                      <Icon size={19} />
                      {label}
                    </a>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* MOBILE BACKDROP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* AI TOOLS PANEL */}
      <AnimatePresence>
        {aiOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiOpen(false)}
              className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-[4px]"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-[999] h-full w-full sm:w-[640px] flex flex-col overflow-hidden"
              style={{
                background: "#0A0A0A",
                borderLeft: "1px solid rgba(212,175,55,0.12)",
                boxShadow: "-30px 0 80px -20px rgba(0,0,0,0.9)",
              }}
            >
              <div
                className="shrink-0 flex items-center justify-between px-6 h-16 border-b border-[#D4AF37]/10"
                style={{
                  background: "rgba(23,23,23,0.95)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[#0A0A0A] text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37, #F0D060)",
                    }}
                  >
                    ✨
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-white text-[15px]">
                      AI Tools
                    </h2>
                    <p className="text-[11px] text-[#A3A3A3]">
                      5 tools for career growth
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => setAiOpen(false)}
                  whileHover={{ scale: 1.08, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[#A3A3A3] hover:text-white hover:bg-[#D4AF37]/[0.08] transition-colors bg-transparent border-none cursor-pointer"
                  aria-label="Close AI Tools"
                >
                  <FiX size={18} />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <style>{`
                  .ai-panel-wrap > section {
                    min-height: auto !important;
                    padding-top: 2rem !important;
                    padding-bottom: 3rem !important;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                    background: transparent !important;
                  }
                  .ai-panel-wrap > section > .absolute {
                    display: none !important;
                  }
                  .ai-panel-wrap .container {
                    max-width: 100% !important;
                    padding-left: 1.5rem !important;
                    padding-right: 1.5rem !important;
                  }
                  .ai-panel-wrap .grid {
                    grid-template-columns: 1fr !important;
                  }
                  @media (min-width: 480px) {
                    .ai-panel-wrap .grid {
                      grid-template-columns: 1fr 1fr !important;
                    }
                  }
                `}</style>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="ai-panel-wrap"
                >
                  <AIToolsDashboard />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}