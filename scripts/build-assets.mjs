/**
 * Generates the derived image assets in public/ from their sources.
 * Run with: npm run assets
 *
 * Sources (originals, committed, never referenced directly by the app):
 *   src/assets/kraftzen-logo.png      the Kraftzen logo artwork
 *   public/Bro ai logo-Photoroom.png  the Bro AI mark, transparent, heavily padded
 *   public/anniverseXlogo.png         the AniVerseX mark, square, solid black ground
 *   public/GarvishDuaphoto.png        founder headshot, 1MB PNG
 *   public/Broaidashboard.png         Bro AI dashboard capture, 1897x850
 *   public/og-default.svg             the social card design
 *
 * Outputs (what the app actually references):
 *   public/logo-mark.png              512px, white keyed out
 *   public/logo-mark-128.png          small raster for the nav
 *   public/favicon.png                48px, flattened onto paper
 *   public/logo-bro-ai.png            256px square product icon
 *   public/logo-aniversex.png         256px square product icon
 *   public/founder-garvish.jpg        1000px wide, quality 82
 *   public/broai-dashboard.jpg        1600px wide product screenshot
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
 * Trim the artwork's transparent margin and square it.
 *
 * **`unflatten()` used to run here and must not come back.** The original mark
 * was drawn on a solid white ground, so keying exactly-white pixels to
 * transparent was how it got its alpha. The 2026 logo is already transparent
 * and uses white *inside* the artwork: the KRAFTZEN wordmark, the eyes, the
 * teeth, the laptop lid and the tagline. Unflattening it punches holes through
 * every one of those.
 *
 * The trim is on alpha now (threshold 1) rather than on a white margin, which
 * is the same treatment `logo-bro-ai` already gets a few lines below.
 */
const trimmed = await sharp(SRC_LOGO).trim({ threshold: 1 }).toBuffer();
const { width, height } = await sharp(trimmed).metadata();
const side = Math.max(width, height);

const squared = await sharp(trimmed)
  .resize(side, side, { fit: "contain", background: TRANSPARENT })
  .toBuffer();

for (const size of [512, 128]) {
  const name = size === 512 ? "logo-mark.png" : `logo-mark-${size}.png`;
  await sharp(squared)
    .resize(size, size, { fit: "contain", background: TRANSPARENT })
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

/**
 * Product screenshots. Wide UI captures compress far better as JPEG than PNG
 * and none of them need transparency.
 */
const screenshots = [
  { src: "public/Broaidashboard.png", out: "broai-dashboard.jpg", width: 1600 },
];

for (const shot of screenshots) {
  await sharp(shot.src)
    .flatten({ background: { r: 12, g: 12, b: 16 } })
    .resize(shot.width, null, { withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(`${OUT}/${shot.out}`);
  console.log(`wrote ${OUT}/${shot.out}`);
}

/**
 * Gen-Z Bro tile, cropped out of the dashboard capture.
 *
 * There is no standalone Gen-Z Bro screenshot yet, so we lift its card from the
 * dashboard. The crop is deliberately tight on the icon and labels rather than
 * the artwork behind them: the dashboard fades that art under a dark gradient,
 * so any crop of it comes out murky and unreadable at tile size. The label area
 * is crisp and is still real product UI.
 *
 * FRAGILE: these coordinates are tied to the current 1897x850 capture. If
 * Broaidashboard.png is ever re-shot at a different size or layout, this crop
 * will be wrong. The guard below skips loudly instead of writing a bad tile.
 * Delete this whole block once a real Gen-Z Bro capture exists.
 */
const GENZ_CROP = { left: 213, top: 610, width: 400, height: 240 };
const dash = await sharp("public/Broaidashboard.png").metadata();

if (dash.width === 1897 && dash.height === 850) {
  await sharp("public/Broaidashboard.png")
    .extract(GENZ_CROP)
    .resize(900, null, { withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(`${OUT}/broai-genz.jpg`);
  console.log(`wrote ${OUT}/broai-genz.jpg`);
} else {
  console.warn(
    `SKIPPED broai-genz.jpg: expected a 1897x850 dashboard, got ${dash.width}x${dash.height}. ` +
      `The Gen-Z Bro crop coordinates no longer apply. Take a real Gen-Z Bro capture instead.`
  );
}

// Social card. The SVG renderer collapses whitespace between tspans, so the
// source uses dx for spacing rather than a space character.
await sharp("public/og-default.svg", { density: 144 })
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/og-default.png`);
console.log(`wrote ${OUT}/og-default.png`);
