import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The two link shapes used across the site.
 *
 * Pill is reserved for the primary CTA, at most one per viewport.
 * Arrow is everything else. See DESIGN.md "Layout / Border radius".
 */

interface PillProps {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}

export function PillLink({
  to,
  href,
  children,
  variant = "solid",
  className,
}: PillProps) {
  const classes = cn(
    "group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[0.9375rem] font-medium",
    "transition-colors duration-short ease-out",
    variant === "solid"
      ? "bg-ink text-paper hover:bg-brand"
      : "border border-line-strong text-ink hover:border-ink hover:bg-surface",
    className
  );

  const inner = (
    <>
      {children}
      <ArrowRight
        size={16}
        className="transition-transform duration-short ease-out group-hover:translate-x-1"
      />
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={to ?? "/contact"} className={classes}>
      {inner}
    </Link>
  );
}

interface ArrowLinkProps {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

export function ArrowLink({ to, href, children, className, external }: ArrowLinkProps) {
  const classes = cn(
    "group inline-flex items-center gap-2 font-medium text-ink",
    "transition-colors duration-short ease-out hover:text-brand",
    className
  );

  const Icon = href || external ? ArrowUpRight : ArrowRight;

  const inner = (
    <>
      <span className="link-underline">{children}</span>
      <Icon
        size={16}
        className={cn(
          "transition-transform duration-short ease-out",
          href || external
            ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            : "group-hover:translate-x-1"
        )}
      />
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link to={to ?? "/"} className={classes}>
      {inner}
    </Link>
  );
}
