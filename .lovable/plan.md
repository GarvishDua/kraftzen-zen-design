
# Kraftzen 3D-Portfolio Redesign — Full Site Rebuild

Rebuild the entire Kraftzen site in the dark, Kanit-driven "3D Creator" aesthetic from the reference, mapping all content to Kraftzen (Bro AI ecosystem, AniVerseX, Automated Blogging Service, etc.). Existing pages (Home, Products, About, Contact, Privacy, Terms) are kept route-wise but visually rebuilt.

## Global theme

- Background `#0C0C0C` on `html`, `body`, `#root`; text light `#D7E2EA`.
- Load Kanit (300–900) from Google Fonts in `index.html`; set as default body font in `tailwind.config.ts` and `index.css`.
- Add semantic tokens (HSL): `--background 0 0% 5%`, `--foreground 210 18% 88%`, keep Kraftzen bamboo green as a secondary accent for subtle CTAs; primary CTA uses the magenta→orange gradient from the reference.
- Utilities: `.hero-heading` (silver gradient text), `.btn-contact` (gradient pill), `.btn-ghost-pill` (outline pill).
- `overflow-x: clip` on main wrapper. Page title updated to "Kraftzen — AI Toolcraft & Digital Zen".

## Reusable components (`src/components/three-d/`)

- `FadeIn.tsx` — Framer Motion `whileInView` wrapper (delay, y/x, duration, easing `[0.25,0.1,0.25,1]`).
- `Magnet.tsx` — cursor-following magnetic hover (padding, strength, in/out transitions).
- `AnimatedText.tsx` — per-character scroll-driven opacity using `useScroll` + offset `['start 0.8','end 0.2']`.
- `ContactButton.tsx` — gradient pill linking to `/contact` ("Get in Touch").
- `GhostPillButton.tsx` — outline pill (used for "Visit Site" / "Learn More").
- `Navbar3D.tsx` — top nav: Home / Products / About / Contact, uppercase, tracking-wider, mobile sheet menu.
- `Footer3D.tsx` — minimal dark footer with brand, nav, social, legal links.

## Page: Home (`src/pages/Index.tsx`)

Sections, in order:

1. **HeroSection** — full viewport, Navbar3D, massive `.hero-heading` "KRAFTING TOOLS. DELIVERING ZEN.", bottom-left tagline ("advanced ai toolcraft engineered to eliminate workflow chaos"), bottom-right ContactButton. Centered `Magnet`-wrapped 3D hero visual (newly generated — abstract zen-tech orb in Kraftzen green/sand palette on dark, generated to `src/assets/hero-3d.png`).
2. **MarqueeSection** — two scroll-driven rows of Bro AI tool screenshots (Designer Bro, Animator Bro, Study Bro, Command Deck, AniVerseX). Capture via `browser--screenshot` of existing product visuals OR generate stylized 3D mockup tiles (8–10 total) saved under `src/assets/marquee/`. Row 1 scrolls right, row 2 scrolls left, both driven by `window.scrollY` offset × 0.3, tripled for seamless loop, `willChange: transform`, passive listener.
3. **AboutSection** — "ABOUT KRAFTZEN" hero-heading + scroll-revealed AnimatedText paragraph about the studio, with 4 corner-floating 3D decorative assets (generated: leaf, stone, abstract orb, geometric cluster — matching Digital Zen). ContactButton below.
4. **ServicesSection** — white `#FFFFFF` panel with rounded top, heading "WHAT WE CRAFT", 5 numbered items: 01 AI Tooling, 02 Workflow Automation, 03 Brand & Web Design, 04 Content Systems, 05 Custom Integrations. Same numbered horizontal layout, 1px dividers, staggered FadeIn.
5. **ProductsSection** (stacking cards) — dark, rounded-top, pulled up `-mt-14`. Heading "OUR PRODUCTS". Sticky-stacking cards using `useScroll` + `useTransform` with `targetScale = 1 - (total-1-i)*0.03` and `top: i*28px`. Cards (expandable list — current 4):
   - 01 **Bro AI** — Platform — 3 screenshots (Designer/Animator/Study), CTA "Explore Bro AI" → `/products#bro-ai`.
   - 02 **AniVerseX** — Product — real site screenshot (`src/assets/aniversex-screenshot.png`) + 2 detail crops, CTA "Visit AniVerseX".
   - 03 **Automated Blogging Service** — Service — generated 3D mockups of blog dashboards, CTA "Get in Touch" → `/contact`.
   - 04 **Custom AI Solutions** — Service — abstract 3D tiles, CTA "Start a Project" → `/contact`.
   Card chrome: `rounded-[60px]`, `border-2 border-[#D7E2EA]`, dark bg, two-column image grid (40/60).
6. **Footer3D**.

## Page: Products (`src/pages/Products.tsx`)

- Dark theme. Hero with hero-heading "OUR PRODUCTS" + intro paragraph + ContactButton.
- Reuse stacking-card pattern at larger scale: one card per product with deeper detail (features list, tech badges, multiple images). Keep existing Bro AI sub-tool grid (Designer/Animator/Study/Command Deck) as a follow-up section styled in the new aesthetic (numbered list + ghost pill links).
- AniVerseX section keeps real screenshot.
- Automated Blogging Service CTA card preserved.

## Page: About (`src/pages/About.tsx`)

- Dark theme. Hero-heading "ABOUT US". Long-form AnimatedText story. Reuse ServicesSection-style numbered list for company values / capabilities. Founder section restyled as a single magnetic portrait + bio block.

## Page: Contact (`src/pages/Contact.tsx`)

- Dark theme. Hero-heading "LET'S BUILD". Two-column: left = AnimatedText pitch + contact info + socials; right = form with floating labels, dark inputs `bg-white/[0.04] border-[#D7E2EA]/20`, gradient submit button. Keep existing form logic/validation.

## Pages: Privacy & Terms

- Apply dark theme + Kanit + new Navbar3D/Footer3D. Keep content as-is in a readable max-w-3xl prose container.

## Assets to generate

- `src/assets/hero-3d.png` — abstract zen-tech 3D centerpiece (generated via `imagegen`, premium, transparent bg).
- `src/assets/decor/{moon,stone,orb,cluster}.png` — 4 corner decorations for AboutSection (transparent PNGs).
- `src/assets/marquee/*.png` — 8–10 product/tool tiles (mix of real Bro AI screenshots captured from current site + AI-generated stylized mockups).
- Reuse `src/assets/aniversex-screenshot.png` and `src/assets/kraftzen-logo.webp`.

## Performance

- All marquee images `loading="lazy"`, fixed dimensions, `willChange: transform` only on moving rows.
- Hero image `loading="eager"`, `fetchPriority="high"`, preloaded in `index.html`.
- Keep existing route-level `React.lazy` + Suspense.
- Replace heavy framer-motion orb stack from current hero — new hero is lean (one Magnet image + a few FadeIns).

## Files

| File | Action |
|------|--------|
| `index.html` | Kanit preload, title/meta update, preload hero-3d.png |
| `tailwind.config.ts` | Kanit font, dark tokens, gradient utilities |
| `src/index.css` | Reset, `.hero-heading`, base bg `#0C0C0C`, Kanit |
| `src/components/three-d/Navbar3D.tsx` | new |
| `src/components/three-d/Footer3D.tsx` | new |
| `src/components/three-d/FadeIn.tsx` | new |
| `src/components/three-d/Magnet.tsx` | new |
| `src/components/three-d/AnimatedText.tsx` | new |
| `src/components/three-d/ContactButton.tsx` | new |
| `src/components/three-d/GhostPillButton.tsx` | new |
| `src/components/three-d/StackingCard.tsx` | new (shared for Home + Products) |
| `src/components/landing/HeroSection.tsx` | rewrite |
| `src/components/landing/MarqueeSection.tsx` | new |
| `src/components/landing/AboutBlockSection.tsx` | new |
| `src/components/landing/ServicesSection.tsx` | new |
| `src/components/landing/ProductsStackSection.tsx` | new |
| `src/pages/Index.tsx` | rewire to new sections |
| `src/pages/Products.tsx` | rewrite in new style |
| `src/pages/About.tsx` | rewrite in new style |
| `src/pages/Contact.tsx` | restyle (keep form logic) |
| `src/pages/PrivacyPolicy.tsx`, `TermsOfService.tsx`, `NotFound.tsx` | swap navbar/footer + dark theme |
| `src/assets/hero-3d.png`, `src/assets/decor/*.png`, `src/assets/marquee/*.png` | generated |
| Old `WhatWeDoSection.tsx`, `BroAISection.tsx`, `TestimonialsSection.tsx`, `FounderSection.tsx`, `Footer.tsx`, `Navbar.tsx` | deleted (content absorbed into new sections) |

## Technical notes

- Stacking cards use `framer-motion` `useScroll({ target: containerRef, offset: ["start end","end end"] })` per card with `useTransform` for scale.
- Marquee uses a single scroll listener at the section level, no per-tile observers.
- All colors via tokens or the explicit `#0C0C0C` / `#D7E2EA` from the reference; gradient hex strings live in a single util.
- Mobile: nav collapses to hamburger sheet; stacking cards reduce to simple vertical stack on `< sm` (disable scale transform) to avoid jank.
