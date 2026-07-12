// ═══════════════════════════════════════════════════════════════
//  smoothScroll.js — reliable smooth scrolling everywhere
//
//  Why this exists: native `scroll-behavior: smooth` and
//  `window.scrollTo({ behavior: "smooth" })` are silently disabled
//  by the browser whenever the OS "reduce motion" accessibility
//  setting is on (common on Android, also present on desktop).
//  When that happens the scroll just jumps instantly, with zero
//  error and zero way to detect it from CSS — it looks like a bug
//  in the app but it's actually the browser overriding you.
//
//  This utility animates scrollTop manually with
//  requestAnimationFrame, so it behaves the same on every device
//  no matter what the OS motion setting is.
// ═══════════════════════════════════════════════════════════════

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Smoothly scrolls the window to a target Y position.
 * @param {number} targetY - destination scrollTop in px
 * @param {number} duration - animation length in ms
 */
export function smoothScrollTo(targetY, duration = 650) {
  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/**
 * Smoothly scrolls an element into view (accounts for a fixed
 * navbar via `offset`).
 * @param {HTMLElement} el
 * @param {number} offset - px to leave above the element (navbar height)
 * @param {number} duration - animation length in ms
 */
export function smoothScrollToElement(el, offset = 72, duration = 650) {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const currentY = window.scrollY || window.pageYOffset;
  const targetY = rect.top + currentY - offset;
  smoothScrollTo(Math.max(targetY, 0), duration);
}