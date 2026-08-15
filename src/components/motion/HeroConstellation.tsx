import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PRODUCTS } from "@/lib/site";
import { EASE } from "./Reveal";

/**
 * The hero visual. A dark identity tile with the live products floating around
 * it.
 *
 * This replaces the flat panel version. `HeroVisual` still exists and its
 * docstring argues against exactly this pattern, because an earlier attempt at
 * floating cards collided at real widths. That objection is answered here by
 * positioning everything in percentages inside one aspect-ratio box, so the
 * composition scales instead of overlapping, and by checking 1024, 1280 and
 * 1440 rather than one width.
 *
 * Two things in the reference this was modelled on are deliberately not copied:
 *
 * - **No founding year.** The reference tile reads "EST. 2020". We have no
 *   verified founding year, and inventing one on the home page is the exact
 *   thing the writing rules forbid. The tile carries "Delhi, India", which is
 *   true.
 * - **No gradient ground.** DESIGN.md allows one accent and no gradients. The
 *   paper ground and the existing grain do the work instead.
 *
 * Satellite count is two because there are two products. There is no third one
 * to draw, so the third slot carries the studio's availability, which is real.
 */

/**
 * Positions as percentages of the box.
 *
 * The centre tile occupies 30% to 70% horizontally and 28% to 72% vertically,
 * so every satellite is placed in a vertical band that clears 28% to 72%
 * outright rather than being nudged sideways. That is the fix for the collision
 * the old `HeroVisual` docstring warned about: this column is only about 380px
 * wide at `lg`, and at that size a centre tile plus cards beside it cannot both
 * fit. Cards above and below always can.
 */
const SLOTS = [
  { pos: { top: "0%", left: "0%" }, rot: -7, drift: -6, delay: 0 },
  { pos: { top: "3%", right: "0%" }, rot: 6, drift: 6, delay: 0.9 },
  { pos: { bottom: "6%", left: "4%" }, rot: -4, drift: -5, delay: 1.7 },
];

export default function HeroConstellation() {
  const reduced = useReducedMotion();
  /** Index of the card under the pointer, or null. Per card, not per group. */
  const [hovered, setHovered] = useState<number | null>(null);

  /**
   * Each card owns its own hover. Hovering one lifts and straightens that card
   * alone; the others keep drifting untouched.
   *
   * An earlier version put the hover on the container so all three reacted
   * together. That reads as a single object rather than three separate cards,
   * which is wrong for something whose whole shape is "these are distinct
   * things floating around the studio".
   *
   * Idle drifts on a loop, hover lifts. One `animate` object switches between
   * the two, because a looping keyframe and a hover offset both write `y` and
   * cannot be stacked on the same element.
   *
   * The rotation is a Framer value, never a Tailwind `rotate-*` class. Framer
   * owns `transform` on these elements, so a utility class would be overwritten
   * the moment anything animates. That is the bug that dropped the centre tile
   * into the corner.
   */
  const cardMotion = (slot: (typeof SLOTS)[number], i: number) => {
    if (reduced) return { animate: { opacity: 1, rotate: slot.rot } };

    return hovered === i
      ? {
          animate: { opacity: 1, y: -9, rotate: slot.rot * 0.3, scale: 1.05 },
          transition: { duration: 0.24, ease: EASE },
        }
      : {
          animate: {
            opacity: 1,
            y: [0, slot.drift, 0],
            rotate: slot.rot,
            scale: 1,
          },
          transition: {
            y: {
              duration: 6 + Math.abs(slot.drift) * 0.3,
              delay: slot.delay,
              repeat: Infinity,
              ease: "easeInOut" as const,
            },
            default: { duration: 0.24, ease: EASE },
          },
        };
  };

  /** Wired onto every card so each one reports its own pointer state. */
  const hoverProps = (i: number) => ({
    onMouseEnter: () => setHovered(i),
    onMouseLeave: () => setHovered((h) => (h === i ? null : h)),
    onFocus: () => setHovered(i),
    onBlur: () => setHovered((h) => (h === i ? null : h)),
  });

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[460px] lg:max-w-none">
      {/* Centre tile.
          The positioning lives on a plain wrapper and the animation on the
          child, on purpose. Framer writes `transform` inline when you animate
          `scale`, which silently overrode the `-translate-x-1/2
          -translate-y-1/2` utilities and dropped the tile to the bottom right
          of the box. Never put Tailwind translate classes on an element Framer
          is transforming. */}
      <div className="absolute left-1/2 top-1/2 h-[50%] w-[44%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="flex h-full w-full flex-col items-center justify-center rounded-[16%] bg-ink px-3 text-center"
        >
          <img
            src="/logo-mark.png"
            alt=""
            width={128}
            height={128}
            loading="eager"
            decoding="async"
            className="mb-3 h-14 w-14 rounded-full bg-paper object-contain p-1.5"
          />
          <p className="text-[1.125rem] font-semibold leading-none tracking-tight text-paper">
            Kraftzen
          </p>
          <p className="t-label t-mono mt-2 whitespace-nowrap text-paper/55">Delhi, India</p>
        </motion.div>
      </div>

      {/* Product satellites */}
      {PRODUCTS.map((product, i) => (
        <motion.a
          key={product.slug}
          href={product.href}
          target="_blank"
          rel="noreferrer noopener"
          style={SLOTS[i].pos}
          initial={{ opacity: 0, rotate: SLOTS[i].rot }}
          {...cardMotion(SLOTS[i], i)}
          {...hoverProps(i)}
          className="group absolute z-10 flex items-center gap-2.5 rounded-2xl border border-line bg-surface py-2.5 pl-2.5 pr-4 shadow-[0_10px_24px_-18px_rgb(22_19_15_/_0.5)]"
        >
          <img
            src={product.logo}
            alt=""
            width={256}
            height={256}
            loading="eager"
            decoding="async"
            /* AniVerseX ships its own dark ground, so it must not get a light
               plate behind it. Bro AI is transparent and does need one. */
            className={`h-9 w-9 shrink-0 rounded-lg object-contain ${
              product.logoOnDark ? "bg-ink" : "bg-paper p-0.5 ring-1 ring-line"
            }`}
          />
          <span className="whitespace-nowrap text-[0.9375rem] font-semibold tracking-tight text-ink transition-colors duration-short ease-out group-hover:text-brand">
            {product.name}
          </span>
        </motion.a>
      ))}

      {/* Third slot. Availability rather than an invented third product. */}
      <motion.div
        style={SLOTS[2].pos}
        initial={{ opacity: 0, rotate: SLOTS[2].rot }}
        {...cardMotion(SLOTS[2], 2)}
        {...hoverProps(2)}
        className="absolute z-10 flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-4 py-3 shadow-[0_10px_24px_-18px_rgb(22_19_15_/_0.5)]"
      >
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {!reduced && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
          )}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
        </span>
        <span className="t-label whitespace-nowrap text-muted-foreground">
          Open for collabs
        </span>
      </motion.div>

      {/* Mono footnote, the one line of texture in the composition. */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
        className="t-label t-mono absolute bottom-[2%] right-0 whitespace-nowrap text-faint"
      >
        Two products live in public.
      </motion.p>
    </div>
  );
}
