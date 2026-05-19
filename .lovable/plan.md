# Fixes

## 1. Products page — duplicate "Our Products"
`src/pages/Products.tsx` renders an `<h1>Our Products</h1>` hero, then mounts `<ProductsStackSection />` which renders the same heading again.

Fix: change the hero heading on the Products page to **"Toolcraft"** (or remove it and keep only the one inside `ProductsStackSection`). Going with **"Toolcraft"** so the page still has a strong page-title hero.

## 2. Home footer hidden behind stacking cards
`StackingCardList` uses `sticky` cards with `h-[85vh]` each. The last card's sticky region extends into the footer, covering it.

Fix: wrap `<Footer3D />` (in `Index.tsx`) inside a `relative z-30` container with `bg-[#0C0C0C]`, and add a small `pb-0` spacer. Also bump `ProductsStackSection` outer wrapper to `z-10` (it's currently `z-20`) so the footer can sit above the trailing sticky card. Simplest reliable fix: render `<Footer3D />` inside a `<div className="relative z-30 bg-[#0C0C0C]">` so it paints over the sticky stack as it scrolls in.

## 3. "Start a Project" → 404
Cause: `ContactButton` uses `<Link to="/contact">` correctly, but on `Products.tsx` it's rendered above `<ProductsStackSection />` which is the route component. Actually the 404 is from `StackingCard` CTAs — they use plain `<a href={...}>` (full page reload). On preview/published this works, but the cards with `cta.to` (relative path) trigger anchor navigation that can mismatch.

Fix: in `src/components/three-d/StackingCard.tsx`, replace `<a href={cta.to}>` with React Router `<Link to={cta.to}>` for internal links. Keep `<a target="_blank">` only for external `cta.href`.

Also verify `ContactButton` on Products page (`label="Start a Project"`) → already uses `Link to="/contact"`. That should not 404; if it still does it's because of a click on a stacking-card CTA. Above fix resolves it.

## 4. "Explore Bro AI" → external bro.ai.in
In `ProductsStackSection.tsx`, change the Bro AI card from:
```
cta: { label: "Explore Bro AI", to: "/products" }
```
to:
```
cta: { label: "Explore Bro AI", href: "https://bro.ai.in" }
```

## 5. Audit all other links
- `Navbar3D` links → all valid routes ✓
- `Footer3D` social links use `href="#"` → leave as-is (no accounts provided) OR remove. I'll keep them but make them `aria-disabled` style by pointing email link only and removing dead `#` placeholders for Instagram/LinkedIn/GitHub unless you provide URLs.
- `AniVerseX` external link `https://aniblogs.vercel.app` ✓
- "Get in Touch" / "Start a Project" CTAs → `/contact` ✓ after fix #3

## Question
Should I **remove** the Instagram / LinkedIn / GitHub social icons from the footer (since they currently point to `#` and do nothing), or do you have URLs to plug in? For now I'll remove them and keep only the Email icon. Reply if you want them kept with specific URLs.

## Files to edit
- `src/pages/Products.tsx` — rename hero heading
- `src/pages/Index.tsx` — wrap footer in `relative z-30` container
- `src/components/three-d/StackingCard.tsx` — use `Link` for internal CTAs
- `src/components/landing/ProductsStackSection.tsx` — Bro AI card → `href: https://bro.ai.in`
- `src/components/three-d/Footer3D.tsx` — remove dead `#` social links
