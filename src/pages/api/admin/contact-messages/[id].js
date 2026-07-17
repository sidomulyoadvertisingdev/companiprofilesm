import db from "../../../../lib/db.js";

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

export async function PUT({ params, request }) {
  const id = Number(params.id);
  if (!id) {
    return new Response(JSON.stringify({ message: "ID tidak valid" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const { is_read } = await request.json().catch(() => ({}));
  try {
    await db.execute(
      "UPDATE contact_messages SET is_read = ? WHERE id = ?",
      [is_read ? 1 : 0, id]
    );
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function DELETE({ params }) {
  const id = Number(params.id);
  if (!id) {
    return new Response(JSON.stringify({ message: "ID tidak valid" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  try {
    await db.execute("DELETE FROM contact_messages WHERE id = ?", [id]);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
