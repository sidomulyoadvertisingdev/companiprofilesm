import db from "../../../../lib/db.js";

export const prerender = false;

function parseTags(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v) {
    try { return JSON.parse(v); } catch { return []; }
  }
  return [];
}

async function single(slug) {
  const [r] = await db.execute("SELECT *, content AS raw_content FROM posts WHERE slug = ?", [slug]);
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
  const post = await single(params.slug);
  if (!post) return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
  return new Response(JSON.stringify({ data: post }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}
