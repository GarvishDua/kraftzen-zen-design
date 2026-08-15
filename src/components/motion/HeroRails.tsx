import { motion, useReducedMotion } from "framer-motion";

/**
 * The drawn layer behind the hero panel.
 *
 * Three rails run in from the left and terminate at the panel's edge, with a
 * pulse travelling along each one. The panel lists what we have shipped, so the
 * rails give it a cause: work arrives, the panel is what comes out.
 *
 * That is the justification for it existing at all. DESIGN.md allows motion
 * when it explains something and bans it when it decorates, and a pulse moving
 * toward the "shipped and live" panel is the one idea of the whole site drawn
 * in two hundred bytes of path data.
 *
 * Deliberately quiet: hairlines at low opacity, sitting behind the panel and
 * under the copy's right margin. If you notice it before you read the headline
 * it is too loud.
 *
 * **No SVG `<text>`.** See the note in ArticleVisual.
 */

/** Rails end at x=200, which is where the panel's left edge sits over them. */
const RAILS = [
  { d: "M -10 40 C 70 40, 90 78, 200 78", dur: 3.4, delay: 0 },
  { d: "M -10 132 C 80 132, 96 132, 200 132", dur: 3.9, delay: 0.7 },
  { d: "M -10 224 C 70 224, 90 186, 200 186", dur: 3.6, delay: 1.4 },
];

/** Length of the travelling pulse and the gap behind it, in path units. */
const DASH = 26;
const GAP = 320;

export default function HeroRails() {
  const reduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 200 264"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
      className="pointer-events-none absolute inset-y-6 -left-16 hidden w-40 lg:block xl:-left-24 xl:w-56"
    >
      {RAILS.map((rail, i) => (
        <g key={i}>
          {/* The rail itself, always visible so the shape survives reduced
              motion and the prerendered capture. */}
          <path
            d={rail.d}
            fill="none"
            stroke="hsl(var(--line-strong))"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* The pulse. A short dash chased along the rail by animating the
              offset, which is cheaper and far more reliable across browsers
              than moving a circle along an offset-path. */}
          {!reduced && (
            <motion.path
              d={rail.d}
              fill="none"
              stroke="hsl(var(--accent-brand))"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeDasharray={`${DASH} ${GAP}`}
              initial={{ strokeDashoffset: DASH + GAP }}
              animate={{ strokeDashoffset: -GAP }}
              transition={{
                duration: rail.dur,
                delay: rail.delay,
                repeat: Infinity,
                /* Linear. A constant travel with an ease on it reads as a
                   stutter, and DESIGN.md keeps eases off anything scrubbed or
                   continuous. */
                ease: "linear",
              }}
              opacity="0.85"
            />
          )}

          {/* Terminal node where the rail meets the panel. */}
          <circle
            cx="200"
            cy={rail.d.match(/,\s*(\d+)\s*$/)?.[1] ?? 132}
            r="2.5"
            fill="hsl(var(--accent-brand))"
            opacity="0.5"
          />
        </g>
      ))}
    </svg>
  );
}
