import { writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import crypto from "node:crypto";

export const prerender = false;

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

const ALLOWED = [".webp", ".jpg", ".jpeg", ".png", ".svg", ".gif", ".avif"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

// Videos (e.g. the ad-campaign hero background) are much larger, so they're
// only accepted from a logged-in admin — this route is otherwise public.
const VIDEO_ALLOWED = [".mp4", ".webm"];
const VIDEO_MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export async function POST({ request, locals }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return new Response(JSON.stringify({ message: "Invalid form data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return new Response(JSON.stringify({ message: "File tidak ditemukan" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ext = extname(file.name || "").toLowerCase();
  const isVideo = VIDEO_ALLOWED.includes(ext);
  if (isVideo && !locals.admin) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!ALLOWED.includes(ext) && !isVideo) {
    return new Response(
      JSON.stringify({ message: "Tipe file tidak diizinkan (webp/jpg/png/svg)" }),
      { status: 415, headers: { "Content-Type": "application/json" } }
    );
  }

  const limit = isVideo ? VIDEO_MAX_BYTES : MAX_BYTES;
  if (file.size > limit) {
    return new Response(JSON.stringify({ message: `Ukuran maksimal ${limit / 1024 / 1024} MB` }), {
      status: 413,
      headers: { "Content-Type": "application/json" },
    });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > limit) {
    return new Response(JSON.stringify({ message: `Ukuran maksimal ${limit / 1024 / 1024} MB` }), {
      status: 413,
      headers: { "Content-Type": "application/json" },
    });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  await writeFile(join(UPLOAD_DIR, filename), buf);

  return new Response(JSON.stringify({ url: `/api/uploads/${filename}` }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
