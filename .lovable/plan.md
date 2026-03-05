

# Kraftzen Landing Page Enhancement Plan

## Three workstreams

### 1. Bro AI Section -- FeatureSteps component
Replace the current `BroAISection.tsx` with an auto-rotating stepped feature showcase. Adapt the provided `FeatureSteps` component (remove Next.js `Image`, use standard `<img>`) and integrate it directly into the Bro AI section.

- Create `src/components/ui/feature-steps.tsx` -- the adapted FeatureSteps component (no `next/image`, plain `<img>` with Unsplash images for each Bro: Designer Bro, Animator Bro, Study Bro, Command Deck).
- Rewrite `src/components/landing/BroAISection.tsx` to use `<FeatureSteps>` with the four Bro features, autoplay interval ~4s, wrapped in the existing section styling (gradient orbs, section id, heading).

### 2. Testimonials Section -- AnimatedTestimonials component
Replace the current `TestimonialsSection.tsx` with the animated testimonials component.

- Create `src/components/ui/animated-testimonials.tsx` -- the adapted component (remove `"use client"` directive, keep framer-motion scroll animations, avatar, star ratings, auto-rotate, dot navigation, decorative gradients). Style the dark navy background via the parent section wrapper.
- Rewrite `src/components/landing/TestimonialsSection.tsx` to render `<AnimatedTestimonials>` with the existing four testimonials (add ratings, avatar URLs from randomuser.me), plus a trusted companies list. The section keeps the navy background and glow accents.

### 3. SEO and AI-discoverability
All within the constraints of a Vite SPA (no SSR):

- **`index.html`**: Update `<title>` to "Kraftzen | AI Tools & Digital Automation Platform", add keyword-rich `<meta description>`, OpenGraph/Twitter tags with Kraftzen branding, canonical URL, and a `<script type="application/ld+json">` block with schema.org Organization + SoftwareApplication structured data.
- **`public/robots.txt`**: Already exists; keep as-is (all allowed).
- **`public/sitemap.xml`**: Create a static XML sitemap with the single `/` page entry.
- **`public/llms.txt`**: Create an LLM-discoverability file describing Kraftzen, its products (Bro AI ecosystem), and page structure.
- **Heading hierarchy**: Audit existing sections to ensure single H1 in Hero, H2 per section, H3 for sub-items. Minor fixes where needed.
- **Image alt text**: Ensure all `<img>` tags have descriptive alt text.

### Files to create/modify

| File | Action |
|------|--------|
| `src/components/ui/feature-steps.tsx` | Create |
| `src/components/ui/animated-testimonials.tsx` | Create |
| `src/components/landing/BroAISection.tsx` | Rewrite |
| `src/components/landing/TestimonialsSection.tsx` | Rewrite |
| `index.html` | Update meta tags, add JSON-LD |
| `public/sitemap.xml` | Create |
| `public/llms.txt` | Create |

No new npm dependencies needed -- framer-motion, lucide-react, radix avatar/separator are already installed.

