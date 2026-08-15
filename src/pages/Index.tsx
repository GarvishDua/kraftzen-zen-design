import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Layout from "@/components/site/Layout";
import Seo, { organizationSchema, websiteSchema } from "@/components/site/Seo";
import { PillLink, ArrowLink } from "@/components/site/Cta";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import WordReveal from "@/components/motion/WordReveal";
import HeroConstellation from "@/components/motion/HeroConstellation";
import CapabilityMarquee from "@/components/motion/CapabilityMarquee";
import ProcessPipeline from "@/components/motion/ProcessPipeline";
import { HERO, HERO_PROOF, SERVICES, PRODUCTS, ABOUT, FOUNDER, SITE } from "@/lib/site";

export default function Index() {
  return (
    <Layout>
      <Seo
        title="Kraftzen | AI tools, automation and websites for small teams"
        description="Kraftzen is an AI studio in Delhi. We build AI tools, workflow automation, websites and automated content systems for small teams. Two products live, fixed quotes, you own the code."
        path="/"
        schema={[organizationSchema, websiteSchema]}
      />

      <Hero />
      <CapabilityMarquee />
      <ServicesPreview />
      <ProductsPreview />
      <ProcessPipeline />
      <FounderNote />
    </Layout>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -48]);

  return (
    <section ref={ref} className="grain relative overflow-hidden pb-16 pt-28 md:pb-20 md:pt-32">
      <motion.div style={{ y }} className="shell relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Copy. Six and six rather than seven and five: the constellation
              needs real width or it reads as a few small chips, which is the
              failure the old panel version was avoiding. The h1 is capped at
              15ch so it still breaks the same way. */}
          <div className="lg:col-span-6">
            <Reveal>
              <p className="t-label mb-6 text-brand">{HERO.eyebrow}</p>
            </Reveal>

            <h1 className="t-h1 mb-7 max-w-[15ch]">
              <WordReveal
                text={HERO.headingLead}
                accent={HERO.headingAccent}
                tail={HERO.headingTail}
                delay={0.1}
              />
            </h1>

            <Reveal delay={0.3}>
              <p className="t-lead mb-9 max-w-measure">{HERO.body}</p>
            </Reveal>

            <Reveal delay={0.38}>
              <div className="flex flex-wrap items-center gap-4">
                <PillLink to={HERO.primaryCta.to}>{HERO.primaryCta.label}</PillLink>
                <ArrowLink to={HERO.secondaryCta.to} className="px-2 py-3.5">
                  {HERO.secondaryCta.label}
                </ArrowLink>
              </div>
            </Reveal>
          </div>

          {/* Visual. The rails were removed with the panel: they existed to
              show work flowing INTO a panel, and with the panel gone they had
              nothing to point at. `HeroVisual` and `HeroRails` are both still
              in the repo if this needs reverting. */}
          <div className="lg:col-span-6 lg:pl-4 xl:pl-8">
            <HeroConstellation />
          </div>
        </div>

        {/* Proof strip. Four things that are true today, no invented metrics. */}
        <Stagger
          as="ul"
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line md:mt-20 md:grid-cols-4"
        >
          {HERO_PROOF.map((item) => (
            <StaggerItem as="li" key={item.label} className="bg-paper p-6 md:p-7">
              <p className="t-mono mb-2 text-[1.75rem] leading-none text-ink">{item.value}</p>
              <p className="t-small text-muted-foreground">{item.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ServicesPreview() {
  return (
    <section aria-labelledby="services-heading" className="py-section md:py-section-md">
      <div className="shell">
        <div className="mb-12 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <p className="t-label mb-5 text-brand">What we do</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="services-heading" className="t-h2 max-w-[18ch]">
                Four things, done <span className="t-accent">properly</span>.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:justify-self-end">
            <Reveal delay={0.12}>
              <ArrowLink to="/services">All services in detail</ArrowLink>
            </Reveal>
          </div>
        </div>

        <Stagger as="ul" className="border-t border-line">
          {SERVICES.map((service) => (
            <StaggerItem as="li" key={service.slug}>
              <Link
                to={`/services#${service.slug}`}
                className="group grid gap-4 border-b border-line py-8 transition-colors duration-short ease-out hover:bg-surface md:grid-cols-12 md:items-baseline md:gap-8 md:py-10"
              >
                <span className="t-label t-mono text-faint md:col-span-1">{service.n}</span>
                <h3 className="t-h3 transition-colors duration-short ease-out group-hover:text-brand md:col-span-4">
                  {service.title}
                </h3>
                <p className="t-small max-w-measure text-muted-foreground md:col-span-6">
                  {service.summary}
                </p>
                <span
                  aria-hidden
                  className="t-label text-faint transition-all duration-short ease-out group-hover:translate-x-1 group-hover:text-brand md:col-span-1 md:justify-self-end"
                >
                  →
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Two big cards. Deliberately a different shape from the products page, which
 * goes into module level detail. Here it is just: these exist, they are live,
 * go and look.
 */
function ProductsPreview() {
  return (
    <section
      aria-labelledby="products-heading"
      className="border-y border-line bg-surface-sunken py-section md:py-section-md"
    >
      <div className="shell">
        <div className="mb-12 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <p className="t-label mb-5 text-brand">Our own products</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="products-heading" className="t-h2 max-w-[18ch]">
                We use this stack on <span className="t-accent">ourselves</span> first.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:justify-self-end">
            <Reveal delay={0.12}>
              <ArrowLink to="/products">Both products in detail</ArrowLink>
            </Reveal>
          </div>
        </div>

        <Stagger as="ul" className="grid gap-6 md:grid-cols-2">
          {PRODUCTS.map((product) => (
            <StaggerItem as="li" key={product.slug}>
              <a
                href={product.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors duration-short ease-out hover:border-line-strong"
              >
                <div className="overflow-hidden border-b border-line">
                  <img
                    src={product.cover.src}
                    alt={product.cover.alt}
                    width={1200}
                    height={700}
                    loading="lazy"
                    decoding="async"
                    className="h-[220px] w-full object-cover object-top transition-transform duration-long ease-out group-hover:scale-[1.03] md:h-[280px]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-7 md:p-8">
                  {/* The mark straddles the screenshot edge, so the card reads
                      as a product rather than a post with a header image. */}
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <img
                      src={product.logo}
                      alt=""
                      width={256}
                      height={256}
                      loading="lazy"
                      decoding="async"
                      className={`-mt-14 h-14 w-14 shrink-0 rounded-lg object-contain ring-1 ring-line ${
                        product.logoOnDark ? "bg-ink" : "bg-surface p-1"
                      }`}
                    />
                    <span className="t-label t-mono text-faint">{product.n}</span>
                  </div>

                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="block h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
                    <span className="t-label text-brand">{product.status}</span>
                  </div>

                  <h3 className="t-h3 mb-2.5">{product.name}</h3>
                  <p className="t-small mb-7 text-muted-foreground">{product.summary}</p>

                  <span className="mt-auto inline-flex items-center gap-2 font-medium text-ink transition-colors duration-short ease-out group-hover:text-brand">
                    <span className="link-underline">{product.ctaLabel}</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-short ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Closes the page on a person rather than a pitch. Sits directly above the
 * footer CTA, so the last thing a reader sees before the ask is who they would
 * actually be talking to.
 */
function FounderNote() {
  return (
    <section
      aria-labelledby="founder-note-heading"
      className="border-t border-line bg-surface-sunken py-section md:py-section-md"
    >
      <div className="shell grid items-center gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5 lg:col-span-4">
          <Reveal x={-16}>
            <div className="relative">
              {/* Offset frame, same device as the hero panel. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-3 -translate-y-3 rounded-lg border border-line-strong"
              />
              <img
                src={FOUNDER.photo}
                alt={`${FOUNDER.name}, founder of ${SITE.name}`}
                width={1000}
                height={1304}
                loading="lazy"
                decoding="async"
                className="relative w-full rounded-lg border border-line object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-7 lg:col-span-7 lg:col-start-6">
          <Reveal>
            <p className="t-label mb-6 text-brand">The studio</p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 id="founder-note-heading" className="t-h2 mb-8 max-w-[20ch]">
              {ABOUT.lead}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="t-lead mb-6 max-w-measure">{ABOUT.body[0]}</p>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mb-9 max-w-measure text-muted-foreground">{FOUNDER.homeNote}</p>
          </Reveal>

          {/* Signature block. Names the person behind everything above. */}
          <Reveal delay={0.18}>
            <div className="mb-9 flex items-center gap-4 border-t border-line pt-6">
              <img
                src="/logo-mark.png"
                alt=""
                width={128}
                height={128}
                loading="lazy"
                className="h-11 w-11 shrink-0 rounded-full bg-surface object-contain p-1 ring-1 ring-line"
              />
              <div>
                <p className="font-semibold tracking-tight text-ink">{FOUNDER.name}</p>
                <p className="t-small text-muted-foreground">
                  {FOUNDER.role}, {SITE.name}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <PillLink to="/contact">
                Talk to {FOUNDER.name.split(" ")[0]}
              </PillLink>
              <ArrowLink to="/about">More about the studio</ArrowLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
