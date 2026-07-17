import db from "../../lib/db.js";

export const prerender = false;

async function rows() {
  const [r] = await db.execute("SELECT id, slug, title, category, price_text, image, short_desc, long_desc, `order` FROM products ORDER BY `order` ASC, id ASC");
  return r.map((x) => ({
    id: x.id, slug: x.slug, title: x.title, category: x.category,
    priceText: x.price_text, image: x.image, shortDesc: x.short_desc, longDesc: x.long_desc, order: x.order,
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
    "INSERT INTO products (slug, title, category, price_text, image, short_desc, long_desc, `order`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [b.slug, b.title, b.category, b.priceText, b.image, b.shortDesc, b.longDesc, b.order || 0]
  );
  const all = await rows();
  return new Response(JSON.stringify({ data: all.find((x) => x.id === result.insertId) }), {
    status: 201, headers: { "Content-Type": "application/json" },
  });
}
