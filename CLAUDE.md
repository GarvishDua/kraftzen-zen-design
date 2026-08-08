# Kraftzen site — working context

Marketing site plus blog for Kraftzen. Vite + React 18 + TypeScript + Tailwind +
shadcn/ui + react-router + Framer Motion, with Supabase behind the blog.

Redesigned 2026-08-07. The previous version was a dark 3D portfolio theme and was
replaced wholesale.

---

## Read first

**`DESIGN.md` is the source of truth for every visual decision.** Read it before
touching colour, type, spacing, radius or motion. Do not deviate without explicit
user approval. In review, flag any code that does not match it.

**`src/lib/site.ts` is the source of truth for every word on the site.** Copy does
not live in components. If you are writing user-facing text, write it there.

**`BLOGWRITER.md` is the source of truth for every blog post.** Read it in full
before drafting one. It carries the tone, the structure skeleton, the SEO field
requirements, the AEO/GEO rules and the image prompt convention.

**Run the `/ai-seo` skill before drafting any post.** It is installed
(`coreyhaines31/marketingskills@ai-seo`) and is the authority for the AEO/GEO
section of `BLOGWRITER.md`. The blog exists to be cited by AI answers, not just
ranked, and those are different jobs. Do not draft from the summary in
`BLOGWRITER.md` alone when the skill is available.

---

## The one idea

**A studio that actually ships.** Bro AI and AniVerseX are live and public, so the
proof is available today. Every page decision serves that: real screenshots, plain
numbers, named outcomes. If an element does not make the work more believable, it
does not belong on the page.

---

## Commands

```bash
npm run dev        # vite dev server
npm run build      # production build
npm run lint       # eslint
npm test           # vitest
npm run assets     # regenerate logo + favicon + OG image into public/
npm run shots      # screenshot every route (dev server must be running)
npm run prerender  # bake static HTML per route into dist/ (needs a build first)
node scripts/optimise-blog-images.mjs --dry-run   # preview storage savings
                   # drop --dry-run and pass BLOG_ADMIN_EMAIL/PASSWORD to apply.
                   # run via node, not npm, so the flag is not eaten on PowerShell
npm run build:static  # vite build + prerender. Use this for deploys.
npx tsc --noEmit -p tsconfig.app.json   # typecheck
```

**Deploy with `npm run build:static`, not `npm run build`.** The plain build
leaves an empty SPA shell, so shared blog links fall back to the generic site
card. `build:static` writes a real HTML file per route, including one per
published post, and regenerates `dist/sitemap.xml` from the database.

### Visual checks

`npm run shots` drives the locally installed Chrome through `puppeteer-core` and
writes `.shots/*.png` for every route, desktop and mobile, plus a console error
report. **Use it after any layout change.** It caught three real bugs the code
alone did not show: colliding hero cards, a duplicated section, and four
identical screenshots in one grid.

Two gotchas:
- The dev server keeps a HMR websocket open, so `networkidle0` never fires. The
  script waits on `#main h1` and `document.fonts.ready` instead.
- Routes are lazy loaded and sections use `whileInView`. The script scrolls the
  page slowly before a `fullPage` capture so reveals have fired. Scroll too fast
  and the capture shows them at opacity 0, which looks like missing content.

Chrome path is hardcoded in `scripts/shoot.mjs`. Change it if Chrome moves.

Lint is clean of errors. The 13 remaining warnings are all
`react-refresh/only-export-components` inside vendored `src/components/ui/*`
shadcn files and `Seo.tsx` (which exports schema builders next to the component).
Do not "fix" those by splitting vendor files.

---

## Architecture

```
scripts/
  build-assets.mjs         Logo, favicon and OG image generation. npm run assets.
  shoot.mjs                Route screenshots via local Chrome. npm run shots.
  prerender.mjs            Static HTML per route. npm run prerender.
  optimise-blog-images.mjs Recompresses the storage bucket in place.
src/
  lib/site.ts              ALL copy and content data. Single source of truth.
  lib/image.ts             Canvas WebP compression. Runs before every upload.
  index.css                Design tokens as CSS custom properties + type classes.
  components/
    motion/                Scroll and entrance motion primitives.
      Reveal.tsx           THE reveal primitive + Stagger/StaggerItem. Use these.
      WordReveal.tsx       h1 word-by-word reveal. One per page, on the h1 only.
      ScrollProgress.tsx   Hairline progress bar under the nav.
      HeroVisual.tsx       The hero right column panel. Logo + the two products.
      CapabilityMarquee.tsx CSS drift + scroll nudge, two rows.
      ProcessPipeline.tsx  The explanatory diagram. Pinned on desktop, stacked on mobile.
    site/                  Page chrome.
      Layout.tsx           Nav + main + footer + progress. Wrap every page in this.
      SiteNav.tsx          Sticky nav, hides on scroll down, mobile drawer.
      SiteFooter.tsx       The one inverted block. Also carries the closing CTA.
      PageHeader.tsx       Shared h1 treatment for every page except Home.
      ProductShowcase.tsx  Full detail product sections for /products.
      Seo.tsx              Per route head tags + JSON-LD + schema builders.
      LegalPage.tsx        Shared shell for Privacy and Terms.
      Cta.tsx              PillLink (primary CTA) and ArrowLink (everything else).
    ui/                    Vendored shadcn. Inherits brand tokens via index.css.
  pages/                   One file per route.
```

### Routes

| Path | File | Notes |
|------|------|-------|
| `/` | `pages/Index.tsx` | Hero + panel, marquee, services preview, products preview, process pipeline, founder note |
| `/services` | `pages/Services.tsx` | The main SEO page. Four service blocks + engagement tiers + FAQ |
| `/products` | `pages/Products.tsx` | The two real products, in full detail |
| `/about` | `pages/About.tsx` | Facts rail, narrative, principles, founder |
| `/contact` | `pages/Contact.tsx` | Form composes a mailto draft |
| `/blog` | `pages/Blog.tsx` | Index. Featured post, search, category filter, card grid |
| `/blog/:slug` | `pages/BlogPost.tsx` | Article. TOC, markdown body, FAQs, related posts |
| `/admin` | `pages/Admin.tsx` | Auth gated blog editor. No Layout, noindex, never prerendered |
| `/privacy`, `/terms` | via `LegalPage` | |
| `/work` | redirect → `/products` | Shipped briefly mid-redesign. Keep the redirect. |

---

## The blog

Supabase project **kraftzen-blog** (`uqnjbkxwmoaohgvwvozl`, region ap-south-1, in
the `officialkraftzen@gmail.com` org). Free tier.

### Tables

- **posts** — `content` is GitHub flavoured markdown. `faqs` and `seo` are jsonb
  because they feed structured output (FAQPage schema, meta tags) and parsing
  them back out of the body would be worse. `views` is a cached counter, only
  ever written by `record_post_view`.
- **post_views** — one row per `(post_id, visitor_id, viewed_on)`. See below.
- **authors**, **categories** — public reference data.
- **post_ideas** — the writing backlog. Internal only, **no anon policy exists
  on this table at all**, so a logged out request returns nothing. Filed by the
  daily research routine and by hand. Unique index on `lower(title)` stops the
  routine filing the same headline twice.

### The idea pipeline

A scheduled cloud agent runs **daily at 02:30 UTC, which is 8am Asia/Calcutta**
(routine `trig_01Gc968ffsiNH5odytjA2G64`). It searches the web across the niche,
reads existing `post_ideas` and `posts` so it never duplicates, and inserts 4 to 6
ideas with a title, angle, keywords, sources, rationale and an honest priority.

It writes through the **Supabase MCP connector**, not a key in the repo. That is
deliberate: no service role key exists anywhere in this codebase, and none should.
The routine has no git source attached either, so its prompt is fully self
contained. If you change the category slugs, update the routine prompt at
https://claude.ai/code/routines/trig_01Gc968ffsiNH5odytjA2G64

In `/admin` the **Ideas** tab shows the backlog with New / Queued / Written /
Dismissed. "Write this" opens the post editor seeded with the title, angle and
keywords, and flips the idea to `written`.

### Running it off-schedule

**There is deliberately no in-app "run now" button.** Firing research needs an API
key, and every `VITE_` variable is compiled into the public bundle, so a key in
the frontend would be readable by anyone viewing source. Being behind the admin
login does not hide it.

To run it early, open the routine on claude.ai and hit Run now, then Refresh in
the Ideas tab once it finishes. The admin links straight to it when
`VITE_IDEAS_ROUTINE_URL` is set, and hides the link when it is not.

An Edge Function that held the key server side was built and then removed as
unnecessary: the schedule plus a manual run covers the need without a second
system to maintain, a second API bill, or a second auth surface. Do not
reintroduce it by putting a key in `.env`, which is the shortcut it existed to
avoid.

### Row level security, and why it is shaped this way

- anon may read **only** published posts with a `published_at` in the past. A
  draft reached by direct URL is invisible to logged out readers.
- authenticated users can do everything. There is no signup flow, so "authenticated"
  means an account someone deliberately created in the Supabase dashboard.
- anon cannot update posts at all, so the view counter goes through
  `record_post_view(slug, visitor)`, a `security definer` function that can only
  ever add one to the counter on an already published post. The security advisor
  flags it as anon-executable, which is intentional.
- anon cannot read `post_views`. Only authenticated users can, because the raw
  rows are the one place a reader's visits are listed together.
- Storage bucket `blog` is public read, authenticated write.

### View counting

**The counter measures unique browsers per post per day.** Not page loads, and
not people.

The dedup lives in the primary key of `post_views`, not in the client. A refresh
loop, a second tab or a bypassed client guard all hit the same
`on conflict do nothing` and change nothing. `record_post_view` returns whether
the insert actually landed and only then bumps `posts.views`, so the cached
counter and the row count cannot drift.

Three things had to be fixed for the number to mean anything, and all three will
come back if the pieces are removed:

- **`recordView` skips `navigator.webdriver` and bot user agents.** `npm run
  build:static` drives headless Chrome over every post route, so before this
  guard every deploy added a view to every post and the number measured how
  often we shipped.
- **`touch_updated_at` ignores views-only updates.** It compares
  `to_jsonb(new) - 'views' - 'updated_at'` against the same slice of `old` and
  holds the timestamp when they match. Without it every view looked like an
  edit, which would have made the "Updated" line on the article meaningless. A
  real content change still moves the timestamp; both directions are tested.
- **There is no client-side counter.** An earlier version used a `useRef` per
  slug, which strict mode and any remount defeated.

Honest limits, worth saying out loud rather than discovering later: a bot that
runs JS without the webdriver flag still counts, and clearing site data makes a
returning reader look new. This is a good enough number for a badge and a
dashboard. **It is not analytics.** For traffic sources, referrers and trends,
add Plausible, Umami or PostHog alongside it rather than trying to extract those
answers from this table.

`blog_views_daily(days)` and `blog_views_by_post(days)` aggregate in Postgres for
the admin dashboard. Do not replace them with a client-side reduce over raw rows.

### Creating an admin user

There is no signup form on purpose. In the Supabase dashboard go to
Authentication → Users → Add user, create one with an email and password, then
sign in at `/admin`. Anyone with an account can publish, so do not hand them out.

**Turn on leaked password protection** while you are in there
(Authentication → Policies). The security advisor flags it as disabled. It checks
new passwords against HaveIBeenPwned, and since that password is the only thing
standing between the internet and your publish button plus the Anthropic budget,
it is worth the one click.

### Publishing flow

Write in `/admin`, which has a markdown editor with a live preview that renders
through the exact `PostBody` the public page uses. Save draft or Publish.

**Publishing alone does not update the prerendered HTML.** Static files are baked
at build time, so a newly published post is live for readers immediately but its
static version, and therefore its social card, only exists after a rebuild. Set
`VITE_DEPLOY_HOOK_URL` to your host's build hook and the Publish button pings it.

### Content conventions

Full spec in `BLOGWRITER.md`. The parts that bite you in code:

- Do not manually number `##` headings unless the post genuinely needs it. The
  table of contents lists headings verbatim.
- Comparison tables are plain GFM markdown tables. They scroll inside their own
  container, so a wide table never makes the page scroll sideways.
- Raw HTML in post bodies is deliberately **not** rendered. `rehype-raw` is left
  out so a post body can never inject a script tag.
- **`CARD_COLUMNS` rows are partial. Never edit from one.** The admin list and
  the public blog both fetch with `CARD_COLUMNS`, which omits `content`, `faqs`
  and `seo` because they are large and never shown in a list. Handing that row
  to `PostEditor` renders an empty body, and a save writes that emptiness back
  over the real post. `openEditor()` in `Admin.tsx` calls `fetchPostById()` for
  the complete row first, and `PostEditor.save()` refuses to write when
  `post.content` is `undefined` or when a post that had a body is about to be
  saved empty. This was a live data-loss bug, not a hypothetical. Keep both
  guards.
- Post list styling lives in `index.css` under `.post-body`, not in `PostBody.tsx`.
  react-markdown renders every `li` through one component and does not say whether
  the parent is a `ul` or an `ol`, so an inline check gave numbered lists a double
  marker. CSS child selectors know the parent for free.
- Images that do not exist yet are written as `> **[IMAGE PROMPT]**` blockquote
  blocks, never as a broken URL or a bare placeholder. They render as a visible
  blockquote in the post, which is intentional: an unreplaced prompt is obvious
  in preview rather than shipping as a silent broken image.
- **Covers are `object-contain` on a paper ground, never `object-cover`.** They
  are wide infographics with type inside them, so cropping cut the headings off.
  Every card fixes `aspect-[16/9]` and lets the image letterbox. This applies in
  `Blog.tsx`, `RelatedCard` in `BlogPost.tsx` and the admin list thumbnail. If a
  cover ever needs to bleed edge to edge, that is a new cover, not a new
  `object-fit`.

### Image weight, and why it is the binding constraint

**Bandwidth runs out long before storage does.** The free tier is roughly 1 GB
of storage and 5 GB of egress a month, and only one of those is close.

Image models emit PNGs around 1.5 MB. The blog index loads up to ten covers at
once, so at that size a single visit to `/blog` costs 15 MB and the monthly
allowance is gone in a few hundred visits, while the bucket is still 99% empty.
Measured on the real cover: 1526 KB as PNG, 94 KB as WebP at the same width.
Sixteen times.

So:

- **`uploadBlogImage` compresses before it uploads.** `src/lib/image.ts` draws
  the file to a canvas at a max width of 1600 and encodes WebP at 0.82. No
  dependency, no server round trip. It keeps the original if the result is
  somehow larger, and passes SVG and GIF through untouched, because rasterising
  an SVG or freezing an animation is worse than a large file. **Never add an
  upload path that skips this.**
- The editor reports the saving in the success toast, so a regression is visible
  the first time someone uploads.
- `npm run images:optimise` sweeps anything already in the bucket. It rewrites
  each file **at its existing path**, so public URLs do not change and no post
  body needs editing. Browsers honour the content type over the extension, which
  is why a `.png` path can hold WebP bytes. Add `--dry-run` to preview.
  It signs in as an ordinary admin, not a service role key. Pass credentials
  inline rather than putting them in `.env`.

The first sweep took the bucket from 4217 KB to 241 KB, a 94% reduction.

If this ever stops being enough, the fix is not a bigger Supabase plan. Move the
bucket to Cloudflare R2, which has no egress charge at all, or serve covers from
the host's CDN. Paying per gigabyte to serve images that should be a tenth of
the size is the wrong end of the problem.

### The blog index

`/blog` carries its own hero rather than `PageHeader`, because the featured post
sits **beside** the h1 instead of in a band below it. That is the whole point of
the layout: the first screen shows the positioning and the newest article at once.

- **The featured post is excluded from the library grid, always.** It is already
  on screen in the hero. An earlier rule only excluded it once there were more
  than three posts, which put the same card on the page twice while the archive
  was small. When that leaves the library empty the section says so.
- **Ten posts per page.** Pagination is the reason the grid stays smooth, so do
  not swap it for infinite scroll or raise the number much.
- Sort is three buttons, not a select, because one option is always active and a
  closed dropdown cannot show which.
- The `<Stagger>` is keyed on `sort` and page number so each page animates in as
  its own set rather than inheriting the previous page's finished state.

### The blog voice is not the marketing voice

The marketing pages are restrained. The blog is deliberately punchier: short
fragments, rhetorical questions as headings, pullquotes, direct "you". That
follows the reference blog the tone was modelled on (enally.in/blog).

The hard rules still apply to both. **No em dashes, no banned vocabulary, no
invented metrics.** Two devices the reference uses are banned here anyway: the
"X doesn't mean Y, it means Z" heading (it is the banned "not just X, it's Y"
in disguise) and triples of bare adjectives. Fragments stay, adjective triples go.
`BLOGWRITER.md` explains the reasoning.

### Anti-repetition rules

The site is small, so the same idea showing up twice is the fastest way to make
it feel padded. These pairings are deliberate, do not undo them:

- **Process pipeline** lives on Home only. Services gets `ENGAGEMENTS` (the three
  pricing shapes) instead, because commercials are more useful on that page than
  a second copy of an animation.
- **Principles** live on About only. Home does not repeat them.
- **Footer CTA** ("One call is usually enough to know") must stay different from
  the Contact page h1 ("Tell us what is eating your week"). They were identical
  once and it read as a bug.
- **Products** appear three times by design, each in a different shape: a compact
  list in the hero panel, two image cards on Home, full sections on /products.
  If you change one, keep the shapes distinct.
- Never pad a grid by repeating the same screenshot. `ProductModule.image` is
  optional precisely so AniVerseX can render numbered cards instead of four
  copies of one capture.
- **The home page closes on one founder section, not two about-ish blocks.** An
  earlier version had a "studio note" immediately followed by a founder block and
  they made the same point twice. `FounderNote` now carries both: the studio's
  reason for existing, then the signature.
- `FOUNDER.body[1]` opens with "He", which only works on About where the name is
  already the heading. The home page uses `FOUNDER.homeNote` instead, which opens
  with the name because the signature sits below the paragraph there. Keep both.

---

## Writing rules (binding)

These exist because the previous copy read as machine written. Enforce them.

- **No em dashes.** Use a period, a comma, or restructure. This is not negotiable.
- **Banned words:** delve, crucial, robust, comprehensive, nuanced, multifaceted,
  furthermore, moreover, additionally, pivotal, landscape, tapestry, underscore,
  foster, showcase, intricate, vibrant, seamless, cutting-edge, leverage, empower,
  unlock, elevate, revolutionize, transform your business, take it to the next
  level, in today's fast-paced world, we are passionate about.
- **Banned constructions:** "Built for X." "Designed for Y." "It's not just X,
  it's Y." Rhetorical triples. Sentences opening with a participle.
- Short sentences. Active voice. Second person for the reader, first person plural
  for Kraftzen.
- Concrete over adjectival. Numbers only where a real number exists.
- Never invent a metric. If a claim needs a figure nobody has verified, either cut
  the claim or mark it `NEEDS_REAL_NUMBER` in `site.ts` and tell the user.

---

## Motion rules

Full detail in DESIGN.md. The short version:

- **Framer Motion only. Do not add GSAP.** Everything the site needs is covered by
  `useScroll` + `useTransform` + sticky positioning. ScrollTrigger would only be
  required for scroll snapping or ScrollSmoother, neither of which we use.
- One easing family: `[0.22, 1, 0.36, 1]`, exported as `EASE` from
  `components/motion/Reveal.tsx`. Import it, do not retype the numbers.
- Four durations: 120 / 240 / 420 / 700ms.
- **Use `<Reveal>` and `<Stagger>`.** Do not hand roll a new entrance animation.
  Consistency here is the whole point.
- Scroll-driven motion is allowed **only when it explains something**. Decorative
  parallax is not allowed. The approved uses are already built.
- Scrubbed timelines never get an ease. Linear only.
- Every scroll-driven component must handle `useReducedMotion()` and have a legible
  static end state. `ProcessPipeline` and `CapabilityMarquee` show the pattern.
- MotionValues must go in `style`, never `animate`.

---

## SEO

**Solved by prerendering, as long as you deploy with `build:static`.**
`Seo.tsx` sets head tags in `useEffect`. Googlebot runs JS and picks them up;
social scrapers (WhatsApp, Slack, X, LinkedIn) do not. `scripts/prerender.mjs`
closes that gap: it serves `dist`, drives the local Chrome over every route
including one per published post, and writes the rendered DOM back as
`<route>/index.html`. Crawlers then get real titles, descriptions, OG images,
JSON-LD and full article text with no JavaScript.

`index.html` still carries a complete standalone OG set as the fallback for any
route that fails to prerender.

Two things to know about the prerender step:
- It force-sets `opacity:1` before capturing, because `whileInView` reveals start
  at opacity 0 and would otherwise be baked into the HTML invisible.
- It skips silently if Chrome is not at the hardcoded path, so a build on a
  machine without it still succeeds, just without static HTML.

What is already wired:

- Per route `<Seo>` with title, description, canonical, OG, Twitter, robots.
- JSON-LD per route: `ProfessionalService` (org), `WebSite`, `ItemList` of
  `Service` on /services, `FAQPage` on /services, `CollectionPage` on /products,
  `AboutPage`, `ContactPage`, `Blog` on /blog, `BlogPosting` plus `FAQPage` on
  each post, `BreadcrumbList` on every inner page.
- `public/sitemap.xml` is the dev-time fallback and lists static routes only.
  The real one is generated into `dist/sitemap.xml` by the prerender step and
  includes every published post. Update the `lastmod` in the public copy when a
  marketing page changes.
- `public/robots.txt`, `public/llms.txt`.
- `public/og-default.png` (1200x630), generated from `public/og-default.svg`.
  To regenerate after editing the SVG:
  ```bash
  npx --yes sharp-cli@5 -i public/og-default.svg -o public/ -f png resize 1200 630
  ```
  Note: the SVG renderer collapses whitespace between `<tspan>` elements. Use
  `dx` for spacing, not a space character or `&#160;`.
- 404 route sets `noindex`.

Ranking intent: `/services` is the page meant to rank for AI automation and AI
agency queries. Keep its four `<h2>` blocks keyword-clear and keep the FAQ answers
substantive, since they feed the `FAQPage` schema.

The blog is the traffic play. Every post should carry a filled in `seo.description`
and at least three FAQs, because the `FAQPage` block is what wins the expandable
result. Comparison tables earn featured snippets, so use one wherever a post is
genuinely comparing options.

### AEO and GEO

The blog targets **citation** in AI answers, not only ranking. Full rules in
`BLOGWRITER.md`; the authority is the `/ai-seo` skill. The parts that live in
code rather than in the writing:

- `public/robots.txt` names the AI crawlers explicitly (GPTBot, ChatGPT-User,
  OAI-SearchBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended,
  Bingbot). A wildcard already allowed them; naming them makes it auditable so a
  broad `Disallow` added later cannot silently kill AI citations.
- The post page shows a visible **Updated** date once a post is edited a day or
  more after publishing. `dateModified` was already in the JSON-LD, but freshness
  only counts as a signal if a reader can see it. The one day threshold exists
  because the `touch_updated_at` trigger fires on every save, so a same-day typo
  fix would otherwise label the post as updated.
- Still unwired, worth adding when the first such post ships: `HowTo` schema for
  how-to posts, `ItemList` schema for comparison posts.

---

## Facts about the business

Verified, safe to use:

- AI studio based in Delhi, India. Founder: Garv.
- `officialkraftzen@gmail.com`, `+91 9310367672`.
- **Exactly two products, both live**: Bro AI (`https://bro.ai.in`) and AniVerseX
  (`https://aniblogs.vercel.app`). Do not invent a third. Client offerings are
  services, and they live in `SERVICES`, never in `PRODUCTS`.
- Bro AI contains **five** tools: Designer Bro, Gen-Z Bro, Animator Bro, Portfolio
  Bro, Emailer Bro. Gen-Z Bro renders photos in whatever art style is trending
  (Ghibli and so on), confirmed by Garv 2026-08-08. If a sixth is added, update
  `PRODUCTS[0].kicker` ("Five narrow AI tools behind one login") and `llms.txt`
  too, and check the modules grid column count in `ProductShowcase.tsx`.
- Services: AI tools and agents, workflow automation, websites and web apps,
  automated content systems.
- **Founder: Garvish Dua.** Not "Garv". The name is in `SITE.founder` and
  `FOUNDER.name`; derive the first name with `FOUNDER.name.split(" ")[0]` rather
  than hardcoding it.

### Image assets

Originals live in the repo but the app never references them directly. Everything
the app uses is generated by `npm run assets`:

| Original | Generated | Notes |
|----------|-----------|-------|
| `src/assets/kraftzen-logo.png` | `logo-mark.png`, `logo-mark-128.png`, `favicon.png` | RGB with a white ground. Trimmed, then white keyed out. |
| `public/Bro ai logo-Photoroom.png` | `logo-bro-ai.png` | Transparent with heavy padding, so it is trimmed on alpha then squared to 256. |
| `public/anniverseXlogo.png` | `logo-aniversex.png` | Already square with its own black ground. Resize only. |
| `public/GarvishDuaphoto.png` | `founder-garvish.jpg` | 1MB PNG down to ~77KB JPEG at 1000px. Never reference the PNG. |
| `public/Broaidashboard.png` | `broai-dashboard.jpg` | 429KB PNG down to ~43KB JPEG at 1600px. The Bro AI cover image. |
| `public/Broaidashboard.png` | `broai-genz.jpg` | Cropped Gen-Z Bro card. **Coordinates are hardcoded to the current 1897x850 capture.** The script checks those dimensions and skips with a warning if they change. Delete the block once a real Gen-Z Bro screenshot exists. |
| `public/og-default.svg` | `og-default.png` | 1200x630 social card. |

Wide UI captures go through the `screenshots` loop in the script: flattened onto
near-black, resized to 1600px, JPEG at quality 84. Add new product captures there
rather than referencing a raw PNG from `site.ts`. A 400KB PNG in a card is a real
page-speed cost for something that compresses to a tenth of that.

Two rules that will bite you otherwise:

- **The Kraftzen mark must sit on a white surface.** Keying the white ground out
  leaves a faint halo on anti aliased edges, invisible on white and visible on
  paper. Nav, footer and hero panel all place it on `bg-surface` or `bg-paper`.
- **AniVerseX carries its own dark ground**, so it must not get a light plate
  behind it. That is what `Product.logoOnDark` is for. Bro AI is transparent and
  does need one. Every place that renders a product mark branches on this flag.

**Unverified, currently written into `site.ts` as reasonable claims. Confirm with
Garv before launch:**

- `ENGAGEMENTS` prices and durations (Sprint from ₹60,000, Build ₹1L to ₹5L,
  Ongoing monthly). These are the most commercially load bearing numbers on the
  site and they also appear in `public/llms.txt`.
- Pricing and timeline bands in `FAQS`.
- "One business day" reply time, used in several places.
- Budget bands in `CONTACT.budgets`.
- `ABOUT.facts` ("Teams of 5 to 50", "2 to 8 weeks").

**Do not invent user counts, revenue, client counts or years in business.** The
previous site had numbers nobody could source. If a number is needed, ask.

---

## Things deliberately removed, do not add back

- The n8n chat widget (`useKraftzenChat`, `components/chat/*`). It was visually
  bolted on and failed visibly when the webhook was down. Note this is unrelated
  to the Supabase dependency added for the blog, which is deliberate.
- The dark `#0C0C0C` theme, Kanit, the gradient hero text, the 3D sphere, the
  floating decor images, the magnet cursor effect.
- `components/three-d/*` and `components/landing/*`.
- The `/products` page, replaced by `/work` plus a redirect.

---

## Open items

1. **Remaining weak screenshots.** Both covers are now real product UI, so the
   flagship images are solid. Still soft at tile size: `designerbro.png` is a
   watch product photo, which is a genuine Designer Bro output but reads as stock,
   and `broai-genz.jpg` is a crop of a card rather than the tool in use. Per tool
   screen captures at ~1200px wide would finish the job. Add them through the
   `screenshots` loop in `scripts/build-assets.mjs`, not as raw PNGs.
2. **Prerendering** for per-route social cards. See SEO above.
3. **Contact form has no backend.** It composes a mailto draft, which loses people
   on devices with no mail client configured. A form endpoint (Formspree, a Worker,
   an n8n webhook) is the fix.
4. **Confirm the unverified facts** listed above.
5. `src/assets/kraftzen-logo.webp` is unreferenced. The `.png` is the asset source
   for `npm run assets`, keep it.

---

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- **Writing or editing a blog post → read `BLOGWRITER.md`, then invoke /ai-seo**
- **AEO, GEO, AI Overviews, getting cited by ChatGPT or Perplexity → invoke /ai-seo**
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
