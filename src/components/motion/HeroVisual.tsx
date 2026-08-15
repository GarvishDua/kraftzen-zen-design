import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS } from "@/lib/site";
import { EASE } from "./Reveal";

/**
 * The right half of the hero.
 *
 * A single panel that answers "what have you actually built" inside the first
 * viewport, which is the whole positioning. Deliberately a panel rather than
 * cards floating over a tile: the floating pattern collides at real widths and
 * reads as the same gimmick this redesign removed.
 *
 * No screenshots here on purpose. The current product captures are photos
 * rather than clean UI, and at 90px tall they read as stock imagery.
 */
export default function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Slight counter drift so the panel does not travel locked to the copy.
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [18, -18]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
      {/* Offset plate behind the panel. Depth from geometry, not shadow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 rounded-lg border border-line"
      />

      <motion.div
        style={{ y }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        className="relative overflow-hidden rounded-lg border border-line bg-surface"
      >
        {/* Identity row */}
        <div className="flex items-center gap-3.5 border-b border-line p-5 md:p-6">
          <img
            src="/logo-mark-128.png"
            alt=""
            width={128}
            height={128}
            loading="eager"
            decoding="async"
            className="h-11 w-11 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="font-semibold tracking-tight text-ink">Kraftzen</p>
            <p className="t-label t-mono whitespace-nowrap text-faint">Delhi, India</p>
          </div>
          <span className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              {!reduced && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            <span className="t-label text-muted-foreground">Open for collabs</span>
          </span>
        </div>

        {/* Products */}
        <div className="px-5 pt-5 md:px-6 md:pt-6">
          <p className="t-label mb-1 text-brand">Shipped and live</p>
        </div>

        <ul>
          {PRODUCTS.map((product, i) => (
            <motion.li
              key={product.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: EASE }}
            >
              <a
                href={product.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-4 border-b border-line px-5 py-5 transition-colors duration-short ease-out hover:bg-surface-sunken md:px-6"
              >
                <img
                  src={product.logo}
                  alt=""
                  width={256}
                  height={256}
                  loading="eager"
                  decoding="async"
                  className={`h-10 w-10 shrink-0 rounded-md object-contain ring-1 ring-line ${
                    product.logoOnDark ? "bg-ink" : "bg-paper p-0.5"
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className="mb-1 flex items-center gap-2.5">
                    <span className="font-semibold tracking-tight text-ink transition-colors duration-short ease-out group-hover:text-brand">
                      {product.name}
                    </span>
                    <span className="t-label rounded-full bg-brand-soft px-2 py-1 text-brand">
                      {product.status}
                    </span>
                  </span>
                  <span className="t-small block leading-snug text-muted-foreground">
                    {product.kicker}
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-faint transition-all duration-short ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  aria-hidden
                />
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Footer row */}
        <Link
          to="/products"
          className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-short ease-out hover:bg-surface-sunken md:px-6"
        >
          <span className="t-small text-muted-foreground">
            How they work, in detail
          </span>
          <span
            aria-hidden
            className="t-label text-faint transition-transform duration-short ease-out group-hover:translate-x-1 group-hover:text-brand"
          >
            →
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
