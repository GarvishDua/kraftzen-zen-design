import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./Reveal";
import { SERVICES } from "@/lib/site";

/**
 * The four services as one system: repeat work in, working software out.
 *
 * Built from HTML and CSS rather than an SVG with <text> in it. Text inside an
 * SVG cannot wrap and scales with the viewBox, so "Automated content systems"
 * overflowed its box and every label shrank on a narrow column. Real elements
 * wrap, inherit the type scale and reflow, which is what "works at every size"
 * actually requires. The only SVG left is the connector rail, because a line
 * that draws itself is the one thing CSS does worse.
 *
 * Stacks on small screens, runs left to right from `sm` up.
 */
export default function ServicesVisual() {
  const reduced = useReducedMotion();

  const item = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.42, delay: 0.08 + i * 0.07, ease: EASE },
    }),
  };

  const enter = (i: number) =>
    reduced
      ? {}
      : {
          custom: i,
          variants: item,
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once: true, amount: 0.3 },
        };

  return (
    <div
      className="w-full select-none"
      role="img"
      aria-label="Repeat work enters the studio, passes through four capabilities, and leaves as working software you own"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
        <motion.div
          {...enter(0)}
          className="flex shrink-0 flex-col justify-center rounded-xl bg-surface-sunken px-4 py-3 text-center sm:w-[116px] sm:text-left"
        >
          <p className="text-[0.8125rem] font-semibold leading-tight text-ink">Repeat work</p>
          <p className="t-label mt-1 whitespace-nowrap text-faint">Every week</p>
        </motion.div>

        <Rail reduced={!!reduced} />

        <ul className="flex min-w-0 flex-1 flex-col gap-2">
          {SERVICES.map((s, i) => (
            <motion.li
              key={s.slug}
              {...enter(i + 1)}
              className="flex min-w-0 items-baseline gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2.5"
            >
              <span className="t-label t-mono shrink-0 text-brand">{s.n}</span>
              {/* Wraps rather than truncating. "Automated content systems" has
                  to fit at any column width, so nothing is clipped here. */}
              <span className="min-w-0 text-[0.8125rem] font-semibold leading-snug text-ink">
                {s.title}
              </span>
            </motion.li>
          ))}
        </ul>

        <Rail reduced={!!reduced} delay={0.34} />

        <motion.div
          {...enter(5)}
          className="flex shrink-0 flex-col justify-center rounded-xl bg-brand px-4 py-3 text-center sm:w-[104px] sm:text-left"
        >
          <p className="text-[0.8125rem] font-semibold leading-tight text-paper">Shipped</p>
          <p className="t-label mt-1 whitespace-nowrap text-paper/70">You own it</p>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * A hairline that draws itself. Hidden when the layout stacks, because a
 * horizontal connector between vertically stacked blocks points nowhere.
 */
function Rail({ reduced, delay = 0.12 }: { reduced: boolean; delay?: number }) {
  if (reduced) {
    return (
      <div aria-hidden className="hidden w-4 self-center border-t border-line-strong sm:block" />
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 2"
      preserveAspectRatio="none"
      className="hidden h-[2px] w-4 shrink-0 self-center sm:block"
    >
      <motion.line
        x1="0"
        y1="1"
        x2="24"
        y2="1"
        stroke="hsl(var(--line-strong))"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.42, delay, ease: EASE }}
      />
    </svg>
  );
}
