/**
 * Recompresses everything already in the `blog` storage bucket.
 *
 * New uploads are compressed in the browser before they ever reach storage
 * (see src/lib/image.ts). This script is for the files that went up before that
 * existed, and as a periodic sweep if a large file ever gets in another way.
 *
 * **Each file is rewritten at its existing path.** The public URL therefore
 * does not change, so no post body needs editing. Only the bytes and the
 * content type change, and browsers honour the content type over the file
 * extension, which is why a `.png` path can hold WebP data safely.
 *
 * Auth is an ordinary admin sign in, not a service role key. No service role
 * key exists in this repo and none should. Pass the credentials inline rather
 * than writing them to .env:
 *
 *   BLOG_ADMIN_EMAIL=you@example.com BLOG_ADMIN_PASSWORD=... npm run images:optimise
 *
 * Add --dry-run to see the savings without writing anything.
 */

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const BUCKET = "blog";
const MAX_WIDTH = 1600;
const QUALITY = 82;

/** Formats left alone. SVG would rasterise, GIF would lose its animation. */
const SKIP_EXT = [".svg", ".gif"];

const dryRun = process.argv.includes("--dry-run");

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

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

/** Walks the bucket, which lists one directory at a time. */
async function listAll(supabase, prefix = "") {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(prefix, { limit: 1000 });

  if (error) throw error;

  const files = [];
  for (const entry of data ?? []) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    // A folder comes back with no id.
    if (entry.id === null) {
      files.push(...(await listAll(supabase, path)));
    } else {
      files.push({ path, size: entry.metadata?.size ?? 0 });
    }
  }
  return files;
}

async function main() {
  const env = await loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const email = env.BLOG_ADMIN_EMAIL;
  const password = env.BLOG_ADMIN_PASSWORD;

  if (!url || !key) {
    console.error("VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required.");
    process.exit(1);
  }

  if (!dryRun && (!email || !password)) {
    console.error(
      "Writing needs an admin sign in.\n" +
        "  BLOG_ADMIN_EMAIL=you@example.com BLOG_ADMIN_PASSWORD=... npm run images:optimise\n" +
        "Or run with --dry-run to preview the savings without signing in."
    );
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  if (!dryRun) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error(`Sign in failed: ${error.message}`);
      process.exit(1);
    }
  }

  const files = await listAll(supabase);
  if (files.length === 0) {
    console.log("Bucket is empty.");
    return;
  }

  let before = 0;
  let after = 0;
  let rewritten = 0;

  for (const file of files) {
    const lower = file.path.toLowerCase();
    if (SKIP_EXT.some((ext) => lower.endsWith(ext))) {
      console.log(`skip   ${file.path} (format left alone)`);
      before += file.size;
      after += file.size;
      continue;
    }

    const { data, error } = await supabase.storage.from(BUCKET).download(file.path);
    if (error) {
      console.log(`fail   ${file.path}: ${error.message}`);
      continue;
    }

    const original = Buffer.from(await data.arrayBuffer());
    const optimised = await sharp(original)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    before += original.length;

    if (optimised.length >= original.length) {
      console.log(`keep   ${file.path} (${kb(original.length)}, already smaller)`);
      after += original.length;
      continue;
    }

    after += optimised.length;
    const factor = (original.length / optimised.length).toFixed(1);

    if (dryRun) {
      console.log(
        `would  ${file.path}  ${kb(original.length)} -> ${kb(optimised.length)}  ${factor}x`
      );
      rewritten += 1;
      continue;
    }

    // Same path, so every URL already written into a post keeps working.
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(file.path, optimised, {
        upsert: true,
        contentType: "image/webp",
        cacheControl: "31536000",
      });

    if (upErr) {
      console.log(`fail   ${file.path}: ${upErr.message}`);
      continue;
    }

    console.log(
      `rewrote ${file.path}  ${kb(original.length)} -> ${kb(optimised.length)}  ${factor}x`
    );
    rewritten += 1;
  }

  const saved = before - after;
  console.log(
    `\n${dryRun ? "Dry run. " : ""}${rewritten} of ${files.length} files, ` +
      `${kb(before)} -> ${kb(after)}, saved ${kb(saved)}` +
      (before > 0 ? ` (${Math.round((saved / before) * 100)}%)` : "")
  );

  if (dryRun && rewritten > 0) {
    console.log("Re-run without --dry-run and with admin credentials to apply.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
