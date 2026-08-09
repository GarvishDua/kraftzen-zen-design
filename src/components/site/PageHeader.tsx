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
  /**
   * Optional visual for the right column.
   *
   * Passing this switches the header to two columns on desktop. Without it the
   * header stays exactly as it was, single column, so pages that do not have a
   * visual worth showing are unchanged rather than padded with decoration.
   */
  aside?: ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  accent,
  titleTail,
  lead,
  children,
  aside,
}: PageHeaderProps) {
  const text = (
    <>
      <Reveal>
        <p className="t-label mb-7 text-brand">{eyebrow}</p>
      </Reveal>

      <h1 className={`t-h1 mb-8 ${aside ? "max-w-[13ch]" : "max-w-[15ch]"}`}>
        <WordReveal text={title} accent={accent} tail={titleTail} delay={0.08} />
      </h1>

      {lead && (
        <Reveal delay={0.18}>
          <p className="t-lead max-w-measure">{lead}</p>
        </Reveal>
      )}

      {children && <Reveal delay={0.26}>{children}</Reveal>}
    </>
  );

  return (
    <header className="grain relative border-b border-line pb-16 pt-36 md:pb-24 md:pt-44">
      <div className="shell relative z-10">
        {aside ? (
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">{text}</div>
            {/* Shows at every size. On mobile the grid collapses to one column
                and this sits after the lead and the CTA, so nothing important
                is pushed below the fold. The visuals themselves reflow. */}
            <div className="lg:col-span-5">
              <Reveal delay={0.22}>{aside}</Reveal>
            </div>
          </div>
        ) : (
          text
        )}
      </div>
    </header>
  );
}
