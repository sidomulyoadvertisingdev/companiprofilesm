import { getSessionAdmin, SESSION_COOKIE } from "../../../lib/auth.js";
import { getLandingPageLeads, getLandingPageLeadById, updateLandingPageLead } from "../../../lib/queries.js";

export const prerender = false;

// NOTE: GET requests under /api/admin/* are NOT gated by src/middleware.js
// (it only checks write methods). These records contain customer PII
// (WhatsApp numbers, addresses, etc.), so this route guards itself
// explicitly on every method rather than relying on the middleware.
async function requireAdmin({ cookies }) {
  const admin = await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
  return admin;
}

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

function toCsvValue(v) {
  if (v == null) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function leadsToCsv(leads) {
  const headers = [
    "id", "landing_page", "name", "whatsapp", "email", "city", "message",
    "status", "utm_source", "utm_medium", "utm_campaign", "answers", "admin_notes", "created_at",
  ];
  const lines = [headers.join(",")];
  for (const l of leads) {
    lines.push(
      [
        l.id, l.landingPageTitle || l.landingPageSlug || l.landingPageId,
        l.name, l.whatsapp, l.email, l.city, l.message,
        l.status, l.utmSource, l.utmMedium, l.utmCampaign,
        JSON.stringify(l.answers || {}), l.adminNotes, l.createdAt,
      ].map(toCsvValue).join(",")
    );
  }
  return lines.join("\n");
}

export async function GET({ url, cookies }) {
  const admin = await requireAdmin({ cookies });
  if (!admin) return json({ message: "Unauthorized" }, 401);

  try {
    const params = url.searchParams;
    const filters = {
      landingPageId: params.get("landingPageId") ? Number(params.get("landingPageId")) : undefined,
      status: params.get("status") || undefined,
      city: params.get("city") || undefined,
      q: params.get("q") || undefined,
      dateFrom: params.get("dateFrom") || undefined,
      dateTo: params.get("dateTo") || undefined,
      page: params.get("page") ? Number(params.get("page")) : 1,
      pageSize: params.get("pageSize") ? Number(params.get("pageSize")) : 20,
    };

    if (params.get("format") === "csv") {
      const result = await getLandingPageLeads({ ...filters, page: 1, pageSize: 5000 });
      const csv = leadsToCsv(result.data);
      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="landing-leads-${Date.now()}.csv"`,
        },
      });
    }

    const result = await getLandingPageLeads(filters);
    return json({ data: result.data, total: result.total, page: result.page, pageSize: result.pageSize, totalPages: result.totalPages });
  } catch (err) {
    console.error("[api/admin/landing-leads] GET error:", err.message);
    return json({ message: "Gagal memuat data leads" }, 500);
  }
}

export async function PUT({ request, url, cookies }) {
  const admin = await requireAdmin({ cookies });
  if (!admin) return json({ message: "Unauthorized" }, 401);

  try {
    const id = Number(url.searchParams.get("id"));
    if (!id) return json({ message: "id wajib" }, 400);
    const body = await request.json();
    const patch = {};
    if (body.status !== undefined) patch.status = body.status;
    if (body.adminNotes !== undefined) patch.adminNotes = body.adminNotes;
    await updateLandingPageLead(id, patch);
    const lead = await getLandingPageLeadById(id);
    return json({ data: lead });
  } catch (err) {
    console.error("[api/admin/landing-leads] PUT error:", err.message);
    return json({ message: "Gagal mengubah lead" }, 500);
  }
}
