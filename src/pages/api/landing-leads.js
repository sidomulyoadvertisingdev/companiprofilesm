// Public lead-submission endpoint for any CMS-driven landing page (/lp/[slug]).
// Generalized: works for any campaign's dynamic form_fields_json, not just SPPG.
import { getLandingPageBySlug, createLandingPageLead } from "../../lib/queries.js";
import { rateLimit } from "../../lib/rate-limiter.js";
import { cleanHtml } from "../../lib/sanitize.js";

export const prerender = false;

const PHONE_RE = /^(\+?62|0)8[0-9]{7,12}$/;

// Free-text fields are plain text, not HTML — strip tags entirely rather than
// allowing "safe" HTML like the rich-text CMS fields do.
function stripText(v, maxLen = 2000) {
  if (v == null) return "";
  const s = cleanHtml(String(v)).replace(/<[^>]*>/g, "").trim();
  return s.slice(0, maxLen);
}

function getClientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST({ request }) {
  try {
    const body = await request.json().catch(() => ({}));
    const landingPageSlug = stripText(body.landingPageSlug, 255);
    if (!landingPageSlug) {
      return json({ message: "landingPageSlug wajib" }, 400);
    }

    const ip = getClientIp(request);
    const rl = await rateLimit(`landing-lead:${ip}:${landingPageSlug}`, 5, 10 * 60 * 1000);
    if (!rl.allowed) {
      return json({ message: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi." }, 429);
    }

    const page = await getLandingPageBySlug(landingPageSlug);
    if (!page) {
      return json({ message: "Landing page tidak ditemukan" }, 404);
    }

    // The dynamic form may name its "identity" field differently per campaign
    // (e.g. SPPG uses `name_sppg` as the org name, mapped to the `name` column).
    // Callers should already send normalized keys: name, whatsapp, email, city,
    // plus any other answers under `answers`.
    const name = stripText(body.name, 255);
    const rawWhatsapp = stripText(body.whatsapp, 30).replace(/[\s-]/g, "");
    const email = body.email ? stripText(body.email, 255) : "";
    const city = body.city ? stripText(body.city, 100) : "";
    const message = body.message ? stripText(body.message, 2000) : "";

    if (!name) return json({ message: "Nama wajib diisi" }, 400);
    if (!rawWhatsapp || !PHONE_RE.test(rawWhatsapp)) {
      return json({ message: "Nomor WhatsApp tidak valid" }, 400);
    }

    const answers = {};
    if (body.answers && typeof body.answers === "object") {
      for (const [k, v] of Object.entries(body.answers)) {
        if (v == null) continue;
        answers[stripText(k, 100)] = Array.isArray(v)
          ? v.map((x) => stripText(x, 500))
          : stripText(v, 2000);
      }
    }

    const leadId = await createLandingPageLead({
      landingPageId: page.id,
      name,
      whatsapp: rawWhatsapp,
      email,
      city,
      message,
      answers,
      source: landingPageSlug,
      utmSource: stripText(body.utmSource, 100),
      utmMedium: stripText(body.utmMedium, 100),
      utmCampaign: stripText(body.utmCampaign, 100),
      utmContent: stripText(body.utmContent, 100),
      utmTerm: stripText(body.utmTerm, 100),
      referrer: stripText(body.referrer, 500),
    });

    return json(
      {
        ok: true,
        id: leadId,
        name,
        whatsapp: rawWhatsapp,
        secondaryCtaTarget: page.secondaryCtaTarget || "",
      },
      201
    );
  } catch (err) {
    console.error("[api/landing-leads] POST error:", err.message);
    return json({ message: "Gagal mengirim data. Silakan coba lagi." }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
