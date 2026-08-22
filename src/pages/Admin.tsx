import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Loader2, LogOut, Pencil, Plus, Trash2, Eye } from "lucide-react";
import Seo from "@/components/site/Seo";
import PostEditor from "@/components/blog/PostEditor";
import IdeasBoard from "@/components/blog/IdeasBoard";
import BlogDashboard from "@/components/blog/BlogDashboard";
import {
  supabase,
  fetchAllPostsAdmin,
  fetchPostById,
  fetchAuthors,
  fetchCategories,
  deletePost,
  updateIdeaStatus,
  formatPostDate,
  isSupabaseConfigured,
  postState,
  type PostState,
  type PostWithRelations,
  type PostIdeaWithCategory,
} from "@/lib/supabase";
import { SITE } from "@/lib/site";

/**
 * Blog admin.
 *
 * Deliberately outside the marketing Layout: no nav, no footer, no scroll
 * animation. It is a tool, not a page, and it is noindex either way.
 *
 * There is no signup flow on purpose. Create the admin user once in the
 * Supabase dashboard under Authentication, then sign in here. That keeps the
 * write path closed to everyone who is not explicitly given an account.
 */
export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Admin"
        description="Kraftzen blog admin."
        path="/admin"
        noIndex
      />

      {!isSupabaseConfigured ? (
        <Centered>
          <h1 className="t-h3 mb-2">Supabase is not configured</h1>
          <p className="t-small text-muted-foreground">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your environment.
          </p>
        </Centered>
      ) : checking ? (
        <Centered>
          <Loader2 className="animate-spin text-faint" aria-label="Checking session" />
        </Centered>
      ) : !session ? (
        <SignIn />
      ) : (
        <Dashboard email={session.user.email ?? ""} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-8 text-center">
        {children}
      </div>
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-lg border border-line bg-surface p-8"
      >
        <div className="mb-7 flex items-center gap-2.5">
          <img
            src="/logo-mark-128.webp"
            alt=""
            width={128}
            height={128}
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span className="font-semibold tracking-tight">{SITE.name}</span>
        </div>

        <h1 className="t-h3 mb-1">Blog admin</h1>
        <p className="t-small mb-7 text-muted-foreground">
          Sign in with the account created in Supabase.
        </p>

        <label className="t-label mb-2 block text-muted-foreground" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border border-line bg-paper px-3.5 py-2.5 outline-none focus:border-ink-soft"
        />

        <label className="t-label mb-2 block text-muted-foreground" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-md border border-line bg-paper px-3.5 py-2.5 outline-none focus:border-ink-soft"
        />

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 font-medium text-paper transition-colors duration-short hover:bg-brand disabled:opacity-50"
        >
          {busy && <Loader2 size={15} className="animate-spin" aria-hidden />}
          Sign in
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Dashboard({ email }: { email: string }) {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [editing, setEditing] = useState<PostWithRelations | null | "new">(null);
  /** Id of the post whose full row is being fetched, for the button spinner. */
  const [opening, setOpening] = useState<string | null>(null);
  /** Set when the editor was opened from an idea, so it can be marked written. */
  const [fromIdea, setFromIdea] = useState<PostIdeaWithCategory | null>(null);

  /**
   * Loads the COMPLETE post before opening the editor.
   *
   * The list is fetched with CARD_COLUMNS, which omits content, faqs and seo.
   * Handing that partial row to the editor showed an empty body and, worse, a
   * save would have written that emptiness back over the real post.
   */
  async function openEditor(post: PostWithRelations) {
    setOpening(post.id);
    try {
      const full = await fetchPostById(post.id);
      if (!full) throw new Error("That post could not be loaded.");
      setEditing(full);
    } catch (err) {
      toast.error("Could not open the post", {
        description:
          err instanceof Error
            ? err.message
            : "Refresh and try again. Nothing was changed.",
      });
    } finally {
      setOpening(null);
    }
  }

  const posts = useQuery({ queryKey: ["admin-posts"], queryFn: fetchAllPostsAdmin });
  const categories = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const authors = useQuery({ queryKey: ["authors"], queryFn: fetchAuthors });

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["admin-posts"] });
    void qc.invalidateQueries({ queryKey: ["posts"] });
    void qc.invalidateQueries({ queryKey: ["ideas"] });
    setEditing(null);
    setFromIdea(null);
  }

  /** Opens the editor seeded from an idea and marks that idea as written. */
  function writeFromIdea(idea: PostIdeaWithCategory) {
    setFromIdea(idea);
    setTab("posts");
    setEditing("new");
    void updateIdeaStatus(idea.id, "written").then(() =>
      qc.invalidateQueries({ queryKey: ["ideas"] })
    );
  }

  async function remove(post: PostWithRelations) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await deletePost(post.id);
      toast.success("Post deleted");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete");
    }
  }

  const all = posts.data ?? [];
  // `scheduled` is derived from a future published_at, not a stored status.
  // See `postState` in lib/supabase.ts.
  const drafts = all.filter((p) => postState(p) === "draft");
  const scheduled = all.filter((p) => postState(p) === "scheduled");
  const live = all.filter((p) => postState(p) === "published");

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo-mark-128.webp"
            alt=""
            width={128}
            height={128}
            className="h-9 w-9 rounded-full bg-surface object-contain p-0.5 ring-1 ring-line"
          />
          <div>
            <p className="font-semibold tracking-tight">Blog admin</p>
            <p className="t-label t-mono text-faint">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/blog"
            target="_blank"
            rel="noreferrer"
            className="t-label inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-muted-foreground transition-colors hover:border-ink hover:text-ink"
          >
            <Eye size={13} aria-hidden /> View blog
          </a>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="t-label inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-muted-foreground transition-colors hover:border-ink hover:text-ink"
          >
            <LogOut size={13} aria-hidden /> Sign out
          </button>
        </div>
      </header>

      {editing !== null ? (
        <PostEditor
          post={editing === "new" ? null : editing}
          seedFromIdea={fromIdea}
          categories={categories.data ?? []}
          authors={authors.data ?? []}
          onSaved={refresh}
          onCancel={() => {
            setEditing(null);
            setFromIdea(null);
          }}
        />
      ) : tab === "dashboard" ? (
        <>
          <TabBar tab={tab} setTab={setTab} />
          <BlogDashboard
            posts={all}
            loading={posts.isLoading}
            onEdit={openEditor}
          />
        </>
      ) : tab === "ideas" ? (
        <>
          <TabBar tab={tab} setTab={setTab} />
          <IdeasBoard onWrite={writeFromIdea} />
        </>
      ) : (
        <>
          <TabBar tab={tab} setTab={setTab} />

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
              <Stat label="Published" value={live.length} />
              <Stat label="Scheduled" value={scheduled.length} />
              <Stat label="Drafts" value={drafts.length} />
              <Stat
                label="Total views"
                value={all.reduce((sum, p) => sum + p.views, 0)}
              />
            </div>

            <button
              type="button"
              onClick={() => setEditing("new")}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.9375rem] font-medium text-paper transition-colors duration-short hover:bg-brand"
            >
              <Plus size={16} aria-hidden /> New post
            </button>
          </div>

          {posts.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-surface-sunken" />
              ))}
            </div>
          ) : all.length === 0 ? (
            <div className="rounded-lg border border-line bg-surface p-12 text-center">
              <p className="t-h3 mb-2">No posts yet</p>
              <p className="t-small text-muted-foreground">
                Write the first one. It will not be live until you hit Publish.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {all.map((post) => (
                <li
                  key={post.id}
                  className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-surface p-4"
                >
                  {post.cover_url ? (
                    <img
                      src={post.cover_url}
                      alt=""
                      className="h-14 w-20 shrink-0 rounded-md border border-line bg-paper object-contain"
                    />
                  ) : (
                    <div className="h-14 w-20 shrink-0 rounded-md border border-line bg-surface-sunken" />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2.5">
                      <StateBadge state={postState(post)} />
                      {post.featured && (
                        <span className="t-label text-faint">featured</span>
                      )}
                      {post.category && (
                        <span className="t-label text-faint">{post.category.name}</span>
                      )}
                    </div>
                    <p className="truncate font-medium text-ink">{post.title}</p>
                    <p className="t-label t-mono text-faint">
                      {postState(post) === "published"
                        ? formatPostDate(post.published_at)
                        : postState(post) === "scheduled"
                          ? `goes live ${formatPostDate(post.published_at)}`
                          : `edited ${formatPostDate(post.updated_at)}`}
                      {" · "}
                      {post.views} views
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={opening === post.id}
                      onClick={() => openEditor(post)}
                      className="t-label inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 transition-colors hover:border-ink disabled:opacity-60"
                    >
                      {opening === post.id ? (
                        <Loader2 size={13} aria-hidden className="animate-spin" />
                      ) : (
                        <Pencil size={13} aria-hidden />
                      )}
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${post.title}`}
                      onClick={() => remove(post)}
                      className="rounded-full border border-line p-2 text-faint transition-colors hover:border-error hover:text-error"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

type Tab = "dashboard" | "posts" | "ideas";

const TABS: { key: Tab; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "posts", label: "Posts" },
  { key: "ideas", label: "Ideas" },
];

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="mb-8 flex gap-2 border-b border-line">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => setTab(key)}
          className={`t-label -mb-px border-b-2 px-4 py-3 transition-colors duration-short ${
            tab === key
              ? "border-brand text-ink"
              : "border-transparent text-muted-foreground hover:text-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const STATE_STYLES: Record<PostState, string> = {
  published: "bg-brand-soft text-brand",
  // Scheduled reads as pending rather than live, so it must not borrow the
  // published colour. Someone scanning this list needs to see at a glance which
  // posts readers can already reach.
  scheduled: "border border-line-strong text-ink-soft",
  draft: "bg-surface-sunken text-muted-foreground",
};

function StateBadge({ state }: { state: PostState }) {
  return (
    <span className={`t-label rounded-full px-2.5 py-1 ${STATE_STYLES[state]}`}>{state}</span>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-surface px-4 py-3">
      <p className="t-label mb-1 text-faint">{label}</p>
      <p className="t-mono text-[1.25rem] leading-none text-ink">{value}</p>
    </div>
  );
}
