import db from "../../../lib/db.js";
import { createHash } from "crypto";

export const prerender = false;

function hashPw(pw) {
  return createHash("sha256").update(pw).digest("hex");
}

export async function POST({ request }) {
  const { name, email, phone, address, password, latitude, longitude } = await request.json();
  if (!name || !email || !phone || !password) {
    return new Response(JSON.stringify({ message: "Nama, email, nomor handphone, dan password wajib diisi" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [[existing]] = await db.execute("SELECT id FROM marketplace_users WHERE email = ?", [email]);
  if (existing) {
    return new Response(JSON.stringify({ message: "Email sudah terdaftar" }), {
      status: 409,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [result] = await db.execute(
    "INSERT INTO marketplace_users (name, email, phone, address, password_hash, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, email, phone, address || "", hashPw(password), latitude || null, longitude || null]
  );

  return new Response(JSON.stringify({ id: result.insertId, message: "Registrasi berhasil" }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
