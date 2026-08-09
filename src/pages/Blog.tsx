import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowUpRight, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Layout from "@/components/site/Layout";
import Seo, { breadcrumbSchema, organizationSchema } from "@/components/site/Seo";
import WordReveal from "@/components/motion/WordReveal";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchPosts,
  fetchCategories,
  formatPostDate,
  isSupabaseConfigured,
  type PostWithRelations,
} from "@/lib/supabase";
import { SITE } from "@/lib/site";

/** Ten keeps the grid to at most four rows and the DOM small enough to stay smooth. */
const PER_PAGE = 10;

type SortKey = "newest" | "oldest" | "views";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "views", label: "Most read" },
];

export default function Blog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);

  const libraryRef = useRef<HTMLDivElement>(null);
  /** Skips the scroll on first paint, so landing on /blog does not jump. */
  const paged = useRef(false);

  const posts = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });
  const categories = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const all = posts.data ?? [];
  const featured = all.find((p) => p.featured) ?? all[0];

  /**
   * The library lists every post, including the one in the hero.
   *
   * Garvish's call, 2026-08-08. The hero is a highlight, not a substitute for
   * the archive: a reader who scrolls past it and starts filtering expects the
   * newest article to be in the grid with everything else, and expects the
   * count to match the real total. An earlier version dropped it to avoid
   * showing the same card twice, which made the archive read as incomplete
   * and left the grid empty while there was only one post.
   */
  const library = all;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matched = library.filter((post) => {
      const inCategory = category === "all" || post.category?.slug === category;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        (post.excerpt ?? "").toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      );
    });

    const byDate = (p: PostWithRelations) =>
      new Date(p.published_at ?? p.created_at).getTime();

    return [...matched].sort((a, b) => {
      if (sort === "views") return b.views - a.views || byDate(b) - byDate(a);
      if (sort === "oldest") return byDate(a) - byDate(b);
      return byDate(b) - byDate(a);
    });
  }, [library, query, category, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  // Any change to the filters invalidates the current page number.
  useEffect(() => {
    setPage(1);
  }, [query, category, sort]);

  // Bring the top of the grid into view on a page change, so page two does not
  // land the reader halfway down a list they have already read.
  useEffect(() => {
    if (!paged.current) {
      paged.current = true;
      return;
    }
    libraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [current]);

  const authorCount = new Set(all.map((p) => p.author_id).filter(Boolean)).size;
  const lastUpdated = all[0]?.published_at;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE.name} blog`,
    url: `${SITE.domain}/blog`,
    description:
      "Writing on AI engineering, automation, web development and SEO from the Kraftzen studio.",
    publisher: { "@id": `${SITE.domain}/#organization` },
    blogPost: all.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE.domain}/blog/${p.slug}`,
      datePublished: p.published_at,
      author: p.author ? { "@type": "Person", name: p.author.name } : undefined,
    })),
  };

  return (
    <Layout>
      <Seo
        title="Blog"
        description="Practical writing on AI engineering, automation, web development and SEO. Notes from real projects at the Kraftzen studio, including the parts that went wrong."
        path="/blog"
        schema={[
          organizationSchema,
          blogSchema,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />

      {/* Hero. The featured post sits beside the h1 rather than below it, so the
          first screen carries both the positioning and the newest article. */}
      <header className="grain relative border-b border-line pb-14 pt-36 md:pb-20 md:pt-44">
        <div className="shell relative z-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="t-label mb-7 text-brand">Blog</p>
              </Reveal>

              <h1 className="t-h1 mb-7 max-w-[13ch]">
                <WordReveal
                  text="Notes from the work, including what went"
                  accent="wrong."
                  delay={0.08}
                />
              </h1>

              <Reveal delay={0.18}>
                <p className="t-lead max-w-measure">
                  Practical writing on AI engineering, automation, web development
                  and SEO. Everything here comes out of something we actually built.
                </p>
              </Reveal>

              <Reveal delay={0.26}>
                <dl className="mt-9 flex flex-wrap gap-3">
                  <Stat label="Posts" value={posts.isLoading ? "—" : String(all.length)} />
                  <Stat
                    label="Authors"
                    value={posts.isLoading ? "—" : String(Math.max(authorCount, 1))}
                  />
                  <Stat
                    label="Updated"
                    value={
                      lastUpdated
                        ? new Date(lastUpdated).toLocaleDateString("en-GB", {
                            month: "short",
                            year: "numeric",
                          })
                        : "—"
                    }
                  />
                </dl>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              {posts.isLoading ? (
                <div className="h-[420px] animate-pulse rounded-lg border border-line bg-surface" />
              ) : featured ? (
                <Reveal delay={0.12}>
                  <p className="t-label mb-4 text-brand">Latest article</p>
                  <FeaturedCard post={featured} />
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Not configured, empty and error states all get an honest message
          rather than an endless skeleton. */}
      {!isSupabaseConfigured && (
        <Notice
          title="The blog is not connected yet"
          body="VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are missing from the environment, so there is nothing to read from."
        />
      )}

      {posts.isError && (
        <Notice
          title="Could not load posts"
          body="The request to Supabase failed. Refresh, and if it keeps happening check the project is awake."
        />
      )}

      {/* Library */}
      <section
        aria-labelledby="library-heading"
        className="border-t border-line bg-surface-sunken py-section md:py-section-md"
      >
        <div className="shell">
          <div
            ref={libraryRef}
            className="mb-10 scroll-mt-28 rounded-lg border border-line bg-surface p-6 md:p-8"
          >
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-4">
                <p className="t-label mb-4 text-brand">Explore the library</p>
                <h2 id="library-heading" className="t-h2 mb-2">
                  All articles
                </h2>
                <p className="t-small text-muted-foreground">
                  {filtered.length} of {library.length}{" "}
                  {library.length === 1 ? "article" : "articles"} across{" "}
                  {categories.data?.length ?? 0} categories
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
                <label className="relative block">
                  <span className="sr-only">Search all articles</span>
                  <Search
                    size={16}
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search all articles"
                    className="w-full rounded-full border border-line bg-paper py-3.5 pl-11 pr-4 text-[0.9375rem] outline-none transition-colors duration-short ease-out placeholder:text-faint focus:border-ink-soft"
                  />
                </label>

                {/* Radix, not a native <select>. A native select renders its
                    option list through the operating system, so no CSS reaches
                    it: square corners, a system blue highlight and the OS font
                    sat inside a rounded warm-paper page. */}
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    aria-label="Filter by category"
                    className="h-auto w-full rounded-full border-line bg-paper px-5 py-3.5 text-[0.9375rem] focus:border-ink-soft focus:ring-0 focus:ring-offset-0"
                  >
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {(categories.data ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort is three buttons rather than a fourth select. There are
                    only ever three options and one is always active, which a
                    closed dropdown cannot show. */}
                <div
                  role="group"
                  aria-label="Sort articles"
                  className="flex flex-wrap gap-2 sm:col-span-2"
                >
                  <span className="t-label self-center pr-1 text-faint">Sort</span>
                  {SORTS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSort(s.key)}
                      aria-pressed={sort === s.key}
                      className={`t-label rounded-full border px-4 py-2 transition-colors duration-short ease-out ${
                        sort === s.key
                          ? "border-brand bg-brand-soft text-brand"
                          : "border-line text-muted-foreground hover:border-ink-soft hover:text-ink"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {posts.isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[380px] animate-pulse rounded-lg border border-line bg-surface"
                />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-lg border border-line bg-surface p-12 text-center">
              <p className="t-h3 mb-2">Nothing matches that</p>
              <p className="t-small text-muted-foreground">
                {all.length === 0
                  ? "The first post is not published yet."
                  : "Try a different search, or clear the category filter."}
              </p>
            </div>
          ) : (
            <>
              {/* Keyed on the page so each page animates in as its own set
                  rather than reusing the previous page's finished state. */}
              <Stagger key={`${sort}-${current}`} as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((post) => (
                  <StaggerItem as="li" key={post.id}>
                    <PostCard post={post} />
                  </StaggerItem>
                ))}
              </Stagger>

              <Pagination page={current} pageCount={pageCount} onChange={setPage} />
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

/* ------------------------------------------------------------------ */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line px-4 py-3">
      <dt className="t-label mb-1.5 text-faint">{label}</dt>
      <dd className="t-mono text-[1.0625rem] leading-none text-ink">{value}</dd>
    </div>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <section className="py-section">
      <div className="shell">
        <div className="rounded-lg border border-line bg-surface p-8">
          <p className="t-h3 mb-2">{title}</p>
          <p className="t-small max-w-measure text-muted-foreground">{body}</p>
        </div>
      </div>
    </section>
  );
}

function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (next: number) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Article pages" className="mt-12 flex items-center justify-center gap-2">
      <PageButton
        label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft size={16} aria-hidden />
      </PageButton>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          className={`t-mono h-10 min-w-10 rounded-full border px-3 text-[0.8125rem] transition-colors duration-short ease-out ${
            n === page
              ? "border-brand bg-brand text-paper"
              : "border-line bg-surface text-muted-foreground hover:border-ink-soft hover:text-ink"
          }`}
        >
          {String(n).padStart(2, "0")}
        </button>
      ))}

      <PageButton
        label="Next page"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight size={16} aria-hidden />
      </PageButton>
    </nav>
  );
}

function PageButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors duration-short ease-out hover:border-ink-soft disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}

/**
 * Covers are wide infographics with type inside them, so they are contained
 * rather than cropped. `object-cover` sliced the headings off both cards.
 * The paper ground means the letterboxing reads as a mount, not a gap.
 */
function Cover({
  post,
  eager,
  className = "",
}: {
  post: PostWithRelations;
  eager?: boolean;
  className?: string;
}) {
  if (!post.cover_url) return <CoverFallback title={post.title} />;

  return (
    <img
      src={post.cover_url}
      alt={post.cover_alt ?? ""}
      /* The featured cover is the largest element on the page, so it is the
         LCP element. `eager` alone still leaves it queued behind the scripts;
         fetchPriority tells the browser to pull it first. Everything below the
         fold stays lazy so it does not compete for the same bandwidth. */
      loading={eager ? "eager" : "lazy"}
      /* Lowercase, spread, on purpose. React 18 does not know the camelCase
         `fetchPriority` prop, so it drops it with a console warning and the
         hint never reaches the HTML. React 19 accepts camelCase; until we are
         on it, this is the form that actually ships the attribute. */
      {...{ fetchpriority: eager ? "high" : "low" }}
      decoding="async"
      width={1600}
      height={900}
      className={`h-full w-full object-contain transition-transform duration-long ease-out group-hover:scale-[1.02] ${className}`}
    />
  );
}

function FeaturedCard({ post }: { post: PostWithRelations }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors duration-short ease-out hover:border-line-strong"
    >
      <div className="aspect-[16/9] overflow-hidden border-b border-line bg-paper">
        <Cover post={post} eager />
      </div>

      <div className="flex flex-col gap-5 p-6 md:p-7">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {post.category && (
              <span className="t-label rounded-full bg-brand-soft px-3 py-1.5 text-brand">
                {post.category.name}
              </span>
            )}
            <span className="t-label t-mono text-faint">
              {formatPostDate(post.published_at)}
            </span>
            <span className="t-label t-mono text-faint">
              {post.reading_minutes} min read
            </span>
          </div>

          <h3 className="t-h3 mb-3 transition-colors duration-short ease-out group-hover:text-brand">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="t-small line-clamp-3 text-muted-foreground">{post.excerpt}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line pt-5">
          <AuthorRow post={post} compact />
          <ArrowUpRight
            size={18}
            aria-hidden
            className="shrink-0 text-faint transition-all duration-short ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
          />
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: PostWithRelations }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors duration-short ease-out hover:border-line-strong"
    >
      <div className="aspect-[16/9] overflow-hidden border-b border-line bg-paper">
        <Cover post={post} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          {post.category && (
            <span className="t-label text-brand">{post.category.name}</span>
          )}
          <span className="t-label t-mono text-faint">{post.reading_minutes} min</span>
          {post.views > 0 && (
            <span className="t-label t-mono inline-flex items-center gap-1 text-faint">
              <Eye size={12} aria-hidden />
              {post.views}
              <span className="sr-only"> views</span>
            </span>
          )}
        </div>

        <h3 className="t-h3 mb-3 transition-colors duration-short ease-out group-hover:text-brand">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="t-small mb-6 line-clamp-3 text-muted-foreground">{post.excerpt}</p>
        )}

        <div className="mt-auto border-t border-line pt-4">
          <AuthorRow post={post} compact />
        </div>
      </div>
    </Link>
  );
}

function AuthorRow({ post, compact }: { post: PostWithRelations; compact?: boolean }) {
  if (!post.author) {
    return (
      <span className="t-label t-mono text-faint">
        {formatPostDate(post.published_at)}
      </span>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-3">
      {post.author.avatar_url && (
        <img
          src={post.author.avatar_url}
          alt=""
          width={80}
          height={80}
          loading="lazy"
          className={`shrink-0 rounded-full border border-line object-cover ${
            compact ? "h-7 w-7" : "h-10 w-10"
          }`}
        />
      )}
      <div className="min-w-0">
        <p
          className={`truncate font-medium text-ink ${
            compact ? "text-[0.8125rem]" : "text-[0.9375rem]"
          }`}
        >
          {post.author.name}
        </p>
        <p className="t-label t-mono truncate text-faint">
          {formatPostDate(post.published_at)}
        </p>
      </div>
    </div>
  );
}

/** Typographic cover for posts with no image, so the grid never shows a hole. */
function CoverFallback({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-end bg-ink p-6">
      <p className="t-h3 line-clamp-3 text-paper/80">{title}</p>
    </div>
  );
}
