import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AIAssistant from "../pages/AIAssistant/AIAssistant";

const EASE = [0.22, 1, 0.36, 1];

// function ScrollProgressMini() {
//   const { scrollYProgress } = useScroll();
//   const scaleX = useSpring(scrollYProgress, {
//     stiffness: 120,
//     damping: 30,
//     restDelta: 0.001,
//   });

//   return (
//     <motion.div
//       aria-hidden="true"
//       className="scroll-progress-mini"
//       style={{ scaleX }}
//     />
//   );
// }

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.25, ease: EASE }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="back-to-top"
        >
          <ArrowUp size={16} strokeWidth={1.8} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="main-layout">
      {/* <ScrollProgressMini /> */}
      <Navbar />

      <main className="main-layout__content">
        {/*
          Opacity-only fade, no mode="wait" and no exit:
          - Outlet already renders the NEW route immediately, so an exit
            animation would just fade the new page out and back in.
          - Animating `y` leaves a transform on the wrapper, which becomes the
            containing block for position:fixed descendants (modals, sticky UI).
        */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="main-layout__page"
        >
          <Outlet />
        </motion.div>
      </main>

      <Footer />
      <BackToTop />
      <AIAssistant />
    </div>
  );
};

export default MainLayout;