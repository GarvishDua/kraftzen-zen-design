import { useState } from "react";
import { toast } from "sonner";
import { Link2, Check, Share2 } from "lucide-react";

/**
 * Share controls for an article.
 *
 * No third party share widgets. The official buttons from X, LinkedIn and the
 * rest each load their own script and set their own cookies, which would cost
 * page speed and add trackers to a site whose privacy policy says we do not run
 * our own. These are plain links to public share URLs, so nothing loads until
 * someone actually clicks.
 *
 * On phones the native share sheet is offered first, because it reaches
 * WhatsApp, which is where most of this audience actually shares things.
 */

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413" />
    </svg>
  );
}

const BTN =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted-foreground transition-colors duration-short ease-out hover:border-ink hover:text-ink";

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <XIcon />,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <LinkedInIcon />,
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <WhatsAppIcon />,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Select the address bar and copy it manually.");
    }
  }

  /** Native sheet reaches apps a web link cannot. Only exists on some browsers. */
  const canShareNatively = typeof navigator !== "undefined" && "share" in navigator;

  async function shareNatively() {
    try {
      await navigator.share({ title, url });
    } catch {
      /* The user dismissing the sheet throws. That is not an error. */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="t-label mr-1 text-faint">Share</span>

      {canShareNatively && (
        <button type="button" onClick={shareNatively} aria-label="Share this article" className={`${BTN} sm:hidden`}>
          <Share2 size={15} aria-hidden />
        </button>
      )}

      {targets.map((t) => (
        <a
          key={t.name}
          href={t.href}
          target="_blank"
          /* noreferrer as well as noopener: the target should not be handed the
             referring URL, and it closes the reverse tabnabbing hole. */
          rel="noopener noreferrer"
          aria-label={`Share on ${t.name}`}
          className={BTN}
        >
          {t.icon}
        </a>
      ))}

      <button type="button" onClick={copy} aria-label="Copy link to this article" className={BTN}>
        {copied ? <Check size={15} aria-hidden /> : <Link2 size={15} aria-hidden />}
      </button>
    </div>
  );
}
