import { useEffect } from "react";
import { SITE } from "@/lib/site";

/**
 * Per route head management.
 *
 * This is a Vite SPA with no server render, so head tags are set on the client.
 * Google executes JS and will pick these up, but social scrapers generally will
 * not. index.html therefore carries a complete default set of OG and Twitter
 * tags, and this component overrides them for crawlers that do run scripts.
 *
 * If link previews on WhatsApp, Slack or X become important, the fix is
 * prerendering at build time, not more work here. Noted in CLAUDE.md.
 */

interface SeoProps {
  title: string;
  description: string;
  /** Path only, for example "/services". */
  path: string;
  /** Absolute URL of the share image. Defaults to the site image. */
  image?: string;
  /** Any number of JSON-LD objects to inject for this route. */
  schema?: Record<string, unknown>[];
  noIndex?: boolean;
}

const SCHEMA_ID = "route-schema";

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function Seo({
  title,
  description,
  path,
  image = `${SITE.domain}/og-default.png`,
  schema,
  noIndex,
}: SeoProps) {
  useEffect(() => {
    const url = `${SITE.domain}${path === "/" ? "/" : path}`;
    const fullTitle =
      path === "/" ? title : `${title} | ${SITE.name}`;

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:image"]', "property", "og:image", image);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    upsertMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    );

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, image, noIndex]);

  useEffect(() => {
    document.getElementById(SCHEMA_ID)?.remove();
    if (!schema?.length) return;

    const script = document.createElement("script");
    script.id = SCHEMA_ID;
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema.length === 1 ? schema[0] : schema);
    document.head.appendChild(script);

    return () => script.remove();
    // Serialised so a fresh array literal on each render does not thrash the DOM.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(schema ?? null)]);

  return null;
}

/* ------------------------------------------------------------------ */
/* Reusable schema builders                                            */
/* ------------------------------------------------------------------ */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE.domain}/#organization`,
  name: SITE.name,
  url: SITE.domain,
  email: SITE.email,
  telephone: SITE.phone,
  description:
    "Kraftzen is an AI studio in Delhi that builds AI tools, workflow automation, websites and automated content systems for small teams.",
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressCountry: "IN",
  },
  areaServed: "Worldwide",
  logo: `${SITE.domain}/logo-mark.png`,
  image: `${SITE.domain}/og-default.png`,
  founder: {
    "@type": "Person",
    name: SITE.founder,
    jobTitle: "Founder",
    image: `${SITE.domain}/founder-garvish.jpg`,
  },
  knowsAbout: [
    "AI agents",
    "Workflow automation",
    "Web development",
    "Technical SEO",
    "Content automation",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.domain}/#website`,
  url: SITE.domain,
  name: SITE.name,
  publisher: { "@id": `${SITE.domain}/#organization` },
};

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.domain}${item.path}`,
    })),
  };
}

export function faqSchema(faqs: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
