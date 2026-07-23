import db from "../../../lib/db.js";
import { createHash } from "crypto";

export const prerender = false;

function hashPw(pw) {
  return createHash("sha256").update(pw).digest("hex");
}

export async function POST({ request }) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return new Response(JSON.stringify({ message: "Email dan password wajib diisi" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [[user]] = await db.execute(
    "SELECT id, name, email, phone, address, verified FROM marketplace_users WHERE email = ? AND password_hash = ?",
    [email, hashPw(password)]
  );

  if (!user) {
    return new Response(JSON.stringify({ message: "Email atau password salah" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!user.verified) {
    return new Response(JSON.stringify({ message: "Email belum diverifikasi, silakan cek inbox Anda", needsVerification: true }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = createHash("sha256")
    .update(`${user.id}-${Date.now()}-${Math.random()}`)
    .digest("hex");

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.execute(
    "INSERT INTO marketplace_sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
    [token, user.id, expires]
  );

  return new Response(JSON.stringify({
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address },
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
