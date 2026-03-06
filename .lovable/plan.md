

# Kraftzen Website Enhancement Plan

## 1. Replace PNG logo with WebP across all files
Copy the uploaded `kznobg.webp` to `src/assets/kraftzen-logo.webp` and update every import of `kraftzen-logo.png` to use the new WebP file. This gives faster load times due to smaller file size. Files to update:
- `src/components/landing/Navbar.tsx`
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/Footer.tsx`
- `src/components/ui/page-loader.tsx`

## 2. Add Bro AI logo as a project asset
Copy `brofavi.svg` to `src/assets/bro-ai-logo.svg`. Use it in the BroAISection and Products page where Bro AI is referenced.

## 3. Fix Bro AI product context
The "Designer Bro", "Animator Bro", "Study Bro", "Command Deck" are tools within the **Bro AI platform**. Update:
- `BroAISection.tsx` -- title to "Meet Bro AI." with subtitle clarifying it's a platform, show the Bro AI logo
- `Products.tsx` -- restructure to present Bro AI as the product with individual tools as features within it, include Bro AI logo

## 4. Mobile & tablet responsiveness fixes
Audit and fix all components for small screens:
- **Navbar**: Already has mobile menu -- verify it works, increase tap targets
- **HeroSection**: Stack to single column on mobile, reduce heading size, hide some floating icons on small screens to reduce clutter
- **WhatWeDoSection**: Cards already stack via `md:grid-cols-3` -- ensure padding is adequate
- **BroAISection (FeatureSteps)**: Image should show above steps on mobile (already `order-1`), reduce image height on mobile
- **TestimonialsSection**: Stack to single column, ensure min-height works on mobile, fix card overflow
- **Footer**: Stack grid to single column on mobile
- **About.tsx**: Fix team grid for small screens, ensure images don't overflow
- **Products.tsx**: Fix alternating layout for mobile, ensure images scale
- **Contact.tsx**: Stack form and info vertically on mobile

## 5. UI beautification
- **Hero**: Add a subtle animated gradient border/glow around the logo, more vibrant gradient orbs
- **WhatWeDoSection**: Add colored icon backgrounds (each card gets a unique accent color tint), add a decorative divider/pattern
- **BroAISection**: Add gradient accent behind the image area, add Bro AI logo badge
- **Footer**: Add a subtle gradient top border
- **All pages**: Ensure consistent spacing and visual rhythm on all breakpoints
- **Products page**: Add gradient accents behind product cards, more visual flair

## Files to create/modify

| File | Action |
|------|--------|
| `src/assets/kraftzen-logo.webp` | Copy from upload |
| `src/assets/bro-ai-logo.svg` | Copy from upload |
| `src/components/landing/Navbar.tsx` | Update logo import to webp, mobile fixes |
| `src/components/landing/HeroSection.tsx` | Update logo to webp, mobile responsive, more visual flair |
| `src/components/landing/WhatWeDoSection.tsx` | Colored card accents, mobile spacing |
| `src/components/landing/BroAISection.tsx` | Add Bro AI logo, fix context, mobile responsive |
| `src/components/landing/TestimonialsSection.tsx` | Mobile responsive fixes |
| `src/components/landing/Footer.tsx` | Update logo to webp, mobile stack, gradient border |
| `src/components/ui/page-loader.tsx` | Update logo to webp |
| `src/components/ui/feature-steps.tsx` | Mobile responsive image height |
| `src/components/ui/animated-testimonials.tsx` | Mobile layout fixes |
| `src/pages/Products.tsx` | Restructure as Bro AI platform + tools, mobile fixes |
| `src/pages/About.tsx` | Mobile responsive fixes |
| `src/pages/Contact.tsx` | Mobile responsive fixes |

No new dependencies needed.

