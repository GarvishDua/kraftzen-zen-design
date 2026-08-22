import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PRODUCTS, SITE } from "@/lib/site";

/**
 * The two products arranged around the studio mark.
 *
 * A floating card composition was tried in the hero on 2026-08-07 and rejected,
 * because four cards docked around a centre tile collided at real container
 * widths. See the decisions log in DESIGN.md. This works where that did not for
 * two reasons: there are two satellites rather than four, and they sit in a
 * CSS grid rather than at hand-picked absolute offsets, so nothing can overlap
 * at any width. The drift is a few pixels of transform on top of a layout that
 * is already correct when it is zero.
 */
export default function ProductConstellation() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Small opposing drift. Enough to feel alive, never enough to move a card
  // out of its grid cell.
  const up = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const down = useTransform(scrollYProgress, [0, 1], [-14, 14]);

  return (
    <div
      ref={ref}
      className="relative mx-auto grid w-full max-w-[420px] grid-cols-2 items-center gap-x-6 gap-y-8"
      aria-hidden
    >
      {/* Bro AI, top left */}
      <ProductTile product={PRODUCTS[0]} y={reduced ? undefined : up} className="justify-self-start" />

      {/* Studio mark, centre, spanning both rows on the right */}
      <div className="row-span-2 flex justify-center">
        <motion.div
          style={reduced ? undefined : { y: down }}
          className="flex aspect-square w-[168px] flex-col items-center justify-center rounded-[28px] bg-ink px-4 text-center shadow-[0_18px_50px_-24px_rgba(22,19,15,0.55)]"
        >
          <img
            src="/logo-mark-128.webp"
            alt=""
            width={128}
            height={128}
            loading="lazy"
            /* The mark must sit on a white surface. Keying the white ground out
               leaves a halo on anti aliased edges, invisible on white and
               visible on anything else. */
            className="mb-3 h-12 w-12 rounded-lg object-cover"
          />
          <p className="font-semibold tracking-tight text-paper">{SITE.name}</p>
          <p className="t-label t-mono mt-1 text-paper/45">Est. 2026</p>
        </motion.div>
      </div>

      {/* AniVerseX, bottom left */}
      <ProductTile product={PRODUCTS[1]} y={reduced ? undefined : down} className="justify-self-start" />
    </div>
  );
}

function ProductTile({
  product,
  y,
  className = "",
}: {
  product: (typeof PRODUCTS)[number];
  y?: ReturnType<typeof useTransform<number, number>>;
  className?: string;
}) {
  return (
    <motion.div
      style={y ? { y } : undefined}
      className={`flex items-center gap-3 rounded-2xl bg-surface p-3 pr-5 shadow-[0_14px_36px_-20px_rgba(22,19,15,0.4)] ring-1 ring-line ${className}`}
    >
      <img
        src={product.logo}
        alt=""
        width={256}
        height={256}
        loading="lazy"
        /* AniVerseX carries its own black ground, so it must not get a light
           plate behind it. Bro AI is transparent and does need one. */
        className={`h-11 w-11 shrink-0 rounded-xl object-contain ${
          product.logoOnDark ? "bg-ink" : "bg-paper p-1"
        }`}
      />
      <span className="whitespace-nowrap font-semibold tracking-tight text-ink">
        {product.name}
      </span>
    </motion.div>
  );
}
