import {
  ensureAdCampaignSchema,
  getAdCampaignBySlug,
  createAdCampaignLead,
} from "../../lib/ad-campaigns.js";
import { rateLimit } from "../../lib/rate-limiter.js";
import { cleanHtml } from "../../lib/sanitize.js";

export const prerender = false;

const PHONE_RE = /^(\+?62|0)8[0-9]{7,12}$/;

function stripTags(value) {
  if (value == null) return null;
  const str = String(value).trim();
  if (!str) return null;
  // These are plain-text answers, not rich content: strip all HTML entirely.
  return cleanHtml(str).replace(/<[^>]*>/g, "").trim() || null;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request, clientAddress }) {
  await ensureAdCampaignSchema();

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ message: "Invalid JSON body" }, 400);
  }

  const campaignSlug = typeof body.campaignSlug === "string" ? body.campaignSlug.trim() : "";
  if (!campaignSlug) {
    return json({ message: "campaignSlug wajib diisi" }, 400);
  }

  const campaign = await getAdCampaignBySlug(campaignSlug);
  if (!campaign) {
    return json({ message: "Campaign tidak ditemukan" }, 404);
  }

  let ip = "unknown";
  try {
    ip = clientAddress || request.headers.get("x-forwarded-for") || "unknown";
  } catch {
    ip = request.headers.get("x-forwarded-for") || "unknown";
  }
  const rl = await rateLimit(`ad-campaign-lead:${ip}:${campaignSlug}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    return json({ message: "Terlalu banyak permintaan, coba lagi nanti." }, 429);
  }

  const name = stripTags(body.name);
  if (!name) {
    return json({ message: "Nama wajib diisi" }, 400);
  }

  const rawWhatsapp = typeof body.whatsapp === "string" ? body.whatsapp.replace(/[\s-]/g, "") : "";
  if (!PHONE_RE.test(rawWhatsapp)) {
    return json({ message: "Nomor WhatsApp tidak valid" }, 400);
  }

  const email = stripTags(body.email);
  const city = stripTags(body.city);
  const message = stripTags(body.message);
  const referrer = stripTags(body.referrer);
  const utmSource = stripTags(body.utmSource);
  const utmMedium = stripTags(body.utmMedium);
  const utmCampaign = stripTags(body.utmCampaign);
  const utmContent = stripTags(body.utmContent);
  const utmTerm = stripTags(body.utmTerm);

  let answers = {};
  if (body.answers && typeof body.answers === "object" && !Array.isArray(body.answers)) {
    for (const [key, value] of Object.entries(body.answers)) {
      const clean = stripTags(value);
      if (clean !== null) answers[String(key).slice(0, 100)] = clean;
    }
  }

  const lead = await createAdCampaignLead({
    adCampaignId: campaign.id,
    name,
    whatsapp: rawWhatsapp,
    email,
    city,
    message,
    answers,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    referrer,
  });

  return json(
    { ok: true, id: lead.id, secondaryCtaTarget: campaign.secondaryCtaTarget || null },
    201
  );
}
