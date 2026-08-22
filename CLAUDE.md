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

### Scheduling posts

**`scheduled` is a derived state, not a stored one.** The `status` column still
only ever holds `draft` or `published`. A scheduled post is `published` with a
`published_at` in the future, and the anon RLS policy is already

```sql
status = 'published' AND published_at IS NOT NULL AND published_at <= now()
```

so the post is invisible to readers and appears by itself at the right moment.
No job flips anything, no column was added, no migration was needed.

That shape was chosen over a third `status` value on purpose: a new value means
editing the RLS policy, and that policy is the only thing standing between a
draft and the public internet. Verified both directions against the live
database on 2026-08-09: a post dated two days out returned 0 rows to `anon`, and
the same row dated one minute ago returned 1.

- `postState(post)` in `src/lib/supabase.ts` is the single place the mapping
  lives. Use it, do not re-derive `published_at > now()` inline. Tested in
  `src/test/post-state.test.ts`, including `published` with a null date, which
  reports as `draft` because RLS hides it.
- **`fetchPosts` filters `published_at <= now()` as well as `status`.** RLS
  already does this for anon, but a signed in admin browsing `/blog` would
  otherwise see their own scheduled posts and think the schedule had leaked.
- **Scheduling deliberately does not ping the deploy hook.** At schedule time
  the post is still hidden, so a build then would bake nothing.
- Publish on an already scheduled post replaces the future date with now.
  Keeping the stored date is right for a live post, so an edit does not bump it
  back to the top of the blog, and wrong for a scheduled one, where it would
  mean Publish silently did nothing. `publishedAtFor` in `PostEditor.tsx`.
- The `datetime-local` input is converted through `toLocalInput`, not by slicing
  the ISO string. Slicing shows UTC and schedules posts hours off.

**The rebuild runs in Postgres, not on Vercel.** Migration
`20260809081916_scheduled_post_rebuild`, kept in `supabase/migrations/` so it is
findable from the repo. `pg_cron` calls
`public.trigger_rebuild_for_due_posts()` every five minutes; when a post has
crossed its publish time since the last build, `pg_net` posts to the deploy
hook.

- **To arm it, store the hook in Vault**, which is the one manual step:
  ```sql
  select vault.create_secret('https://api.vercel.com/v1/integrations/deploy/...', 'deploy_hook_url');
  ```
  Until that secret exists the job runs, finds the due posts, and writes
  `build_state.last_reason` explaining that it is not armed. It deliberately
  **does not advance the marker** in that state, so arming it later still
  catches everything.
- **`build_state` is a one row table holding `last_build_at`.** That marker is
  the whole reason this lives in the database. A stateless function cannot
  remember where it got to, so it has to guess a lookback window and either
  double-build or drop posts. This just asks "what published after the marker",
  which is exact.
- It advances the marker to the **newest post consumed, not to `now()`**. A post
  landing between the count and the update stays unconsumed for the next run
  instead of being skipped forever.
- **`build_state` has RLS on and no policies**, so anon and authenticated cannot
  touch it. The function is `security definer` with execute revoked from
  `public`, `anon` and `authenticated`, because otherwise it is a public button
  that spends build minutes.
- Debug with `select * from public.build_state` and
  `select status_code, error_msg, created from net._http_response order by created desc`.

**Vercel cron was the first version and was replaced.** Hobby caps cron at one
run per day with ±59 minutes of jitter and best-effort delivery, which forced a
48 hour lookback window and occasional duplicate builds. `pg_cron` runs every
five minutes with exact state. If you ever go back, the constraint to remember
is that a stateless endpoint has no marker, so the window has to be wider than
the interval.

### Content conventions

Full spec in `BLOGWRITER.md`. The parts that bite you in code:

- Do not manually number `##` headings unless the post genuinely needs it. The
  table of contents lists headings verbatim.
- Comparison tables are plain GFM markdown tables. They scroll inside their own
  container, so a wide table never makes the page scroll sideways.
- Raw HTML in post bodies is deliberately **not** rendered. `rehype-raw` is left
  out so a post body can never inject a script tag.
- **`faqs` rows are `{ q, a }`, not `{ question, answer }`.** The `Faq` type in
  `src/lib/supabase.ts` is the shape every consumer reads: the editor inputs,
  the article accordion and `faqSchema` in `Seo.tsx`. Inserting a draft through
  SQL or the Supabase MCP with the long key names looks fine in the database and
  then renders zero FAQs, and `PostEditor.save()` threw
  "Cannot read properties of undefined (reading 'trim')" on it. The filter is
  now optional-chained so a bad row is dropped rather than killing the save, but
  the row is still silently lost, so write the right keys. Verify after any
  scripted insert with `select jsonb_object_keys(...)`.
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

- **The library lists every post, including the featured one.** Garvish's call,
  2026-08-08. The hero is a highlight, not a replacement for the archive: a
  reader who scrolls past it and starts filtering expects the newest post in the
  grid and expects the count to match the real total. A version that excluded it
  was tried and rejected, because it made the archive read as incomplete and
  left the grid empty while there was only one post. Yes, the newest post
  appears twice on the first screen. That is intended.
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
- **Never call Kraftzen small.** No "small studio", "small company", "small
  startup", "small agency", "just a", "only a". Garvish's call, 2026-08-15. It
  is an apology offered before the reader has decided anything, and the proof on
  the page carries the positioning better than a hedge does. Write "an AI studio
  in Delhi".
  **Describing the client as a small team is different and stays.** "Automation
  for teams of 5 to 50" is who the work is for, not a claim about us, and it is
  load bearing for search. Do not strip those.
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
- **Route changes reset scroll and fade in.** `components/motion/RouteTransition.tsx`
  holds both. `ScrollToTop` resets the scroll position on a pathname change and
  deliberately skips when there is a hash, because `/services#workflow-automation`
  is a request to land at a section. `RouteTransition` is a 240ms opacity fade
  with no movement and no exit animation: the sections inside each page already
  animate through `Reveal`, so anything larger runs against them, and an exit
  animation around lazy routes has to hold the old tree while the next chunk
  loads, which feels slower rather than smoother. It skips the first paint so a
  cold load is not delayed and the prerender is not fighting an opacity of 0.

## Page visuals are drawn, not photographed

`ServicesVisual`, `AboutVisual`, `ContactVisual` and `ProductConstellation` in
`components/motion/` fill the right column of each page header, through the
optional `aside` prop on `PageHeader`. Pass nothing and the header stays single
column exactly as before.

- **They are HTML and CSS, not image files.** Zero network requests, they read
  the brand tokens so they cannot clash, sharp at any size, no licence.
- **Text is never SVG `<text>`.** It cannot wrap and it scales with the viewBox,
  which overflowed the longest service title and shrank every label in a narrow
  column. Only the connector rails are SVG.
- **Every number in them is real.** `AboutVisual` counts the two live products
  and nothing else. Stock photography was rejected partly because the proposed
  About image showed eight people for a one-person studio, which is the visual
  form of the invented-metrics rule.
- **Check both breakpoints when adding one.** The aside shows at every size, so
  a visual that repeats something already on the page collides on mobile where
  the layout stacks. `ProductConstellation` is wrapped in `hidden lg:block` for
  exactly that reason: the jump links below it already name both products.

## Never use a native `<select>` on a public page

A native `<select>` renders its option list through the operating system, so no
CSS reaches it. On a warm rounded page you get square corners, a system blue
highlight and the OS font, which is exactly the inconsistency it looks like.

Use the vendored Radix `Select` from `components/ui/select.tsx`, which renders a
real popover that inherits the brand tokens. `/blog` and `/contact` are both
converted. The two remaining native selects are in `PostEditor` inside `/admin`,
which is a tool rather than a page and is deliberately left utilitarian.

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

Three things to know about the prerender step:
- **Routes whose content comes from a query need a `waitFor` selector.** The
  capture used to wait only for an `h1`. On `/blog/:slug` the h1 IS the post
  title, so that implicitly waited for Supabase. On `/blog` the h1 is the static
  hero copy, which exists on first paint, so the capture happened while the
  posts query was still in flight and **the loading skeletons were baked into
  the static HTML**. Every visitor then paid the whole chain before seeing a
  card: download 420 KB of JS, hydrate, query, render, only then fetch covers.
  `/blog` now waits for `a[href^="/blog/"]`. Add a `waitFor` to any new route
  that renders fetched data, and check the built HTML actually contains a post
  title rather than trusting the `ok` line.
- **The LCP image is hoisted into a `<head>` preload.** The largest image
  carries `fetchpriority="high"` but sits thousands of bytes into the body, so
  the preload scanner reaches it late. Only the first one is hoisted; preloading
  several makes them compete, which is the problem it exists to avoid.
- It force-sets `opacity:1` before capturing, because `whileInView` reveals start
  at opacity 0 and would otherwise be baked into the HTML invisible. **It then
  removes that rule and strips the inline start states, inside a single
  `page.evaluate` that also returns the HTML.** Both halves are load bearing.
  The forcing rule used to ship inside every prerendered page, and
  `*{opacity:1!important;transform:none!important}` beats Framer's inline
  styles, so the deployed static build had every animation on the site
  permanently switched off while looking completely correct. Splitting the strip
  and the serialize into two calls reintroduces a different version of the bug:
  Framer rewrites its inline styles every frame, so a frame lands in between and
  re-hides anything whose reveal was still in flight. Keep it atomic.
- It skips with a warning if no Chrome is found, so a build on a machine without
  it still succeeds, just without static HTML. It checks `CHROME_PATH`, then
  `PUPPETEER_EXECUTABLE_PATH`, then the usual Windows, macOS and Linux install
  locations. It used to be one hardcoded Windows path, which meant it skipped
  silently on every Linux builder and the deploy shipped an empty SPA shell.

### Performance

**Measured 2026-08-22 with Lighthouse against a local `build:static` preview.**
Production PageSpeed before this work was desktop 57, mobile 60.

| | Desktop | Mobile |
|---|---|---|
| After the image work | **89 to 93** | 62 |
| Same build, ad hosts blocked | n/a | **81** |

**Images were the whole desktop story.** The home page was loading 1,333 KB of
images and is now 168 KB. Two separate instances of the same mistake:

- `site.ts` referenced `/aniversex.png`, a 610 KB raw source capture, as the
  AniVerseX cover.
- Four Bro AI module tiles were raw source PNGs totalling 1,781 KB on
  `/products`. `Animatorbro.png` alone was 886 KB for a tile that renders about
  600 px wide.

Both are exactly what the asset table below warns about. Every capture now goes
through the `screenshots` loop in `build-assets.mjs`, which emits a right-sized
JPEG and a WebP, and the UI references the WebP. **Never reference a file from
`public/` that the pipeline did not generate.**

Also done: WebP for every logo (the 512px mark went 386 KB to 35 KB), a
`Cache-Control` header for root images in `vercel.json` (they sit outside
`/assets` so they had no cache policy at all), and `fetchpriority="high"` on the
hero logo so `prerender.mjs` hoists it into a `<head>` preload.

**AdSense costs about 19 mobile points, and that is not fixable in code.**
Blocking only the ad hosts on the same build moves mobile from 62 to 81, FCP
from 5.3s to 3.3s and LCP from 7.7s to 3.9s. The tag pulls in doubleclick,
adtrafficquality, recaptcha and sodar, all executing on a 4x throttled main
thread. The LCP breakdown is almost entirely render delay, 7.3s of 7.7s.

**Mobile 90 is not reachable while ads run.** Even with ads blocked it is 81,
and the remaining gap is the JS bundle: roughly 137 KB gzipped costing 1.8s of
CPU under Lighthouse's 4x mobile throttle. Closing that means cutting Framer
Motion out of the critical path, which DESIGN.md currently mandates everywhere.
That is a design decision, not a tuning exercise.

### Vercel routing

**`vercel.json` is what makes a typed URL work.** Vercel serves files, so
`/services` with no file there is a 404 and React Router never runs. The rewrite
sends anything unmatched to `/index.html`.

The order matters and is doing real work: Vercel checks the filesystem **before**
applying rewrites, so a prerendered `dist/services/index.html` is served as
itself, and only routes with no file fall through to the SPA shell. That is
exactly right for a blog. Posts published after the last build have no static
file, so they fall back to client rendering and still load, while everything
present at build time keeps its real HTML.

Two consequences worth knowing:
- **Prerendering now runs on Vercel.** `vercel.json` sets
  `"buildCommand": "npm run build:static"`, and `prerender.mjs` falls back to
  `@sparticuz/chromium` when it finds no local Chrome. That fallback exists
  because the builder is Amazon Linux 2023, which **has no Chromium in its
  repositories at all**, so `dnf install chromium` is not an option and every
  path in `CHROME_CANDIDATES` is missing there. The package is a headless
  Chromium with the shared libraries Amazon Linux lacks bundled alongside it,
  and it unpacks itself to /tmp.
  The fallback is tried **last**, so a developer machine still uses its real
  Chrome, and if the import fails the script drops through to the existing
  skip-with-a-warning path rather than failing the deploy.
- A newly published post is readable immediately but has no static HTML until the
  next `build:static`. That is the same rebuild the social card already needs.

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
and at least three FAQs. Comparison tables earn featured snippets, so use one
wherever a post is genuinely comparing options.

**FAQ rich results no longer exist on Google.** They were restricted to
government and health sites in September 2023 and removed from Search entirely
on 15 June 2026. `FAQPage` markup stays because AI answer engines still extract
question and answer pairs from it, which is the citation play. Do not expect an
expandable blue-link result from it.

Schema is verified in the built output, not in the source. Checking `Seo.tsx`
tells you what should be emitted; only `dist` tells you what shipped. The
regex to match a JSON-LD block must allow attributes before `type`, because the
component writes `<script id="route-schema" type="application/ld+json">` and a
naive `<script type=...>` pattern silently misses every route-level graph.

### AEO and GEO

The blog targets **citation** in AI answers, not only ranking. Full rules in
`BLOGWRITER.md`; the authority is the `/ai-seo` skill. The parts that live in
code rather than in the writing:

- `public/robots.txt` names the AI crawlers explicitly (GPTBot, ChatGPT-User,
  OAI-SearchBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended,
  Bingbot). A wildcard already allowed them; naming them makes it auditable so a
  broad `Disallow` added later cannot silently kill AI citations.
- **Every named group in `robots.txt` repeats `Disallow: /admin`, and that
  duplication is load bearing.** A crawler matching its own named group uses
  ONLY that group and ignores `User-agent: *` completely. The first version gave
  each AI crawler a bare `Allow: /`, which silently exempted all of them from
  the admin rule. `AdsBot-Google` is worse: it ignores `User-agent: *` by design,
  so it obeys nothing unless a group names it. Do not deduplicate this file.
- The post page shows a visible **Updated** date once a post is edited a day or
  more after publishing. `dateModified` was already in the JSON-LD, but freshness
  only counts as a signal if a reader can see it. The one day threshold exists
  because the `touch_updated_at` trigger fires on every save, so a same-day typo
  fix would otherwise label the post as updated.
- Still unwired, worth adding when the first such post ships: `HowTo` schema for
  how-to posts, `ItemList` schema for comparison posts.

---

## The contact form

`api/contact.ts` is a Vercel serverless function that sends through Resend. The
form posts to `/api/contact`.

**The key lives in `RESEND_API_KEY` on Vercel, with no `VITE_` prefix.** That
prefix is the whole point: every `VITE_` variable is compiled into the public
bundle, so a key with it would be readable by anyone viewing source. A build is
verified to contain neither the key nor the variable name.

Two optional vars, both with sane fallbacks:
- `CONTACT_TO_EMAIL`, defaults to `officialkraftzen@gmail.com`.
- `CONTACT_FROM_EMAIL`, defaults to `onboarding@resend.dev`. **Resend only sends
  from a domain you have verified**, so until kraftzen.in is verified in the
  Resend dashboard, the fallback is the only address that works, and it delivers
  to the account owner only. Verify the domain, then set this to something like
  `hello@kraftzen.in`.

Things that are load bearing:

- **The handler is exported as `export default { fetch: handler }`.** Not as
  `export default async function handler`. Vercel's Node runtime accepts three
  shapes: an object with a `fetch` method, per-method exports like
  `export function POST`, or the legacy `(req, res)` pair. A default-exported
  *function* is read as the legacy shape, so Vercel invoked it with Node's
  `IncomingMessage`, `await request.json()` threw because that object has no
  such method, and the returned `Response` was thrown away because the legacy
  shape expects `res.send()`.
  **The failure mode is why this took so long to spot:** the invocation errors,
  the form's `catch` opens the mail draft, and the visitor sees a mail client
  rather than an error. From the outside it looks like the form preferring
  mailto, not a broken endpoint. Found 2026-08-15.
- **`vercel.json` excludes `/api` from the SPA rewrite.** The rule is
  `/((?!api/).*)`. Without that exclusion the catch-all rewrite swallows the
  endpoint and a POST gets an HTML page back instead of JSON.
  **Do not explain that inside the file.** Vercel validates `vercel.json`
  against a strict schema, so the `"//"` comment key convention that works in
  most JSON configs fails the build outright with `rewrites[0] should NOT have
  additional property '//'`. Nothing is deployed when that happens. Comments
  about routing belong here, not in the config.
- **The mailto draft is still there as a fallback.** If the endpoint fails for
  any reason the mail app opens carrying the same content. An enquiry is the
  most valuable thing this site collects, so a failure must never end with
  someone retyping their message.
- **Validation is server side.** The form can be bypassed by posting to the URL
  directly, so the checks in `Contact.tsx` are a convenience and the ones in the
  function are the real ones.
- **There is a honeypot field** called `website`, positioned off screen rather
  than `display:none` because some bots skip hidden fields but follow the tab
  order. A filled honeypot returns 200, so a bot gets no signal it was caught.

Not built, and worth knowing: there is no rate limiting. Serverless functions are
stateless so an in-memory counter does nothing. If it gets abused, add Upstash
Redis or Vercel KV rather than trying to solve it in the function.

## AdSense

Publisher id `ca-pub-1631267597697170`, in `public/ads.txt`. Not a secret: the
id ships in the HTML of every site running ads, so an env var would only add a
moving part.

**The site was rejected for "Low value content" on 2026-08-20.** The dominant
cause is volume and age, not code: 9 posts, the oldest 12 days old, 41 total
views. No technical change fixes that. What code could fix was the second half
of the same policy, below.

**The script is global in `index.html`, and it must stay that way.** Google
verifies a site by finding that code, and their setup instructions say to put it
in the head of every page. It was briefly restricted to `/blog` routes on
inventory-value grounds. That was a mistake and was reverted the same day: a tag
being present is not the same as an ad rendering, where ads appear is an Auto
ads setting in the dashboard, and restricting the tag risks failing the
verification step that approval actually depends on.

Three things keep the account safe, and all three are easy to undo by accident:

- **`scripts/prerender.mjs` blocks the ad hosts.** The prerender opens every
  route in headless Chrome on every build, so without the request interception
  each deploy fired real ad requests from an automated client. That is the
  definition of invalid traffic and it risks the account, not just the numbers.
  Same class of bug as the view counter counting its own prerenders.
- **`robots.txt` must let `Mediapartners-Google` through.** Blocking it does not
  stop ads, it makes them untargeted. See the note above about named groups.
- **Ads must never render on `/admin`.** Ads shown to the signed-in owner are how
  accidental self clicks happen, and self clicks are an automated permanent ban.
  This is now enforced in code rather than by a dashboard checkbox:
  `src/components/site/AdSense.tsx` strips the tag and anything it injected while
  the admin route is mounted, and the rule lives in `src/lib/adsense.ts`.
- **`adsAllowed` blocks exactly one route, `/admin`.** Everything else, including
  the landing page and the legal pages, keeps the tag so verification cannot
  fail on a missing snippet. Pinned in `src/test/adsense.test.ts`.
- **The admin guard uses a MutationObserver, not a one-off removal.** Auto ads
  can inject after first paint, so clearing only on route entry leaves a window
  where an ad renders in a tool the owner is signed into.

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

- **The Kraftzen mark now carries its own dark ground, like AniVerseX.**
  Reversed on 2026-08-15 when the logo was replaced. The old mark was drawn on
  white, so the pipeline keyed white out with `unflatten()` and every render
  site put it on `bg-surface` or `bg-paper` to hide the halo that left.
  **All of that is now wrong and was removed:**
  - `build-assets.mjs` no longer calls `unflatten()`. The current artwork uses
    white *inside* it, in the KRAFTZEN wordmark, the eyes, the teeth and the
    tagline, and unflattening punched holes through every one of them. It trims
    on alpha instead, the same as `logo-bro-ai`.
  - No render site gives it a light plate, padding or a ring any more, and none
    crops it to a circle. It is `rounded-lg object-cover` everywhere, so its own
    ground is the shape. A white circle behind a dark square logo looked exactly
    as bad as it sounds.
  If the logo is ever replaced with transparent artwork again, both of those
  decisions flip back.
- **Use `logo-mark-128.png` in the UI, never `logo-mark.png`.** Nothing on the
  site renders the mark larger than 56 CSS px, and the 512px file is around
  400 KB against 31 KB for the small one. `Seo.tsx` keeps the 512px version,
  which is correct for JSON-LD and the OG card.
- **The mark is a full lockup, not an icon.** It contains the KRAFTZEN wordmark
  and a tagline, and at 32px in the nav neither is legible. The nav prints the
  word "Kraftzen" beside it anyway, so the name is not lost, but a cropped
  icon-only variant for sizes under 64px is the real fix if it ever matters.
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
3. ~~Contact form has no backend.~~ Done. See below.
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
