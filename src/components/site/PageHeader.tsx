import type { ReactNode } from "react";
import WordReveal from "@/components/motion/WordReveal";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Shared header for every route except Home, which gets its own hero.
 * Keeps the h1 treatment identical across pages so the site reads as one thing.
 */
interface PageHeaderProps {
  eyebrow: string;
  /** Words before the accent word. */
  title: string;
  /** The single italic accent word. */
  accent?: string;
  /** Words after the accent word. */
  titleTail?: string;
  lead?: string;
  children?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  accent,
  titleTail,
  lead,
  children,
}: PageHeaderProps) {
  return (
    <header className="grain relative border-b border-line pb-16 pt-36 md:pb-24 md:pt-44">
      <div className="shell relative z-10">
        <Reveal>
          <p className="t-label mb-7 text-brand">{eyebrow}</p>
        </Reveal>

        <h1 className="t-h1 mb-8 max-w-[15ch]">
          <WordReveal text={title} accent={accent} tail={titleTail} delay={0.08} />
        </h1>

        {lead && (
          <Reveal delay={0.18}>
            <p className="t-lead max-w-measure">{lead}</p>
          </Reveal>
        )}

        {children && <Reveal delay={0.26}>{children}</Reveal>}
      </div>
    </header>
  );
}
