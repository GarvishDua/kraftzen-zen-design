import { Link } from "react-router-dom";

interface Props {
  to?: string;
  label?: string;
  className?: string;
}

export default function ContactButton({ to = "/contact", label = "Get in Touch", className = "" }: Props) {
  return (
    <Link
      to={to}
      className={`btn-contact-gradient inline-flex items-center justify-center rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base font-medium uppercase tracking-widest text-white transition-transform hover:scale-[1.03] ${className}`}
    >
      {label}
    </Link>
  );
}
