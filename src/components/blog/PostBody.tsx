import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

/**
 * Renders a post body from GitHub flavoured markdown.
 *
 * Every element is mapped explicitly rather than styled through a prose plugin,
 * because the article has to use the same type scale and tokens as the rest of
 * the site. See DESIGN.md.
 *
 * GFM gives us tables (the comparison tables), strikethrough and task lists.
 * rehype-slug gives every heading an id so the table of contents can link to it.
 *
 * Raw HTML is deliberately NOT enabled. Post content is trusted today because
 * only admins can write it, but leaving rehype-raw off means a future contributor
 * cannot inject script tags through a post body.
 */
export default function PostBody({ content }: { content: string }) {
  return (
    <div className="post-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h2: ({ children, ...props }) => (
            <h2 {...props} className="t-h2 mb-5 mt-16 scroll-mt-28 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 {...props} className="t-h3 mb-4 mt-12 scroll-mt-28">
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 {...props} className="mb-3 mt-9 scroll-mt-28 font-semibold text-ink">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-6 text-[1.0625rem] leading-[1.75] text-ink-soft">{children}</p>
          ),
          a: ({ children, href }) => {
            const external = href?.startsWith("http");
            return (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer noopener" : undefined}
                className="font-medium text-brand underline decoration-brand/30 underline-offset-4 transition-colors duration-short ease-out hover:decoration-brand"
              >
                {children}
              </a>
            );
          },
          /* Lists are styled in index.css under .post-body rather than here.
             react-markdown does not tell a `li` whether its parent is a ul or
             an ol, so an inline check marked ordered items with the unordered
             dash as well and every numbered list rendered a double marker.
             A CSS child selector knows the parent for free. */
          strong: ({ children }) => (
            <strong className="font-semibold text-ink">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-8 border-l-2 border-brand bg-brand-soft/40 py-4 pl-6 pr-5 [&>p:last-child]:mb-0 [&>p]:text-ink">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-12 border-line" />,

          /* Comparison tables. Scroll inside their own container so a wide
             table never makes the whole page scroll sideways. */
          table: ({ children }) => (
            <div className="mb-8 overflow-x-auto rounded-lg border border-line">
              <table className="w-full border-collapse text-left text-[0.9375rem]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface-sunken">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="t-label whitespace-nowrap border-b border-line px-5 py-4 text-muted-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-line px-5 py-4 align-top text-ink-soft last:border-r-0">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="last:[&>td]:border-b-0">{children}</tr>
          ),

          /* Inline code and fenced blocks share the mono face. */
          code: ({ children, className }) => {
            const isBlock = Boolean(className?.startsWith("language-"));
            if (isBlock) {
              return (
                <code className="t-mono block whitespace-pre text-[0.875rem] leading-[1.7] text-ink">
                  {children}
                </code>
              );
            }
            return (
              <code className="t-mono rounded-sm border border-line bg-surface-sunken px-1.5 py-0.5 text-[0.875em] text-ink">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-8 overflow-x-auto rounded-lg border border-line bg-surface-sunken p-5">
              {children}
            </pre>
          ),

          /* Images render as figures so the alt text doubles as a caption. */
          img: ({ src, alt }) => (
            <figure className="mb-8">
              <img
                src={typeof src === "string" ? src : ""}
                alt={alt ?? ""}
                loading="lazy"
                decoding="async"
                className="w-full rounded-lg border border-line"
              />
              {alt && (
                <figcaption className="t-small mt-3 text-muted-foreground">{alt}</figcaption>
              )}
            </figure>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
