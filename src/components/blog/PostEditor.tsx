import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Eye, Code2, ImagePlus, Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import PostBody from "./PostBody";
import {
  estimateReadingMinutes,
  slugify,
  uploadBlogImage,
  upsertPost,
  type Author,
  type Category,
  type Faq,
  type PostWithRelations,
} from "@/lib/supabase";
import { formatBytes } from "@/lib/image";

const FIELD =
  "w-full rounded-md border border-line bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink outline-none transition-colors duration-short ease-out placeholder:text-faint focus:border-ink-soft";
const LABEL = "t-label mb-2 block text-muted-foreground";

interface Props {
  post: PostWithRelations | null;
  /** When the editor was opened from the ideas board, seed the new post. */
  seedFromIdea?: {
    title: string;
    angle: string;
    keywords: string[];
    category_id: string | null;
  } | null;
  categories: Category[];
  authors: Author[];
  onSaved: () => void;
  onCancel: () => void;
}

/**
 * Post editor. A plain markdown textarea with a live preview rather than a rich
 * text editor, because the body is stored as markdown and a WYSIWYG would just
 * be a lossy layer on top of it. The preview uses the exact same PostBody the
 * public page uses, so what you see is genuinely what ships.
 */
export default function PostEditor({
  post,
  seedFromIdea,
  categories,
  authors,
  onSaved,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(post?.title ?? seedFromIdea?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? seedFromIdea?.angle ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverUrl, setCoverUrl] = useState(post?.cover_url ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.cover_alt ?? "");
  const [categoryId, setCategoryId] = useState(
    post?.category_id ?? seedFromIdea?.category_id ?? categories[0]?.id ?? ""
  );
  const [authorId, setAuthorId] = useState(post?.author_id ?? authors[0]?.id ?? "");
  const [tags, setTags] = useState(
    (post?.tags ?? seedFromIdea?.keywords ?? []).join(", ")
  );
  const [faqs, setFaqs] = useState<Faq[]>(post?.faqs ?? []);
  const [seoTitle, setSeoTitle] = useState(post?.seo?.title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo?.description ?? "");
  const [keywords, setKeywords] = useState(
    (post?.seo?.keywords ?? seedFromIdea?.keywords ?? []).join(", ")
  );
  const [featured, setFeatured] = useState(post?.featured ?? false);

  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const isNew = !post;

  // Only auto-derive the slug for a new post. Changing it on a published post
  // would break every existing link to it.
  useEffect(() => {
    if (isNew) setSlug(slugify(title));
  }, [title, isNew]);

  const readingMinutes = estimateReadingMinutes(content);

  async function save(status: "draft" | "published") {
    if (!title.trim()) return toast.error("The post needs a title");
    if (!slug.trim()) return toast.error("The post needs a slug");

    // Defence in depth against a partially loaded post. If an existing post
    // arrives without its `content` field the editor shows an empty body, and
    // saving would overwrite the real one with nothing. Refuse rather than
    // destroy. The load path is fixed, this catches any future regression.
    if (post && post.content === undefined) {
      return toast.error("This post did not load fully", {
        description: "Nothing was saved. Close the editor and open it again.",
      });
    }

    if (post && post.content?.trim() && !content.trim()) {
      const ok = window.confirm(
        "This post had a body and the editor is now empty. Saving will erase it. Continue?"
      );
      if (!ok) return;
    }

    setSaving(true);
    try {
      await upsertPost({
        ...(post?.id ? { id: post.id } : {}),
        slug: slug.trim(),
        title: title.trim(),
        excerpt: excerpt.trim() || null,
        content,
        cover_url: coverUrl.trim() || null,
        cover_alt: coverAlt.trim() || null,
        category_id: categoryId || null,
        author_id: authorId || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        // Read through `?.` rather than `.trim()` directly. A row written
        // outside this editor can arrive with the wrong keys, and an undefined
        // `q` used to throw here and kill the whole save with a bare
        // "Cannot read properties of undefined" toast. Dropping the bad row is
        // the right failure: the editor shows it as missing, nothing is lost.
        faqs: faqs.filter((f) => f?.q?.trim() && f?.a?.trim()),
        seo: {
          title: seoTitle.trim() || undefined,
          description: seoDescription.trim() || undefined,
          keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
        },
        reading_minutes: readingMinutes,
        featured,
        status,
        // Set the publish date the first time it goes live, never overwrite it.
        published_at:
          status === "published" ? post?.published_at ?? new Date().toISOString() : null,
      });

      toast.success(status === "published" ? "Published" : "Draft saved");

      // Prerendered HTML is baked at build time, so publishing needs a rebuild
      // for the static version of the post to exist. Optional, skipped if unset.
      const hook = import.meta.env.VITE_DEPLOY_HOOK_URL as string | undefined;
      if (status === "published" && hook) {
        try {
          await fetch(hook, { method: "POST" });
          toast("Rebuild triggered", {
            description: "The static version of this post will exist once the deploy finishes.",
          });
        } catch {
          toast.error("Saved, but the deploy hook did not respond");
        }
      }

      onSaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message.includes("duplicate") ? "That slug is already taken" : message);
    } finally {
      setSaving(false);
    }
  }

  /** Uploads then drops a markdown image tag at the cursor. */
  async function handleUpload(file: File, target: "cover" | "body") {
    setUploading(true);
    try {
      const { url, originalBytes, storedBytes } = await uploadBlogImage(file);
      if (target === "cover") {
        setCoverUrl(url);
      } else {
        const el = bodyRef.current;
        const snippet = `\n\n![Describe this image](${url})\n\n`;
        if (el) {
          const at = el.selectionStart;
          setContent(content.slice(0, at) + snippet + content.slice(at));
        } else {
          setContent(content + snippet);
        }
      }

      // The saving is worth surfacing. It is the difference between the free
      // tier lasting hundreds of visits and thousands, and it is invisible
      // otherwise.
      const saved = originalBytes - storedBytes;
      toast.success("Image uploaded", {
        description:
          saved > 0
            ? `${formatBytes(originalBytes)} compressed to ${formatBytes(storedBytes)}, ${(
                originalBytes / storedBytes
              ).toFixed(1)}x smaller.`
            : `Stored as is, ${formatBytes(storedBytes)}.`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Body */}
      <div className="lg:col-span-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="t-label text-brand">{isNew ? "New post" : "Editing"}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className={`t-label rounded-full px-3.5 py-2 transition-colors duration-short ${
                !preview ? "bg-ink text-paper" : "border border-line text-muted-foreground"
              }`}
            >
              <Code2 size={13} className="mr-1.5 inline" aria-hidden /> Markdown
            </button>
            <button
              type="button"
              onClick={() => setPreview(true)}
              className={`t-label rounded-full px-3.5 py-2 transition-colors duration-short ${
                preview ? "bg-ink text-paper" : "border border-line text-muted-foreground"
              }`}
            >
              <Eye size={13} className="mr-1.5 inline" aria-hidden /> Preview
            </button>
          </div>
        </div>

        <input
          className={`${FIELD} mb-3 !text-[1.375rem] !font-semibold`}
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className={`${FIELD} mb-4 resize-none`}
          rows={2}
          placeholder="Excerpt. One or two sentences, shown on the card and in search results."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />

        {preview ? (
          <div className="min-h-[600px] rounded-lg border border-line bg-paper p-7">
            {content.trim() ? (
              <PostBody content={content} />
            ) : (
              <p className="t-small text-faint">Nothing to preview yet.</p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className={LABEL}>Body, GitHub flavoured markdown</span>
              <label className="t-label inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-colors hover:text-ink">
                {uploading ? (
                  <Loader2 size={13} className="animate-spin" aria-hidden />
                ) : (
                  <ImagePlus size={13} aria-hidden />
                )}
                Insert image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleUpload(f, "body");
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <textarea
              ref={bodyRef}
              className={`${FIELD} t-mono min-h-[600px] resize-y !text-[0.875rem] leading-relaxed`}
              placeholder={"## A heading\n\nA paragraph.\n\n| Tool | Free tier |\n|------|-----------|\n| A    | Yes       |"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </>
        )}

        <p className="t-small mt-3 text-muted-foreground">
          {content.trim().split(/\s+/).filter(Boolean).length} words, about {readingMinutes} min
          read
        </p>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6 lg:col-span-4">
        <Panel title="Publish">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => save("published")}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.875rem] font-medium text-paper transition-colors duration-short hover:bg-brand disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" aria-hidden />}
              Publish
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save("draft")}
              className="rounded-full border border-line-strong px-5 py-2.5 text-[0.875rem] font-medium transition-colors duration-short hover:border-ink disabled:opacity-50"
            >
              Save draft
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-4 py-2.5 text-[0.875rem] text-muted-foreground transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-[hsl(var(--accent-brand))]"
            />
            <span className="t-small">Feature at the top of the blog</span>
          </label>

          {post?.slug && post.status === "published" && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noreferrer"
              className="t-label mt-4 inline-flex items-center gap-1.5 text-brand"
            >
              View live <ExternalLink size={12} aria-hidden />
            </a>
          )}
        </Panel>

        <Panel title="Organise">
          <label className={LABEL} htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            className={`${FIELD} t-mono mb-4 !text-[0.8125rem]`}
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
          />
          {!isNew && (
            <p className="t-small mb-4 -mt-2 text-warning">
              Changing this breaks existing links to the post.
            </p>
          )}

          <label className={LABEL} htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className={`${FIELD} mb-4`}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className={LABEL} htmlFor="author">
            Author
          </label>
          <select
            id="author"
            className={`${FIELD} mb-4`}
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
          >
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <label className={LABEL} htmlFor="tags">
            Tags, comma separated
          </label>
          <input
            id="tags"
            className={FIELD}
            placeholder="ai, automation, react"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Panel>

        <Panel title="Cover image">
          {coverUrl && (
            <img
              src={coverUrl}
              alt=""
              className="mb-3 h-32 w-full rounded-md border border-line object-cover"
            />
          )}
          <label className="t-label mb-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-muted-foreground transition-colors hover:border-ink hover:text-ink">
            {uploading ? (
              <Loader2 size={13} className="animate-spin" aria-hidden />
            ) : (
              <ImagePlus size={13} aria-hidden />
            )}
            Upload cover
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleUpload(f, "cover");
                e.target.value = "";
              }}
            />
          </label>
          <input
            className={`${FIELD} mb-3 t-mono !text-[0.8125rem]`}
            placeholder="or paste an image URL"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
          />
          <input
            className={FIELD}
            placeholder="Alt text, describe the image"
            value={coverAlt}
            onChange={(e) => setCoverAlt(e.target.value)}
          />
        </Panel>

        <Panel title="FAQs">
          <p className="t-small mb-4 text-muted-foreground">
            These render as an accordion and are also emitted as FAQPage schema, which
            is what can win you the expandable results in Google.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-md border border-line p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="t-label t-mono text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove question ${i + 1}`}
                    onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}
                    className="text-faint transition-colors hover:text-error"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <input
                  className={`${FIELD} mb-2`}
                  placeholder="Question"
                  value={faq.q ?? ""}
                  onChange={(e) =>
                    setFaqs(faqs.map((f, j) => (j === i ? { ...f, q: e.target.value } : f)))
                  }
                />
                <textarea
                  className={`${FIELD} resize-none`}
                  rows={3}
                  placeholder="Answer"
                  value={faq.a ?? ""}
                  onChange={(e) =>
                    setFaqs(faqs.map((f, j) => (j === i ? { ...f, a: e.target.value } : f)))
                  }
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setFaqs([...faqs, { q: "", a: "" }])}
            className="t-label mt-4 inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-muted-foreground transition-colors hover:border-ink hover:text-ink"
          >
            <Plus size={13} aria-hidden /> Add question
          </button>
        </Panel>

        <Panel title="SEO">
          <label className={LABEL} htmlFor="seo-title">
            Meta title
          </label>
          <input
            id="seo-title"
            className={`${FIELD} mb-1`}
            placeholder="Defaults to the post title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
          <p className="t-small mb-4 text-faint">
            {(seoTitle || title).length}/60 characters
          </p>

          <label className={LABEL} htmlFor="seo-description">
            Meta description
          </label>
          <textarea
            id="seo-description"
            className={`${FIELD} mb-1 resize-none`}
            rows={3}
            placeholder="Defaults to the excerpt"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
          <p className="t-small mb-4 text-faint">
            {(seoDescription || excerpt).length}/160 characters
          </p>

          <label className={LABEL} htmlFor="keywords">
            Keywords, comma separated
          </label>
          <input
            id="keywords"
            className={FIELD}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </Panel>
      </aside>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-surface p-5">
      <h2 className="t-label mb-4 text-brand">{title}</h2>
      {children}
    </section>
  );
}
