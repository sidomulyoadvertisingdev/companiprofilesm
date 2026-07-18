import db from "../../../lib/db.js";

export const prerender = false;

export async function GET() {
  try {
    const [rows] = await db.execute(
      `SELECT id, name, email, phone, subject, message, is_read, created_at, updated_at
       FROM contact_messages ORDER BY created_at DESC`
    );
    const unread = rows.filter((r) => !r.is_read).length;
    return new Response(JSON.stringify({ data: rows, unread }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
