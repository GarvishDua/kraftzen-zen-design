import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "./Reveal";

/**
 * Scroll reset on navigation.
 *
 * React Router does not restore or reset scroll by itself, so moving from
 * halfway down /blog to /about used to land the reader halfway down /about,
 * looking at a paragraph with no heading above it. That reads as a broken page
 * rather than a new one.
 *
 * A hash is left alone, because `/services#workflow-automation` is a request to
 * land at that section and Services already scrolls to it.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (hash) return;

    // 'instant' rather than 'smooth': the page has already changed, so an
    // animated scroll would race the entrance animation and land late.
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? "auto" : "instant" });
  }, [pathname, hash, reduced]);

  return null;
}

/**
 * Entrance fade on route change.
 *
 * Deliberately opacity only, and deliberately short. The sections inside each
 * page already animate on scroll through `Reveal`, so a large movement here
 * would run against those and read as two competing animations. This exists to
 * take the hard cut off a navigation, nothing more.
 *
 * There is no exit animation. `AnimatePresence` around lazy routes has to hold
 * the old tree while the next chunk loads, which makes navigation feel slower
 * rather than smoother.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();

  /**
   * The first paint is not a navigation. Animating it would fight the prerender,
   * which force-sets opacity before capture, and would delay the largest
   * contentful paint on a cold load for no benefit.
   */
  const first = useRef(true);
  useEffect(() => {
    first.current = false;
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={first.current ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
