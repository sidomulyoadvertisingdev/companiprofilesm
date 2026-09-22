import { getSessionAdmin, SESSION_COOKIE } from "../../../lib/auth.js";
import {
  ensureAdCampaignSchema,
  getAdCampaignLeads,
  updateAdCampaignLead,
} from "../../../lib/ad-campaigns.js";

export const prerender = false;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// These are customer PII records (WhatsApp numbers, addresses). GET is not
// covered by the middleware's write-only admin check, so every method here
// does its own explicit admin guard.
async function requireAdmin({ cookies }) {
  return getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
}

function csvEscape(value) {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows) {
  const headers = [
    "id",
    "campaign",
    "name",
    "whatsapp",
    "email",
    "city",
    "message",
    "status",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "admin_notes",
    "created_at",
  ];
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.campaignTitle,
        r.name,
        r.whatsapp,
        r.email,
        r.city,
        r.message,
        r.status,
        r.utmSource,
        r.utmMedium,
        r.utmCampaign,
        r.adminNotes,
        r.createdAt,
      ]
        .map(csvEscape)
        .join(",")
    );
  }
  return lines.join("\r\n");
}

export async function GET({ cookies, url }) {
  const admin = await requireAdmin({ cookies });
  if (!admin) return json({ message: "Unauthorized" }, 401);

  await ensureAdCampaignSchema();

  const params = url.searchParams;
  const filters = {
    adCampaignId: params.get("campaignId") ? Number(params.get("campaignId")) : undefined,
    status: params.get("status") || undefined,
    city: params.get("city") || undefined,
    q: params.get("q") || undefined,
    dateFrom: params.get("dateFrom") || undefined,
    dateTo: params.get("dateTo") || undefined,
    page: params.get("page") ? Number(params.get("page")) : 1,
    pageSize: params.get("pageSize") ? Number(params.get("pageSize")) : 20,
  };

  if (params.get("format") === "csv") {
    const result = await getAdCampaignLeads({ ...filters, page: 1, pageSize: 10000 });
    const csv = toCsv(result.items);
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ad-campaign-leads.csv"`,
      },
    });
  }

  const result = await getAdCampaignLeads(filters);
  return json(result);
}

export async function PUT({ cookies, request, url }) {
  const admin = await requireAdmin({ cookies });
  if (!admin) return json({ message: "Unauthorized" }, 401);

  await ensureAdCampaignSchema();

  const id = url.searchParams.get("id");
  if (!id) return json({ message: "id wajib diisi" }, 400);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ message: "Invalid JSON body" }, 400);
  }

  const lead = await updateAdCampaignLead(Number(id), {
    status: body.status,
    adminNotes: body.adminNotes,
  });
  if (!lead) return json({ message: "Not found" }, 404);
  return json(lead);
}
