import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { EASE } from "./Reveal";
import { PRODUCTS, SITE } from "@/lib/site";

/**
 * The studio as a picture: one founder, one city, two live products.
 *
 * Every number here is real and already on the page in words. Nothing is
 * invented, which rules out the usual about-page stock photo of eight people
 * around a table implying a team that does not exist.
 *
 * The motion is a count up on the two figures and a slow orbit on the product
 * marks, both of which stop dead under `prefers-reduced-motion`.
 */
export default function AboutVisual() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className="w-full select-none">
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        {/* Studio line. Deliberately NOT the founder photo and name: those get
            a full section further down the page, and running them twice is the
            repetition this site keeps having to be saved from. */}
        <div className="mb-5 flex items-center gap-3 border-b border-line pb-5">
          <img
            src="/logo-mark.png"
            alt=""
            width={128}
            height={128}
            loading="lazy"
            decoding="async"
            className="h-10 w-10 shrink-0 rounded-full bg-surface object-contain p-0.5 ring-1 ring-line"
          />
          <div className="min-w-0">
            <p className="truncate text-[0.9375rem] font-semibold tracking-tight text-ink">
              {SITE.name}
            </p>
            <p className="t-label t-mono flex items-center gap-1.5 text-faint">
              <MapPin size={11} aria-hidden />
              {SITE.city}, {SITE.country}
            </p>
          </div>
        </div>

        {/* Two real figures */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <Figure label="Products live" value={PRODUCTS.length} inView={inView} reduced={!!reduced} />
          <Figure label="Both public" value={100} suffix="%" inView={inView} reduced={!!reduced} />
        </div>

        {/* The two products, orbiting gently */}
        <ul className="grid gap-2">
          {PRODUCTS.map((p, i) => (
            <motion.li
              key={p.slug}
              initial={reduced ? undefined : { opacity: 0, x: -6 }}
              animate={inView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.42, delay: 0.2 + i * 0.08, ease: EASE }}
              className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2.5"
            >
              <motion.img
                src={p.logo}
                alt=""
                width={256}
                height={256}
                loading="lazy"
                decoding="async"
                animate={
                  reduced
                    ? undefined
                    : { y: [0, -3, 0] }
                }
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`h-8 w-8 shrink-0 rounded-lg object-contain ${
                  p.logoOnDark ? "bg-ink" : "bg-surface p-0.5 ring-1 ring-line"
                }`}
              />
              <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-semibold text-ink">
                {p.name}
              </span>
              <span className="t-label t-mono shrink-0 text-brand">{p.status}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Counts up once, when the card first enters the viewport. */
function Figure({
  label,
  value,
  suffix = "",
  inView,
  reduced,
}: {
  label: string;
  value: number;
  suffix?: string;
  inView: boolean;
  reduced: boolean;
}) {
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) {
      if (reduced) setShown(value);
      return;
    }

    // Short and linear. A long eased counter reads as a loading spinner.
    const duration = 700;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setShown(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value]);

  return (
    <div className="rounded-xl bg-surface-sunken px-4 py-3">
      <p className="t-mono text-[1.375rem] leading-none text-ink">
        {shown}
        {suffix}
      </p>
      <p className="t-label mt-2 text-faint">{label}</p>
    </div>
  );
}
