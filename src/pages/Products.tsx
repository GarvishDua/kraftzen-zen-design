import Layout from "@/components/site/Layout";
import Seo, { breadcrumbSchema, organizationSchema } from "@/components/site/Seo";
import PageHeader from "@/components/site/PageHeader";
import ProductShowcase from "@/components/site/ProductShowcase";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ArrowLink, PillLink } from "@/components/site/Cta";
import { PRODUCTS, SERVICES, SITE } from "@/lib/site";

const productsSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `Products by ${SITE.name}`,
  url: `${SITE.domain}/products`,
  about: PRODUCTS.map((p) => ({
    "@type": "SoftwareApplication",
    name: p.name,
    description: p.summary,
    url: p.href,
    image: `${SITE.domain}${p.logo}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    author: { "@id": `${SITE.domain}/#organization` },
  })),
};

export default function Products() {
  return (
    <Layout>
      <Seo
        title="Products"
        description="Bro AI and AniVerseX are the two products Kraftzen built and runs. Bro AI is four narrow AI tools behind one login. AniVerseX is a blog that researches, writes and publishes itself."
        path="/products"
        schema={[
          organizationSchema,
          productsSchema,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
        ]}
      />

      <PageHeader
        eyebrow="Products"
        title="Two products, both"
        accent="live."
        lead="We build our own things alongside client work. It keeps us honest, and it means you can go and click on what we make instead of reading a case study about it."
      >
        {/* Jump links. With only two products a directory beats a grid. */}
        <Stagger as="ul" className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {PRODUCTS.map((p) => (
            <StaggerItem as="li" key={p.slug} className="bg-paper">
              <a
                href={`#${p.slug}`}
                className="group flex h-full items-center gap-4 p-5 transition-colors duration-short ease-out hover:bg-surface"
              >
                <img
                  src={p.logo}
                  alt=""
                  width={256}
                  height={256}
                  loading="lazy"
                  decoding="async"
                  className={`h-10 w-10 shrink-0 rounded-md object-contain ring-1 ring-line ${
                    p.logoOnDark ? "bg-ink" : "bg-surface p-0.5"
                  }`}
                />
                <span>
                  <span className="block font-semibold tracking-tight text-ink transition-colors duration-short ease-out group-hover:text-brand">
                    {p.name}
                  </span>
                  <span className="t-small block text-muted-foreground">{p.kicker}</span>
                </span>
                <span
                  aria-hidden
                  className="t-label ml-auto text-faint transition-transform duration-short ease-out group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </PageHeader>

      <ProductShowcase />

      {/* The bridge from products to services. */}
      <section aria-labelledby="products-cta-heading" className="py-section md:py-section-md">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="t-label mb-5 text-brand">Want one of your own</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="products-cta-heading" className="t-h2 max-w-[14ch]">
                We build these for <span className="t-accent">clients</span> too.
              </h2>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.08}>
              <p className="t-lead mb-8 max-w-measure">
                Both products started as something we needed ourselves, then became a
                service once we knew the system held up. AniVerseX is the one we rebuild
                most often, on a client domain and in their voice.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <ul className="mb-10 space-y-3 border-t border-line pt-6">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <ArrowLink to={`/services#${s.slug}`}>{s.title}</ArrowLink>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2}>
              <PillLink to="/contact">Start a project</PillLink>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
