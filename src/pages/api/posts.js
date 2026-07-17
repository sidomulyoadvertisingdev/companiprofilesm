import db from "../../lib/db.js";

export const prerender = false;

async function rows(status) {
  let sql = "SELECT id, title, slug, excerpt, featured_image, tags_json, meta_title, meta_description, status, author, created_at, updated_at FROM posts";
  const params = [];
  if (status) {
    sql += " WHERE status = ?";
    params.push(status);
  }
  sql += " ORDER BY created_at DESC";
  const [r] = await db.execute(sql, params);
  return r.map((x) => ({
    id: x.id, title: x.title, slug: x.slug, excerpt: x.excerpt,
    featuredImage: x.featured_image, tags: JSON.parse(x.tags_json || "[]"),
    metaTitle: x.meta_title, metaDescription: x.meta_description,
    status: x.status, author: x.author,
    createdAt: x.created_at, updatedAt: x.updated_at,
  }));
}

function makeSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

export async function GET({ url }) {
  try {
    const status = url.searchParams.get("status");
    return new Response(JSON.stringify({ data: await rows(status) }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message, code: err.code }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST({ request }) {
  const b = await request.json();
  const slug = b.slug || makeSlug(b.title || "untitled");
  const [result] = await db.execute(
    "INSERT INTO posts (title, slug, excerpt, content, featured_image, tags_json, meta_title, meta_description, status, author) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      b.title, slug, b.excerpt || "", b.content || "", b.featuredImage || "",
      JSON.stringify(b.tags || []), b.metaTitle || b.title || "", b.metaDescription || "",
      b.status || "draft", b.author || "",
    ]
  );
  const all = await rows();
  return new Response(JSON.stringify({ data: all.find((x) => x.id === result.insertId) }), {
    status: 201, headers: { "Content-Type": "application/json" },
  });
}
