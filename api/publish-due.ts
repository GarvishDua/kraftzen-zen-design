/**
 * Daily cron. Triggers a rebuild when a scheduled post has gone live.
 *
 * Scheduling itself needs no job at all: a scheduled post is `status: published`
 * with a future `published_at`, and the anon RLS policy already reads
 * `published_at <= now()`, so the post appears to readers on its own at the
 * right moment. See `postState` in `src/lib/supabase.ts`.
 *
 * What does need a job is the static HTML. `scripts/prerender.mjs` bakes one
 * file per post at build time, so a post that went live after the last build
 * has no prerendered page and no per-post social card until something rebuilds.
 * That is this function's only job.
 *
 * Wired in `vercel.json` under `crons`. Vercel calls it with a GET.
 */

/**
 * How far back to look for posts that crossed their publish time.
 *
 * Deliberately wider than the daily interval. Vercel documents cron delivery as
 * best effort: a run can be skipped entirely, and Hobby fires anywhere inside
 * the scheduled hour. A 24 hour window would drop a post whose moment fell in
 * the gap between a missed run and the next one. At 48 hours a missed day is
 * still caught, and the cost of the overlap is one extra rebuild, which is
 * harmless because a rebuild is idempotent.
 */
const LOOKBACK_HOURS = 48;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

interface DuePost {
  slug: string;
  title: string;
  published_at: string;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  /**
   * Vercel sends `Authorization: Bearer <CRON_SECRET>` when the project has a
   * `CRON_SECRET` env var. Refusing when it is unset is deliberate: an open
   * endpoint here lets anyone burn build minutes on demand.
   */
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return json({ error: "Unauthorized" }, 401);
  }

  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error("Supabase env vars are not set for the publish-due cron");
    return json({ error: "Not configured" }, 500);
  }

  const now = new Date();
  const since = new Date(now.getTime() - LOOKBACK_HOURS * 60 * 60 * 1000);

  // The publishable key is enough. Anon can already read exactly the rows this
  // needs, and RLS is what enforces that, so no service role key is involved.
  // There is none in this project and there should not be one.
  const query = new URLSearchParams({
    select: "slug,title,published_at",
    status: "eq.published",
    published_at: `lte.${now.toISOString()}`,
    order: "published_at.desc",
  });
  // URLSearchParams cannot hold the same key twice, so the lower bound of the
  // window is appended by hand. PostgREST ANDs repeated column filters.
  const endpoint =
    `${url.replace(/\/$/, "")}/rest/v1/posts?${query.toString()}` +
    `&published_at=gte.${encodeURIComponent(since.toISOString())}`;

  let due: DuePost[];
  try {
    const res = await fetch(endpoint, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      console.error("Supabase rejected the due-posts query", res.status, await res.text());
      return json({ error: "Query failed" }, 502);
    }
    due = (await res.json()) as DuePost[];
  } catch (err) {
    console.error("Could not reach Supabase", err);
    return json({ error: "Query failed" }, 502);
  }

  if (due.length === 0) {
    return json({ ok: true, due: 0, rebuilt: false }, 200);
  }

  const hook = process.env.DEPLOY_HOOK_URL ?? process.env.VITE_DEPLOY_HOOK_URL;
  if (!hook) {
    // Worth logging loudly. The posts are live for readers either way, they
    // just have no static HTML, so this fails quietly in exactly the way that
    // is easy to miss for months.
    console.warn(
      `${due.length} post(s) went live but DEPLOY_HOOK_URL is not set, so no rebuild was triggered`
    );
    return json({ ok: true, due: due.length, rebuilt: false, reason: "no hook" }, 200);
  }

  try {
    const res = await fetch(hook, { method: "POST" });
    if (!res.ok) {
      console.error("Deploy hook rejected the rebuild", res.status);
      return json({ ok: false, due: due.length, rebuilt: false }, 502);
    }
  } catch (err) {
    console.error("Deploy hook did not respond", err);
    return json({ ok: false, due: due.length, rebuilt: false }, 502);
  }

  console.log(
    `Rebuilding for ${due.length} newly live post(s): ${due.map((p) => p.slug).join(", ")}`
  );
  return json({ ok: true, due: due.length, rebuilt: true, slugs: due.map((p) => p.slug) }, 200);
}
