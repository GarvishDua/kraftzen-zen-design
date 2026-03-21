

# Add AniVerseX Product + Automated Blogging Service Section

## Overview
Add AniVerseX as a second Kraftzen product alongside Bro AI on the Products page, and add an "Automated Blogging Service" CTA section offering custom blog websites (React or WordPress).

## 1. Update Products page hero
Change the hero from being Bro AI-specific to a general "Our Products" page that showcases all Kraftzen products. Keep the Bro AI section as one product block, then add AniVerseX as a second product block below.

## 2. Add AniVerseX product section
After the Bro AI tools section, add an AniVerseX product block:
- **Name**: AniVerseX
- **Description**: AI-automated blog posting platform that publishes high-quality SEO-optimized blogs automatically on a regular schedule
- **Link**: aniblogs.vercel.app (external link button "Visit AniVerseX")
- **Features**: AI-generated SEO content, automated publishing schedule, category/tag management, view tracking, newsletter integration
- **Visual**: Use the uploaded screenshots as reference for styling -- dark themed card with a gradient accent (teal/mint green matching the AniVerseX brand color `#4ade80`)
- **Image**: Screenshot-style mockup using an Unsplash blog/writing image

## 3. Add "Automated Blogging Service" CTA section
After the products, add a service offering section:
- Title: "Want Your Own Automated Blog?"
- Description: Kraftzen builds custom AI-automated blogging websites for businesses -- available in both React and WordPress
- Features listed: Custom design, SEO optimization, auto-publishing, analytics dashboard
- CTA button linking to `/contact` -- "Get in Touch"
- Styled as a prominent gradient card/banner

## 4. Update homepage WhatWeDoSection or BroAISection context
No changes needed to homepage -- AniVerseX is a Products page addition only.

## Files to modify

| File | Action |
|------|--------|
| `src/pages/Products.tsx` | Restructure hero, add AniVerseX section, add blogging service CTA |

