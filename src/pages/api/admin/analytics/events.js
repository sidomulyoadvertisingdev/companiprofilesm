import db from "../../../../lib/db.js";
import { getSessionAdmin, SESSION_COOKIE } from "../../../../lib/auth.js";

export const prerender = false;

export async function GET({ url, cookies }) {
  try {
    const admin = await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
    if (!admin) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const [rows] = await db.execute(
      `SELECT id, visitor_id, event_type, page_url, element_target, element_text, city, region, country, device_type, browser, os, created_at
       FROM analytics_events ORDER BY created_at DESC LIMIT ? OFFSET ?`, [limit, offset]
    );

    const [[{ total }]] = await db.execute(`SELECT COUNT(*) as total FROM analytics_events`);

    return new Response(JSON.stringify({ data: rows, total }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
