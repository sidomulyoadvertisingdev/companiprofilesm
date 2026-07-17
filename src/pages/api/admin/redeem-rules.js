import db from "../../../lib/db.js";

export const prerender = false;

export async function GET() {
  const [rows] = await db.execute(
    `SELECT rr.id, rr.product_id, rr.discount_percent, rr.is_active,
            p.title AS product_title, p.image AS product_image, p.category AS product_category
     FROM redeem_rules rr
     JOIN products p ON rr.product_id = p.id
     ORDER BY rr.id ASC`
  );
  return new Response(JSON.stringify({ data: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }) {
  const { product_id, discount_percent, is_active } = await request.json();
  if (!product_id || !discount_percent) {
    return new Response(JSON.stringify({ message: "product_id dan discount_percent wajib" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const [result] = await db.execute(
    "INSERT INTO redeem_rules (product_id, discount_percent, is_active) VALUES (?, ?, ?)",
    [product_id, discount_percent, is_active !== undefined ? is_active : 1]
  );
  return new Response(JSON.stringify({ id: result.insertId }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
