import db from "../../../lib/db.js";
import { verifyPassword, createSession, destroySession, SESSION_COOKIE } from "../../../lib/auth.js";

export const prerender = false;

export async function POST({ request }) {
  const { email, password } = await request.json();
  const [[row]] = await db.execute("SELECT * FROM admins WHERE email = ?", [email]);

  if (!row || !verifyPassword(password, row.password_hash)) {
    return new Response(JSON.stringify({ message: "Email atau password salah" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = await createSession(row.id);
  return new Response(
    JSON.stringify({ token, admin: { id: row.id, name: row.name, email: row.email } }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
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
