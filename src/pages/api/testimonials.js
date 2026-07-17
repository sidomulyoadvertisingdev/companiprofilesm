import db from "../../lib/db.js";

export const prerender = false;

async function rows() {
  const [r] = await db.execute("SELECT id, name, role, company, quote, avatar, `order` FROM testimonials ORDER BY `order` ASC, id ASC");
  return r.map((x) => ({
    id: x.id, name: x.name, role: x.role, company: x.company,
    quote: x.quote, avatar: x.avatar, order: x.order,
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
    "INSERT INTO testimonials (name, role, company, quote, avatar, `order`) VALUES (?, ?, ?, ?, ?, ?)",
    [b.name, b.role, b.company, b.quote, b.avatar, b.order || 0]
  );
  const all = await rows();
  return new Response(JSON.stringify({ data: all.find((x) => x.id === result.insertId) }), {
    status: 201, headers: { "Content-Type": "application/json" },
  });
}
