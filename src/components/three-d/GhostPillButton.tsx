import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}

export default function GhostPillButton({ to, href, children, className = "" }: Props) {
  const cls = `inline-flex items-center justify-center rounded-full border-2 border-[#D7E2EA] px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10 ${className}`;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  return <Link to={to || "/"} className={cls}>{children}</Link>;
}
