import db from "../../../lib/db.js";

export const prerender = false;

export async function PUT({ params, request }) {
  const b = await request.json();
  await db.execute(
    "UPDATE products SET slug=?, title=?, category=?, price_text=?, image=?, short_desc=?, long_desc=?, `order`=? WHERE id=?",
    [b.slug, b.title, b.category, b.priceText, b.image, b.shortDesc, b.longDesc, b.order || 0, Number(params.id)]
  );
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE({ params }) {
  await db.execute("DELETE FROM products WHERE id = ?", [Number(params.id)]);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}
