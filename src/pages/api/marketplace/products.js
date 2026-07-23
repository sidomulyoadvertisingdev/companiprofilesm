import db from "../../../lib/db.js";

export const prerender = false;

export async function GET() {
  const [rows] = await db.execute(
    "SELECT rr.id, rr.discount_percent, p.title, p.image, p.category FROM redeem_rules rr JOIN products p ON rr.product_id = p.id WHERE rr.is_active = 1"
  );
  return new Response(JSON.stringify({ data: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
