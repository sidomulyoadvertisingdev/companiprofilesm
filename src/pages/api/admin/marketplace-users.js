import db from "../../../lib/db.js";

export const prerender = false;

export async function GET() {
  const [users] = await db.execute(
    `SELECT u.id, u.name, u.email, u.phone, u.address, u.verified, u.banned, u.latitude, u.longitude, u.created_at,
            COUNT(mc.id) AS total_codes,
            SUM(CASE WHEN mc.redeemed = 1 THEN 1 ELSE 0 END) AS redeemed_codes
     FROM marketplace_users u
     LEFT JOIN marketplace_codes mc ON mc.phone = REGEXP_REPLACE(u.phone, '[^0-9]', '')
     GROUP BY u.id
     ORDER BY u.created_at DESC`
  );
  return new Response(JSON.stringify({ data: users }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT({ request }) {
  const { id, name, email, phone, address, banned } = await request.json();
  if (!id) {
    return new Response(JSON.stringify({ message: "User ID wajib" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const fields = [];
  const values = [];
  if (name !== undefined) { fields.push("name = ?"); values.push(name); }
  if (email !== undefined) { fields.push("email = ?"); values.push(email); }
  if (phone !== undefined) { fields.push("phone = ?"); values.push(phone); }
  if (address !== undefined) { fields.push("address = ?"); values.push(address); }
  if (banned !== undefined) { fields.push("banned = ?"); values.push(banned ? 1 : 0); }

  if (fields.length === 0) {
    return new Response(JSON.stringify({ message: "Tidak ada data yang diubah" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  values.push(id);
  await db.execute(`UPDATE marketplace_users SET ${fields.join(", ")} WHERE id = ?`, values);

  return new Response(JSON.stringify({ message: "Berhasil diupdate" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE({ request }) {
  const { id } = await request.json();
  if (!id) {
    return new Response(JSON.stringify({ message: "User ID wajib" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await db.execute("DELETE FROM marketplace_users WHERE id = ?", [id]);

  return new Response(JSON.stringify({ message: "Berhasil dihapus" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
