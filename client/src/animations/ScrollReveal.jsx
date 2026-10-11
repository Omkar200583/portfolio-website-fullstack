import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import useMotionDistance from "./useMotionDistance";
import {
  EASE,
  VIEWPORT,
  SHOWN,
  getHidden,
  staggerContainer,
} from "./variants";

/**
 * <ScrollReveal direction="left" delay={0.1}>…</ScrollReveal>
 * direction: left | right | up | down | scale | rotate | fade
 *   left  = slides in left -> right
 *   right = slides in right -> left
 */
export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  as = "div",
  className = "",
  ...rest
}) {
  const reduce = useReducedMotion();
  const distance = useMotionDistance();
  const Tag = motion[as] || motion.div;

  if (reduce) {
    return React.createElement(as, { className, ...rest }, children);
  }

  return (
    <Tag
      className={className}
      initial={getHidden(direction, distance)}
      whileInView={SHOWN}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Staggered group. Put <StaggerItem> children inside.
 * <Stagger className="grid ..."> <StaggerItem>card</StaggerItem> … </Stagger>
 */
export function Stagger({
  children,
  stagger = 0.08,
  delay = 0,
  className = "",
  ...rest
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} {...rest}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  direction = "up",
  duration = 0.6,
  className = "",
  ...rest
}) {
  const reduce = useReducedMotion();
  const distance = useMotionDistance();
  if (reduce) return <div className={className} {...rest}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: getHidden(direction, distance),
        visible: { ...SHOWN, transition: { duration, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}