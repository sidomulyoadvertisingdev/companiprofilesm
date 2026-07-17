import db from "../../../lib/db.js";

export const prerender = false;

async function rows() {
  const [r] = await db.execute("SELECT id, slug, title, icon, image, short_desc, long_desc, features_json, `order` FROM services ORDER BY `order` ASC, id ASC");
  return r.map((x) => ({
    id: x.id, slug: x.slug, title: x.title, icon: x.icon, image: x.image,
    shortDesc: x.short_desc, longDesc: x.long_desc, features: JSON.parse(x.features_json || "[]"), order: x.order,
  }));
}

export async function PUT({ params, request }) {
  const b = await request.json();
  await db.execute(
    "UPDATE services SET slug=?, title=?, icon=?, image=?, short_desc=?, long_desc=?, features_json=?, `order`=? WHERE id=?",
    [b.slug, b.title, b.icon, b.image, b.shortDesc, b.longDesc, JSON.stringify(b.features || []), b.order || 0, Number(params.id)]
  );
  const all = await rows();
  return new Response(JSON.stringify({ data: all.find((x) => x.id === Number(params.id)) }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE({ params }) {
  await db.execute("DELETE FROM services WHERE id = ?", [Number(params.id)]);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}
