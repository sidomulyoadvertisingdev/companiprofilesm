import { readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
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
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const VIDEO_EXTS = [".mp4", ".webm"];

// Videos are streamed with HTTP Range support — Safari (esp. iOS) refuses to
// play a <video> whose server doesn't answer byte-range requests, and
// streaming avoids loading a whole video into memory per request.
async function serveVideo(path, ext, request) {
  const { size } = await stat(path);
  const headers = {
    "Content-Type": MIME[ext],
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  const range = request.headers.get("range");
  const match = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!match) {
    headers["Content-Length"] = String(size);
    return new Response(Readable.toWeb(createReadStream(path)), { status: 200, headers });
  }

  let start;
  let end;
  if (match[1] === "") {
    // Suffix range: last N bytes.
    start = Math.max(size - Number(match[2]), 0);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
  }
  if (start > end || start >= size) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }

  headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
  headers["Content-Length"] = String(end - start + 1);
  return new Response(Readable.toWeb(createReadStream(path, { start, end })), { status: 206, headers });
}

export async function GET({ params, request }) {
  const file = basename(params.file || "");
  if (!file || file.includes("..") || file.includes("/")) {
    return new Response("Not found", { status: 404 });
  }
  const ext = extname(file).toLowerCase();
  try {
    if (VIDEO_EXTS.includes(ext)) {
      return await serveVideo(join(UPLOAD_DIR, file), ext, request);
    }
    const buf = await readFile(join(UPLOAD_DIR, file));
    const headers = {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    };
    if (ext === ".svg") {
      headers["Content-Security-Policy"] = "default-src 'none';";
    }
    return new Response(buf, {
      status: 200,
      headers,
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
