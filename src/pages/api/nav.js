import { getNav } from "../../lib/queries.js";

export const prerender = false;

export async function GET() {
  const nav = await getNav();
  return new Response(JSON.stringify({ data: nav }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

