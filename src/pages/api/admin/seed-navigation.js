import db from "../../../lib/db.js";
import { DEFAULT_NAV_MENU } from "../../../lib/schema.js";

export const prerender = false;

export async function POST({ request }) {
  try {
    await db.execute("UPDATE site_config SET nav_json = ? WHERE id = 1", [JSON.stringify(DEFAULT_NAV_MENU)]);
    return new Response(JSON.stringify({ success: true, message: "Navigation menu seeded successfully", data: DEFAULT_NAV_MENU }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
