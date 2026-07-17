import db from "../../../lib/db.js";
import { lookupIP, getClientIP } from "../../../lib/geo.js";
import { parseUA } from "../../../lib/ua-parser.js";

export const prerender = false;

export async function POST({ request }) {
  try {
    const b = await request.json();
    const { visitorId, eventType, pageUrl, elementTarget, elementText, screenWidth, screenHeight } = b;
    if (!visitorId || !eventType) {
      return new Response(JSON.stringify({ message: "Missing visitorId or eventType" }), { status: 400 });
    }

    const ip = getClientIP(request);
    const ua = parseUA(request.headers.get("user-agent"));
    const geo = await lookupIP(ip);

    const pageUrlClean = (pageUrl || "").slice(0, 500);
    const elementTargetClean = (elementTarget || "").slice(0, 200);
    const elementTextClean = (elementText || "").slice(0, 200);
    const userAgent = (request.headers.get("user-agent") || "").slice(0, 500);

    await db.execute(
      `INSERT INTO analytics_events (visitor_id, event_type, page_url, element_target, element_text, city, region, country, device_type, browser, os, screen_width, screen_height, user_agent, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [visitorId, eventType, pageUrlClean, elementTargetClean, elementTextClean, geo.city, geo.region, geo.country, ua.deviceType, ua.browser, ua.os, screenWidth || null, screenHeight || null, userAgent, ip]
    );

    const isClick = eventType === "click" ? 1 : 0;
    const isVisit = eventType === "pageview" ? 1 : 0;
    await db.execute(
      `INSERT INTO analytics_visitors (visitor_id, total_visits, total_clicks, city, region, country, device_type, browser, os, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         total_visits = total_visits + VALUES(total_visits),
         total_clicks = total_clicks + VALUES(total_clicks),
         city = IF(VALUES(city) != '', VALUES(city), city),
         region = IF(VALUES(region) != '', VALUES(region), region),
         country = IF(VALUES(country) != '', VALUES(country), country),
         device_type = IF(VALUES(device_type) != 'unknown', VALUES(device_type), device_type),
         browser = IF(VALUES(browser) != 'Other', VALUES(browser), browser),
         os = IF(VALUES(os) != 'Other', VALUES(os), os)`,
      [visitorId, isVisit, isClick, geo.city, geo.region, geo.country, ua.deviceType, ua.browser, ua.os, geo.latitude, geo.longitude]
    );

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
