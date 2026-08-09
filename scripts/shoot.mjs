/**
 * Dev-only visual check. Drives the locally installed Chrome via puppeteer-core
 * and writes screenshots of each route so layout regressions are visible without
 * clicking through by hand.
 *
 * Usage: node scripts/shoot.mjs [baseUrl] [outDir]
 * Requires the dev server (or a preview server) to already be running.
 */

import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.argv[2] ?? "http://localhost:8081";
const OUT = process.argv[3] ?? ".shots";

const ROUTES = [
  ["home", "/"],
  ["services", "/services"],
  ["products", "/products"],
  ["blog", "/blog"],
  /**
   * Any published slug will do, this is just a sample of the article layout.
   * It was hardcoded to a post that has since been deleted, so the shot was a
   * 404 page for a while without anything failing. Update it when the post it
   * points at goes away, or the capture quietly stops testing the layout.
   */
  ["blog-post", "/blog/n8n-vs-zapier-vs-make-2026-real-cost"],
  ["about", "/about"],
  ["contact", "/contact"],
];

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-device-scale-factor=1"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

for (const [name, path] of ROUTES) {
  await page.goto(`${BASE}${path}`, { waitUntil: "load", timeout: 45000 });
  // Routes are lazy loaded, so wait past the PageLoader for the real h1,
  // then let entrance animations and webfonts settle.
  await page.waitForSelector("#main h1", { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: `${OUT}/${name}-top.png` });

  // Full page capture, scrolled through first so lazy content and
  // whileInView reveals have all fired.
  // Scroll slowly enough that IntersectionObserver fires for every
  // whileInView reveal, otherwise fullPage capture catches them at opacity 0.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.5;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 400));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 800));
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });

  console.log(`shot ${name}`);
}

// Mobile pass on the home page only, that is where layout breaks first.
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await page.goto(`${BASE}/`, { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 1400));
await page.screenshot({ path: `${OUT}/home-mobile.png` });
console.log("shot home-mobile");

await browser.close();

if (errors.length) {
  console.log("\nCONSOLE ERRORS:");
  for (const e of [...new Set(errors)]) console.log(" -", e);
} else {
  console.log("\nno console errors");
}
