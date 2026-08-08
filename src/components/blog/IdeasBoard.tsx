import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ExternalLink,
  Plus,
  Trash2,
  PenLine,
  Check,
  X,
  Bot,
  User as UserIcon,
  RefreshCw,
} from "lucide-react";
import {
  fetchIdeas,
  updateIdeaStatus,
  deleteIdea,
  createIdea,
  formatPostDate,
  type IdeaStatus,
  type PostIdeaWithCategory,
} from "@/lib/supabase";

const FIELD =
  "w-full rounded-md border border-line bg-paper px-3.5 py-2.5 text-[0.9375rem] outline-none transition-colors duration-short focus:border-ink-soft";

const TABS: { key: IdeaStatus; label: string }[] = [
  { key: "new", label: "New" },
  { key: "queued", label: "Queued" },
  { key: "written", label: "Written" },
  { key: "dismissed", label: "Dismissed" },
];

const ROUTINE_URL = import.meta.env.VITE_IDEAS_ROUTINE_URL as string | undefined;

/**
 * Explains where ideas come from, and links out to the routine.
 *
 * There is deliberately no in-app "run now" button. Firing research needs an
 * API key, and every VITE_ variable is compiled into the public bundle, so a
 * key here would be readable by anyone viewing source. Running it from
 * claude.ai keeps the credential where it belongs.
 */
function ResearchNote() {
  return (
    <p className="t-small mb-6 flex flex-wrap items-center gap-1.5 rounded-md border border-line bg-surface px-4 py-3 text-muted-foreground">
      <Bot size={13} aria-hidden className="text-brand" />
      The research routine files fresh ideas every morning at 8am.
      {ROUTINE_URL && (
        <>
          {" "}
          To run it sooner,{" "}
          <a
            href={ROUTINE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="link-underline inline-flex items-center gap-1 text-ink"
          >
            open it on claude.ai
            <ExternalLink size={10} aria-hidden />
          </a>{" "}
          and hit Run now, then Refresh here once it finishes.
        </>
      )}
    </p>
  );
}

/**
 * Idea backlog. Filled every morning by the scheduled research agent and by
 * hand. This is the front of the writing pipeline: pick an idea, hit Write, and
 * it opens the editor with the title and keywords already in place.
 */
export default function IdeasBoard({
  onWrite,
}: {
  onWrite: (idea: PostIdeaWithCategory) => void;
}) {
  const qc = useQueryClient();
  const [tab, setTab] = useState<IdeaStatus>("new");
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [angle, setAngle] = useState("");

  const ideas = useQuery({ queryKey: ["ideas"], queryFn: fetchIdeas });
  const all = ideas.data ?? [];
  const visible = all.filter((i) => i.status === tab);

  function refresh() {
    void qc.invalidateQueries({ queryKey: ["ideas"] });
  }

  async function setStatus(id: string, status: IdeaStatus) {
    try {
      await updateIdeaStatus(id, status);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update");
    }
  }

  async function remove(idea: PostIdeaWithCategory) {
    if (!window.confirm(`Delete "${idea.title}"?`)) return;
    try {
      await deleteIdea(idea.id);
      toast.success("Idea deleted");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete");
    }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createIdea({ title: title.trim(), angle: angle.trim(), source: "manual" });
      toast.success("Idea added");
      setTitle("");
      setAngle("");
      setAdding(false);
      refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not add";
      toast.error(
        message.includes("duplicate") ? "An idea with that title already exists" : message
      );
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => {
            const count = all.filter((i) => i.status === t.key).length;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`t-label rounded-full px-4 py-2.5 transition-colors duration-short ${
                  active
                    ? "bg-ink text-paper"
                    : "border border-line text-muted-foreground hover:border-ink hover:text-ink"
                }`}
              >
                {t.label}
                <span className={active ? "ml-2 text-paper/50" : "ml-2 text-faint"}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refresh()}
            className="t-label inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-muted-foreground transition-colors hover:border-ink hover:text-ink"
            title="Reload ideas from the database"
          >
            <RefreshCw
              size={13}
              aria-hidden
              className={ideas.isFetching ? "animate-spin" : undefined}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="t-label inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-muted-foreground transition-colors hover:border-ink hover:text-ink"
          >
            <Plus size={13} aria-hidden /> Add idea
          </button>

        </div>
      </div>

      <ResearchNote />

      {adding && (
        <form onSubmit={add} className="mb-6 rounded-lg border border-line bg-surface p-5">
          <input
            className={`${FIELD} mb-3`}
            placeholder="Working title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className={`${FIELD} mb-4 resize-none`}
            rows={2}
            placeholder="The angle. Who is it for, and why now."
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-2.5 text-[0.875rem] font-medium text-paper transition-colors hover:bg-brand"
            >
              Save idea
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-2.5 text-[0.875rem] text-muted-foreground hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {ideas.isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-surface-sunken" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-lg border border-line bg-surface p-12 text-center">
          <p className="t-h3 mb-2">Nothing in {tab}</p>
          <p className="t-small text-muted-foreground">
            {tab === "new"
              ? "The research routine files fresh ideas here every morning at 8am."
              : "Move ideas here as you work through them."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((idea) => (
            <li key={idea.id} className="rounded-lg border border-line bg-surface p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <span
                  className="t-label inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1 text-muted-foreground"
                  title={idea.source === "routine" ? "Filed by the research routine" : "Added by hand"}
                >
                  {idea.source === "routine" ? (
                    <Bot size={12} aria-hidden />
                  ) : (
                    <UserIcon size={12} aria-hidden />
                  )}
                  {idea.source}
                </span>

                <span className="t-label t-mono text-faint">
                  P{idea.priority}
                </span>

                {idea.category && (
                  <span className="t-label text-brand">{idea.category.name}</span>
                )}

                <span className="t-label t-mono ml-auto text-faint">
                  {formatPostDate(idea.created_at)}
                </span>
              </div>

              <h3 className="mb-2 text-[1.0625rem] font-semibold tracking-tight text-ink">
                {idea.title}
              </h3>

              {idea.angle && (
                <p className="t-small mb-3 max-w-measure text-muted-foreground">{idea.angle}</p>
              )}

              {idea.rationale && (
                <p className="t-small mb-3 max-w-measure text-faint">
                  <span className="t-label mr-1.5 text-brand">Why now</span>
                  {idea.rationale}
                </p>
              )}

              {idea.keywords.length > 0 && (
                <ul className="mb-3 flex flex-wrap gap-1.5">
                  {idea.keywords.map((k) => (
                    <li
                      key={k}
                      className="t-label rounded-full border border-line px-2.5 py-1 text-muted-foreground"
                    >
                      {k}
                    </li>
                  ))}
                </ul>
              )}

              {idea.sources.length > 0 && (
                <ul className="mb-4 space-y-1">
                  {idea.sources.slice(0, 4).map((s, i) => (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="t-small inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-brand"
                      >
                        <ExternalLink size={11} aria-hidden />
                        <span className="line-clamp-1">{s.title || s.url}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => onWrite(idea)}
                  className="t-label inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-paper transition-colors hover:bg-brand"
                >
                  <PenLine size={12} aria-hidden /> Write this
                </button>

                {idea.status !== "queued" && (
                  <button
                    type="button"
                    onClick={() => setStatus(idea.id, "queued")}
                    className="t-label inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-muted-foreground transition-colors hover:border-ink hover:text-ink"
                  >
                    <Check size={12} aria-hidden /> Queue
                  </button>
                )}

                {idea.status !== "dismissed" && (
                  <button
                    type="button"
                    onClick={() => setStatus(idea.id, "dismissed")}
                    className="t-label inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-muted-foreground transition-colors hover:border-ink hover:text-ink"
                  >
                    <X size={12} aria-hidden /> Dismiss
                  </button>
                )}

                <button
                  type="button"
                  aria-label={`Delete ${idea.title}`}
                  onClick={() => remove(idea)}
                  className="ml-auto rounded-full border border-line p-2 text-faint transition-colors hover:border-error hover:text-error"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
