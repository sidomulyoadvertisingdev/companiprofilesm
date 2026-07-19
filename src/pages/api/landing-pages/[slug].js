import { getLandingPageBySlug } from "../../../lib/queries.js";

export const prerender = false;

export async function GET({ params }) {
  const slug = params.slug;
  try {
    const page = await getLandingPageBySlug(slug);
    if (!page) {
      return new Response(JSON.stringify({ error: "Landing page not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ data: page }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api/landing-pages/[slug]] GET error:", err.message);
    return new Response(JSON.stringify({ error: "Failed to load landing page" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
