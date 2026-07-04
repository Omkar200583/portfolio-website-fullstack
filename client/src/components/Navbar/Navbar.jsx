import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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

const NAV_HEIGHT = 80;

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.pageYOffset - NAV_HEIGHT;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [aiOpen, setAiOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
      if (e.key === "Escape") setAiOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (aiOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [aiOpen]);

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
      { threshold: 0.15, rootMargin: `-${NAV_HEIGHT}px 0px -45% 0px` }
    );

    els.forEach((el) => observer.observe(el));

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        let current = "home";
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= NAV_HEIGHT + 50) {
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
  }, [location.pathname]);

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
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-[Inter] ${
          scrolled
            ? "bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-[#D4AF37]/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
          .font-display { font-family: 'Space Grotesk', sans-serif; }
        `}</style>

        <div className="container mx-auto max-w-8xl px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">

            {/* Logo */}
            <Link to="/" className="font-display font-bold text-lg sm:text-xl text-[#FFFFFF] tracking-tight">
              OMKAR{" "}
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F0D060] bg-clip-text text-transparent">
                JADHAV
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1">
              <LayoutGroup>
                {SECTION_LINKS.map((link) => {
                  const active = isSectionActive(link.id);
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleSectionClick(link.id)}
                      className="relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-250 bg-transparent border-none cursor-pointer flex items-center"
                      style={{ color: active ? "#D4AF37" : "#A3A3A3" }}
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.color = "#A3A3A3";
                      }}
                    >
                      {link.name}
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
                      className="relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-250 flex items-center"
                      style={{ color: active ? "#D4AF37" : "#A3A3A3" }}
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.color = "#A3A3A3";
                      }}
                    >
                      {link.name}
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
                            zIndex: 10,
                          }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </LayoutGroup>
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-4 pl-6 ml-2 border-l border-[#D4AF37]/15">
              <button
                onClick={() => setAiOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-[#A3A3A3] hover:text-[#D4AF37] border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.06] transition-all duration-300 bg-transparent cursor-pointer"
              >
                ✨ AI Tools
              </button>
              <div className="flex items-center gap-3 text-[#A3A3A3]">
                {SOCIALS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="hover:text-[#D4AF37] transition-colors duration-250"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-[#FFFFFF] border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-colors duration-250 bg-transparent cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#D4AF37]/10"
            >
              <div className="px-4 sm:px-6 py-4 flex flex-col gap-1">
                {ALL_NAV.map((link) => {
                  const isActive =
                    link.type === "section"
                      ? isSectionActive(link.id)
                      : isPageActive(link.path);

                  if (link.type === "section") {
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleSectionClick(link.id)}
                        className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-250 flex items-center gap-2 border-l-2 text-left w-full bg-transparent border-r-0 border-t-0 border-b-0 cursor-pointer ${
                          isActive
                            ? "text-[#D4AF37] bg-[#D4AF37]/[0.08] border-[#D4AF37]"
                            : "text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/[0.03] border-transparent"
                        }`}
                      >
                        {link.name}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-250 flex items-center gap-2 border-l-2 ${
                        isActive
                          ? "text-[#D4AF37] bg-[#D4AF37]/[0.08] border-[#D4AF37]"
                          : "text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/[0.03] border-transparent"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    setAiOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-3 rounded-lg text-sm font-medium text-[#D4AF37] border border-[#D4AF37]/20 mt-1 cursor-pointer"
                  style={{ background: "rgba(212,175,55,0.06)" }}
                >
                  ✨ AI Tools
                </button>

                <div className="flex items-center gap-5 px-3 pt-4 mt-2 border-t border-[#D4AF37]/10 text-[#A3A3A3]">
                  {SOCIALS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex items-center gap-2 text-sm hover:text-[#D4AF37] transition-colors duration-250"
                    >
                      <Icon size={18} />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

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
              className="fixed top-0 right-0 z-[999] h-full w-full sm:w-[640px] flex flex-col overflow-hidden"
              style={{
                background: "#0A0A0A",
                borderLeft: "1px solid rgba(212,175,55,0.12)",
                boxShadow: "-30px 0 80px -20px rgba(0,0,0,0.9)",
              }}
            >
              {/* ── Panel Header ── */}
              <div
                className="shrink-0 flex items-center justify-between px-6 h-16 border-b border-[#D4AF37]/10"
                style={{ background: "rgba(23,23,23,0.95)", backdropFilter: "blur(20px)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[#0A0A0A] text-sm font-bold"
                    style={{ background: "linear-gradient(135deg, #D4AF37, #F0D060)" }}
                  >
                    ✨
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-[#FFFFFF] text-[15px] leading-tight">
                      AI Tools
                    </h2>
                    <p className="text-[11px] text-[#A3A3A3] leading-tight">
                      5 tools for career growth
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAiOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[#A3A3A3] hover:text-[#FFFFFF] hover:bg-[#D4AF37]/[0.08] transition-all duration-200 bg-transparent border-none cursor-pointer"
                  aria-label="Close"
                >
                  <FiX size={18} />
                </button>
              </div>

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
                  .ai-panel-wrap .text-center.mb-16 {
                    margin-bottom: 2rem !important;
                  }
                  .ai-panel-wrap .font-display.font-bold.text-4xl {
                    font-size: 1.75rem !important;
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

                <div className="ai-panel-wrap">
                  <AIToolsDashboard />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}