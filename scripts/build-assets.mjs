/**
 * Generates the derived image assets in public/ from their sources.
 * Run with: npm run assets
 *
 * Sources (originals, committed, never referenced directly by the app):
 *   src/assets/kraftzen-logo.png      the Kraftzen logo artwork
 *   public/Bro ai logo-Photoroom.png  the Bro AI mark, transparent, heavily padded
 *   public/anniverseXlogo.png         the AniVerseX mark, square, solid black ground
 *   public/GarvishDuaphoto.png        founder headshot, 1MB PNG
 *   public/og-default.svg             the social card design
 *
 * Outputs (what the app actually references):
 *   public/logo-mark.png              512px, white keyed out
 *   public/logo-mark-128.png          small raster for the nav
 *   public/favicon.png                48px, flattened onto paper
 *   public/logo-bro-ai.png            256px square product icon
 *   public/logo-aniversex.png         256px square product icon
 *   public/founder-garvish.jpg        1000px wide, quality 82
 *   public/og-default.png             1200x630 social card
 */

import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC_LOGO = "src/assets/kraftzen-logo.png";
const OUT = "public";

const PAPER = { r: 251, g: 248, b: 243 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

await mkdir(OUT, { recursive: true });

/**
 * Trim the artwork's white margin, square it, then key the white ground out.
 *
 * `unflatten` only clears pixels that are exactly white, so anti aliased edges
 * keep a faint light halo. That is fine here because the mark is always placed
 * on a white surface in the UI, never directly on paper.
 */
const trimmed = await sharp(SRC_LOGO).trim({ threshold: 10 }).toBuffer();
const { width, height } = await sharp(trimmed).metadata();
const side = Math.max(width, height);

const squared = await sharp(trimmed)
  .resize(side, side, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  })
  .toBuffer();

for (const size of [512, 128]) {
  const name = size === 512 ? "logo-mark.png" : `logo-mark-${size}.png`;
  await sharp(squared)
    .unflatten()
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${name}`);
  console.log(`wrote ${OUT}/${name}`);
}

// Favicon sits on paper so it reads on a light browser tab strip.
await sharp(squared)
  .resize(48, 48, { fit: "contain", background: PAPER })
  .flatten({ background: PAPER })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/favicon.png`);
console.log(`wrote ${OUT}/favicon.png`);

/**
 * Product marks, squared to 256px so they drop into any avatar slot.
 *
 * Bro AI ships transparent with a lot of empty canvas around a circular badge,
 * so it gets trimmed on its alpha channel first. AniVerseX is already square
 * with a solid black ground, which reads fine as an app icon, so it only needs
 * a resize.
 */
const productMarks = [
  { src: "public/Bro ai logo-Photoroom.png", out: "logo-bro-ai.png", trim: true },
  { src: "public/anniverseXlogo.png", out: "logo-aniversex.png", trim: false },
];

for (const mark of productMarks) {
  let img = sharp(mark.src);

  if (mark.trim) {
    const trimmedBuf = await img.trim({ threshold: 1 }).toBuffer();
    const meta = await sharp(trimmedBuf).metadata();
    const side = Math.max(meta.width, meta.height);
    img = sharp(trimmedBuf).resize(side, side, {
      fit: "contain",
      background: TRANSPARENT,
    });
  }

  await img
    .resize(256, 256, { fit: "contain", background: TRANSPARENT })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${mark.out}`);
  console.log(`wrote ${OUT}/${mark.out}`);
}

// Founder headshot. The original is a 1MB PNG, which is a poor LCP candidate
// for a photograph. JPEG at 1000px wide is a fraction of the weight.
await sharp("public/GarvishDuaphoto.png")
  .resize(1000, null, { withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(`${OUT}/founder-garvish.jpg`);
console.log(`wrote ${OUT}/founder-garvish.jpg`);

// Social card. The SVG renderer collapses whitespace between tspans, so the
// source uses dx for spacing rather than a space character.
await sharp("public/og-default.svg", { density: 144 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/og-default.png`);
console.log(`wrote ${OUT}/og-default.png`);
