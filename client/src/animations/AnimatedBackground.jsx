import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Fixed, non-interactive atmosphere: two drifting gradient orbs + one slowly
 * rotating dashed ring (circular effect).
 *
 * Uses radial-gradient (the .orb class in animations.css), NOT filter: blur().
 * Blur on big moving layers repaints every frame and caused your scroll ghosting.
 * Only transform/opacity are animated, so it stays on the GPU.
 *
 * Place once in MainLayout, as the first child of .main-layout.
 */
export default function AnimatedBackground() {
  const reduce = useReducedMotion();

  const drift = (x, y, s, duration) =>
    reduce
      ? {}
      : {
          animate: { x: [0, x, 0], y: [0, y, 0], scale: [1, s, 1] },
          transition: { duration, repeat: Infinity, ease: "easeInOut" },
        };

  return (
    <div className="animated-background" aria-hidden="true">
      <motion.div
        className="orb orb--one"
        {...drift(40, -30, 1.1, 14)}
      />
      {/* hidden on phones: one orb is enough and saves battery */}
      <motion.div
        className="orb orb--two hidden sm:block"
        style={{ "--orb-color": "var(--warm)" }}
        {...drift(-36, 28, 1.08, 18)}
      />
      <motion.div
        className="orbit-ring"
        {...(reduce
          ? {}
          : {
              animate: { rotate: 360 },
              transition: { duration: 60, repeat: Infinity, ease: "linear" },
            })}
      />
    </div>
  );
}