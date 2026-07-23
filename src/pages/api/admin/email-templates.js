import db from "../../../lib/db.js";

export const prerender = false;

export async function GET() {
  const [rows] = await db.execute(
    "SELECT * FROM email_templates ORDER BY created_at DESC"
  );
  return new Response(JSON.stringify({ data: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }) {
  const b = await request.json();
  if (!b.name || !b.subject || !b.type) {
    return new Response(JSON.stringify({ message: "name, subject, type wajib diisi" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [result] = await db.execute(
    `INSERT INTO email_templates (name, type, subject, header_text, logo_url, description, body_html, footer_text, accent_color, button_text, button_url, banner_image, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      b.name, b.type, b.subject,
      b.header_text || "", b.logo_url || "", b.description || "",
      b.body_html || "", b.footer_text || "",
      b.accent_color || "#2563eb",
      b.button_text || "", b.button_url || "", b.banner_image || "",
      b.is_active !== undefined ? (b.is_active ? 1 : 0) : 1,
    ]
  );

  return new Response(JSON.stringify({ id: result.insertId, message: "Template berhasil dibuat" }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT({ request }) {
  const b = await request.json();
  if (!b.id) {
    return new Response(JSON.stringify({ message: "ID wajib diisi" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await db.execute(
    `UPDATE email_templates SET
      name=?, type=?, subject=?, header_text=?, logo_url=?, description=?,
      body_html=?, footer_text=?, accent_color=?, button_text=?, button_url=?, banner_image=?, is_active=?
     WHERE id=?`,
    [
      b.name, b.type, b.subject,
      b.header_text || "", b.logo_url || "", b.description || "",
      b.body_html || "", b.footer_text || "",
      b.accent_color || "#2563eb",
      b.button_text || "", b.button_url || "", b.banner_image || "",
      b.is_active ? 1 : 0,
      b.id,
    ]
  );

  return new Response(JSON.stringify({ message: "Template berhasil diupdate" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  if (!id) {
    return new Response(JSON.stringify({ message: "ID wajib diisi" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await db.execute("DELETE FROM email_templates WHERE id = ?", [id]);

  return new Response(JSON.stringify({ message: "Template berhasil dihapus" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
