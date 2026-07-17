import db from "../../../lib/db.js";
import { hashPassword, verifyPassword, SESSION_COOKIE } from "../../../lib/auth.js";

export const prerender = false;

export async function POST({ request, locals, cookies }) {
  const admin = locals.admin;
  if (!admin) {
    return json({ message: "Unauthorized" }, 401);
  }

  const { currentPassword, newPassword } = await request.json().catch(() => ({}));

  if (!currentPassword || !newPassword) {
    return json({ message: "Password lama dan baru wajib diisi" }, 400);
  }
  if (String(newPassword).length < 8) {
    return json({ message: "Password baru minimal 8 karakter" }, 400);
  }

  const [[row]] = await db.execute("SELECT * FROM admins WHERE id = ?", [admin.id]);
  if (!row || !verifyPassword(currentPassword, row.password_hash)) {
    return json({ message: "Password lama salah" }, 401);
  }

  const hash = hashPassword(newPassword);
  await db.execute("UPDATE admins SET password_hash = ? WHERE id = ?", [hash, admin.id]);

  // Invalidate all other sessions; keep the current one.
  const current = cookies.get(SESSION_COOKIE)?.value;
  await db.execute("DELETE FROM sessions WHERE admin_id = ? AND token != ?", [admin.id, current || ""]);

  return json({ ok: true });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
