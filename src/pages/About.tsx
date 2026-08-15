import Layout from "@/components/site/Layout";
import Seo, { breadcrumbSchema, organizationSchema } from "@/components/site/Seo";
import PageHeader from "@/components/site/PageHeader";
import AboutVisual from "@/components/motion/AboutVisual";
import { PillLink } from "@/components/site/Cta";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ABOUT, PRINCIPLES, FOUNDER, SITE } from "@/lib/site";

export default function About() {
  return (
    <Layout>
      <Seo
        title="About"
        description="Kraftzen is an AI studio in Delhi, founded by Garvish Dua. We build our own products alongside client work, quote fixed numbers, and hand over everything we build."
        path="/about"
        schema={[
          organizationSchema,
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: `About ${SITE.name}`,
            url: `${SITE.domain}/about`,
            mainEntity: { "@id": `${SITE.domain}/#organization` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="About"
        title="An AI studio that would rather show you the"
        accent="thing."
        lead={ABOUT.lead}
        aside={<AboutVisual />}
      />

      {/* Narrative */}
      <section className="py-section md:py-section-md">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Reveal x={-16}>
                <p className="t-label mb-7 text-brand">Who we are</p>
              </Reveal>
              <Stagger as="dl" className="border-t border-line">
                {ABOUT.facts.map((fact) => (
                  <StaggerItem
                    key={fact.label}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-3.5"
                  >
                    <dt className="t-label text-faint">{fact.label}</dt>
                    <dd className="t-small text-right text-ink">{fact.value}</dd>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
          <div className="md:col-span-8 space-y-7">
            {ABOUT.body.map((para, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="t-lead max-w-measure !text-ink-soft">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section
        aria-labelledby="principles-heading"
        className="border-y border-line bg-surface-sunken py-section md:py-section-md"
      >
        <div className="shell">
          <Reveal>
            <p className="t-label mb-5 text-brand">How we work</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="principles-heading" className="t-h2 mb-14 max-w-[16ch]">
              Four rules we do not <span className="t-accent">bend</span>.
            </h2>
          </Reveal>

          <Stagger as="ul" className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <StaggerItem as="li" key={p.n} className="bg-paper p-7 md:p-10">
                <p className="t-label t-mono mb-6 text-faint">{p.n}</p>
                <h3 className="t-h3 mb-3">{p.title}</h3>
                <p className="t-small text-muted-foreground">{p.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Founder */}
      <section aria-labelledby="founder-heading" className="py-section md:py-section-md">
        <div className="shell grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <Reveal x={-20}>
              <img
                src={FOUNDER.photo}
                alt={`${FOUNDER.name}, founder of ${SITE.name}`}
                loading="lazy"
                decoding="async"
                width={1000}
                height={1304}
                className="w-full rounded-lg border border-line object-cover"
              />
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.08}>
              <p className="t-label mb-6 text-brand">{FOUNDER.role}</p>
            </Reveal>
            <Reveal delay={0.12}>
              <h2 id="founder-heading" className="t-h2 mb-8">
                {FOUNDER.name}
              </h2>
            </Reveal>
            {FOUNDER.body.map((para, i) => (
              <Reveal key={i} delay={0.16 + i * 0.05}>
                <p className="mb-5 max-w-measure text-muted-foreground">{para}</p>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <div className="mt-6">
                <PillLink to="/contact">
                  Talk to {FOUNDER.name.split(" ")[0]}
                </PillLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
