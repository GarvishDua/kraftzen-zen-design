import { useQuery } from "@tanstack/react-query";
import { Eye, FileWarning, Pencil, TrendingUp } from "lucide-react";
import {
  fetchViewsDaily,
  fetchViewsByPost,
  formatPostDate,
  type PostWithRelations,
} from "@/lib/supabase";

/**
 * Blog dashboard.
 *
 * Every number here comes from `post_views`, which holds one row per visitor
 * per post per day. There is no sampling and no estimate: a number on this
 * screen is a count of rows.
 *
 * The chart is hand rolled SVG rather than a chart library. Thirty bars do not
 * justify a dependency, and this way it inherits the brand tokens directly.
 */
export default function BlogDashboard({
  posts,
  loading,
  onEdit,
}: {
  posts: PostWithRelations[];
  loading: boolean;
  onEdit: (post: PostWithRelations) => void;
}) {
  const daily = useQuery({ queryKey: ["views-daily", 30], queryFn: () => fetchViewsDaily(30) });
  const recent = useQuery({ queryKey: ["views-by-post", 30], queryFn: () => fetchViewsByPost(30) });

  const live = posts.filter((p) => p.status === "published");
  const drafts = posts.filter((p) => p.status === "draft");
  const allTime = posts.reduce((sum, p) => sum + p.views, 0);

  const byPost = recent.data ?? {};
  const last30 = Object.values(byPost).reduce((sum, n) => sum + n, 0);

  const top = [...live]
    .map((p) => ({ post: p, recent: byPost[p.id] ?? 0 }))
    .sort((a, b) => b.recent - a.recent || b.post.views - a.post.views)
    .slice(0, 5);

  /**
   * Only fields present in CARD_COLUMNS are checked. `seo` is not fetched for
   * the list, and guessing at a missing field we never loaded is how the empty
   * editor bug happened.
   */
  const needsWork = posts
    .map((post) => {
      const gaps: string[] = [];
      if (!post.cover_url) gaps.push("no cover");
      if (!post.excerpt) gaps.push("no excerpt");
      if (!post.category) gaps.push("no category");
      if (post.tags.length === 0) gaps.push("no tags");
      return { post, gaps };
    })
    .filter((r) => r.gaps.length > 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Views, last 30 days" value={recent.isLoading ? "—" : String(last30)} />
        <Metric label="Views, all time" value={loading ? "—" : String(allTime)} />
        <Metric label="Published" value={loading ? "—" : String(live.length)} />
        <Metric label="Drafts" value={loading ? "—" : String(drafts.length)} />
      </div>

      <section className="rounded-lg border border-line bg-surface p-6">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="font-semibold tracking-tight">Views per day</h2>
            <p className="t-small text-muted-foreground">
              Last 30 days. One visitor reading one post counts once, however many
              times they refresh.
            </p>
          </div>
          <span className="t-label t-mono text-faint">
            {last30} total
          </span>
        </div>

        <ViewsChart data={daily.data ?? []} loading={daily.isLoading} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-surface p-6">
          <h2 className="mb-1 flex items-center gap-2 font-semibold tracking-tight">
            <TrendingUp size={16} aria-hidden className="text-brand" /> Top posts
          </h2>
          <p className="t-small mb-5 text-muted-foreground">
            Ranked by the last 30 days, not all time, so a new post is not buried
            by an old one.
          </p>

          {top.length === 0 ? (
            <Empty>Nothing is published yet.</Empty>
          ) : (
            <ol className="space-y-3">
              {top.map(({ post, recent: recentViews }, i) => (
                <li key={post.id} className="flex items-center gap-4">
                  <span className="t-mono w-6 shrink-0 text-[0.8125rem] text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.9375rem] font-medium text-ink">
                      {post.title}
                    </p>
                    <p className="t-label t-mono text-faint">
                      {formatPostDate(post.published_at)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="t-mono text-[0.9375rem] leading-none text-ink">
                      {recentViews}
                    </p>
                    <p className="t-label t-mono mt-1 text-faint">{post.views} all time</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="rounded-lg border border-line bg-surface p-6">
          <h2 className="mb-1 flex items-center gap-2 font-semibold tracking-tight">
            <FileWarning size={16} aria-hidden className="text-brand" /> Needs attention
          </h2>
          <p className="t-small mb-5 text-muted-foreground">
            Missing fields that cost you either a click or a search result.
          </p>

          {needsWork.length === 0 ? (
            <Empty>Every post has a cover, excerpt, category and tags.</Empty>
          ) : (
            <ul className="space-y-3">
              {needsWork.map(({ post, gaps }) => (
                <li key={post.id} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.9375rem] font-medium text-ink">
                      {post.title}
                    </p>
                    <p className="t-label text-error">{gaps.join(" · ")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEdit(post)}
                    className="t-label inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 transition-colors hover:border-ink"
                  >
                    <Pencil size={12} aria-hidden /> Fix
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="t-small flex items-start gap-2 rounded-lg border border-line bg-surface-sunken p-4 text-muted-foreground">
        <Eye size={15} aria-hidden className="mt-0.5 shrink-0 text-faint" />
        <span>
          Views are deduplicated per browser per day and headless browsers are
          skipped, so builds and prerenders do not count. Clearing site data makes
          a returning reader look new. For traffic sources rather than totals, add
          a real analytics tool.
        </span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-5 py-4">
      <p className="t-label mb-2 text-faint">{label}</p>
      <p className="t-mono text-[1.5rem] leading-none text-ink">{value}</p>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="t-small py-6 text-center text-faint">{children}</p>;
}

/**
 * Bars are rendered as flex children rather than SVG rects so they scale with
 * the container without a resize observer. A zero day still draws a hairline,
 * otherwise a quiet week looks like a broken chart.
 */
function ViewsChart({
  data,
  loading,
}: {
  data: { day: string; views: number }[];
  loading: boolean;
}) {
  if (loading) {
    return <div className="h-40 animate-pulse rounded-md bg-surface-sunken" />;
  }

  if (data.length === 0) {
    return <Empty>No view data yet.</Empty>;
  }

  const max = Math.max(1, ...data.map((d) => Number(d.views)));

  return (
    <div>
      <div className="flex h-40 items-end gap-[3px]" role="img" aria-label="Daily views for the last 30 days">
        {data.map((d) => {
          const views = Number(d.views);
          const height = views === 0 ? 2 : Math.max(4, (views / max) * 100);
          return (
            <div
              key={d.day}
              title={`${new Date(d.day).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}: ${views} ${views === 1 ? "view" : "views"}`}
              style={{ height: `${height}%` }}
              className={`flex-1 rounded-sm transition-colors duration-short ${
                views === 0 ? "bg-line" : "bg-brand/70 hover:bg-brand"
              }`}
            />
          );
        })}
      </div>

      <div className="mt-3 flex justify-between">
        <span className="t-label t-mono text-faint">
          {formatPostDate(data[0].day)}
        </span>
        <span className="t-label t-mono text-faint">
          peak {max}
        </span>
        <span className="t-label t-mono text-faint">
          {formatPostDate(data[data.length - 1].day)}
        </span>
      </div>
    </div>
  );
}
