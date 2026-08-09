import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Eye } from "lucide-react";
import Layout from "@/components/site/Layout";
import Seo, { breadcrumbSchema, faqSchema, organizationSchema } from "@/components/site/Seo";
import PostBody from "@/components/blog/PostBody";
import ShareButtons from "@/components/blog/ShareButtons";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink, PillLink } from "@/components/site/Cta";
import {
  fetchPost,
  fetchPosts,
  formatPostDate,
  recordView,
  type PostWithRelations,
} from "@/lib/supabase";
import { SITE } from "@/lib/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function BlogPost() {
  const { slug = "" } = useParams();

  const post = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
    enabled: Boolean(slug),
  });

  const others = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });

  // Fire and forget, never blocks render. `recordView` handles its own dedup
  // and skips headless browsers, so this only has to know the post is public.
  useEffect(() => {
    if (post.data?.status !== "published") return;
    void recordView(slug);
  }, [post.data?.status, slug]);

  if (post.isLoading) return <LoadingShell />;

  if (post.isError || !post.data) return <NotFoundShell />;

  const p = post.data;

  // A draft reached by direct link should not be indexed or presented as live.
  const isDraft = p.status !== "published";

  const related = (others.data ?? [])
    .filter((o) => o.id !== p.id)
    .filter((o) => !p.category_id || o.category_id === p.category_id)
    .slice(0, 3);

  const url = `${SITE.domain}/blog/${p.slug}`;
  const image = p.seo?.og_image || p.cover_url || `${SITE.domain}/og-default.png`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.seo?.description || p.excerpt || undefined,
    image,
    url,
    datePublished: p.published_at,
    dateModified: p.updated_at,
    wordCount: p.content.trim().split(/\s+/).length,
    keywords: [...(p.seo?.keywords ?? []), ...p.tags].join(", ") || undefined,
    articleSection: p.category?.name,
    author: p.author
      ? { "@type": "Person", name: p.author.name, jobTitle: p.author.role ?? undefined }
      : { "@id": `${SITE.domain}/#organization` },
    publisher: { "@id": `${SITE.domain}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <Layout>
      <Seo
        title={p.seo?.title || p.title}
        description={p.seo?.description || p.excerpt || `${p.title} from the Kraftzen blog.`}
        path={`/blog/${p.slug}`}
        image={image}
        noIndex={isDraft}
        schema={[
          organizationSchema,
          articleSchema,
          ...(p.faqs?.length ? [faqSchema(p.faqs)] : []),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: p.title, path: `/blog/${p.slug}` },
          ]),
        ]}
      />

      <ReadingProgress />

      <article>
        {/* Header */}
        <header className="grain relative border-b border-line pb-12 pt-32 md:pt-40">
          <div className="shell relative z-10">
            <Reveal>
              <Link
                to="/blog"
                className="group mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors duration-short ease-out hover:text-ink"
              >
                <ArrowLeft
                  size={15}
                  className="transition-transform duration-short ease-out group-hover:-translate-x-1"
                />
                <span className="t-label">All articles</span>
              </Link>
            </Reveal>

            {isDraft && (
              <Reveal>
                <p className="t-label mb-6 inline-block rounded-full bg-warning/15 px-3 py-2 text-warning">
                  Draft, not published
                </p>
              </Reveal>
            )}

            <Reveal delay={0.04}>
              <div className="mb-7 flex flex-wrap items-center gap-3">
                {p.category && (
                  <Link
                    to="/blog"
                    className="t-label rounded-full bg-brand-soft px-3 py-1.5 text-brand"
                  >
                    {p.category.name}
                  </Link>
                )}
                <span className="t-label t-mono text-faint">
                  {formatPostDate(p.published_at)}
                </span>

                {/* Freshness is a ranking and citation signal for AI answer
                    engines, and it was previously only in the JSON-LD where no
                    reader could see it. Shown only when the edit is meaningfully
                    later than publication, so it never reads as noise. */}
                {isMeaningfullyUpdated(p.published_at, p.updated_at) && (
                  <span className="t-label t-mono text-brand">
                    Updated {formatPostDate(p.updated_at)}
                  </span>
                )}

                <span className="t-label t-mono text-faint">
                  {p.reading_minutes} min read
                </span>
                {p.views > 0 && (
                  <span className="t-label t-mono flex items-center gap-1.5 text-faint">
                    <Eye size={12} aria-hidden /> {p.views} views
                  </span>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="t-h1 mb-7 max-w-[20ch]">{p.title}</h1>
            </Reveal>

            {p.excerpt && (
              <Reveal delay={0.12}>
                <p className="t-lead mb-10 max-w-measure">{p.excerpt}</p>
              </Reveal>
            )}

            <Reveal delay={0.16}>
              <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-7">
                {p.author ? (
                  <div className="flex items-center gap-4">
                    {p.author.avatar_url && (
                      <img
                        src={p.author.avatar_url}
                        alt=""
                        width={112}
                        height={112}
                        className="h-12 w-12 rounded-full border border-line object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold tracking-tight text-ink">{p.author.name}</p>
                      {p.author.role && (
                        <p className="t-small text-muted-foreground">{p.author.role}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <span />
                )}

                <ShareButtons title={p.title} url={url} />
              </div>
            </Reveal>
          </div>
        </header>

        {/* Cover */}
        {p.cover_url && (
          <div className="shell -mt-0 pt-10">
            <Reveal>
              <img
                src={p.cover_url}
                alt={p.cover_alt ?? ""}
                /* This is the LCP element on an article page. */
                loading="eager"
                /* Lowercase and spread: React 18 drops camelCase fetchPriority. */
                {...{ fetchpriority: "high" }}
                decoding="async"
                width={1600}
                height={900}
                className="w-full rounded-lg border border-line object-cover"
              />
            </Reveal>
          </div>
        )}

        {/* Body + table of contents */}
        <div className="shell py-section">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <aside className="lg:col-span-3">
              <TableOfContents content={p.content} />
            </aside>

            <div className="lg:col-span-8 lg:col-start-5">
              <PostBody content={p.content} />

              {p.tags.length > 0 && (
                <ul className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
                  {p.tags.map((tag) => (
                    <li
                      key={tag}
                      className="t-label rounded-full border border-line px-3 py-2 text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              {/* FAQs. Structured separately from the body so they can also be
                  emitted as FAQPage schema above. */}
              {p.faqs?.length > 0 && (
                <section aria-labelledby="post-faq" className="mt-16">
                  <p className="t-label mb-5 text-brand">Questions</p>
                  <h2 id="post-faq" className="t-h2 mb-8">
                    Frequently asked
                  </h2>
                  <Accordion type="single" collapsible className="border-t border-line">
                    {p.faqs.map((faq, i) => (
                      <AccordionItem
                        key={i}
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
                </section>
              )}

              {/* Studio CTA. The commercial reason the blog exists. */}
              <aside className="mt-16 rounded-lg border border-line bg-surface-sunken p-7 md:p-9">
                <p className="t-label mb-4 text-brand">From the studio</p>
                <p className="t-h3 mb-4 max-w-[24ch]">
                  We build the things we write about.
                </p>
                <p className="t-small mb-7 max-w-measure text-muted-foreground">
                  Kraftzen builds AI tools, automation and websites for small teams. If
                  something here is a problem you have, tell us about it.
                </p>
                <div className="flex flex-wrap items-center gap-5">
                  <PillLink to="/contact">Start a project</PillLink>
                  <ArrowLink to="/services">See what we do</ArrowLink>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section
            aria-labelledby="related-heading"
            className="border-t border-line bg-surface-sunken py-section"
          >
            <div className="shell">
              <Reveal>
                <p className="t-label mb-5 text-brand">Keep reading</p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 id="related-heading" className="t-h2 mb-10">
                  More on this
                </h2>
              </Reveal>

              <ul className="grid gap-6 md:grid-cols-3">
                {related.map((r) => (
                  <li key={r.id}>
                    <RelatedCard post={r} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}

/* ------------------------------------------------------------------ */

/**
 * True when a post was edited a day or more after publishing.
 *
 * Every save bumps `updated_at` via the touch trigger, so a naive comparison
 * would label a post "Updated" for a typo fix made minutes after publishing.
 */
function isMeaningfullyUpdated(
  publishedAt: string | null,
  updatedAt: string | null
): boolean {
  if (!publishedAt || !updatedAt) return false;
  const gapMs = new Date(updatedAt).getTime() - new Date(publishedAt).getTime();
  return gapMs > 24 * 60 * 60 * 1000;
}

/** Accent hairline showing how far through the article you are. */
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-brand"
    />
  );
}

/**
 * Table of contents built from the h2s in the markdown source.
 *
 * The ids match what rehype-slug generates in PostBody, so the anchors line up
 * without needing to walk the rendered DOM.
 */
function TableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => {
    return content
      .split("\n")
      .filter((line) => /^##\s+/.test(line))
      .map((line) => {
        const text = line.replace(/^##\s+/, "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
        return { text, id };
      });
  }, [content]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-28">
      <p className="t-label mb-5 text-brand">On this page</p>
      {/* No number prefix here on purpose. Plenty of posts number their own
          headings ("## 1. Something"), and a counter on top of that renders
          as "01. 1. Something". */}
      <ul className="space-y-3 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="t-small -ml-px block border-l-2 border-transparent pl-4 text-muted-foreground transition-colors duration-short ease-out hover:border-brand hover:text-ink"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function RelatedCard({ post }: { post: PostWithRelations }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-paper transition-colors duration-short ease-out hover:border-line-strong"
    >
      {/* Contained, not cropped. Covers carry type inside them. */}
      {post.cover_url && (
        <div className="aspect-[16/9] overflow-hidden border-b border-line bg-surface">
          <img
            src={post.cover_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-long ease-out group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="t-label mb-3 text-brand">{post.category?.name}</p>
        <h3 className="t-h3 mb-3 transition-colors duration-short ease-out group-hover:text-brand">
          {post.title}
        </h3>
        <p className="t-label t-mono mt-auto text-faint">
          {post.reading_minutes} min read
        </p>
      </div>
    </Link>
  );
}

function LoadingShell() {
  return (
    <Layout>
      <div className="shell pb-section pt-40">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-line" />
        <div className="mb-5 h-14 w-3/4 animate-pulse rounded bg-line" />
        <div className="mb-10 h-4 w-1/2 animate-pulse rounded bg-line" />
        <div className="h-[320px] animate-pulse rounded-lg bg-line" />
      </div>
    </Layout>
  );
}

function NotFoundShell() {
  return (
    <Layout>
      <Seo
        title="Article not found"
        description="That article does not exist on the Kraftzen blog."
        path="/blog"
        noIndex
      />
      <section className="shell flex min-h-[60vh] flex-col justify-center pb-section pt-40">
        <p className="t-label t-mono mb-7 text-brand">Error 404</p>
        <h1 className="t-h1 mb-7 max-w-[16ch]">
          That article is not <span className="t-accent">here</span>.
        </h1>
        <p className="t-lead mb-10 max-w-lead">
          The link is either old or slightly wrong. The archive is one click away.
        </p>
        <div>
          <PillLink to="/blog">Back to the blog</PillLink>
        </div>
      </section>
    </Layout>
  );
}
