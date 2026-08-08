import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS } from "@/lib/site";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

type Product = (typeof PRODUCTS)[number];

/**
 * Full detail treatment for the products page. There are only two products, so
 * each one gets a whole section: the pitch, a large screenshot, and the modules
 * that make up the product. Depth instead of a list of four thin cards.
 */
export default function ProductShowcase() {
  return (
    <>
      {PRODUCTS.map((product, i) => (
        <ProductSection key={product.slug} product={product} flipped={i % 2 === 1} />
      ))}
    </>
  );
}

function ProductSection({ product, flipped }: { product: Product; flipped: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // The screenshot travels a little slower than the copy beside it.
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [26, -26]);

  return (
    <section
      id={product.slug}
      aria-labelledby={`${product.slug}-heading`}
      className={
        flipped
          ? "scroll-mt-24 border-b border-line bg-surface-sunken py-section md:py-section-md"
          : "scroll-mt-24 border-b border-line py-section md:py-section-md"
      }
    >
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <div className={`lg:col-span-5 ${flipped ? "lg:order-2" : "lg:order-1"}`}>
            <Reveal>
              <div className="mb-7 flex items-center gap-4">
                <span className="t-label t-mono text-faint">{product.n}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
                  <span className="t-label text-brand">{product.status}</span>
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.04}>
              <img
                src={product.logo}
                alt={`${product.name} logo`}
                width={256}
                height={256}
                loading="lazy"
                decoding="async"
                className={`mb-6 h-16 w-16 rounded-lg object-contain ring-1 ring-line ${
                  product.logoOnDark ? "bg-ink" : "bg-surface p-1"
                }`}
              />
            </Reveal>

            <Reveal delay={0.05}>
              <h2 id={`${product.slug}-heading`} className="t-h2 mb-3">
                {product.name}
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="t-lead mb-7 max-w-lead !text-ink-soft">{product.kicker}</p>
            </Reveal>

            {product.body.map((para, i) => (
              <Reveal key={i} delay={0.12 + i * 0.05}>
                <p className="mb-5 max-w-measure text-muted-foreground">{para}</p>
              </Reveal>
            ))}

            <Reveal delay={0.24}>
              <ul className="mb-9 mt-8 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <li
                    key={tag}
                    className="t-label rounded-full border border-line px-3 py-2 text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.28}>
              <a
                href={product.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-[0.9375rem] font-medium text-paper transition-colors duration-short ease-out hover:bg-brand"
              >
                {product.ctaLabel}
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-short ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </Reveal>
          </div>

          {/* Screenshot */}
          <div
            ref={ref}
            className={`lg:col-span-7 ${flipped ? "lg:order-1" : "lg:order-2"}`}
          >
            <Reveal delay={0.1}>
              <motion.div
                style={{ y: imageY }}
                className="overflow-hidden rounded-lg border border-line bg-surface p-2 shadow-[0_30px_70px_-40px_rgba(22,19,15,0.5)]"
              >
                {/* Browser chrome. Cheap, and it frames a screenshot as software. */}
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <span className="block h-2 w-2 rounded-full bg-line-strong" />
                  <span className="block h-2 w-2 rounded-full bg-line-strong" />
                  <span className="block h-2 w-2 rounded-full bg-line-strong" />
                  <span className="t-label t-mono ml-3 text-faint">
                    {product.href.replace("https://", "")}
                  </span>
                </div>
                <img
                  src={product.cover.src}
                  alt={product.cover.alt}
                  width={1400}
                  height={880}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-md object-cover object-top"
                />
              </motion.div>
            </Reveal>
          </div>
        </div>

        {/* Modules */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <p className="t-label mb-6 text-brand">What is inside</p>
          </Reveal>

          {/* Separate bordered cards rather than one seamless hairline grid.
              The seamless version leaves the divider colour showing in empty
              cells whenever the module count does not divide by the column
              count, which it stopped doing when Bro AI went to five tools. */}
          <Stagger
            as="ul"
            className={`grid gap-4 sm:grid-cols-2 ${
              product.modules.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"
            }`}
          >
            {product.modules.map((mod, i) => (
              <StaggerItem
                as="li"
                key={mod.name}
                className="rounded-lg border border-line bg-paper p-5"
              >
                {mod.image ? (
                  <div className="mb-5 overflow-hidden rounded-md border border-line">
                    <img
                      src={mod.image}
                      alt={mod.alt ?? ""}
                      width={600}
                      height={340}
                      loading="lazy"
                      decoding="async"
                      className="h-[120px] w-full object-cover object-top"
                    />
                  </div>
                ) : (
                  /* Pipeline stages have no screen of their own, so the step
                     number carries the visual weight instead of a repeat image. */
                  <div className="mb-5 flex h-[120px] items-end border-b border-line">
                    <span className="t-mono text-[3rem] leading-none text-line-strong">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}
                <h3 className="mb-2 font-semibold tracking-tight text-ink">{mod.name}</h3>
                <p className="t-small text-muted-foreground">{mod.detail}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
