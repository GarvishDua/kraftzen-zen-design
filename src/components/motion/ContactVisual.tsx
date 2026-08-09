import { motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Phone, FileText } from "lucide-react";
import { EASE } from "./Reveal";

/**
 * What happens after you send the form, drawn as three steps.
 *
 * This is the same three lines already written on the contact page, given a
 * shape. It replaces the usual stock photo of a headset, which would have said
 * nothing and clashed with the palette on a page where someone is deciding
 * whether to trust us.
 *
 * The live dot pulses to suggest an open line. It is the only looping animation
 * on the site and it stops under `prefers-reduced-motion`.
 */

const STEPS = [
  {
    icon: MessageSquare,
    title: "You write",
    detail: "Reply within one business day",
  },
  {
    icon: Phone,
    title: "One call",
    detail: "Thirty minutes, no deck",
  },
  {
    icon: FileText,
    title: "A fixed price",
    detail: "And a date, in writing",
  },
];

export default function ContactVisual() {
  const reduced = useReducedMotion();

  return (
    <div
      className="w-full select-none"
      role="img"
      aria-label="Three steps after you send the form: you write and we reply within one business day, a thirty minute call, then a fixed price and a date in writing"
    >
      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2.5 border-b border-line pb-4">
          <span className="relative flex h-2 w-2 shrink-0">
            {!reduced && (
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-brand"
                animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          <p className="t-label text-muted-foreground">Line is open</p>
        </div>

        <ol className="relative grid gap-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.title}
                initial={reduced ? undefined : { opacity: 0, y: 8 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.42, delay: 0.08 + i * 0.09, ease: EASE }}
                className="flex min-w-0 items-center gap-3.5 rounded-xl bg-paper px-3.5 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <Icon size={16} aria-hidden />
                </span>
                <span className="min-w-0">
                  {/* Real text, so it wraps instead of overflowing. */}
                  <span className="block text-[0.8125rem] font-semibold leading-snug text-ink">
                    {step.title}
                  </span>
                  <span className="t-label block leading-snug text-faint">{step.detail}</span>
                </span>
                <span className="t-label t-mono ml-auto shrink-0 text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
