import { createClient } from "@supabase/supabase-js";
import { compressImage } from "./image";

/**
 * Supabase client for the blog.
 *
 * The publishable key is public by design and ships in the bundle. Row level
 * security is what actually protects the data: anon can only read published
 * posts, and only signed in users can write anything.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

/**
 * True when the project is configured. The blog routes check this so a missing
 * .env shows an honest message instead of an unhandled crash on a blank page.
 */
export const isSupabaseConfigured = Boolean(url && key);

export const supabase = createClient(
  url ?? "https://placeholder.supabase.co",
  key ?? "placeholder",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/* ------------------------------------------------------------------ */
/* Types. Hand written to match the schema in supabase/migrations.     */
/* ------------------------------------------------------------------ */

export interface Author {
  id: string;
  slug: string;
  name: string;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
  links: Record<string, string>;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface Faq {
  q: string;
  a: string;
}

export interface PostSeo {
  title?: string;
  description?: string;
  keywords?: string[];
  og_image?: string;
  canonical?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  cover_alt: string | null;
  content: string;
  category_id: string | null;
  author_id: string | null;
  tags: string[];
  faqs: Faq[];
  seo: PostSeo;
  reading_minutes: number;
  views: number;
  featured: boolean;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** A post joined with its author and category, which is what the UI renders. */
export interface PostWithRelations extends Post {
  author: Author | null;
  category: Category | null;
}

/**
 * Columns needed for a card. Deliberately excludes `content`, `faqs` and `seo`,
 * which are large and never rendered in a list.
 *
 * A row fetched with these columns is PARTIAL. Never hand one to the editor:
 * the missing fields read as empty and a save writes that emptiness back over
 * the real post. Load the full row with `fetchPostById` before editing.
 */
const CARD_COLUMNS =
  "id, slug, title, excerpt, cover_url, cover_alt, tags, reading_minutes, views, featured, status, published_at, created_at, updated_at, category_id, author_id, author:authors(*), category:categories(*)";

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

/**
 * Published posts, newest first. RLS already hides drafts from anon, but the
 * status filter is repeated here so a signed in admin browsing the public blog
 * sees the same thing a reader would.
 */
export async function fetchPosts(): Promise<PostWithRelations[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(CARD_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PostWithRelations[];
}

export async function fetchPost(slug: string): Promise<PostWithRelations | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:authors(*), category:categories(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return (data as unknown as PostWithRelations) ?? null;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}

/* ------------------------------------------------------------------ */
/* View counting                                                       */
/* ------------------------------------------------------------------ */

const VISITOR_KEY = "kz_visitor";

/**
 * A stable random id for this browser, used only to deduplicate views.
 *
 * It is not linked to anything identifying and never leaves the view counter,
 * so it needs no cookie banner. Clearing site data makes the browser look new,
 * which is the accepted cost of not fingerprinting anyone.
 */
function getVisitorId(): string | null {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    /* private mode with storage denied. Skip counting rather than throw. */
    return null;
  }
}

/**
 * True for headless Chrome, which is what `npm run build:static` drives over
 * every route at build time.
 *
 * Without this check each build silently added a view to every published post,
 * so the number on the page measured how often we deployed. Puppeteer sets
 * `navigator.webdriver`, and so does most naive JS-capable scraping.
 */
function isAutomated(): boolean {
  if (typeof navigator === "undefined") return true;
  if (navigator.webdriver) return true;
  return /bot|crawler|spider|headless|prerender|lighthouse/i.test(navigator.userAgent);
}

/** Guards against React strict mode running the effect twice on one mount. */
const counted = new Set<string>();

/**
 * Records at most one view per browser, per post, per day.
 *
 * The dedup lives in the primary key of `post_views`, not here, so a refresh
 * loop or a second tab cannot inflate the number even if this guard is bypassed.
 * Counting is never worth an error state, so every failure is swallowed.
 */
export async function recordView(slug: string): Promise<void> {
  if (isAutomated() || counted.has(slug)) return;

  const visitor = getVisitorId();
  if (!visitor) return;

  counted.add(slug);

  try {
    await supabase.rpc("record_post_view", { post_slug: slug, visitor });
  } catch {
    /* counting views is not worth an error state */
  }
}

/* ------------------------------------------------------------------ */
/* Admin queries. These require a signed in session.                   */
/* ------------------------------------------------------------------ */

/** Every post including drafts. RLS allows this only for authenticated users. */
export async function fetchAllPostsAdmin(): Promise<PostWithRelations[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(CARD_COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PostWithRelations[];
}

/**
 * The complete row, including `content`, `faqs` and `seo`.
 *
 * The editor must use this rather than the row it got from the list, which is
 * fetched with CARD_COLUMNS and is missing exactly the fields the editor writes.
 * Keyed on id rather than slug because the slug is itself editable.
 */
export async function fetchPostById(id: string): Promise<PostWithRelations | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:authors(*), category:categories(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return (data as unknown as PostWithRelations) ?? null;
}

export interface DailyViews {
  day: string;
  views: number;
}

/** Daily totals for the dashboard chart. Aggregated in Postgres, not here. */
export async function fetchViewsDaily(days = 30): Promise<DailyViews[]> {
  const { data, error } = await supabase.rpc("blog_views_daily", { days });
  if (error) throw error;
  return (data ?? []) as DailyViews[];
}

/**
 * Views per post inside a window, keyed by post id.
 *
 * `posts.views` is an all-time counter and cannot answer "what is doing well
 * this month", which is the only question worth asking of a small blog.
 */
export async function fetchViewsByPost(days = 30): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc("blog_views_by_post", { days });
  if (error) throw error;

  const out: Record<string, number> = {};
  for (const row of (data ?? []) as { post_id: string; views: number }[]) {
    out[row.post_id] = Number(row.views);
  }
  return out;
}

export async function fetchAuthors(): Promise<Author[]> {
  const { data, error } = await supabase.from("authors").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as Author[];
}

/* ------------------------------------------------------------------ */
/* Post ideas. Internal only, no anon policy exists on this table.     */
/* ------------------------------------------------------------------ */

export type IdeaStatus = "new" | "queued" | "written" | "dismissed";

export interface IdeaSource {
  title?: string;
  url: string;
}

export interface PostIdea {
  id: string;
  title: string;
  angle: string;
  keywords: string[];
  category_id: string | null;
  sources: IdeaSource[];
  rationale: string | null;
  priority: number;
  status: IdeaStatus;
  source: string;
  post_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostIdeaWithCategory extends PostIdea {
  category: Category | null;
}

export async function fetchIdeas(): Promise<PostIdeaWithCategory[]> {
  const { data, error } = await supabase
    .from("post_ideas")
    .select("*, category:categories(*)")
    .order("status", { ascending: true })
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as PostIdeaWithCategory[];
}

export async function updateIdeaStatus(id: string, status: IdeaStatus): Promise<void> {
  const { error } = await supabase.from("post_ideas").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteIdea(id: string): Promise<void> {
  const { error } = await supabase.from("post_ideas").delete().eq("id", id);
  if (error) throw error;
}

export async function createIdea(
  idea: Pick<PostIdea, "title" | "angle"> & Partial<PostIdea>
): Promise<void> {
  const { error } = await supabase.from("post_ideas").insert(idea);
  if (error) throw error;
}

export type PostDraft = Partial<Post> & { slug: string; title: string };

export async function upsertPost(post: PostDraft): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .upsert(post, { onConflict: "slug" })
    .select()
    .single();

  if (error) throw error;
  return data as Post;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

export interface UploadResult {
  url: string;
  originalBytes: number;
  storedBytes: number;
}

/**
 * Compresses, then uploads to the public `blog` bucket.
 *
 * **Never upload the raw file.** Image models emit PNGs around 1.5 MB, and the
 * blog index loads up to ten covers at once, so raw uploads spend the monthly
 * bandwidth allowance in a few hundred visits. See `compressImage`.
 */
export async function uploadBlogImage(file: File): Promise<UploadResult> {
  const { file: optimised, originalBytes } = await compressImage(file);

  const ext = optimised.name.split(".").pop()?.toLowerCase() ?? "webp";
  const safeName = optimised.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const path = `${new Date().getFullYear()}/${Date.now()}-${safeName || "image"}.${ext}`;

  const { error } = await supabase.storage
    .from("blog")
    .upload(path, optimised, {
      cacheControl: "31536000",
      upsert: false,
      contentType: optimised.type,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("blog").getPublicUrl(path);
  return { url: data.publicUrl, originalBytes, storedBytes: optimised.size };
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Roughly 200 words a minute, floored at 1. Good enough for a read estimate. */
export function estimateReadingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function formatPostDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
