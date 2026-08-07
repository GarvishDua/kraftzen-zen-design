import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { PROCESS } from "@/lib/site";
import { useIsMobile } from "@/hooks/use-mobile";
import { EASE } from "./Reveal";

/**
 * The explanatory motion graphic.
 *
 * A pinned section where a connector line draws itself across four nodes as the
 * reader scrolls, activating each step in turn. This is the one place on the
 * site where motion is doing work the copy would otherwise have to do: it shows
 * a process moving from a mess to a handover.
 *
 * Desktop pins for 320vh and draws left to right.
 * Mobile drops the pin and draws a vertical rail instead, because pinning on a
 * short viewport steals more than it gives.
 * Reduced motion renders the finished diagram immediately.
 */
export default function ProcessPipeline() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  if (isMobile || reduced) return <PipelineStacked reduced={!!reduced} />;
  return <PipelinePinned />;
}

/* ------------------------------------------------------------------ */
/* Desktop: pinned, horizontal, self drawing                           */
/* ------------------------------------------------------------------ */

function PipelinePinned() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Smooth the raw progress so the line does not jitter on trackpad scroll.
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 34,
    restDelta: 0.0005,
  });

  // The line finishes drawing at 88% so the last node has room to settle.
  const pathLength = useTransform(progress, [0.06, 0.88], [0, 1], { clamp: true });
  const railWidth = useTransform(pathLength, (v) => `${v * 100}%`);

  return (
    <section
      ref={ref}
      aria-labelledby="process-heading"
      className="relative h-[250vh] bg-paper"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="shell w-full">
          {/* Header spacing shrinks on short laptops so the four columns
              always fit inside the pinned viewport without clipping. */}
          <header className="mb-10 flex items-end justify-between gap-8 [@media(min-height:820px)]:mb-16">
            <div>
              <p className="t-label mb-4 text-brand [@media(min-height:820px)]:mb-5">
                How we work
              </p>
              <h2
                id="process-heading"
                className="t-h2 max-w-[16ch] [@media(max-height:819px)]:text-[2rem]"
              >
                Four steps, and you keep <span className="t-accent">everything</span>.
              </h2>
            </div>
            <StepCounter progress={progress} />
          </header>

          <div className="relative">
            {/* Static rail, then the drawn rail on top of it. */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-[26px] h-px bg-line"
            />
            <motion.div
              aria-hidden
              style={{ width: railWidth }}
              className="absolute left-0 top-[26px] h-px origin-left bg-brand"
            />
            {/* The head of the line. Makes the draw legible as travel rather
                than a bar quietly getting longer. */}
            <motion.span
              aria-hidden
              style={{ left: railWidth }}
              className="absolute top-[26px] block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand ring-4 ring-paper"
            />

            <ol className="relative grid grid-cols-4 gap-6 lg:gap-10">
              {PROCESS.map((step, i) => (
                <PinnedStep key={step.n} step={step} index={i} progress={progress} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function PinnedStep({
  step,
  index,
  progress,
}: {
  step: (typeof PROCESS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  // Each node lights up as the rail reaches it.
  const at = 0.06 + (index / (PROCESS.length - 1)) * 0.82;
  const lit = useTransform(progress, [at - 0.09, at], [0, 1], { clamp: true });

  const dotScale = useTransform(lit, [0, 1], [0.55, 1]);
  const dotColor = useTransform(lit, [0, 1], ["hsl(35 24% 75%)", "hsl(13 78% 53%)"]);
  const textOpacity = useTransform(lit, [0, 1], [0.28, 1]);
  const y = useTransform(lit, [0, 1], [14, 0]);

  return (
    <li className="relative">
      <motion.span
        aria-hidden
        style={{ scale: dotScale, backgroundColor: dotColor }}
        className="absolute left-0 top-[19px] block h-3.5 w-3.5 rounded-full ring-4 ring-paper"
      />
      <motion.div style={{ opacity: textOpacity, y }} className="pt-12 [@media(min-height:820px)]:pt-14">
        <p className="t-label t-mono mb-3 text-faint [@media(min-height:820px)]:mb-4">
          {step.n}
        </p>
        <h3 className="t-h3 mb-2 [@media(min-height:820px)]:mb-3">
          {step.verb} <span className="text-brand">{step.artifact}</span>
        </h3>
        <p className="t-small text-muted-foreground">{step.detail}</p>
      </motion.div>
    </li>
  );
}

function StepCounter({ progress }: { progress: MotionValue<number> }) {
  const index = useTransform(progress, (v) => {
    const raw = Math.floor(v * PROCESS.length) + 1;
    return String(Math.min(Math.max(raw, 1), PROCESS.length)).padStart(2, "0");
  });

  return (
    <p className="t-label t-mono shrink-0 text-faint" aria-hidden>
      <motion.span className="text-ink">{index}</motion.span>
      {" / "}
      {String(PROCESS.length).padStart(2, "0")}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile and reduced motion: vertical rail, no pin                    */
/* ------------------------------------------------------------------ */

function PipelineStacked({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section aria-labelledby="process-heading-m" className="bg-paper py-section">
      <div className="shell">
        <p className="t-label mb-5 text-brand">How we work</p>
        <h2 id="process-heading-m" className="t-h2 mb-14 max-w-[16ch]">
          Four steps, and you keep <span className="t-accent">everything</span>.
        </h2>

        <div ref={ref} className="relative pl-10">
          <div aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line" />
          {!reduced && (
            <motion.div
              aria-hidden
              style={{ height: railHeight }}
              className="absolute left-[7px] top-2 w-px origin-top bg-brand"
            />
          )}
          {reduced && (
            <div aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-brand" />
          )}

          <ol className="space-y-12">
            {PROCESS.map((step, i) => (
              <motion.li
                key={step.n}
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
                transition={{ duration: 0.42, delay: i * 0.04, ease: EASE }}
                className="relative"
              >
                <span
                  aria-hidden
                  className="absolute -left-10 top-1.5 block h-3.5 w-3.5 rounded-full bg-brand ring-4 ring-paper"
                />
                <p className="t-label t-mono mb-3 text-faint">{step.n}</p>
                <h3 className="t-h3 mb-2">
                  {step.verb} <span className="text-brand">{step.artifact}</span>
                </h3>
                <p className="t-small text-muted-foreground">{step.detail}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
