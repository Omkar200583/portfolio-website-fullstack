// Shared motion constants + helpers (framer-motion).
export const EASE = [0.22, 1, 0.36, 1];

export const VIEWPORT = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -40px 0px",
};

/**
 * Hidden-state offset for a direction.
 * left  = element starts on the left and slides RIGHT  (left -> right)
 * right = element starts on the right and slides LEFT  (right -> left)
 */
export const getHidden = (direction = "up", d = 60) => {
  switch (direction) {
    case "left":
      return { opacity: 0, x: -d };
    case "right":
      return { opacity: 0, x: d };
    case "down":
      return { opacity: 0, y: -d * 0.8 };
    case "scale":
      return { opacity: 0, scale: 0.88 };
    case "rotate":
      return { opacity: 0, rotate: -8, scale: 0.92 };
    case "fade":
      return { opacity: 0 };
    case "up":
    default:
      return { opacity: 0, y: d * 0.8 };
  }
};

export const SHOWN = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };

export const staggerContainer = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

// ── Loops (decorative; pair with useReducedMotion) ──
export const floatLoop = {
  animate: { y: [0, -10, 0] },
  transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
};

export const spinLoop = (seconds = 24) => ({
  animate: { rotate: 360 },
  transition: { duration: seconds, repeat: Infinity, ease: "linear" },
});

export const pulseLoop = {
  animate: { opacity: [0.7, 1, 0.7], scale: [1, 1.03, 1] },
  transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
};

// ── Interaction presets ──
export const tap = { scale: 0.97 };
export const hoverLift = { y: -6 };