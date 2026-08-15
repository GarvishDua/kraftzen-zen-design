import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./Reveal";

/**
 * The visual in the right column of a blog post header.
 *
 * Three stacked sheets of paper with a line of type being written on the top
 * one. It exists because the post header was a single column with a `20ch` h1,
 * which left a large hole on wide screens.
 *
 * Why it is drawn rather than illustrated: the flat character illustrations
 * this was modelled on carry their own palette, and every one of them fights a
 * vermilion-and-paper page. Everything here is a brand token, so it cannot
 * clash and it follows the theme for free.
 *
 * **No SVG `<text>` anywhere.** Text in SVG cannot wrap and scales with the
 * viewBox, which is the bug that broke `ServicesVisual`. The "writing" is
 * rounded rects, which is also what makes it language independent.
 *
 * Interaction: hovering or focusing fans the stack out and restarts the
 * writing. Reduced motion gets the fanned end state with no movement, which is
 * the composition it settles into anyway.
 */

/** Sheet offsets: resting, then fanned on hover. Back sheet first. */
const SHEETS = [
  { rest: { x: 16, y: -14, r: 4 }, open: { x: 30, y: -24, r: 7 }, tone: "var(--sheet-back)" },
  { rest: { x: 8, y: -7, r: 2 }, open: { x: 15, y: -12, r: 3.5 }, tone: "var(--sheet-mid)" },
  { rest: { x: 0, y: 0, r: 0 }, open: { x: 0, y: 0, r: 0 }, tone: "var(--sheet-front)" },
];

/** Line lengths on the front sheet, as a fraction of the writable width. */
const LINES = [1, 0.92, 0.66, 1, 0.84, 0.44];

export default function ArticleVisual() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const active = reduced ? true : open;

  return (
    <div
      className="relative select-none"
      style={
        {
          "--sheet-back": "hsl(var(--surface-sunken))",
          "--sheet-mid": "hsl(var(--surface))",
          "--sheet-front": "hsl(var(--surface))",
        } as React.CSSProperties
      }
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
      role="img"
      aria-label="Three stacked sheets of paper with a line of writing appearing on the top one"
    >
      <svg
        viewBox="0 0 320 260"
        className="h-auto w-full overflow-visible"
        aria-hidden
      >
        {SHEETS.map((sheet, i) => {
          const to = active ? sheet.open : sheet.rest;
          const isFront = i === SHEETS.length - 1;

          return (
            <motion.g
              key={i}
              initial={false}
              animate={{ x: to.x, y: to.y, rotate: to.r }}
              transition={{ duration: reduced ? 0 : 0.42, ease: EASE }}
              style={{ originX: "40px", originY: "220px" }}
            >
              <rect
                x="34"
                y="18"
                width="212"
                height="212"
                rx="10"
                fill={sheet.tone}
                stroke="hsl(var(--line))"
                strokeWidth="1.5"
              />

              {/* Only the front sheet carries content. The others are edges. */}
              {isFront && (
                <>
                  {/* Category chip */}
                  <rect
                    x="54"
                    y="40"
                    width="52"
                    height="13"
                    rx="6.5"
                    fill="hsl(var(--accent-brand))"
                    opacity="0.18"
                  />
                  {/* Heading rule, the one vermilion element */}
                  <rect
                    x="54"
                    y="66"
                    width="118"
                    height="9"
                    rx="4.5"
                    fill="hsl(var(--accent-brand))"
                  />

                  {/* The lines write themselves in ONCE on mount, not on hover.
                      Driving them from hover left the sheet blank for every
                      visitor who never moved their mouse there, and baked an
                      empty card into the prerendered HTML. Hover is for the fan
                      only. */}
                  {LINES.map((w, li) => (
                    <motion.rect
                      key={li}
                      x="54"
                      y={96 + li * 20}
                      height="7"
                      rx="3.5"
                      fill="hsl(var(--line-strong))"
                      initial={{ width: reduced ? 172 * w : 0 }}
                      animate={{ width: 172 * w }}
                      transition={{
                        duration: reduced ? 0 : 0.42,
                        ease: EASE,
                        delay: reduced ? 0 : 0.35 + li * 0.08,
                      }}
                    />
                  ))}

                  {/* The caret. Sits at the end of the last line and blinks
                      while the sheet is open, which is what sells "writing"
                      rather than "loading". */}
                  <motion.rect
                    x={54 + 172 * LINES[LINES.length - 1] + 6}
                    y={96 + (LINES.length - 1) * 20 - 2}
                    width="3"
                    height="11"
                    rx="1.5"
                    fill="hsl(var(--accent-brand))"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: reduced ? 1 : [0, 1, 1, 0] }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            duration: 1.1,
                            repeat: Infinity,
                            times: [0, 0.1, 0.6, 0.7],
                            delay: 0.35 + LINES.length * 0.08,
                          }
                    }
                  />
                </>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
