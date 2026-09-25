import db from "../../../lib/db.js";
import { getSessionAdmin, SESSION_COOKIE } from "../../../lib/auth.js";
import { ensureAdCampaignSchema, getAdminAdCampaigns } from "../../../lib/ad-campaigns.js";

export const prerender = false;

const RANGES = { "7d": 7, "30d": 30, "90d": 90, all: null };
const PROMO_PAGE = "SUBSTRING_INDEX(SUBSTRING_INDEX(page_url, '?', 1), '/', 3)";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sqlDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}

export async function GET({ cookies, url }) {
  try {
    const admin = await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
    if (!admin) return json({ message: "Unauthorized" }, 401);

    await ensureAdCampaignSchema();
    const campaigns = await getAdminAdCampaigns();
    const requestedId = url.searchParams.get("campaignId");
    const campaign = requestedId
      ? campaigns.find((item) => item.id === Number(requestedId))
      : campaigns.find((item) => item.status === "published") || campaigns[0];
    if (requestedId && !campaign) return json({ message: "Campaign tidak ditemukan" }, 404);
    if (!campaign) return json({ campaigns, campaign: null, summary: null, daily: [], cities: [], points: [], recentLeads: [] });

    const range = Object.hasOwn(RANGES, url.searchParams.get("range")) ? url.searchParams.get("range") : "30d";
    const since = RANGES[range] === null ? "2000-01-01 00:00:00" : sqlDate(new Date(Date.now() - RANGES[range] * 86400000));
    const page = `/promo/${campaign.slug}`;
    const eventWhere = `event_type = 'pageview' AND ${PROMO_PAGE} = ? AND created_at >= ?`;

    const [visitRows, dailyRows, cityRows, pointRows, leadRows, recentLeadRows, leadMapRows] = await Promise.all([
      db.execute(
        `SELECT COUNT(*) AS visits, COUNT(DISTINCT visitor_id) AS visitors,
                SUM(location_source = 'gps') AS gpsPageviews,
                SUM(latitude IS NULL OR longitude IS NULL) AS unlocatedVisits,
                SUM(ip_address IN ('127.0.0.1', '::1') OR ip_address LIKE '10.%' OR ip_address LIKE '192.168.%') AS privateIpVisits
         FROM analytics_events WHERE ${eventWhere}`,
        [page, since]
      ),
      db.execute(
        `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS date, COUNT(*) AS visits
         FROM analytics_events WHERE ${eventWhere}
         GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d') ORDER BY date DESC LIMIT 30`,
        [page, since]
      ),
      db.execute(
        `SELECT city, region, country, COUNT(DISTINCT visitor_id) AS visitors
         FROM analytics_events WHERE ${eventWhere} AND city != ''
         GROUP BY city, region, country ORDER BY visitors DESC LIMIT 8`,
        [page, since]
      ),
      db.execute(
        `SELECT e.latitude, e.longitude, e.location_source, e.city, e.region, e.country,
                e.created_at AS visited_at
         FROM analytics_events e
         JOIN (
           SELECT visitor_id, MAX(id) AS id FROM analytics_events
           WHERE ${eventWhere}
           GROUP BY visitor_id ORDER BY id DESC LIMIT 300
         ) latest ON latest.id = e.id
         WHERE e.latitude IS NOT NULL AND e.longitude IS NOT NULL`,
        [page, since]
      ),
      db.execute(
        `SELECT COUNT(*) AS leads FROM ad_campaign_leads
         WHERE ad_campaign_id = ? AND created_at >= ?`,
        [campaign.id, since]
      ),
      db.execute(
        `SELECT id, name, city, answers_json, created_at
         FROM ad_campaign_leads WHERE ad_campaign_id = ? AND created_at >= ?
         ORDER BY created_at DESC LIMIT 8`,
        [campaign.id, since]
      ),
      db.execute(
        `SELECT id, name, answers_json FROM ad_campaign_leads
         WHERE ad_campaign_id = ? AND created_at >= ?
           AND JSON_EXTRACT(answers_json, '$.gps_latitude') IS NOT NULL
         ORDER BY created_at DESC LIMIT 200`,
        [campaign.id, since]
      ),
    ]);

    const visits = Number(visitRows[0][0]?.visits || 0);
    const visitors = Number(visitRows[0][0]?.visitors || 0);
    const leads = Number(leadRows[0][0]?.leads || 0);
    return json({
      campaigns: campaigns.map(({ id, slug, title, status }) => ({ id, slug, title, status })),
      campaign: { id: campaign.id, slug: campaign.slug, title: campaign.title, status: campaign.status },
      range,
      summary: {
        visits,
        visitors,
        leads,
        conversion: visitors ? Math.round((leads / visitors) * 1000) / 10 : 0,
        gpsPageviews: Number(visitRows[0][0]?.gpsPageviews || 0),
        unlocatedVisits: Number(visitRows[0][0]?.unlocatedVisits || 0),
        privateIpVisits: Number(visitRows[0][0]?.privateIpVisits || 0),
      },
      daily: dailyRows[0].reverse().map((row) => ({ date: row.date, visits: Number(row.visits) })),
      cities: cityRows[0].map((row) => ({ ...row, visitors: Number(row.visitors) })),
      points: pointRows[0],
      leadPoints: leadMapRows[0].map((row) => {
        let answers = {};
        try { answers = JSON.parse(row.answers_json || "{}"); } catch { /* legacy answer */ }
        return { id: row.id, name: row.name, address: answers.address || "", latitude: Number(answers.gps_latitude), longitude: Number(answers.gps_longitude) };
      }).filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude) && Math.abs(point.latitude) <= 90 && Math.abs(point.longitude) <= 180),
      recentLeads: recentLeadRows[0].map((row) => {
        let answers = {};
        try { answers = JSON.parse(row.answers_json || "{}"); } catch { /* legacy answer */ }
        return { id: row.id, name: row.name, address: answers.address || "", city: row.city || "", createdAt: row.created_at };
      }),
    });
  } catch (err) {
    return json({ message: err.message || "Gagal memuat analisa iklan" }, 500);
  }
}
