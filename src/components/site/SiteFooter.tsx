import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SITE, NAV, SERVICES } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The one inverted block on the site. Ink ground, paper text.
 * Doubles as the closing CTA so no page ends on a dead end.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="shell py-20 md:py-28">
        {/* Closing CTA */}
        <Reveal>
          <div className="mb-20 border-b border-paper/15 pb-16 md:mb-24 md:pb-20">
            <p className="t-label mb-6 text-brand">Next step</p>
            <h2 className="t-h1 mb-8 max-w-[14ch]">
              One call is usually <span className="t-accent">enough</span> to know.
            </h2>
            <p className="t-lead mb-10 max-w-lead !text-paper/60">
              Thirty minutes, no deck. If we are not the right people for the job we
              will say so on that call and point you somewhere better.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-paper px-7 py-4 font-medium text-ink transition-colors duration-short ease-out hover:bg-brand hover:text-paper"
            >
              Start a project
              <ArrowUpRight
                size={18}
                className="transition-transform duration-short ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Reveal>

        {/* Directory */}
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/logo-mark-128.webp"
                alt=""
                width={128}
                height={128}
                loading="lazy"
                className="h-11 w-11 rounded-lg object-cover"
              />
              <p className="flex items-baseline gap-1.5 text-lg font-semibold tracking-tight">
                {SITE.name}
                <span className="block h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
              </p>
            </div>
            <p className="t-small max-w-[34ch] text-paper/55">
              An AI studio in {SITE.city}. We build the tools, automation and sites
              that take repeat work off small teams.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="t-label mb-5 text-paper/40">Site</p>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="t-small text-paper/75 transition-colors duration-short hover:text-paper">
                  Home
                </Link>
              </li>
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="t-small text-paper/75 transition-colors duration-short hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="t-label mb-5 text-paper/40">Services</p>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services#${s.slug}`}
                    className="t-small text-paper/75 transition-colors duration-short hover:text-paper"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <address className="not-italic md:col-span-2">
            <p className="t-label mb-5 text-paper/40">Contact</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="t-small break-all text-paper/75 transition-colors duration-short hover:text-paper"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.phoneHref}
                  className="t-small text-paper/75 transition-colors duration-short hover:text-paper"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="t-small text-paper/55">
                {SITE.city}, {SITE.country}
              </li>
            </ul>
          </address>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-label t-mono text-paper/40">
            © {year} {SITE.name}
          </p>
          <ul className="flex gap-6">
            <li>
              <Link to="/privacy" className="t-label text-paper/40 transition-colors duration-short hover:text-paper">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="t-label text-paper/40 transition-colors duration-short hover:text-paper">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
