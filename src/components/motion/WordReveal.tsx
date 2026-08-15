import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./Reveal";

/**
 * Word by word display reveal. Used once per page, on the h1 only.
 *
 * Each word sits in an overflow-hidden box and slides up from below it, so the
 * line assembles rather than fading. Accessible name stays intact because the
 * whole string is still one text node per word inside a normal heading.
 */

interface WordRevealProps {
  /** Plain words rendered in ink. */
  text: string;
  /** Optional word rendered in the accent italic. Placed after `text`. */
  accent?: string;
  /** Words rendered after the accent word. */
  tail?: string;
  className?: string;
  delay?: number;
}

export default function WordReveal({
  text,
  accent,
  tail,
  className,
  delay = 0,
}: WordRevealProps) {
  const reduced = useReducedMotion();

  const parts: { word: string; accent: boolean }[] = [
    ...text.split(" ").filter(Boolean).map((word) => ({ word, accent: false })),
    ...(accent ? [{ word: accent, accent: true }] : []),
    ...(tail ? tail.split(" ").filter(Boolean).map((word) => ({ word, accent: false })) : []),
  ];

  if (reduced) {
    return (
      <span className={className}>
        {parts.map((p, i) => (
          <span key={i} className={p.accent ? "t-accent" : undefined}>
            {p.word}
            {i < parts.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className={className}>
      {parts.map((p, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom pb-[0.08em] pr-[0.24em]"
        >
          <motion.span
            className={`inline-block ${p.accent ? "t-accent" : ""}`}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.7, delay: delay + i * 0.055, ease: EASE }}
          >
            {p.word}
          </motion.span>
          {/* A real space, so the heading is still words when read as text.
              Word gaps are drawn with `pr-[0.24em]`, which produces no
              character, so `textContent` on the h1 used to come back as
              "Lessonsthatcostusmoney." That is the highest-weight element on
              the page for both search and AI extraction, and it was arriving
              as one unbroken string. A trailing space at the end of an
              inline-block is trimmed for rendering, so this is invisible. */}
          {i < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
