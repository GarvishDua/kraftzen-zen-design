

# Performance Optimization + Products Layout Revamp

## Problems to Fix
1. **Slow logo/icon loading** -- The hero logo animates in via framer-motion with `initial={{ opacity: 0, scale: 0.9 }}` causing perceived delay. The WebP is preloaded in HTML but the motion animation masks it.
2. **Products page too long** -- Bro AI tools displayed as full-width alternating sections with huge spacing, AniVerseX buried at the bottom. Too much scrolling.
3. **AniVerseX uses a stock photo** instead of an actual website screenshot.

## Plan

### 1. Smoother, faster hero logo animation
In `HeroSection.tsx`:
- Change logo `initial` from `{ opacity: 0, scale: 0.9 }` to `{ opacity: 0.8, scale: 0.95 }` with shorter duration (0.5s, no delay) so it appears almost instantly
- Use CSS `will-change: transform` on the logo for GPU acceleration
- Reduce the number of floating particles from 12 to 6 and floating icons from 7 to 4 to reduce animation overhead

### 2. Optimize Navbar logo
In `Navbar.tsx`:
- Add `decoding="async"` alongside existing eager loading for non-blocking decode

### 3. Revamp Products page layout -- compact card grid
In `Products.tsx`:
- **Replace the full-width alternating Bro AI tool sections** with a compact 2x2 card grid. Each tool gets a card with icon, name, tagline, short description, and features list. Much less scrolling.
- **Move AniVerseX up** to appear right after the Bro AI grid as a featured product card (side-by-side with details), not buried at the bottom
- **Use the actual AniVerseX website screenshot** (fetched screenshot) instead of the Unsplash stock image. Store a reference screenshot or use the user-uploaded screenshots (`image-2.png`, `image-3.png`) as the product visual
- **Keep the "Automated Blogging Service" CTA** section at the bottom but tighten spacing
- Overall: Hero -> Bro AI badge + 2x2 grid -> AniVerseX featured section -> Service CTA -> Footer

### 4. Use uploaded screenshots for AniVerseX
Copy `user-uploads://image-2.png` to `src/assets/aniversex-screenshot.png` and use it as the AniVerseX product image instead of the Unsplash placeholder.

### 5. Reduce motion animation load site-wide
- Add `loading="eager"` to the Bro AI SVG logo in `BroAISection.tsx`
- Ensure all Unsplash images on Products use `loading="lazy"` with smaller `w=400` sizes for cards

## Files to create/modify

| File | Action |
|------|--------|
| `src/assets/aniversex-screenshot.png` | Copy from user upload |
| `src/components/landing/HeroSection.tsx` | Faster logo animation, fewer particles/icons |
| `src/pages/Products.tsx` | Compact card grid for Bro AI, move AniVerseX up, use real screenshot |

