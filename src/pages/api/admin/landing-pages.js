import { getAdminLandingPages, upsertLandingPage, deleteLandingPage } from "../../../lib/queries.js";

export const prerender = false;

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    const pages = await getAdminLandingPages();
    return new Response(JSON.stringify({ data: pages }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api/admin/landing-pages] GET error:", err.message);
    return new Response(JSON.stringify({ error: "Failed to load landing pages" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { title, slug, sections, ...rest } = body;
    if (!title) {
      return new Response(JSON.stringify({ message: "title wajib" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const finalSlug = slugify(slug || title);
    if (!finalSlug) {
      return new Response(JSON.stringify({ message: "slug tidak valid" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const id = await upsertLandingPage({ ...rest, title, slug: finalSlug, sections });
    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api/admin/landing-pages] POST error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT({ request, url }) {
  try {
    const id = Number(url.searchParams.get("id"));
    if (!id) {
      return new Response(JSON.stringify({ message: "id wajib" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const body = await request.json();
    const { title, slug, sections, ...rest } = body;
    const finalSlug = slugify(slug || title);
    await upsertLandingPage({ ...rest, id, title, slug: finalSlug, sections });
    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api/admin/landing-pages] PUT error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE({ url }) {
  try {
    const id = Number(url.searchParams.get("id"));
    if (!id) {
      return new Response(JSON.stringify({ message: "id wajib" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    await deleteLandingPage(id);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api/admin/landing-pages] DELETE error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
