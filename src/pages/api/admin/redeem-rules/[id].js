import db from "../../../../lib/db.js";

export const prerender = false;

export async function PUT({ params, request }) {
  const { id } = params;
  const { product_id, discount_percent, is_active } = await request.json();
  await db.execute(
    "UPDATE redeem_rules SET product_id = ?, discount_percent = ?, is_active = ? WHERE id = ?",
    [product_id, discount_percent, is_active ? 1 : 0, id]
  );
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE({ params }) {
  const { id } = params;
  await db.execute("DELETE FROM redeem_rules WHERE id = ?", [id]);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
