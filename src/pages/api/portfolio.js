import db from "../../lib/db.js";

export const prerender = false;

async function rows() {
  const [r] = await db.execute("SELECT id, title, category, client, year, image, description, `order` FROM portfolio ORDER BY `order` ASC, id ASC");
  return r.map((x) => ({
    id: x.id, title: x.title, category: x.category, client: x.client,
    year: x.year, image: x.image, description: x.description, order: x.order,
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
    "INSERT INTO portfolio (title, category, client, year, image, description, `order`) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [b.title, b.category, b.client, b.year, b.image, b.description, b.order || 0]
  );
  const all = await rows();
  return new Response(JSON.stringify({ data: all.find((x) => x.id === result.insertId) }), {
    status: 201, headers: { "Content-Type": "application/json" },
  });
}
