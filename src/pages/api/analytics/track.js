import db from "../../../lib/db.js";
import { lookupIP, getClientIP } from "../../../lib/geo.js";
import { parseUA } from "../../../lib/ua-parser.js";

export const prerender = false;

export async function POST({ request }) {
  try {
    const b = await request.json();
    const { visitorId, fingerprint, eventType, pageUrl, elementTarget, elementText, screenWidth, screenHeight, timezone, locale } = b;
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
    const fingerprintClean = (fingerprint || "").slice(0, 64);
    const timezoneClean = (timezone || "").slice(0, 64);
    const localeClean = (locale || "").slice(0, 16);

    await db.execute(
      `INSERT INTO analytics_events (visitor_id, fingerprint, event_type, page_url, element_target, element_text, city, region, country, device_type, browser, os, screen_width, screen_height, timezone, locale, user_agent, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [visitorId, fingerprintClean, eventType, pageUrlClean, elementTargetClean, elementTextClean, geo.city, geo.region, geo.country, ua.deviceType, ua.browser, ua.os, screenWidth || null, screenHeight || null, timezoneClean, localeClean, userAgent, ip]
    );

    const isClick = eventType === "click" ? 1 : 0;
    const isVisit = eventType === "pageview" ? 1 : 0;
    await db.execute(
      `INSERT INTO analytics_visitors (visitor_id, fingerprint, total_visits, total_clicks, city, region, country, device_type, browser, os, latitude, longitude, location_source, ip_address, timezone, locale)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ip', ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         total_visits = total_visits + VALUES(total_visits),
         total_clicks = total_clicks + VALUES(total_clicks),
         fingerprint = IF(VALUES(fingerprint) != '', VALUES(fingerprint), fingerprint),
         city = IF(location_source = 'gps', city, IF(VALUES(city) != '', VALUES(city), city)),
         region = IF(location_source = 'gps', region, IF(VALUES(region) != '', VALUES(region), region)),
         country = IF(location_source = 'gps', country, IF(VALUES(country) != '', VALUES(country), country)),
         latitude = IF(location_source = 'gps', latitude, VALUES(latitude)),
         longitude = IF(location_source = 'gps', longitude, VALUES(longitude)),
         device_type = IF(VALUES(device_type) != 'unknown', VALUES(device_type), device_type),
         browser = IF(VALUES(browser) != 'Other', VALUES(browser), browser),
         os = IF(VALUES(os) != 'Other', VALUES(os), os),
         ip_address = IF(VALUES(ip_address) != '', VALUES(ip_address), ip_address),
         timezone = IF(VALUES(timezone) != '', VALUES(timezone), timezone),
         locale = IF(VALUES(locale) != '', VALUES(locale), locale)`,
      [visitorId, fingerprintClean, isVisit, isClick, geo.city, geo.region, geo.country, ua.deviceType, ua.browser, ua.os, geo.latitude, geo.longitude, ip, timezoneClean, localeClean]
    );

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
