import { getSessionAdmin, SESSION_COOKIE } from "../../../lib/auth.js";
import { ensureAdCampaignSchema, searchSppgDirectory, upsertSppgDirectory, deleteSppgDirectory } from "../../../lib/ad-campaigns.js";

export const prerender = false;
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
const authorized = async (cookies) => Boolean(await getSessionAdmin(cookies.get(SESSION_COOKIE)?.value));

export async function GET({ cookies, url }) {
  if (!await authorized(cookies)) return json({ message: "Unauthorized" }, 401);
  await ensureAdCampaignSchema();
  return json(await searchSppgDirectory(url.searchParams.get("q") || "", 100));
}

export async function POST({ cookies, request }) {
  if (!await authorized(cookies)) return json({ message: "Unauthorized" }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ message: "JSON tidak valid" }, 400); }
  const rows = body?.rows;
  if (!Array.isArray(rows) || !rows.length || rows.length > 5000) return json({ message: "Kirim 1 hingga 5000 data SPPG" }, 400);
  await ensureAdCampaignSchema();
  try {
    await upsertSppgDirectory(rows);
    return json({ ok: true, count: rows.length });
  } catch (error) {
    return json({ message: error.message || "Gagal menyimpan data SPPG" }, 400);
  }
}

export async function DELETE({ cookies, url }) {
  if (!await authorized(cookies)) return json({ message: "Unauthorized" }, 401);
  const id = Number(url.searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return json({ message: "ID tidak valid" }, 400);
  await ensureAdCampaignSchema();
  await deleteSppgDirectory(id);
  return json({ ok: true });
}
