import { writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import crypto from "node:crypto";

export const prerender = false;

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

const ALLOWED = [".webp", ".jpg", ".jpeg", ".png", ".svg", ".gif", ".avif"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST({ request }) {
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
  if (!ALLOWED.includes(ext)) {
    return new Response(
      JSON.stringify({ message: "Tipe file tidak diizinkan (webp/jpg/png/svg)" }),
      { status: 415, headers: { "Content-Type": "application/json" } }
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    return new Response(JSON.stringify({ message: "Ukuran maksimal 5 MB" }), {
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
