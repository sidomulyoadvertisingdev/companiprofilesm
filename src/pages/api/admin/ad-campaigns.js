import { getSessionAdmin, SESSION_COOKIE } from "../../../lib/auth.js";
import {
  ensureAdCampaignSchema,
  getAdminAdCampaigns,
  getAdCampaignById,
  upsertAdCampaign,
  deleteAdCampaign,
} from "../../../lib/ad-campaigns.js";

export const prerender = false;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// GET is not covered by the middleware's write-only admin check, so every
// method here does its own explicit admin guard.
async function requireAdmin({ cookies }) {
  const admin = await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value);
  return admin;
}

export async function GET({ cookies, url }) {
  const admin = await requireAdmin({ cookies });
  if (!admin) return json({ message: "Unauthorized" }, 401);

  await ensureAdCampaignSchema();

  const id = url.searchParams.get("id");
  if (id) {
    const campaign = await getAdCampaignById(Number(id));
    if (!campaign) return json({ message: "Not found" }, 404);
    return json(campaign);
  }

  const campaigns = await getAdminAdCampaigns();
  return json(campaigns);
}

export async function POST({ cookies, request }) {
  const admin = await requireAdmin({ cookies });
  if (!admin) return json({ message: "Unauthorized" }, 401);

  await ensureAdCampaignSchema();

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ message: "Invalid JSON body" }, 400);
  }

  if (!body.slug || !body.title) {
    return json({ message: "slug dan title wajib diisi" }, 400);
  }

  try {
    const campaign = await upsertAdCampaign(body);
    return json(campaign, 201);
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      return json({ message: "Slug sudah digunakan" }, 409);
    }
    return json({ message: err.message || "Gagal menyimpan campaign" }, 500);
  }
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

  const existing = await getAdCampaignById(Number(id));
  if (!existing) return json({ message: "Not found" }, 404);

  try {
    const campaign = await upsertAdCampaign({ ...body, id: Number(id) });
    return json(campaign);
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      return json({ message: "Slug sudah digunakan" }, 409);
    }
    return json({ message: err.message || "Gagal menyimpan campaign" }, 500);
  }
}

export async function DELETE({ cookies, url }) {
  const admin = await requireAdmin({ cookies });
  if (!admin) return json({ message: "Unauthorized" }, 401);

  await ensureAdCampaignSchema();

  const id = url.searchParams.get("id");
  if (!id) return json({ message: "id wajib diisi" }, 400);

  await deleteAdCampaign(Number(id));
  return json({ ok: true });
}
