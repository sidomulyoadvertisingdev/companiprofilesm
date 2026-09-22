// Dedicated dynamic sitemap for the standalone ad-campaigns feature.
//
// Why this exists: @astrojs/sitemap (wired up in astro.config.mjs) only
// scans prerendered/static routes at build time. /promo/[slug] pages are
// `prerender = false` (SSR, driven by the ad_campaigns table), so they are
// silently absent from the generated sitemap-index.xml — search engines
// would never discover them via the sitemap. This route fills that gap by
// building a standards-compliant sitemap at request time from the live DB,
// and is referenced as a second `Sitemap:` line in public/robots.txt
// (the sitemap protocol explicitly allows listing multiple sitemaps).
import { ensureAdCampaignSchema, getPublishedAdCampaigns } from "../lib/ad-campaigns.js";

export const prerender = false;

function escapeXml(str) {
  return String(str || "").replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

export async function GET({ url }) {
  await ensureAdCampaignSchema();
  const campaigns = await getPublishedAdCampaigns();
  const origin = url.origin;

  const entries = campaigns
    // Respect the per-campaign noindex toggle — a campaign an admin marked
    // noindex shouldn't be advertised via the sitemap either.
    .filter((c) => !c.noindex && c.slug)
    .map((c) => {
      const loc = `${origin}/promo/${encodeURIComponent(c.slug)}`;
      const lastmodDate = c.updatedAt || c.createdAt;
      const lastmod = lastmodDate ? new Date(lastmodDate).toISOString() : new Date().toISOString();
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
