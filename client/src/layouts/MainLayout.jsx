// ═══════════════════════════════════════════════════════════════
//  MAIN LAYOUT — Cleaned up (no gold scroll-indicator lines)
// ═══════════════════════════════════════════════════════════════
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AIAssistant from "../pages/AIAssistant/AIAssistant";
import { smoothScrollTo, smoothScrollToElement } from "../utils/smoothScroll.js";

import "../index.css";

/* ═══════════════════════════════════════════════════════════════
   SCROLL MANAGER — makes smooth scrolling work on EVERY page
   - If the URL has a #hash (e.g. /about#skills), smooth-scrolls to
     that section once it exists in the DOM (retries until mounted).
   - Otherwise, smooth-scrolls to the top on every route change.
   Uses the custom smoothScroll utility instead of native browser
   smooth scroll, since native smooth scroll is silently disabled
   by the OS "reduce motion" setting on many devices — which made
   scrolling feel instant/broken even though the code was correct.
   ═══════════════════════════════════════════════════════════════ */
function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      let attempts = 0;

      const scrollToEl = () => {
        const el = document.getElementById(id);
        if (el) {
          smoothScrollToElement(el, 72, 650);
        } else if (attempts < 30) {
          // page/section may still be mounting (route transition,
          // lazy content, images, etc.) — keep retrying briefly
          attempts += 1;
          requestAnimationFrame(scrollToEl);
        }
      };

      const timer = setTimeout(scrollToEl, 60);
      return () => clearTimeout(timer);
    }

    smoothScrollTo(0, 550);
  }, [location.pathname, location.hash]);

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   BACK TO TOP — Bottom-left button (kept, it's not a "line")
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
          onClick={() => smoothScrollTo(0, 550)}
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
      <ScrollManager />
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