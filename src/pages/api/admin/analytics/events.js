import db from "../../../../lib/db.js";
import { getSessionAdmin, SESSION_COOKIE } from "../../../../lib/auth.js";

export const prerender = false;

export async function GET({ url, cookies }) {
  try {
    const admin = await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
    if (!admin) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const limit = String(Math.min(parseInt(url.searchParams.get("limit") || "50"), 200));
    const offset = String(parseInt(url.searchParams.get("offset") || "0"));
    const type = url.searchParams.get("type");

    const where = type ? "WHERE e.event_type = ?" : "";
    const params = type ? [type, limit, offset] : [limit, offset];

    const [rows] = await db.execute(
      `SELECT e.id, e.visitor_id, e.fingerprint, e.event_type, e.page_url, e.element_target, e.element_text,
              COALESCE(NULLIF(v.city, ''), e.city) AS city,
              COALESCE(NULLIF(v.region, ''), e.region) AS region,
              COALESCE(NULLIF(v.country, ''), e.country) AS country,
              e.device_type, e.browser, e.os, e.timezone, e.locale, e.ip_address, e.created_at
       FROM analytics_events e
       LEFT JOIN analytics_visitors v ON v.visitor_id = e.visitor_id
       ${where} ORDER BY e.created_at DESC LIMIT ? OFFSET ?`, params
    );

    const countWhere = type ? "WHERE event_type = ?" : "";
    const countParams = type ? [type] : [];
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) as total FROM analytics_events ${countWhere}`, countParams);

    return new Response(JSON.stringify({ data: rows, total }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
