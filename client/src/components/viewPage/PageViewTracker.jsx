// ═══════════════════════════════════════════════════════════════
//  PAGE VIEW TRACKER — No visual changes needed (headless)
// ═══════════════════════════════════════════════════════════════
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../services/analyticsService";

const PageViewTracker = () => {
  const location = useLocation();
  const tracked = useRef(new Set());

  useEffect(() => {
    const path = location.pathname + location.search;
    if (path.startsWith("/admin")) return;
    if (tracked.current.has(path)) return;
    tracked.current.add(path);
    trackPageView(path);
  }, [location]);

  return null;
};

export default PageViewTracker;