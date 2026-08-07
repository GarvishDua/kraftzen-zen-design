import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import Layout from "@/components/site/Layout";
import Seo, { breadcrumbSchema, faqSchema, organizationSchema } from "@/components/site/Seo";
import PageHeader from "@/components/site/PageHeader";
import { PillLink, ArrowLink } from "@/components/site/Cta";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SERVICES, FAQS, ENGAGEMENTS, SITE } from "@/lib/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** Each service becomes a Service entity so the page can rank on its own terms. */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Kraftzen services",
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      description: s.summary,
      url: `${SITE.domain}/services#${s.slug}`,
      provider: { "@id": `${SITE.domain}/#organization` },
      areaServed: "Worldwide",
    },
  })),
};

export default function Services() {
  const { hash } = useLocation();

  // Deep links from the nav and footer land on the right block.
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) {
      requestAnimationFrame(() =>
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    }
  }, [hash]);

  return (
    <Layout>
      <Seo
        title="Services"
        description="AI tools and agents, workflow automation, websites and web apps, and automated content systems. Fixed quotes, clear timelines, and you own the code at the end."
        path="/services"
        schema={[
          organizationSchema,
          serviceSchema,
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Services"
        title="Four ways we take work off your"
        accent="plate"
        lead="Every engagement starts the same way. One call, a fixed number, a date. No retainers you cannot cancel and no tools that stop working when we stop invoicing."
      >
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <PillLink to="/contact">Start a project</PillLink>
          <ArrowLink to="/products">See what we have built</ArrowLink>
        </div>
      </PageHeader>

      {SERVICES.map((service, i) => (
        <section
          key={service.slug}
          id={service.slug}
          aria-labelledby={`${service.slug}-heading`}
          className={
            i % 2 === 1
              ? "scroll-mt-24 border-b border-line bg-surface-sunken py-section md:py-section-md"
              : "scroll-mt-24 border-b border-line py-section md:py-section-md"
          }
        >
          <div className="shell grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <Reveal x={-16}>
                <div className="md:sticky md:top-28">
                  <p className="t-label t-mono mb-6 text-faint">{service.n}</p>
                  <h2 id={`${service.slug}-heading`} className="t-h2 max-w-[12ch]">
                    {service.title}
                  </h2>
                </div>
              </Reveal>
            </div>

            <div className="md:col-span-8">
              <Reveal>
                <p className="t-lead mb-6 max-w-measure text-ink-soft">{service.summary}</p>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="mb-12 max-w-measure text-muted-foreground">{service.body}</p>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="t-label mb-6 text-brand">What you get</p>
              </Reveal>

              <Stagger as="ul" className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                {service.deliverables.map((d) => (
                  <StaggerItem
                    as="li"
                    key={d}
                    className="flex items-start gap-3 bg-paper p-5"
                  >
                    <Check size={16} className="mt-1 shrink-0 text-brand" aria-hidden />
                    <span className="t-small">{d}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </section>
      ))}

      <Engagements />

      <Faq />
    </Layout>
  );
}

/**
 * Replaces what used to be a second copy of the home page process diagram.
 * Commercials are more useful here than a repeated animation.
 */
function Engagements() {
  return (
    <section
      aria-labelledby="engagements-heading"
      className="border-b border-line bg-surface-sunken py-section md:py-section-md"
    >
      <div className="shell">
        <div className="mb-12 grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <Reveal>
              <p className="t-label mb-5 text-brand">How we work together</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="engagements-heading" className="t-h2 max-w-[18ch]">
                Three shapes, priced <span className="t-accent">up front</span>.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-5 md:justify-self-end">
            <Reveal delay={0.12}>
              <p className="t-small max-w-[34ch] text-muted-foreground">
                Every project starts with one call. You get the number and the date in
                writing before anyone commits to anything.
              </p>
            </Reveal>
          </div>
        </div>

        <Stagger as="ul" className="grid gap-5 lg:grid-cols-3">
          {ENGAGEMENTS.map((tier) => {
            const featured = "featured" in tier && tier.featured;
            return (
              <StaggerItem
                as="li"
                key={tier.name}
                className={`flex flex-col rounded-lg border p-7 md:p-8 ${
                  featured
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper"
                }`}
              >
                <div className="mb-6 flex items-baseline justify-between gap-4">
                  <h3 className={`t-h3 ${featured ? "text-paper" : ""}`}>{tier.name}</h3>
                  {featured && (
                    <span className="t-label rounded-full bg-brand px-3 py-1.5 text-paper">
                      Most projects
                    </span>
                  )}
                </div>

                <p
                  className={`t-mono mb-1.5 text-[1.375rem] leading-none ${
                    featured ? "text-paper" : "text-ink"
                  }`}
                >
                  {tier.price}
                </p>
                <p className={`t-label mb-6 ${featured ? "text-paper/50" : "text-faint"}`}>
                  {tier.duration}
                </p>

                <p
                  className={`t-small mb-7 ${
                    featured ? "text-paper/70" : "text-muted-foreground"
                  }`}
                >
                  {tier.best}
                </p>

                <ul
                  className={`mt-auto space-y-3 border-t pt-6 ${
                    featured ? "border-paper/15" : "border-line"
                  }`}
                >
                  {tier.includes.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <Check
                        size={15}
                        className="mt-1 shrink-0 text-brand"
                        aria-hidden
                      />
                      <span
                        className={`t-small ${
                          featured ? "text-paper/80" : "text-muted-foreground"
                        }`}
                      >
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="t-small mt-8 text-muted-foreground">
            Prices are indicative. Scope changes get repriced before we build them, never
            after.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="border-t border-line py-section md:py-section-md">
      <div className="shell grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal x={-16}>
            <div className="md:sticky md:top-28">
              <p className="t-label mb-5 text-brand">Questions</p>
              <h2 id="faq-heading" className="t-h2 max-w-[12ch]">
                The ones we get <span className="t-accent">most</span>.
              </h2>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-8">
          <Reveal>
            <Accordion type="single" collapsible className="border-t border-line">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={faq.q}
                  value={`faq-${i}`}
                  className="border-b border-line"
                >
                  <AccordionTrigger className="py-6 text-left text-[1.0625rem] font-medium hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-measure pb-6 text-[1rem] leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
