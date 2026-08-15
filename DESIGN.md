# Design System — Kraftzen

Source of truth for every visual decision on kraftzen.in. Read this before touching
any UI. Do not deviate without explicit user approval.

Created 2026-08-07 by `/design-consultation`.

---

## Product Context

- **What this is:** Marketing site for Kraftzen, an AI studio that builds AI tools,
  automation and websites. It sells services and shows shipped products.
- **Who it's for:** Founders and small teams (2 to 50 people) who want a working thing
  built, not a strategy deck. Secondary: people evaluating Bro AI and AniVerseX.
- **Space:** AI product studios and automation agencies. Category converges on dark
  gradients, geometric sans, three-column icon grids, and vague capability language.
- **Project type:** Marketing site. Seven routes, no app surface.

## The Memorable Thing

**A studio that actually ships.**

Every design decision serves this. Proof over promises: live products, real
screenshots, named outcomes, plain language. If an element does not make the work
more believable, it does not belong on the page.

## Aesthetic Direction

- **Direction:** Editorial, with utilitarian mono accents.
- **Decoration level:** Intentional. Hairline rules, faint paper grain, generous
  margins. Nothing decorative that is not structural.
- **Mood:** Confident and plain. Reads like a studio with taste that also writes code.
  Quiet enough to trust, sharp enough to remember.
- **Banned outright:** gradients of any kind, purple/violet accents, three-column icon
  grids with icons in colored circles, centered-everything layouts, uniform bubble
  radius, glow effects, stock illustration, floating 3D blobs, glassmorphism.

---

## Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / hero | **Instrument Serif** 400 + 400 italic | Carries all the personality. Italic used for the accented word only. |
| Body / UI | **Instrument Sans** 400 / 500 / 600 | Designed against Instrument Serif, so headline and body share a skeleton. |
| Labels / numbers / tags | **JetBrains Mono** 400 / 500 | Eyebrows, section numbers, metadata, tabular figures. Gives engineering credibility the serif alone would not. |

**Loading:** Google Fonts, preconnected, `display=swap`, single stylesheet request.
Instrument Serif and Instrument Sans in one call, JetBrains Mono in the same call.

### Scale

All fluid. Values are the CSS custom properties defined in `src/index.css`.

| Token | Size | Line height | Tracking | Family |
|-------|------|-------------|----------|--------|
| `--fs-display` | `clamp(3.25rem, 7vw, 6.5rem)` | 0.95 | -0.02em | serif |
| `--fs-h1` | `clamp(2.5rem, 5.5vw, 4.5rem)` | 1.0 | -0.02em | serif |
| `--fs-h2` | `clamp(1.875rem, 3.6vw, 3.25rem)` | 1.05 | -0.015em | serif |
| `--fs-h3` | `clamp(1.25rem, 2vw, 1.75rem)` | 1.2 | -0.01em | sans 600 |
| `--fs-lead` | `clamp(1.0625rem, 1.5vw, 1.375rem)` | 1.55 | 0 | sans 400 |
| `--fs-body` | `1.0625rem` | 1.65 | 0 | sans 400 |
| `--fs-small` | `0.875rem` | 1.5 | 0 | sans 400 |
| `--fs-label` | `0.6875rem` | 1 | 0.16em | mono 500, uppercase |

Rules:
- One display element per viewport. Never two competing serif headlines side by side.
- Body copy max width 68ch. Lead copy max width 46ch.
- Never set the serif below 1.25rem. It is a display face only.
- Numbers in tables and stat blocks use JetBrains Mono with `font-variant-numeric: tabular-nums`.

---

## Color

**Approach:** restrained. One accent. Color is rare, so it means something.

| Token | Hex | HSL | Use |
|-------|-----|-----|-----|
| `paper` | `#FBF8F3` | `38 44% 97%` | page base, warm off-white |
| `surface` | `#FFFFFF` | `0 0% 100%` | cards, panels, raised blocks |
| `surface-sunken` | `#F4EFE7` | `36 33% 93%` | wells, code blocks, inactive tabs |
| `ink` | `#16130F` | `34 19% 7%` | headings, body, inverted section base |
| `ink-soft` | `#3B342C` | `33 14% 20%` | secondary headings on paper |
| `muted` | `#6E655B` | `31 10% 39%` | secondary text, captions |
| `faint` | `#9A9086` | `31 9% 56%` | disabled, placeholder, timestamps |
| `line` | `#E4DCD0` | `34 30% 85%` | hairlines, borders, dividers |
| `line-strong` | `#CFC3B2` | `35 24% 75%` | focused borders, active dividers |
| `accent` | `#E5502A` | `13 78% 53%` | primary CTA, active state, one word per headline |
| `accent-hover` | `#CC4322` | `13 71% 47%` | CTA hover |
| `accent-soft` | `#FBEBE4` | `19 71% 94%` | tag chips, hover wash, highlight rows |

**Semantic** (used only in form states and status dots, never decoratively):
success `#2F7D5B`, warning `#B7791F`, error `#C4341F`, info `#2C5F8A`.

**On the inverted footer:** `ink` becomes the background, `paper` becomes the text,
`muted` becomes `#9A9086`, `line` becomes `rgba(251,248,243,0.14)`. Accent is unchanged.

**Dark mode:** not shipped. The site is light by design. If added later, redesign the
surfaces rather than inverting, and drop accent saturation by 12%.

**Accent budget:** at most three accent elements visible in any single viewport. If a
fourth appears, remove one.

---

## Spacing

- **Base unit:** 4px.
- **Density:** spacious.
- **Scale:** `2xs 2` · `xs 4` · `sm 8` · `md 16` · `lg 24` · `xl 32` · `2xl 48` · `3xl 64` · `4xl 96` · `5xl 128` · `6xl 160`
- **Section rhythm:** 96px mobile, 128px tablet, 160px desktop between major sections.
- **Gutter:** 20px mobile, 32px tablet, 48px desktop.

## Layout

- **Approach:** creative-editorial on a disciplined grid.
- **Grid:** 4 col mobile, 8 col tablet, 12 col desktop.
- **Max content width:** 1240px. Prose blocks cap at 68ch inside that.
- **Alignment:** left-aligned by default. Centering is reserved for one moment per page
  at most, and only when the block is genuinely symmetric.
- **Border radius:** `sm 4` · `md 8` · `lg 14` · `xl 24` · `pill 999`.
  Cards are `lg`. Inputs and small controls are `md`. `pill` is reserved for the
  primary CTA button and tag chips. Never apply one radius uniformly.

---

## Motion

**Approach:** intentional, escalating to expressive only where motion explains
something the copy would otherwise have to say.

- **Easing:** one family.
  - enter / move: `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-out`)
  - exit: `cubic-bezier(0.4, 0, 0.2, 1)` (`--ease-in`)
  - scroll scrub: linear. Never ease a scrubbed timeline.
- **Duration:** micro 120ms · short 240ms · medium 420ms · long 700ms.
- **Reveal primitive:** 20px translateY + opacity 0 to 1, `medium`, 70ms stagger,
  fires once as the element clears the bottom edge (`margin: "0px 0px -10% 0px"`,
  `amount: 0.1`). Every section uses this same primitive.
  - The trigger only insets the **bottom** edge. An earlier version also inset the
    top by 12%, so anything already high in the viewport on load waited for a
    scroll that never came and the section read as missing.
  - 70ms stagger, not 40ms. At 40ms a row of cards arrived as one block and the
    sequence was invisible, which made the timing look like a stutter instead of
    a deliberate cascade.
- **Scroll-driven motion is allowed only when it explains the product.** Decorative
  parallax is not allowed. Approved uses: the process pipeline that draws itself, the
  pinned product stack, the logo marquee, the hero word reveal.
- **Hover:** transform no larger than 2px, color transitions at `short`.
- **Reduced motion:** `prefers-reduced-motion: reduce` disables all transforms,
  pinning, and scrubbing. Content becomes immediately visible with opacity only.
  Every scroll-driven section must have a legible static end state.

---

## Content Voice

The copy is part of the design. Rules are binding.

- No em dashes. Use a period, a comma, or restructure the sentence.
- Banned vocabulary: delve, crucial, robust, comprehensive, nuanced, multifaceted,
  furthermore, moreover, additionally, pivotal, landscape, tapestry, underscore,
  foster, showcase, intricate, vibrant, seamless, cutting-edge, leverage, empower,
  unlock, elevate, revolutionize, transform your business, take it to the next level,
  in today's fast-paced world, we are passionate about.
- Banned constructions: "Built for X." "Designed for Y." "It's not just X, it's Y."
  Rhetorical triples. Sentences that open with a participle.
- Say the concrete thing. "We built the blog engine that publishes 40 posts a month"
  beats "we deliver content solutions."
- Short sentences. Active voice. Second person for the reader, first person plural
  for Kraftzen.
- Numbers over adjectives wherever a real number exists.

---

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-07 | Light warm editorial over the existing dark 3D theme | The dark portfolio theme read as gimmicky and buried the services. Light warm scans faster, reads more credible for a services buyer, and helps SEO legibility. |
| 2026-08-07 | Instrument Serif + Instrument Sans + JetBrains Mono | Serif display in an all-sans category is the differentiator. The two Instrument faces are a designed pair. Mono labels supply the engineering signal the serif does not. |
| 2026-08-07 | Single vermilion accent `#E5502A`, no gradients | Category default is purple gradients. One warm accent used sparingly is recognizable and cheap to keep consistent across seven pages. |
| 2026-08-07 | Positioning locked to "a studio that actually ships" | Bro AI and AniVerseX are live, so proof is available on day one and beats any adjective. |
| 2026-08-07 | Scroll motion restricted to explanatory use | The previous site animated for its own sake. Tying motion to explanation is what separates motion graphics from decoration. |
| 2026-08-07 | Chat widget removed | Bolted-on visually and dependent on an external webhook that fails visibly when down. |
| 2026-08-07 | Hero became two columns with a product panel on the right | The single column hero read as empty and made the reader scroll before seeing any proof. The panel answers "what have you built" inside the first viewport. |
| 2026-08-07 | Logo added to nav, footer and hero panel | Wordmark alone had no visual anchor. The mark always sits on a white surface because keying the white ground out leaves a faint halo on anti aliased edges. |
| 2026-08-07 | Floating card composition rejected | Cards docked around a centre tile collided at real container widths and read as the same gimmick this redesign removed. Replaced with one bordered panel. |
| 2026-08-07 | Work page became Products, cut from four items to two | Only Bro AI and AniVerseX are products. The other two entries were services already described on the services page, so listing them twice padded the site. |
| 2026-08-07 | Process pipeline restricted to Home, pin shortened to 250vh | It appeared on Home and Services, which was the most visible repetition. 320vh made the pinned section outstay its four steps. |
| 2026-08-07 | Official Bro AI and AniVerseX marks adopted as product icons | Product cards were carrying the whole identity load through screenshots that are inconsistent. The marks give each product a stable visual anchor that survives a screenshot swap. |
| 2026-08-07 | AniVerseX mark keeps its own black ground | Its neon artwork is designed against black. Keying it out or plating it light would break the glow. `Product.logoOnDark` exists to carry this exception rather than hardcoding it per placement. |
| 2026-08-07 | Home closes on a founder section | The last thing before the CTA is now a person and a name, not another claim. Proof of a real studio with a real person behind it is the point of the whole positioning. |
| 2026-08-08 | Blog added, article body uses the same tokens as the rest of the site | Article elements are mapped one by one in `PostBody.tsx` rather than handed to a prose plugin, so headings, tables and code inherit the real type scale instead of a generic default. A blog that looks like a different product undoes the studio positioning. |
| 2026-08-08 | Comparison tables scroll inside their own container | Wide tables are worth ranking for, but a table that makes the whole page scroll sideways breaks the reading experience on a phone. |
| 2026-08-08 | Unordered list markers are hairline dashes, not bullets | A filled bullet fights the editorial serif. A rule matches the dividers used everywhere else on the site. |
| 2026-08-08 | Admin sits outside the marketing Layout | No nav, no footer, no scroll motion. It is a tool, not a page, and the reveal animations actively get in the way when you are editing. |
| 2026-08-08 | Post covers are contained on a paper ground, not cropped | Covers are wide infographics with type inside them. `object-cover` in a tall card sliced the heading off, so the thumbnail showed a fragment of a diagram and half a face. Letterboxing on paper reads as a mount. |
| 2026-08-08 | Blog featured post moved beside the h1, and shrank | It was a full width two column band under the header, so the first screen carried a heading and nothing else while the article pushed the archive below the fold. Beside the h1 it costs no extra vertical space. |
| 2026-08-08 | Blog paginates at ten | The grid is the only place on the site that grows without bound. Ten keeps it to four rows on desktop and keeps the reveal animation cheap. |
| 2026-08-08 | Reveal fires earlier and staggers slower | 40ms across a row arrived as one block, which read as a stutter rather than a cascade. The old trigger also inset the top edge, holding back anything already on screen at load. |
| 2026-08-08 | Page visuals are drawn in HTML and SVG, never stock photography | Three stock images were proposed and rejected on evidence: one URL was a 403 gallery page, one was a Depositphotos file licensed by a third party and showing eight people for a one-person studio, and one was a teal photo sharing no colour with the palette. Drawn visuals cost no request, read the brand tokens so they cannot drift, stay sharp at any size, need no licence, and can say something true. |
| 2026-08-08 | Diagram text is HTML, not SVG `<text>` | Text inside an SVG cannot wrap and scales with the viewBox, so "Automated content systems" overflowed its box and every label shrank in a narrow column. Only the connector rails are still SVG, because a line that draws itself is the one thing CSS does worse. |
| 2026-08-08 | `PageHeader` gained an optional `aside` | Services, About and Contact had an empty right column beside the h1. Passing `aside` switches the header to two columns; omitting it leaves the header byte-identical, so pages with nothing worth showing are not padded with decoration. |
| 2026-08-08 | Native `<select>` replaced with Radix Select on public pages | A native select draws its option list in the OS, so no CSS reaches it. The result was square corners, a system blue highlight and the OS font sitting inside a rounded warm-paper page. Admin keeps its native selects; it is a tool, not a page. |
| 2026-08-08 | Route changes reset scroll and fade at 240ms | React Router does not reset scroll, so navigating from mid-page landed the reader mid-page on the next one, which reads as a broken page. The fade is opacity only and short, because every section already animates on scroll and a larger transition competes with them. |
| 2026-08-08 | Blog imagery is vibrant, the site stays restrained | Confirmed by Garvish. A page someone already chose to visit can afford quiet. A blog cover competes in a social feed and a search result, where restrained reads as invisible. Blog covers and diagrams use a saturated pop palette anchored on the same vermilion; everything else on the site is unchanged. Spec lives in `BLOGWRITER.md`, not here. Do not reconcile the two by making the blog quiet. |
