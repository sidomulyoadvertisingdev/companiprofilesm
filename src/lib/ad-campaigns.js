import db from "./db.js";

// Standalone data-access module for the "ad campaigns" feature.
// Intentionally isolated from src/lib/schema.js and src/lib/queries.js —
// this feature owns its own tables and must not touch the shared
// landing_pages system.

const TABLES = [
  `CREATE TABLE IF NOT EXISTS ad_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    status ENUM('draft','published') NOT NULL DEFAULT 'draft',
    meta_title VARCHAR(255),
    meta_description TEXT,
    og_image VARCHAR(500),
    canonical_url VARCHAR(500),
    noindex TINYINT(1) NOT NULL DEFAULT 0,
    published_at DATETIME DEFAULT NULL,
    accent_color VARCHAR(20) DEFAULT '#0A4DA6',
    hero_eyebrow VARCHAR(160),
    hero_headline TEXT,
    hero_subtext TEXT,
    hero_image VARCHAR(500),
    hero_video VARCHAR(500),
    hero_badges_json TEXT,
    hero_trust_points_json TEXT,
    primary_cta_text VARCHAR(100),
    primary_cta_target VARCHAR(500),
    secondary_cta_text VARCHAR(100),
    secondary_cta_target VARCHAR(500),
    sections_json LONGTEXT,
    form_enabled TINYINT(1) NOT NULL DEFAULT 0,
    form_title VARCHAR(160),
    form_subtext TEXT,
    form_fields_json TEXT,
    cta_band_heading TEXT,
    cta_band_text TEXT,
    cta_band_badges_json TEXT,
    whatsapp_shortcut_text VARCHAR(160),
    page_settings_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS ad_campaign_leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_campaign_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(30) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    message TEXT,
    answers_json LONGTEXT,
    status ENUM('new','contacted','qualified','sample_approved','sample_sent','sample_received','follow_up','quotation','order','not_interested') NOT NULL DEFAULT 'new',
    utm_source VARCHAR(100), utm_medium VARCHAR(100), utm_campaign VARCHAR(100), utm_content VARCHAR(100), utm_term VARCHAR(100),
    referrer VARCHAR(500),
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ad_campaign_id) REFERENCES ad_campaigns(id) ON DELETE CASCADE,
    INDEX idx_status (status), INDEX idx_city (city), INDEX idx_created (created_at), INDEX idx_campaign (ad_campaign_id)
  )`,
];

// Additive, safe-default column check for deployments where ad_campaigns
// already exists (CREATE TABLE IF NOT EXISTS above won't retrofit new
// columns onto an existing table). Mirrors the ensureColumn-style pattern
// used elsewhere in this codebase for schema evolution.
async function ensureColumn(table, column, definition) {
  const [rows] = await db.execute(
    `SELECT COUNT(*) AS cnt FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [table, column]
  );
  if (!rows[0]?.cnt) {
    await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

export async function ensureAdCampaignSchema() {
  for (const sql of TABLES) {
    await db.execute(sql);
  }
  // New CTA/hero badge fields, added after the original schema shipped.
  await ensureColumn("ad_campaigns", "hero_trust_points_json", "TEXT DEFAULT NULL");
  await ensureColumn("ad_campaigns", "cta_band_badges_json", "TEXT DEFAULT NULL");
  // Background video for the full-screen hero.
  await ensureColumn("ad_campaigns", "hero_video", "VARCHAR(500) DEFAULT NULL");
  // Misc page copy that used to be hardcoded (headline highlight word,
  // footer tagline/keywords, CTA band button, form privacy note).
  await ensureColumn("ad_campaigns", "page_settings_json", "TEXT DEFAULT NULL");
}

function parseJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapAdCampaign(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogImage: row.og_image,
    canonicalUrl: row.canonical_url,
    noindex: !!row.noindex,
    publishedAt: row.published_at,
    accentColor: row.accent_color,
    heroEyebrow: row.hero_eyebrow,
    heroHeadline: row.hero_headline,
    heroSubtext: row.hero_subtext,
    heroImage: row.hero_image,
    heroVideo: row.hero_video,
    heroBadges: parseJson(row.hero_badges_json, []),
    heroTrustPoints: parseJson(row.hero_trust_points_json, []),
    primaryCtaText: row.primary_cta_text,
    primaryCtaTarget: row.primary_cta_target,
    secondaryCtaText: row.secondary_cta_text,
    secondaryCtaTarget: row.secondary_cta_target,
    sections: parseJson(row.sections_json, []),
    formEnabled: !!row.form_enabled,
    formTitle: row.form_title,
    formSubtext: row.form_subtext,
    formFields: parseJson(row.form_fields_json, []),
    ctaBandHeading: row.cta_band_heading,
    ctaBandText: row.cta_band_text,
    ctaBandBadges: parseJson(row.cta_band_badges_json, []),
    whatsappShortcutText: row.whatsapp_shortcut_text,
    pageSettings: parseJson(row.page_settings_json, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAdCampaignLead(row) {
  if (!row) return null;
  return {
    id: row.id,
    adCampaignId: row.ad_campaign_id,
    campaignSlug: row.campaign_slug || undefined,
    campaignTitle: row.campaign_title || undefined,
    name: row.name,
    whatsapp: row.whatsapp,
    email: row.email,
    city: row.city,
    message: row.message,
    answers: parseJson(row.answers_json, {}),
    status: row.status,
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    utmContent: row.utm_content,
    utmTerm: row.utm_term,
    referrer: row.referrer,
    adminNotes: row.admin_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getPublishedAdCampaigns() {
  const [rows] = await db.execute(
    `SELECT * FROM ad_campaigns WHERE status = 'published' AND (published_at IS NULL OR published_at <= NOW()) ORDER BY created_at DESC`
  );
  return rows.map(mapAdCampaign);
}

export async function getAdminAdCampaigns() {
  const [rows] = await db.execute(`SELECT * FROM ad_campaigns ORDER BY created_at DESC`);
  return rows.map(mapAdCampaign);
}

export async function getAdCampaignBySlug(slug) {
  const [rows] = await db.execute(
    `SELECT * FROM ad_campaigns WHERE slug = ? AND status = 'published' AND (published_at IS NULL OR published_at <= NOW()) LIMIT 1`,
    [slug]
  );
  return mapAdCampaign(rows[0]);
}

export async function getAdCampaignById(id) {
  const [rows] = await db.execute(`SELECT * FROM ad_campaigns WHERE id = ? LIMIT 1`, [id]);
  return mapAdCampaign(rows[0]);
}

export async function upsertAdCampaign(data) {
  const {
    id,
    slug,
    title,
    status = "draft",
    metaTitle = null,
    metaDescription = null,
    ogImage = null,
    canonicalUrl = null,
    noindex = false,
    publishedAt = null,
    accentColor = "#0A4DA6",
    heroEyebrow = null,
    heroHeadline = null,
    heroSubtext = null,
    heroImage = null,
    heroVideo = null,
    heroBadges = [],
    heroTrustPoints = [],
    primaryCtaText = null,
    primaryCtaTarget = null,
    secondaryCtaText = null,
    secondaryCtaTarget = null,
    sections = [],
    formEnabled = false,
    formTitle = null,
    formSubtext = null,
    formFields = [],
    ctaBandHeading = null,
    ctaBandText = null,
    ctaBandBadges = [],
    whatsappShortcutText = null,
    pageSettings = {},
  } = data;

  const params = [
    slug,
    title,
    status,
    metaTitle,
    metaDescription,
    ogImage,
    canonicalUrl,
    noindex ? 1 : 0,
    publishedAt,
    accentColor,
    heroEyebrow,
    heroHeadline,
    heroSubtext,
    heroImage,
    heroVideo,
    JSON.stringify(heroBadges || []),
    JSON.stringify(heroTrustPoints || []),
    primaryCtaText,
    primaryCtaTarget,
    secondaryCtaText,
    secondaryCtaTarget,
    JSON.stringify(sections || []),
    formEnabled ? 1 : 0,
    formTitle,
    formSubtext,
    JSON.stringify(formFields || []),
    ctaBandHeading,
    ctaBandText,
    JSON.stringify(ctaBandBadges || []),
    whatsappShortcutText,
    JSON.stringify(pageSettings || {}),
  ];

  if (id) {
    await db.execute(
      `UPDATE ad_campaigns SET
        slug=?, title=?, status=?, meta_title=?, meta_description=?, og_image=?, canonical_url=?,
        noindex=?, published_at=?, accent_color=?, hero_eyebrow=?, hero_headline=?, hero_subtext=?,
        hero_image=?, hero_video=?, hero_badges_json=?, hero_trust_points_json=?, primary_cta_text=?, primary_cta_target=?,
        secondary_cta_text=?, secondary_cta_target=?, sections_json=?, form_enabled=?, form_title=?,
        form_subtext=?, form_fields_json=?, cta_band_heading=?, cta_band_text=?, cta_band_badges_json=?,
        whatsapp_shortcut_text=?, page_settings_json=?
       WHERE id = ?`,
      [...params, id]
    );
    return getAdCampaignById(id);
  }

  const [result] = await db.execute(
    `INSERT INTO ad_campaigns
      (slug, title, status, meta_title, meta_description, og_image, canonical_url, noindex,
       published_at, accent_color, hero_eyebrow, hero_headline, hero_subtext, hero_image, hero_video,
       hero_badges_json, hero_trust_points_json, primary_cta_text, primary_cta_target, secondary_cta_text,
       secondary_cta_target, sections_json, form_enabled, form_title, form_subtext,
       form_fields_json, cta_band_heading, cta_band_text, cta_band_badges_json, whatsapp_shortcut_text, page_settings_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    params
  );
  return getAdCampaignById(result.insertId);
}

export async function deleteAdCampaign(id) {
  await db.execute(`DELETE FROM ad_campaigns WHERE id = ?`, [id]);
}

export async function createAdCampaignLead(data) {
  const {
    adCampaignId,
    name,
    whatsapp,
    email = null,
    city = null,
    message = null,
    answers = {},
    utmSource = null,
    utmMedium = null,
    utmCampaign = null,
    utmContent = null,
    utmTerm = null,
    referrer = null,
  } = data;

  const [result] = await db.execute(
    `INSERT INTO ad_campaign_leads
      (ad_campaign_id, name, whatsapp, email, city, message, answers_json,
       utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      adCampaignId,
      name,
      whatsapp,
      email,
      city,
      message,
      JSON.stringify(answers || {}),
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      referrer,
    ]
  );
  return getAdCampaignLeadById(result.insertId);
}

export async function getAdCampaignLeads({
  adCampaignId,
  status,
  city,
  q,
  dateFrom,
  dateTo,
  page = 1,
  pageSize = 20,
} = {}) {
  const where = [];
  const params = [];

  if (adCampaignId) {
    where.push("l.ad_campaign_id = ?");
    params.push(adCampaignId);
  }
  if (status) {
    where.push("l.status = ?");
    params.push(status);
  }
  if (city) {
    where.push("l.city = ?");
    params.push(city);
  }
  if (q) {
    where.push("(l.name LIKE ? OR l.whatsapp LIKE ? OR l.email LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (dateFrom) {
    where.push("l.created_at >= ?");
    params.push(dateFrom);
  }
  if (dateTo) {
    where.push("l.created_at <= ?");
    params.push(dateTo);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const safePageSize = Math.min(Math.max(Number(pageSize) || 20, 1), 200);
  const safePage = Math.max(Number(page) || 1, 1);
  const offset = (safePage - 1) * safePageSize;

  const [countRows] = await db.execute(
    `SELECT COUNT(*) AS total FROM ad_campaign_leads l ${whereSql}`,
    params
  );
  const total = countRows[0]?.total || 0;

  // mysql2's prepared-statement protocol (db.execute) is known to reject `?`
  // placeholders for LIMIT/OFFSET on many server versions ("Incorrect
  // arguments to mysqld_stmt_execute"). safePageSize/offset are already
  // clamped, server-computed integers (not raw user input), so inlining
  // them directly is the standard, safe workaround — no injection risk.
  const [rows] = await db.execute(
    `SELECT l.*, c.slug AS campaign_slug, c.title AS campaign_title
     FROM ad_campaign_leads l
     JOIN ad_campaigns c ON c.id = l.ad_campaign_id
     ${whereSql}
     ORDER BY l.created_at DESC
     LIMIT ${safePageSize} OFFSET ${offset}`,
    params
  );

  return {
    items: rows.map(mapAdCampaignLead),
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.max(Math.ceil(total / safePageSize), 1),
  };
}

export async function getAdCampaignLeadById(id) {
  const [rows] = await db.execute(
    `SELECT l.*, c.slug AS campaign_slug, c.title AS campaign_title
     FROM ad_campaign_leads l
     JOIN ad_campaigns c ON c.id = l.ad_campaign_id
     WHERE l.id = ? LIMIT 1`,
    [id]
  );
  return mapAdCampaignLead(rows[0]);
}

export async function updateAdCampaignLead(id, { status, adminNotes } = {}) {
  const sets = [];
  const params = [];
  if (status !== undefined) {
    sets.push("status = ?");
    params.push(status);
  }
  if (adminNotes !== undefined) {
    sets.push("admin_notes = ?");
    params.push(adminNotes);
  }
  if (!sets.length) return getAdCampaignLeadById(id);
  params.push(id);
  await db.execute(`UPDATE ad_campaign_leads SET ${sets.join(", ")} WHERE id = ?`, params);
  return getAdCampaignLeadById(id);
}

export { mapAdCampaign, mapAdCampaignLead };
