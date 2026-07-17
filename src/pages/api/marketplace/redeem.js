import db from "../../../lib/db.js";

export const prerender = false;

export async function POST({ request }) {
  const { code } = await request.json();
  if (!code) {
    return new Response(JSON.stringify({ message: "Kode redeem wajib diisi" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [[session]] = await db.execute(
    "SELECT user_id FROM marketplace_sessions WHERE token = ? AND expires_at > NOW()",
    [token]
  );
  if (!session) {
    return new Response(JSON.stringify({ message: "Session expired, silakan login kembali" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const userId = session.user_id;

  const [[codeRow]] = await db.execute(
    "SELECT id FROM marketplace_codes WHERE code = ? AND redeemed = 0",
    [code.trim().toUpperCase()]
  );
  if (!codeRow) {
    return new Response(JSON.stringify({ message: "Kode tidak valid atau sudah digunakan" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [[alreadyRedeemed]] = await db.execute(
    "SELECT id FROM marketplace_redemptions WHERE user_id = ? AND code_id = ?",
    [userId, codeRow.id]
  );
  if (alreadyRedeemed) {
    return new Response(JSON.stringify({ message: "Anda sudah menukarkan kode ini" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [rules] = await db.execute(
    "SELECT rr.id, rr.discount_percent, p.title, p.image, p.category FROM redeem_rules rr JOIN products p ON rr.product_id = p.id WHERE rr.is_active = 1"
  );
  if (rules.length === 0) {
    return new Response(JSON.stringify({ message: "Tidak ada produk diskon yang tersedia" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const chosen = rules[Math.floor(Math.random() * rules.length)];

  await db.execute(
    "INSERT INTO marketplace_redemptions (user_id, code_id, rule_id) VALUES (?, ?, ?)",
    [userId, codeRow.id, chosen.id]
  );
  await db.execute(
    "UPDATE marketplace_codes SET redeemed = 1, redeemed_at = NOW() WHERE id = ?",
    [codeRow.id]
  );

  return new Response(JSON.stringify({
    product: chosen.title,
    image: chosen.image,
    category: chosen.category,
    discount_percent: chosen.discount_percent,
    code: code.trim().toUpperCase(),
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
