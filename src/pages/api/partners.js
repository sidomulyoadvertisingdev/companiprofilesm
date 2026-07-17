import db from "../../lib/db.js";

export const prerender = false;

async function rows() {
  const [r] = await db.execute("SELECT id, name, logo, website, `order` FROM partners ORDER BY `order` ASC, id ASC");
  return r.map((x) => ({ id: x.id, name: x.name, logo: x.logo, website: x.website, order: x.order }));
}

export async function GET() {
  return new Response(JSON.stringify({ data: await rows() }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }) {
  const b = await request.json();
  const [result] = await db.execute(
    "INSERT INTO partners (name, logo, website, `order`) VALUES (?, ?, ?, ?)",
    [b.name, b.logo, b.website, b.order || 0]
  );
  const all = await rows();
  return new Response(JSON.stringify({ data: all.find((x) => x.id === result.insertId) }), {
    status: 201, headers: { "Content-Type": "application/json" },
  });
}
