import { useEffect, useState } from "react";

/**
 * Slide distance that scales with the screen so sideways animations never
 * push content past the viewport on phones.
 *   mobile  (<640px)  -> 24px
 *   tablet  (<1024px) -> 40px
 *   desktop           -> 64px
 */
const pick = () => {
  if (typeof window === "undefined") return 64;
  const w = window.innerWidth;
  if (w < 640) return 24;
  if (w < 1024) return 40;
  return 64;
};

export default function useMotionDistance() {
  const [distance, setDistance] = useState(pick);

  useEffect(() => {
    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const update = () => setDistance(pick());

    mqSm.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqSm.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  return distance;
}