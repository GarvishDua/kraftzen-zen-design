import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/Reveal";

/**
 * Sticky nav. Transparent over the hero, paper with a hairline once scrolled,
 * hidden while scrolling down past 240px so long pages get their height back.
 */
export default function SiteNav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const prev = useRef(0);
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextScrolled = latest > 24;
    const nextHidden = latest > prev.current && latest > 240 && !open;
    setScrolled((c) => (c === nextScrolled ? c : nextScrolled));
    setHidden((c) => (c === nextHidden ? c : nextHidden));
    prev.current = latest;
  });

  // Close the drawer and reset scroll on navigation.
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  // Lock the page while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      <motion.header
        animate={{ y: hidden ? -96 : 0 }}
        transition={{ duration: 0.24, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-short ease-out",
          scrolled ? "border-b border-line bg-paper/85 backdrop-blur-md" : "bg-transparent"
        )}
      >
        <nav
          aria-label="Primary"
          className="shell flex h-[72px] items-center justify-between gap-6"
        >
          <Link
            to="/"
            aria-label={`${SITE.name} home`}
            className="group flex items-center gap-2.5"
          >
            <img
              src="/logo-mark-128.png"
              alt=""
              width={128}
              height={128}
              className="h-8 w-8 rounded-lg object-cover transition-transform duration-short ease-out group-hover:-rotate-6"
            />
            <span className="flex items-baseline gap-1.5 text-[1.0625rem] font-semibold tracking-tight text-ink">
              {SITE.name}
              <span className="block h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
            </span>
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "text-[0.9375rem] transition-colors duration-short ease-out hover:text-ink",
                      isActive ? "text-ink" : "text-muted-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <span className="relative inline-block">
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute -bottom-1.5 left-0 right-0 block h-px bg-brand"
                        />
                      )}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.875rem] font-medium text-paper transition-colors duration-short ease-out hover:bg-brand"
            >
              Start a project
              <ArrowRight
                size={15}
                className="transition-transform duration-short ease-out group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 p-2 text-ink md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE }}
            className="fixed inset-0 z-40 bg-paper pt-[72px] md:hidden"
          >
            <div className="shell flex h-full flex-col justify-between py-10">
              <ul className="space-y-1">
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.34, delay: 0.04 + i * 0.05, ease: EASE }}
                    className="border-b border-line"
                  >
                    <Link to={item.to} className="t-h2 block py-5">
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="space-y-6">
                <Link
                  to="/contact"
                  className="flex w-full items-center justify-between rounded-full bg-ink px-6 py-4 text-paper"
                >
                  Start a project
                  <ArrowRight size={17} />
                </Link>
                <div className="t-small space-y-1 text-muted-foreground">
                  <a href={`mailto:${SITE.email}`} className="block link-underline">
                    {SITE.email}
                  </a>
                  <a href={SITE.phoneHref} className="block link-underline">
                    {SITE.phone}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
