import db from "../../../lib/db.js";
import { reverseGeocode } from "../../../lib/geo.js";

export const prerender = false;

export async function POST({ request }) {
  try {
    const { visitorId, latitude, longitude } = await request.json();
    if (!visitorId || latitude == null || longitude == null) {
      return new Response(JSON.stringify({ message: "Missing data" }), { status: 400 });
    }

    // Derive an accurate city/region/country from the device GPS coordinates.
    const geo = await reverseGeocode(latitude, longitude);

    await db.execute(
      `UPDATE analytics_visitors
       SET latitude = ?, longitude = ?, city = ?, region = ?, country = ?, location_source = 'gps'
       WHERE visitor_id = ?`,
      [latitude, longitude, geo.city, geo.region, geo.country, visitorId]
    );

    await db.execute(
      `UPDATE analytics_events SET latitude = ?, longitude = ?, location_source = 'gps' WHERE visitor_id = ? AND id = (SELECT id FROM (SELECT id FROM analytics_events WHERE visitor_id = ? ORDER BY id DESC LIMIT 1) AS tmp)`,
      [latitude, longitude, visitorId, visitorId]
    );

    return new Response(JSON.stringify({ ok: true, geo }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
