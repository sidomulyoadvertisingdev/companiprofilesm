import db from "../../lib/db.js";

export const prerender = false;

export async function POST({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ message: "Format request tidak valid" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();

  if (!name || !message) {
    return new Response(JSON.stringify({ message: "Nama dan pesan wajib diisi" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, subject, message]
    );
    return new Response(
      JSON.stringify({ id: result.insertId, message: "Pesan berhasil dikirim" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: "Gagal menyimpan pesan: " + err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
