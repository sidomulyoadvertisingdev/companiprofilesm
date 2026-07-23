import db from "../../../lib/db.js";
import { verifyPassword, createSession, destroySession, SESSION_COOKIE } from "../../../lib/auth.js";
import { rateLimit } from "../../../lib/rate-limiter.js";

export const prerender = false;

export async function POST({ request }) {
  const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
  const { allowed, resetTime } = await rateLimit(`admin-login:${clientIp}`, 5, 60 * 1000);

  if (!allowed) {
    const secondsLeft = Math.ceil((resetTime - Date.now()) / 1000);
    return new Response(JSON.stringify({ message: `Terlalu banyak percobaan masuk, silakan coba lagi dalam ${secondsLeft} detik` }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(secondsLeft),
      },
    });
  }

  const { email, password } = await request.json();
  const [[row]] = await db.execute("SELECT * FROM admins WHERE email = ?", [email]);

  if (!row || !verifyPassword(password, row.password_hash)) {
    return new Response(JSON.stringify({ message: "Email atau password salah" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isProd = import.meta.env.PROD || process.env.NODE_ENV === "production";
  const secureFlag = isProd ? "; Secure" : "";
  const token = await createSession(row.id);
  return new Response(
    JSON.stringify({ token, admin: { id: row.id, name: row.name, email: row.email } }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secureFlag}`,
      },
    }
  );
}

export async function DELETE({ cookies }) {
  const token = cookies.get(SESSION_COOKIE)?.value;
  await destroySession(token);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
