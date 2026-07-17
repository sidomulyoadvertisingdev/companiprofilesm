import db from "../../../lib/db.js";

export const prerender = false;

export async function PUT({ params, request }) {
  const b = await request.json();
  await db.execute(
    "UPDATE partners SET name=?, logo=?, website=?, `order`=? WHERE id=?",
    [b.name, b.logo, b.website, b.order || 0, Number(params.id)]
  );
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE({ params }) {
  await db.execute("DELETE FROM partners WHERE id = ?", [Number(params.id)]);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}
