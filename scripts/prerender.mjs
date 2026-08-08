/**
 * Bakes static HTML for every route, including one file per published blog post.
 *
 * Why this exists: the site is a client rendered SPA, so the HTML that arrives
 * is an empty div. Google executes JavaScript and will index it, but social
 * scrapers (WhatsApp, Slack, X, LinkedIn) do not, so every shared link showed
 * the same generic card. For a blog that is meant to earn from shares, that is
 * the difference between a post spreading and not.
 *
 * How: build normally, serve dist, drive the already installed Chrome over each
 * route, then write the fully rendered DOM back to disk as <route>/index.html.
 * A static host serves those files directly; React still boots and takes over.
 *
 * Run: npm run build (which chains into this), or node scripts/prerender.mjs
 */

import { createServer } from "node:http";
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import puppeteer from "puppeteer-core";
import { createClient } from "@supabase/supabase-js";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const DIST = "dist";
const PORT = 4178;
const ORIGIN = "https://kraftzen.com";

/** Routes that always exist, regardless of what is in the database. */
const STATIC_ROUTES = [
  "/",
  "/services",
  "/products",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

/** /admin is deliberately never prerendered. It is noindex and auth gated. */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
};

/* ------------------------------------------------------------------ */
/* env                                                                 */
/* ------------------------------------------------------------------ */

/** Minimal .env reader so this script needs no extra dependency. */
async function loadEnv() {
  const merged = { ...process.env };
  if (existsSync(".env")) {
    const raw = await readFile(".env", "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (!match) continue;
      const [, key, value = ""] = match;
      if (!(key in merged)) merged[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return merged;
}

/* ------------------------------------------------------------------ */
/* routes                                                              */
/* ------------------------------------------------------------------ */

async function blogRoutes(env) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.warn("! Supabase env missing, skipping blog post routes");
    return [];
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("posts")
    .select("slug, published_at, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.warn(`! Could not read posts, skipping blog routes: ${error.message}`);
    return [];
  }

  return (data ?? []).map((p) => ({
    path: `/blog/${p.slug}`,
    lastmod: (p.updated_at ?? p.published_at ?? "").slice(0, 10),
  }));
}

/* ------------------------------------------------------------------ */
/* static server over dist, with SPA fallback                          */
/* ------------------------------------------------------------------ */

function serveDist() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
      let filePath = join(DIST, urlPath);

      try {
        if (!extname(filePath)) filePath = join(DIST, "index.html");
        const body = await readFile(filePath);
        res.writeHead(200, {
          "Content-Type": MIME[extname(filePath)] ?? "application/octet-stream",
        });
        res.end(body);
      } catch {
        // Unknown path: hand back the SPA shell so the router can resolve it.
        try {
          const shell = await readFile(join(DIST, "index.html"));
          res.writeHead(200, { "Content-Type": MIME[".html"] });
          res.end(shell);
        } catch {
          res.writeHead(404);
          res.end("not found");
        }
      }
    });

    server.listen(PORT, () => resolve(server));
  });
}

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */

if (!existsSync(DIST)) {
  console.error(`No ${DIST}/ directory. Run vite build first.`);
  process.exit(1);
}

if (!existsSync(CHROME)) {
  console.warn(`! Chrome not found at ${CHROME}. Skipping prerender.`);
  console.warn("  The build still works, but shared links will use the default card.");
  process.exit(0);
}

const env = await loadEnv();
const posts = await blogRoutes(env);
const routes = [...STATIC_ROUTES.map((path) => ({ path, lastmod: null })), ...posts];

console.log(`Prerendering ${routes.length} routes (${posts.length} blog posts)`);

const server = await serveDist();
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let ok = 0;
const failed = [];

for (const route of routes) {
  const page = await browser.newPage();
  try {
    await page.goto(`http://localhost:${PORT}${route.path}`, {
      waitUntil: "load",
      timeout: 45000,
    });

    // Wait for the router to resolve and the page to actually render content.
    await page.waitForSelector("#main h1, article h1, main h1", { timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);

    // Reveal animations start at opacity 0. A crawler reading the HTML does not
    // care, but a human viewing source or a scraper grabbing text does, so force
    // everything visible before capturing.
    await page.addStyleTag({
      content: "*{opacity:1 !important;transform:none !important;}",
    });
    await new Promise((r) => setTimeout(r, 250));

    const html = await page.content();

    const outDir =
      route.path === "/" ? DIST : join(DIST, route.path.replace(/^\//, ""));
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "index.html"), html, "utf8");

    ok += 1;
    console.log(`  ok  ${route.path}`);
  } catch (err) {
    failed.push(route.path);
    console.warn(`  !!  ${route.path}: ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();

/* ------------------------------------------------------------------ */
/* sitemap                                                             */
/* ------------------------------------------------------------------ */

const today = new Date().toISOString().slice(0, 10);
const priority = (path) =>
  path === "/" ? "1.0" : path === "/services" ? "0.9" : path.startsWith("/blog/") ? "0.7" : "0.8";

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${ORIGIN}${r.path === "/" ? "/" : r.path}</loc>
    <lastmod>${r.lastmod || today}</lastmod>
    <changefreq>${r.path.startsWith("/blog") ? "weekly" : "monthly"}</changefreq>
    <priority>${priority(r.path)}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

await writeFile(join(DIST, "sitemap.xml"), sitemap, "utf8");
console.log(`\nWrote dist/sitemap.xml with ${routes.length} urls`);
console.log(`Prerendered ${ok}/${routes.length} routes`);

if (failed.length) {
  console.warn(`Failed: ${failed.join(", ")}`);
  process.exitCode = 1;
}
