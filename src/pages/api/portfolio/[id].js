import db from "../../../lib/db.js";

export const prerender = false;

export async function PUT({ params, request }) {
  const b = await request.json();
  await db.execute(
    "UPDATE portfolio SET title=?, category=?, client=?, year=?, image=?, description=?, `order`=? WHERE id=?",
    [b.title, b.category, b.client, b.year, b.image, b.description, b.order || 0, Number(params.id)]
  );
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE({ params }) {
  await db.execute("DELETE FROM portfolio WHERE id = ?", [Number(params.id)]);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}
