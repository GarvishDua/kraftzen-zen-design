import { motion } from "framer-motion";

/**
 * Route transition placeholder. Deliberately quiet: a wordmark and a hairline.
 * A loud loader on a fast connection is a flash of noise, not a feature.
 */
export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[45] flex flex-col items-center justify-center gap-6 bg-paper">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-baseline gap-1.5 text-lg font-semibold tracking-tight text-ink"
      >
        Kraftzen
        <span className="block h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
      </motion.p>

      <div
        role="status"
        aria-label="Loading"
        className="h-px w-40 overflow-hidden bg-line"
      >
        <motion.div
          className="h-full w-1/3 bg-brand"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
