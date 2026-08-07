import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The single reveal primitive. Every section on the site uses this one,
 * which is what makes the motion read as consistent rather than assorted.
 *
 * 24px up + opacity, 420ms, ease-out, fires once at 20% viewport entry.
 * See DESIGN.md "Motion".
 */

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Horizontal entry instead of vertical. Used for gutter labels. */
  x?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "footer";
}

export function Reveal({ children, delay = 0, className, x = 0, as = "div" }: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      initial={{ opacity: 0, y: reduced ? 0 : 24, x: reduced ? 0 : x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: reduced ? 0 : 0.42, delay: reduced ? 0 : delay, ease: EASE }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Stagger container. Children marked with <RevealItem> inherit the timing,
 * so a list never needs hand written per item delays.
 */
export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "dl" | "section";
}

export function Stagger({ children, className, as = "div" }: StaggerProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      variants={reduced ? undefined : staggerParent}
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      className={className}
    >
      {children}
    </Tag>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}

export function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag variants={reduced ? undefined : staggerChild} className={className}>
      {children}
    </Tag>
  );
}

export { EASE };
