import crypto from "node:crypto";
import db from "./db.js";

// Simple password hashing (scrypt). Good enough for self-hosted admin.
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const verify = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verify));
}

export async function createSession(adminId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
  await db.execute(
    "INSERT INTO sessions (token, admin_id, expires_at) VALUES (?, ?, ?)",
    [token, adminId, expires.toISOString().slice(0, 19).replace("T", " ")]
  );
  return token;
}

export async function getSessionAdmin(token) {
  if (!token) return null;
  const [sessions] = await db.execute("SELECT * FROM sessions WHERE token = ?", [token]);
  const session = sessions[0];
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    await db.execute("DELETE FROM sessions WHERE token = ?", [token]);
    return null;
  }
  const [admins] = await db.execute("SELECT id, name, email, role FROM admins WHERE id = ?", [session.admin_id]);
  return admins[0] || null;
}

export async function destroySession(token) {
  if (token) await db.execute("DELETE FROM sessions WHERE token = ?", [token]);
}

export const SESSION_COOKIE = "sidomulyo_admin";
