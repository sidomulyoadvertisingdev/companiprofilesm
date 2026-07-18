import { readFile } from "node:fs/promises";
import { join, extname, basename } from "node:path";

export const prerender = false;

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

const MIME = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET({ params }) {
  const file = basename(params.file || "");
  if (!file || file.includes("..") || file.includes("/")) {
    return new Response("Not found", { status: 404 });
  }
  const ext = extname(file).toLowerCase();
  try {
    const buf = await readFile(join(UPLOAD_DIR, file));
    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
