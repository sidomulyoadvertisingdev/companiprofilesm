import db from "../../../lib/db.js";
import { getSessionAdmin, SESSION_COOKIE } from "../../../lib/auth.js";

export const prerender = false;

function rangeToDays(range) {
  switch (range) {
    case "7d": return 7;
    case "30d": return 30;
    case "90d": return 90;
    case "1y": return 365;
    default: return 30;
  }
}

export async function GET({ url, cookies }) {
  try {
    const admin = await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
    if (!admin) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const range = url.searchParams.get("range") || "30d";
    const days = rangeToDays(range);
    const now = new Date();
    const localDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    const since = localDate(new Date(now.getTime() - days * 86400000));

    const [[totalRow]] = await db.execute(
      `SELECT COUNT(*) as total FROM analytics_events WHERE event_type = 'pageview' AND created_at >= ?`, [since]
    );
    const [[uniqueRow]] = await db.execute(
      `SELECT COUNT(DISTINCT visitor_id) as total FROM analytics_events WHERE event_type = 'pageview' AND created_at >= ?`, [since]
    );
    const [[clicksRow]] = await db.execute(
      `SELECT COUNT(*) as total FROM analytics_events WHERE event_type = 'click' AND created_at >= ?`, [since]
    );

    const [dailyChart] = await db.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as visits
       FROM analytics_events WHERE event_type = 'pageview' AND created_at >= ?
       GROUP BY DATE(created_at) ORDER BY date ASC`, [since]
    );

    const [deviceBreakdown] = await db.execute(
      `SELECT device_type, COUNT(*) as count FROM analytics_events
       WHERE event_type = 'pageview' AND created_at >= ?
       GROUP BY device_type ORDER BY count DESC`, [since]
    );

    const [topPages] = await db.execute(
      `SELECT page_url, COUNT(*) as visits FROM analytics_events
       WHERE event_type = 'pageview' AND created_at >= ?
       GROUP BY page_url ORDER BY visits DESC LIMIT 10`, [since]
    );

    const [topClicks] = await db.execute(
      `SELECT element_target, element_text, COUNT(*) as clicks FROM analytics_events
       WHERE event_type = 'click' AND created_at >= ?
       GROUP BY element_target, element_text ORDER BY clicks DESC LIMIT 10`, [since]
    );

    const [topCities] = await db.execute(
      `SELECT city, region, country, COUNT(*) as count FROM analytics_visitors
       WHERE city != '' AND last_seen >= ?
       GROUP BY city, region, country ORDER BY count DESC LIMIT 10`, [since]
    );

    const [browserBreakdown] = await db.execute(
      `SELECT browser, COUNT(*) as count FROM analytics_events
       WHERE event_type = 'pageview' AND created_at >= ?
       GROUP BY browser ORDER BY count DESC`, [since]
    );

    const [osBreakdown] = await db.execute(
      `SELECT os, COUNT(*) as count FROM analytics_events
       WHERE event_type = 'pageview' AND created_at >= ?
       GROUP BY os ORDER BY count DESC`, [since]
    );

    const todayStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} 00:00:00`;
    const [[todayVisits]] = await db.execute(
      `SELECT COUNT(*) as total FROM analytics_events WHERE event_type = 'pageview' AND created_at >= ?`, [todayStart]
    );
    const [[todayClicks]] = await db.execute(
      `SELECT COUNT(*) as total FROM analytics_events WHERE event_type = 'click' AND created_at >= ?`, [todayStart]
    );

    return new Response(JSON.stringify({
      summary: {
        totalVisits: totalRow.total,
        uniqueVisitors: uniqueRow.total,
        totalClicks: clicksRow.total,
        avgPerDay: days > 0 ? Math.round(totalRow.total / days) : 0,
        todayVisits: todayVisits.total,
        todayClicks: todayClicks.total,
      },
      dailyChart: dailyChart.map((r) => ({ date: r.date, visits: r.visits })),
      deviceBreakdown: deviceBreakdown.map((r) => ({ name: r.device_type, value: r.count })),
      browserBreakdown: browserBreakdown.map((r) => ({ name: r.browser, value: r.count })),
      osBreakdown: osBreakdown.map((r) => ({ name: r.os, value: r.count })),
      topPages: topPages.map((r) => ({ page: r.page_url, visits: r.visits })),
      topClicks: topClicks.map((r) => ({ target: r.element_target, text: r.element_text, clicks: r.clicks })),
      topCities: topCities.map((r) => ({ city: r.city, region: r.region, country: r.country, count: r.count })),
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
