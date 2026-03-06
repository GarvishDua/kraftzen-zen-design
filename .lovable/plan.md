

# Meet the Founder Section + Image Loading Optimization

## 1. Add founder image asset
Copy `user-uploads://Garv.jpeg` to `src/assets/founder-garv.jpeg`. Import it as an ES module in components.

## 2. Create reusable FounderSection component
Create `src/components/landing/FounderSection.tsx` -- a "Meet the Founder" section with:
- Founder photo (the uploaded image) sliding in from the left with framer-motion
- Text content sliding in from the right: name "Garvish Dua", title "Founder & CEO", a short bio about his vision for Kraftzen
- Decorative gradient orbs and a subtle border glow around the photo
- Fully responsive (stacks vertically on mobile)

## 3. Add FounderSection to Index page
Insert `<FounderSection />` after `<TestimonialsSection />` and before `<Footer />` in `src/pages/Index.tsx`.

## 4. Add FounderSection to About page
Replace the fake team section in `src/pages/About.tsx` with the real founder section. Remove the fake team members (Arjun Mehta, Priya Sharma, etc.) and add the FounderSection instead, keeping the existing values section.

## 5. Image loading priority optimization
- **Navbar logo & Hero logo**: Add `loading="eager"` and `fetchPriority="high"` attributes so they load immediately instead of being deferred.
- **PageLoader logo**: Already eagerly loaded (no lazy attribute) -- keep as is.
- **All other images** (Unsplash photos, avatars, founder photo in below-fold sections): Keep `loading="lazy"` for deferred loading.
- **Preload the WebP logo** in `index.html` via `<link rel="preload" as="image" href="/src/assets/kraftzen-logo.webp">` so the browser fetches it before any JS executes.

## Files to create/modify

| File | Action |
|------|--------|
| `src/assets/founder-garv.jpeg` | Copy from upload |
| `src/components/landing/FounderSection.tsx` | Create -- founder section with slide-in animations |
| `src/pages/Index.tsx` | Add FounderSection before Footer |
| `src/pages/About.tsx` | Replace fake team with FounderSection |
| `src/components/landing/HeroSection.tsx` | Add eager loading + fetchPriority to logo |
| `src/components/landing/Navbar.tsx` | Add eager loading to navbar logo |
| `index.html` | Add preload link for logo |

