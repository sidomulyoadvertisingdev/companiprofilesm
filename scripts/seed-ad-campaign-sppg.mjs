// Seeds the "Free Sample Label Ompreng SPPG" ad campaign.
// Mirrors the env/db-loading convention of scripts/seed.mjs (imports the
// pool from src/lib/db.js, which loads dotenv), but targets the standalone
// ad_campaigns / ad_campaign_leads tables owned by src/lib/ad-campaigns.js.
// The campaign content itself lives in scripts/lib/sppg-campaign.mjs.
import db from "../src/lib/db.js";
import { ensureAdCampaignSchema } from "../src/lib/ad-campaigns.js";
import { SLUG, WHATSAPP_NUMBER, sppgCampaign, upsertCampaignRow } from "./lib/sppg-campaign.mjs";

await ensureAdCampaignSchema();

await upsertCampaignRow(db, sppgCampaign());

console.log(`URL: /promo/${SLUG}`);
console.log(`Placeholder WhatsApp number used: ${WHATSAPP_NUMBER} — replace via /admin/campaigns before going live.`);

process.exit(0);
