import db from "../../../lib/db.js";

export const prerender = false;

export async function POST({ request }) {
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

  const [[user]] = await db.execute(
    "SELECT phone FROM marketplace_users WHERE id = ?",
    [userId]
  );
  if (!user || !user.phone) {
    return new Response(JSON.stringify({ message: "Nomor handphone tidak ditemukan" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const phoneDigits = user.phone.replace(/[^0-9]/g, "");

  const [[existingRedemption]] = await db.execute(
    `SELECT mr.id, mc.code, rr.discount_percent, p.title AS product, p.image, p.category
     FROM marketplace_redemptions mr
     JOIN marketplace_codes mc ON mr.code_id = mc.id
     JOIN redeem_rules rr ON mr.rule_id = rr.id
     JOIN products p ON rr.product_id = p.id
     WHERE mr.user_id = ?`,
    [userId]
  );
  if (existingRedemption) {
    return new Response(JSON.stringify({
      code: existingRedemption.code,
      product: existingRedemption.product,
      image: existingRedemption.image,
      category: existingRedemption.category,
      discount_percent: existingRedemption.discount_percent,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [[codeRow]] = await db.execute(
    "SELECT id, code FROM marketplace_codes WHERE REGEXP_REPLACE(phone, '[^0-9]', '') = ? AND redeemed = 0 LIMIT 1",
    [phoneDigits]
  );
  if (!codeRow) {
    const hex = Math.random().toString(16).substring(2, 8).toUpperCase();
    const newCode = `SDM-${hex}`;
    const [ins] = await db.execute(
      "INSERT INTO marketplace_codes (phone, code, redeemed) VALUES (?, ?, 0)",
      [user.phone, newCode]
    );

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
      [userId, ins.insertId, chosen.id]
    );
    await db.execute(
      "UPDATE marketplace_codes SET redeemed = 1, redeemed_at = NOW() WHERE id = ?",
      [ins.insertId]
    );

    return new Response(JSON.stringify({
      code: newCode,
      product: chosen.title,
      image: chosen.image,
      category: chosen.category,
      discount_percent: chosen.discount_percent,
    }), {
      status: 200,
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
    code: codeRow.code,
    product: chosen.title,
    image: chosen.image,
    category: chosen.category,
    discount_percent: chosen.discount_percent,
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
