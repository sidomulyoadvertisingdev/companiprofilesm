import db from "../../../lib/db.js";

export const prerender = false;

export async function POST({ request }) {
  try {
    const { visitorId, latitude, longitude } = await request.json();
    if (!visitorId || latitude == null || longitude == null) {
      return new Response(JSON.stringify({ message: "Missing data" }), { status: 400 });
    }

    await db.execute(
      `UPDATE analytics_visitors SET latitude = ?, longitude = ? WHERE visitor_id = ?`,
      [latitude, longitude, visitorId]
    );

    await db.execute(
      `UPDATE analytics_events SET latitude = ?, longitude = ?, location_source = 'gps' WHERE visitor_id = ? AND id = (SELECT id FROM (SELECT id FROM analytics_events WHERE visitor_id = ? ORDER BY id DESC LIMIT 1) AS tmp)`,
      [latitude, longitude, visitorId, visitorId]
    );

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
