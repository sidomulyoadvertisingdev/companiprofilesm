import { getLandingPages } from "../../lib/queries.js";

export const prerender = false;

export async function GET() {
  try {
    const pages = await getLandingPages();
    return new Response(JSON.stringify({ data: pages }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api/landing-pages] GET error:", err.message);
    return new Response(JSON.stringify({ error: "Failed to load landing pages" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
