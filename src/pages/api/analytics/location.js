import db from "../../../lib/db.js";
import { reverseGeocode } from "../../../lib/geo.js";

export const prerender = false;

export async function POST({ request }) {
  try {
    const { visitorId, pageUrl, latitude, longitude } = await request.json();
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!visitorId || !pageUrl || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return new Response(JSON.stringify({ message: "Missing data" }), { status: 400 });
    }

    // Derive an accurate city/region/country from the device GPS coordinates.
    const geo = await reverseGeocode(lat, lng);

    await db.execute(
      `UPDATE analytics_visitors
       SET latitude = ?, longitude = ?, city = ?, region = ?, country = ?, location_source = 'gps'
       WHERE visitor_id = ?`,
      [lat, lng, geo.city, geo.region, geo.country, visitorId]
    );

    await db.execute(
      `UPDATE analytics_events
       SET latitude = ?, longitude = ?, location_source = 'gps', city = ?, region = ?, country = ?
       WHERE visitor_id = ? AND page_url = ? AND created_at >= NOW() - INTERVAL 5 MINUTE`,
      [lat, lng, geo.city, geo.region, geo.country, visitorId, String(pageUrl).slice(0, 500)]
    );

    return new Response(JSON.stringify({ ok: true, geo }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
