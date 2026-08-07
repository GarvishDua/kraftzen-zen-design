import { motion, useScroll, useSpring } from "framer-motion";

/** Hairline read progress under the nav. One accent element, cheap. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-px origin-left bg-brand"
    />
  );
}
