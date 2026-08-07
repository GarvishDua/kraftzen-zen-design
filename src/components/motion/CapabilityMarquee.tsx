import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { CAPABILITIES } from "@/lib/site";

/**
 * Two rows of capability tags drifting in opposite directions.
 *
 * The CSS keyframe supplies a constant base drift so the band is alive when the
 * page is still. Scroll adds a nudge on top of it, which makes the band feel
 * connected to the reader rather than looping in its own world.
 * Reduced motion drops both and leaves a static, wrapped tag list.
 */
export default function CapabilityMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const nudge = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-90, 90]);
  const nudgeBack = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [90, -90]);

  const row = [...CAPABILITIES, ...CAPABILITIES];

  if (reduced) {
    return (
      <div ref={ref} className="border-y border-line py-10">
        <div className="shell flex flex-wrap gap-2">
          {CAPABILITIES.map((c) => (
            <Tag key={c} label={c} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative overflow-hidden border-y border-line py-10"
      aria-hidden
    >
      {/* Fade the band into the paper at both edges instead of cutting it. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent md:w-28" />

      <motion.div style={{ x: nudge }} className="flex w-max">
        <div className="marquee-track flex w-max gap-2 pr-2">
          {row.map((c, i) => (
            <Tag key={`a-${i}`} label={c} />
          ))}
        </div>
      </motion.div>

      <motion.div style={{ x: nudgeBack }} className="mt-2 flex w-max">
        <div className="marquee-track-reverse flex w-max gap-2 pr-2">
          {row.map((c, i) => (
            <Tag key={`b-${i}`} label={c} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="t-label whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2.5 text-ink-soft">
      {label}
    </span>
  );
}
