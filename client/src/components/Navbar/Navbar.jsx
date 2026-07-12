import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence, LayoutGroup, useScroll, useSpring } from "framer-motion";
import AIToolsDashboard from "../../pages/AIAssistant/AIToolsDashboard";

const SECTION_LINKS = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Skills", id: "skills" },
  { name: "Projects", id: "projects" },
  { name: "Experience", id: "experience" },
  { name: "Contact", id: "contact" },
];

const PAGE_LINKS = [
  { name: "Certificates", path: "/certificates" },
  { name: "Blog", path: "/blog" },
];

const ALL_NAV = [
  ...SECTION_LINKS.map((l) => ({ ...l, type: "section" })),
  ...PAGE_LINKS.map((l) => ({ ...l, type: "page" })),
];

const SOCIALS = [
  { icon: FaGithub, href: "https://github.com/Omkar200583", label: "GitHub" },
  { icon: FaLinkedin, href: "https://linkedin.com/in/omkar-jadhav-6915052a1", label: "LinkedIn" },
];

// Fallback only — real value comes from measuring the navbar itself,
// so mobile (64px) vs desktop (72px) heights never cause scroll drift.
const FALLBACK_NAV_HEIGHT = 72;

/* ─── Mobile menu stagger variants ─── */
const mobileListVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.06 },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── Animated hamburger ↔ X icon (morphs via line rotation) ─── */
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [aiOpen, setAiOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Measure the ACTUAL rendered navbar height (64px mobile / 72px desktop,
  // or anything a future edit changes it to) instead of hardcoding one value.
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(FALLBACK_NAV_HEIGHT);

  useEffect(() => {
    const measure = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };
    measure();

    // Re-measure on resize/orientation change so tablet ↔ desktop
    // breakpoint switches (h-16 -> lg:h-[72px]) stay accurate.
    window.addEventListener("resize", measure);

    // Also catch font-load / layout shifts right after mount.
    const ro = new ResizeObserver(measure);
    if (navRef.current) ro.observe(navRef.current);

    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const scrollToId = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
      return true;
    },
    [navHeight]
  );

  // Scroll progress bar under the navbar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setAiOpen(false);
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (aiOpen || isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [aiOpen, isOpen]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const ids = SECTION_LINKS.map((l) => l.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    let ticking = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length) {
            visible.sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
            );
            setActiveSection(visible[0].target.id);
          }
          ticking = false;
        });
      },
      { threshold: 0.15, rootMargin: `-${navHeight}px 0px -45% 0px` }
    );

    els.forEach((el) => observer.observe(el));

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        let current = "home";
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= navHeight + 50) {
            current = id;
          }
        }
        setActiveSection(current);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [location.pathname, navHeight]);

  const handleSectionClick = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      const tryScroll = () => {
        if (!scrollToId(id)) {
          requestAnimationFrame(tryScroll);
        }
      };
      setTimeout(tryScroll, 100);
    } else {
      scrollToId(id);
    }
    setIsOpen(false);
  };

  const isSectionActive = (id) => location.pathname === "/" && activeSection === id;
  const isPageActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-[background-color,border-color,box-shadow] duration-500 font-[Inter] ${
          scrolled
            ? "bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-[#D4AF37]/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
          .font-display { font-family: 'Space Grotesk', sans-serif; }

          @keyframes navGlowPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); }
            50% { box-shadow: 0 0 16px 2px rgba(212,175,55,0.15); }
          }
          .nav-ai-pulse { animation: navGlowPulse 3s ease-in-out infinite; }

          .nav-link-underline {
            position: absolute;
            left: 14px;
            right: 14px;
            bottom: 2px;
            height: 2px;
            border-radius: 2px;
            transform-origin: left;
            transform: scaleX(0);
            background: linear-gradient(90deg, rgba(212,175,55,0.5), rgba(240,208,96,0.5));
            transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
          }
          .nav-link-hoverable:hover .nav-link-underline {
            transform: scaleX(1);
          }

          /* Keep the logo readable at the very narrowest phones (320px) */
          @media (max-width: 360px) {
            .nav-logo {
              font-size: 15px !important;
              letter-spacing: -0.01em;
            }
          }
        `}</style>

        <div className="container mx-auto max-w-8xl px-3 xs:px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 min-w-0"
            >
              <Link
                to="/"
                className="nav-logo font-display font-bold text-base xs:text-lg sm:text-xl text-[#FFFFFF] tracking-tight whitespace-nowrap"
              >
                OMKAR{" "}
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#F0D060] bg-clip-text text-transparent">
                  JADHAV
                </span>
              </Link>
            </motion.div>

            {/* Desktop Links */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex items-center gap-1"
            >
              <LayoutGroup>
                {SECTION_LINKS.map((link) => {
                  const active = isSectionActive(link.id);
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleSectionClick(link.id)}
                      className="nav-link-hoverable relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-250 bg-transparent border-none cursor-pointer flex items-center"
                      style={{ color: active ? "#D4AF37" : "#A3A3A3" }}
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.color = "#A3A3A3";
                      }}
                    >
                      {link.name}
                      {!active && <span className="nav-link-underline" />}
                      {active && (
                        <motion.span
                          layoutId="active-nav-underline"
                          style={{
                            position: "absolute",
                            left: "14px",
                            right: "14px",
                            bottom: "2px",
                            height: "2px",
                            borderRadius: "2px",
                            background: "linear-gradient(90deg, #D4AF37, #F0D060)",
                            boxShadow: "0 0 8px rgba(212,175,55,0.5)",
                            zIndex: 10,
                          }}
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
                      className="nav-link-hoverable relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-250 flex items-center"
                      style={{ color: active ? "#D4AF37" : "#A3A3A3" }}
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.color = "#A3A3A3";
                      }}
                    >
                      {link.name}
                      {!active && <span className="nav-link-underline" />}
                      {active && (
                        <motion.span
                          layoutId="active-nav-underline"
                          style={{
                            position: "absolute",
                            left: "14px",
                            right: "14px",
                            bottom: "2px",
                            height: "2px",
                            borderRadius: "2px",
                            background: "linear-gradient(90deg, #D4AF37, #F0D060)",
                            boxShadow: "0 0 8px rgba(212,175,55,0.5)",
                            zIndex: 10,
                          }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </LayoutGroup>
            </motion.div>

            {/* Right side */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex items-center gap-4 pl-6 ml-2 border-l border-[#D4AF37]/15 shrink-0"
            >
              <motion.button
                onClick={() => setAiOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="nav-ai-pulse flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-[#A3A3A3] hover:text-[#D4AF37] border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.06] transition-colors duration-300 bg-transparent cursor-pointer whitespace-nowrap"
              >
                ✨ AI Tools
              </motion.button>
              <div className="flex items-center gap-2 text-[#A3A3A3]">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.08, y: -1 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] text-[#A3A3A3] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.10] hover:shadow-[0_0_16px_rgba(212,175,55,0.25)] transition-colors duration-250"
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Mobile toggle — animated hamburger ↔ X morph */}
            <motion.button
              onClick={() => setIsOpen((v) => !v)}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="lg:hidden shrink-0 p-2.5 rounded-lg text-[#FFFFFF] border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-colors duration-250 bg-transparent cursor-pointer"
              style={{ minWidth: 44, minHeight: 44 }}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <MenuIcon isOpen={isOpen} />
            </motion.button>
          </div>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] origin-left"
          style={{
            scaleX,
            width: "100%",
            background: "linear-gradient(90deg, #D4AF37, #F0D060)",
            opacity: scrolled ? 0.7 : 0,
          }}
        />

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#D4AF37]/10 max-h-[calc(100vh-4rem)] overflow-y-auto"
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
                        className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-250 flex items-center gap-2 border-l-2 text-left w-full bg-transparent border-r-0 border-t-0 border-b-0 cursor-pointer ${
                          isActive
                            ? "text-[#D4AF37] bg-[#D4AF37]/[0.08] border-[#D4AF37]"
                            : "text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/[0.03] border-transparent"
                        }`}
                        style={{ minHeight: 44 }}
                      >
                        {link.name}
                      </motion.button>
                    );
                  }

                  return (
                    <motion.div key={link.path} variants={mobileItemVariants}>
                      <Link
                        to={link.path}
                        className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-250 flex items-center gap-2 border-l-2 ${
                          isActive
                            ? "text-[#D4AF37] bg-[#D4AF37]/[0.08] border-[#D4AF37]"
                            : "text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/[0.03] border-transparent"
                        }`}
                        style={{ minHeight: 44 }}
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
                  style={{ background: "rgba(212,175,55,0.06)", minHeight: 44 }}
                >
                  ✨ AI Tools
                </motion.button>

                <motion.div
                  variants={mobileItemVariants}
                  className="flex items-center gap-3 px-3 pt-4 mt-2 border-t border-[#D4AF37]/10 text-[#A3A3A3]"
                >
                  {SOCIALS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] text-[#A3A3A3] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.10] transition-colors duration-250"
                      style={{ minHeight: 44 }}
                    >
                      <Icon size={20} />
                      {label}
                    </a>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile menu backdrop — dims the page behind the open menu.
          top now matches the *measured* navbar height, so it lines up
          exactly under the navbar on both phone (64px) and desktop (72px). */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            style={{ top: navHeight }}
          />
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          AI TOOLS DASHBOARD — Slide-over Panel
          ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {aiOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setAiOpen(false)}
              className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-[4px]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-[999] h-full w-full sm:w-[640px] max-w-full flex flex-col overflow-hidden"
              style={{
                background: "#0A0A0A",
                borderLeft: "1px solid rgba(212,175,55,0.12)",
                boxShadow: "-30px 0 80px -20px rgba(0,0,0,0.9)",
              }}
            >
              {/* ── Panel Header ── */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="shrink-0 flex items-center justify-between px-4 sm:px-6 h-16 border-b border-[#D4AF37]/10"
                style={{ background: "rgba(23,23,23,0.95)", backdropFilter: "blur(20px)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <motion.div
                    initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-[#0A0A0A] text-sm font-bold"
                    style={{ background: "linear-gradient(135deg, #D4AF37, #F0D060)" }}
                  >
                    ✨
                  </motion.div>
                  <div className="min-w-0">
                    <h2 className="font-display font-semibold text-[#FFFFFF] text-[15px] leading-tight truncate">
                      AI Tools
                    </h2>
                    <p className="text-[11px] text-[#A3A3A3] leading-tight truncate">
                      5 tools for career growth
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setAiOpen(false)}
                  whileHover={{ scale: 1.08, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#D4AF37]/[0.08] transition-colors duration-200 bg-transparent border-none cursor-pointer"
                  aria-label="Close"
                >
                  <FiX size={18} />
                </motion.button>
              </motion.div>

              {/* ── Scrollable Dashboard Area ── */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">

                <style>{`
                  .ai-panel-wrap {
                    --panel-override: 1;
                  }
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
                    padding-left: 1.25rem !important;
                    padding-right: 1.25rem !important;
                  }
                  @media (min-width: 400px) {
                    .ai-panel-wrap .container {
                      padding-left: 1.5rem !important;
                      padding-right: 1.5rem !important;
                    }
                  }
                  .ai-panel-wrap .grid {
                    grid-template-columns: 1fr !important;
                  }
                  @media (min-width: 480px) {
                    .ai-panel-wrap .grid {
                      grid-template-columns: 1fr 1fr !important;
                    }
                  }
                  .ai-panel-wrap .text-center.mb-16 {
                    margin-bottom: 2rem !important;
                  }
                  .ai-panel-wrap .font-display.font-bold.text-4xl {
                    font-size: 1.5rem !important;
                  }
                  @media (min-width: 480px) {
                    .ai-panel-wrap .font-display.font-bold.text-4xl {
                      font-size: 2.25rem !important;
                    }
                  }
                  .ai-panel-wrap .text-\\[\\#A3A3A3\\].text-base {
                    font-size: 0.875rem !important;
                  }
                  .ai-panel-wrap .group {
                    border-color: rgba(212,175,55,0.1) !important;
                  }
                `}</style>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
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