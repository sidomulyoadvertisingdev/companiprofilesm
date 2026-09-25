import {
  ensureAdCampaignSchema,
  getAdCampaignBySlug,
  createAdCampaignLead,
  getSppgById,
  getSppgByName,
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

// Pulls the raw phone number out of a wa.me / api.whatsapp.com link (the
// hero secondary CTA target an admin pastes in) so we can build a fresh,
// lead-specific prefilled message rather than reusing the generic CTA text.
function extractWaPhone(target) {
  if (!target) return null;
  const m = String(target).match(/wa\.me\/(\d+)|[?&]phone=(\d+)/);
  return m ? m[1] || m[2] : null;
}

// The page shows a "Ketik: SAMPLE SPPG" style hint elsewhere; reuse that
// same keyword here (if set) so the admin can spot/search follow-up chats
// consistently, instead of hardcoding "SAMPLE SPPG" for every campaign.
function extractShortcutKeyword(text) {
  if (!text) return null;
  const m = String(text).match(/ketik\s*:?\s*(.+)/i);
  return (m ? m[1] : text).trim() || null;
}

function buildFollowUpWhatsappUrl(campaign, leadName) {
  const phone = extractWaPhone(campaign.secondaryCtaTarget);
  if (!phone) return null;
  const keyword = extractShortcutKeyword(campaign.whatsappShortcutText);
  const parts = [];
  if (keyword) parts.push(keyword);
  parts.push(
    `Halo, saya ${leadName} sudah mengisi form request sample untuk "${campaign.title}". Mohon segera di-follow up ya, terima kasih.`
  );
  return `https://wa.me/${phone}?text=${encodeURIComponent(parts.join(" - "))}`;
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

  const isConfigurator = body.source === "product_configurator";
  const rawWhatsapp = typeof body.whatsapp === "string" ? body.whatsapp.replace(/[\s-]/g, "") : "";
  if ((!isConfigurator || rawWhatsapp) && !PHONE_RE.test(rawWhatsapp)) {
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
  if (isConfigurator && !answers.address) {
    return json({ message: "Alamat SPPG wajib diisi" }, 400);
  }
  if (isConfigurator) {
    const sppgId = Number(body.sppgId);
    const sppg = Number.isInteger(sppgId) && sppgId > 0 ? await getSppgById(sppgId) : null;
    if (body.manualSppg === true) {
      if (name.length < 2 || name.length > 255) return json({ message: "Nama SPPG harus 2–255 karakter" }, 400);
      if (await getSppgByName(name)) return json({ message: "Nama SPPG sudah terdaftar. Pilih dari daftar." }, 400);
      if (!["manual", "maps"].includes(answers.address_source)) return json({ message: "Pilih sumber alamat yang valid" }, 400);
      answers.sppg_status = "Belum terdaftar";
    } else {
      if (!sppg || sppg.name !== name) return json({ message: "Pilih nama SPPG dari daftar atau gunakan opsi belum terdaftar" }, 400);
      if (!["database", "manual", "maps"].includes(answers.address_source)) return json({ message: "Sumber alamat tidak valid" }, 400);
      if (answers.address_source === "database") answers.address = sppg.address;
      answers.sppg_id = String(sppg.id);
      answers.registered_address = sppg.address;
      answers.sppg_status = "Terdaftar";
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
    {
      ok: true,
      id: lead.id,
      secondaryCtaTarget: campaign.secondaryCtaTarget || null,
      whatsappUrl: buildFollowUpWhatsappUrl(campaign, name),
    },
    201
  );
}
