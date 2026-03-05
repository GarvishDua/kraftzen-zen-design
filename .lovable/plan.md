

# Kraftzen Website Enhancement Plan

## 1. New Pages

Create four new pages with proper content:

- **`src/pages/About.tsx`** -- Company story, mission, team section, values
- **`src/pages/Products.tsx`** -- Bro AI ecosystem overview, product cards for each Bro tool
- **`src/pages/Contact.tsx`** -- Contact form (name, email, subject, message), office info, map placeholder
- **`src/pages/PrivacyPolicy.tsx`** -- Standard privacy policy content
- **`src/pages/TermsOfService.tsx`** -- Standard terms of service content

Each page will include the Navbar and Footer for consistent layout.

## 2. Navbar Update

Update `src/components/landing/Navbar.tsx`:
- Replace hash-based navLinks with React Router `Link` navigation
- New links: **Home** (`/`), **Our Products** (`/products`), **About Us** (`/about`), **Contact Us** (`/contact`)
- Keep "Enter Zen Mode" CTA button
- Add smooth scroll behavior for on-page sections

## 3. Hero Section Background Enhancement

Update `src/components/landing/HeroSection.tsx`:
- Add more gradient orbs with varied colors (green, sand, soft blue tones)
- Add animated mesh/grid pattern overlay
- Add particle-like floating dots with framer-motion
- More floating icons (Sparkles, Zap, Star) alongside existing Leaf icons
- Add a subtle radial gradient behind the content area

## 4. Lazy Loading with Animated Loading Effect

Update `src/App.tsx`:
- Use `React.lazy()` for all page imports
- Wrap routes in `<Suspense>` with a custom loading component
- Create `src/components/ui/page-loader.tsx` -- a full-screen loader with the Kraftzen logo pulsing/spinning and a progress bar animation using framer-motion

## 5. Footer Update

Update `src/components/landing/Footer.tsx`:
- Update quick links to point to the new pages (Privacy Policy -> `/privacy`, Terms -> `/terms`, About -> `/about`, Contact -> `/contact`)
- Use React Router `Link` instead of `<a href="#">`

## 6. SEO Updates

- Update `public/sitemap.xml` with new page URLs
- Update `public/llms.txt` with new page descriptions

## Files to create/modify

| File | Action |
|------|--------|
| `src/pages/About.tsx` | Create |
| `src/pages/Products.tsx` | Create |
| `src/pages/Contact.tsx` | Create |
| `src/pages/PrivacyPolicy.tsx` | Create |
| `src/pages/TermsOfService.tsx` | Create |
| `src/components/ui/page-loader.tsx` | Create |
| `src/components/landing/Navbar.tsx` | Rewrite (Router links) |
| `src/components/landing/HeroSection.tsx` | Enhance background |
| `src/components/landing/Footer.tsx` | Update links |
| `src/App.tsx` | Add lazy routes + Suspense |
| `public/sitemap.xml` | Add new pages |
| `public/llms.txt` | Add new page descriptions |

No new dependencies needed.

