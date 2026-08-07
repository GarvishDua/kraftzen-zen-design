# Kraftzen site — working context

Marketing site for Kraftzen. Vite + React 18 + TypeScript + Tailwind + shadcn/ui +
react-router + Framer Motion. Seven routes, no backend.

Redesigned 2026-08-07. The previous version was a dark 3D portfolio theme and was
replaced wholesale.

---

## Read first

**`DESIGN.md` is the source of truth for every visual decision.** Read it before
touching colour, type, spacing, radius or motion. Do not deviate without explicit
user approval. In review, flag any code that does not match it.

**`src/lib/site.ts` is the source of truth for every word on the site.** Copy does
not live in components. If you are writing user-facing text, write it there.

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
npx tsc --noEmit -p tsconfig.app.json   # typecheck
```

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
src/
  lib/site.ts              ALL copy and content data. Single source of truth.
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
| `/privacy`, `/terms` | via `LegalPage` | |
| `/work` | redirect → `/products` | Shipped briefly mid-redesign. Keep the redirect. |

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

**Known limitation, and the most valuable thing to fix next.** This is a client
rendered SPA. `Seo.tsx` sets head tags in `useEffect`, which Googlebot executes and
picks up, but social scrapers (WhatsApp, Slack, X, LinkedIn) generally do not run
JS. `index.html` therefore carries a complete standalone set of OG and Twitter tags,
so every shared link falls back to the site-level card rather than showing nothing.

**Per-route link previews need prerendering.** Add `vite-plugin-prerender` or move
to a framework with SSG. Until then, do not spend more effort on runtime head tags.

What is already wired:

- Per route `<Seo>` with title, description, canonical, OG, Twitter, robots.
- JSON-LD per route: `ProfessionalService` (org), `WebSite`, `ItemList` of
  `Service` on /services, `FAQPage` on /services, `CollectionPage` on /work,
  `AboutPage`, `ContactPage`, `BreadcrumbList` on every inner page.
- `public/sitemap.xml` — **update `lastmod` when a page's content changes.**
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

---

## Facts about the business

Verified, safe to use:

- AI studio based in Delhi, India. Founder: Garv.
- `officialkraftzen@gmail.com`, `+91 9310367672`.
- **Exactly two products, both live**: Bro AI (`https://bro.ai.in`) and AniVerseX
  (`https://aniblogs.vercel.app`). Do not invent a third. Client offerings are
  services, and they live in `SERVICES`, never in `PRODUCTS`.
- Bro AI contains Designer Bro, Animator Bro, Portfolio Bro, Emailer Bro.
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
| `public/og-default.svg` | `og-default.png` | 1200x630 social card. |

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
  bolted on and failed visibly when the webhook was down.
- The dark `#0C0C0C` theme, Kanit, the gradient hero text, the 3D sphere, the
  floating decor images, the magnet cursor effect.
- `components/three-d/*` and `components/landing/*`.
- The `/products` page, replaced by `/work` plus a redirect.

---

## Open items

1. **Real product screenshots. Highest value item on this list.** The product
   logos are now official and look right. The *screenshots* are still the weak
   part: `designerbro.png` is a photo of a watch, so on `/products` the flagship
   Bro AI image reads as stock photography rather than software. Wide, consistent
   1600px captures of each actual screen would lift `/products` more than any code
   change. This is also why the hero panel carries marks but no screenshots.
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
