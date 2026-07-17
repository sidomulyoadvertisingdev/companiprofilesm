import db from "../../lib/db.js";

export const prerender = false;

async function rows() {
  const [r] = await db.execute("SELECT id, slug, title, icon, image, short_desc, long_desc, features_json, `order` FROM services ORDER BY `order` ASC, id ASC");
  return r.map((x) => ({
    id: x.id, slug: x.slug, title: x.title, icon: x.icon, image: x.image,
    shortDesc: x.short_desc, longDesc: x.long_desc, features: JSON.parse(x.features_json || "[]"), order: x.order,
  }));
}

export async function GET() {
  return new Response(JSON.stringify({ data: await rows() }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }) {
  const b = await request.json();
  const [result] = await db.execute(
    "INSERT INTO services (slug, title, icon, image, short_desc, long_desc, features_json, `order`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [b.slug, b.title, b.icon, b.image, b.shortDesc, b.longDesc, JSON.stringify(b.features || []), b.order || 0]
  );
  const all = await rows();
  return new Response(JSON.stringify({ data: all.find((x) => x.id === result.insertId) }), {
    status: 201, headers: { "Content-Type": "application/json" },
  });
}
