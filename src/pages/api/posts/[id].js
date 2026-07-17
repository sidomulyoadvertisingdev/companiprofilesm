import db from "../../../lib/db.js";

export const prerender = false;

function parseTags(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v) {
    try { return JSON.parse(v); } catch { return []; }
  }
  return [];
}

async function rows() {
  const [r] = await db.execute("SELECT id, title, slug, excerpt, featured_image, tags_json, meta_title, meta_description, status, author, created_at, updated_at FROM posts ORDER BY created_at DESC");
  return r.map((x) => ({
    id: x.id, title: x.title, slug: x.slug, excerpt: x.excerpt,
    featuredImage: x.featured_image, tags: parseTags(x.tags_json),
    metaTitle: x.meta_title, metaDescription: x.meta_description,
    status: x.status, author: x.author,
    createdAt: x.created_at, updatedAt: x.updated_at,
  }));
}

async function single(id) {
  const [r] = await db.execute("SELECT *, content AS raw_content FROM posts WHERE id = ?", [Number(id)]);
  const x = r[0];
  if (!x) return null;
  return {
    id: x.id, title: x.title, slug: x.slug, excerpt: x.excerpt, content: x.raw_content,
    featuredImage: x.featured_image, tags: parseTags(x.tags_json),
    metaTitle: x.meta_title, metaDescription: x.meta_description,
    status: x.status, author: x.author,
    createdAt: x.created_at, updatedAt: x.updated_at,
  };
}

export async function GET({ params }) {
  const post = await single(params.id);
  if (!post) return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
  return new Response(JSON.stringify({ data: post }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}

export async function PUT({ params, request }) {
  const b = await request.json();
  await db.execute(
    "UPDATE posts SET title=?, slug=?, excerpt=?, content=?, featured_image=?, tags_json=?, meta_title=?, meta_description=?, status=?, author=? WHERE id=?",
    [
      b.title, b.slug, b.excerpt || "", b.content || "", b.featuredImage || "",
      JSON.stringify(b.tags || []), b.metaTitle || "", b.metaDescription || "",
      b.status || "draft", b.author || "", Number(params.id),
    ]
  );
  const all = await rows();
  return new Response(JSON.stringify({ data: all.find((x) => x.id === Number(params.id)) }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE({ params }) {
  await db.execute("DELETE FROM posts WHERE id = ?", [Number(params.id)]);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}
