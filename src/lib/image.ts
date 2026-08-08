/**
 * Browser side image compression, applied before anything reaches storage.
 *
 * The images that go into posts come out of an image model as PNGs, which is
 * the worst possible format for a wide flat infographic: the real cover was
 * 1526 KB as a PNG and 94 KB as WebP at the same width. That factor of sixteen
 * is the difference between the free tier lasting a few hundred visits and
 * lasting a few thousand.
 *
 * This runs on the canvas, so there is no dependency and no server round trip.
 */

/** Nothing on the site renders a blog image wider than this. */
const MAX_WIDTH = 1600;
const QUALITY = 0.82;

/**
 * Formats that must pass through untouched.
 *
 * SVG is already tiny and would be rasterised. GIF would lose its animation,
 * and silently turning an animation into a still frame is worse than a large
 * file.
 */
const PASS_THROUGH = ["image/svg+xml", "image/gif"];

export interface CompressionResult {
  file: File;
  /** Original byte size, for reporting the saving to the user. */
  originalBytes: number;
  /** True when the image was left exactly as it arrived. */
  skipped: boolean;
}

/**
 * Returns a WebP version of the file, downscaled to at most MAX_WIDTH.
 *
 * Falls back to the original on any failure. A failed compression must never
 * block an upload, because the person is mid post and the large file still
 * works. It just costs more bandwidth.
 */
export async function compressImage(file: File): Promise<CompressionResult> {
  const originalBytes = file.size;

  if (PASS_THROUGH.includes(file.type) || !file.type.startsWith("image/")) {
    return { file, originalBytes, skipped: true };
  }

  try {
    const bitmap = await createImageBitmap(file);

    // Only ever shrink. Upscaling a small image would add bytes and no detail.
    const scale = Math.min(1, MAX_WIDTH / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return { file, originalBytes, skipped: true };

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY)
    );

    // A browser with no WebP encoder hands back a PNG, which can be larger than
    // what arrived. Keep whichever is actually smaller.
    if (!blob || blob.type !== "image/webp" || blob.size >= originalBytes) {
      return { file, originalBytes, skipped: true };
    }

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return {
      file: new File([blob], name, { type: "image/webp" }),
      originalBytes,
      skipped: false,
    };
  } catch {
    return { file, originalBytes, skipped: true };
  }
}

/** "1.5 MB", "94 KB". For telling the user what the upload saved. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
