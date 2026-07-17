import db from "../../../../lib/db.js";
import { getSessionAdmin, SESSION_COOKIE } from "../../../../lib/auth.js";

export const prerender = false;

// Returns recent visitor locations (with GPS/IP coordinates) for the map.
export async function GET({ url, cookies }) {
  try {
    const admin = await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
    if (!admin) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const limit = String(Math.min(parseInt(url.searchParams.get("limit") || "200") || 200, 500));

    const [rows] = await db.execute(
      `SELECT visitor_id, city, region, country, latitude, longitude, device_type, location_source, last_seen, ip_address
       FROM analytics_visitors
       WHERE latitude IS NOT NULL AND longitude IS NOT NULL
       ORDER BY last_seen DESC LIMIT ?`,
      [limit]
    );

    return new Response(JSON.stringify({ data: rows }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
