import { ensureAdCampaignSchema, searchSppgDirectory } from "../../lib/ad-campaigns.js";

export const prerender = false;

export async function GET({ url }) {
  const q = (url.searchParams.get("q") || "").trim();
  if (q.length < 2) return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
  await ensureAdCampaignSchema();
  const rows = await searchSppgDirectory(q, 20);
  return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
}
