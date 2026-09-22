// Server-side read access to the database (used during SSR).
import db from "./db.js";

// mysql2 returns JSON columns already parsed; guard both cases.
function parseTags(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v) {
    try { return JSON.parse(v); } catch { return []; }
  }
  return [];
}

export async function getSite() {
  const [rows] = await db.execute("SELECT * FROM site_config WHERE id = 1");
  const r = rows[0];
  if (!r) return null;
  return {
    name: r.name, shortName: r.short_name, tagline: r.tagline, description: r.description,
    address: { street: r.address_street, city: r.address_city, region: r.address_region, postalCode: r.address_postal_code, country: r.address_country },
    geo: { latitude: r.geo_lat, longitude: r.geo_lng },
    phone: r.phone, phoneDisplay: r.phone_display, email: r.email,
    operationalHours: r.operational_hours, mapsUrl: r.maps_url, mapsEmbed: r.maps_embed,
    logo: r.logo, heroImage: r.hero_image,
    social: JSON.parse(r.social_json || "[]"),
    serviceArea: JSON.parse(r.service_area_json || "[]"),
    footerLinks: JSON.parse(r.footer_links_json || "[]"),
    navMenu: JSON.parse(r.nav_json || "[]"),
    copyrightText: r.copyright_text || "All rights reserved.",
  };
}

export async function getServices() {
  const [rows] = await db.execute("SELECT id, slug, title, icon, image, short_desc, long_desc, features_json, `order` FROM services ORDER BY `order` ASC, id ASC");
  return rows.map((r) => ({ id: r.id, slug: r.slug, title: r.title, icon: r.icon, image: r.image, shortDesc: r.short_desc, longDesc: r.long_desc, features: JSON.parse(r.features_json || "[]"), order: r.order }));
}

export async function getService(slug) {
  const [rows] = await db.execute("SELECT * FROM services WHERE slug = ?", [slug]);
  const r = rows[0];
  if (!r) return null;
  return { id: r.id, slug: r.slug, title: r.title, icon: r.icon, image: r.image, shortDesc: r.short_desc, longDesc: r.long_desc, features: JSON.parse(r.features_json || "[]"), order: r.order };
}

export async function getProducts() {
  const [rows] = await db.execute("SELECT id, slug, title, category, price_text, image, short_desc, long_desc, `order` FROM products ORDER BY `order` ASC, id ASC");
  return rows.map((r) => ({ id: r.id, slug: r.slug, title: r.title, category: r.category, priceText: r.price_text, image: r.image, shortDesc: r.short_desc, longDesc: r.long_desc, order: r.order }));
}

export async function getPortfolio() {
  const [rows] = await db.execute("SELECT id, title, category, client, year, image, description, `order` FROM portfolio ORDER BY `order` ASC, id ASC");
  return rows.map((r) => ({ id: r.id, title: r.title, category: r.category, client: r.client, year: r.year, image: r.image, description: r.description, order: r.order }));
}

export async function getPortfolioItem(id) {
  const [rows] = await db.execute("SELECT * FROM portfolio WHERE id = ?", [id]);
  const r = rows[0];
  if (!r) return null;
  return { id: r.id, title: r.title, category: r.category, client: r.client, year: r.year, image: r.image, description: r.description, order: r.order };
}

export async function getPartners() {
  const [rows] = await db.execute("SELECT id, name, logo, website, `order` FROM partners ORDER BY `order` ASC, id ASC");
  return rows.map((r) => ({ id: r.id, name: r.name, logo: r.logo, website: r.website, order: r.order }));
}

export async function getTestimonials() {
  const [rows] = await db.execute("SELECT id, name, role, company, quote, avatar, `order` FROM testimonials ORDER BY `order` ASC, id ASC");
  return rows.map((r) => ({ id: r.id, name: r.name, role: r.role, company: r.company, quote: r.quote, avatar: r.avatar, order: r.order }));
}

export async function getStats() {
  const [[sv]] = await db.execute("SELECT COUNT(*) AS c FROM services");
  const [[pf]] = await db.execute("SELECT COUNT(*) AS c FROM portfolio");
  const [[pt]] = await db.execute("SELECT COUNT(*) AS c FROM partners");
  return [
    { id: 1, label: "Layanan", value: sv.c, suffix: "+" },
    { id: 2, label: "Proyek Selesai", value: pf.c, suffix: "+" },
    { id: 3, label: "Mitra & Klien", value: pt.c, suffix: "+" },
    { id: 4, label: "Kota Terjangkau", value: 15, suffix: "+" },
  ];
}

export async function getNav() {
  const [rows] = await db.execute("SELECT nav_json FROM site_config WHERE id = 1");
  const r = rows[0];
  if (r && r.nav_json) {
    try {
      const parsed = JSON.parse(r.nav_json);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  return [
    { name: "Beranda", path: "/" },
    { name: "Layanan", path: "/services" },
    { name: "Portofolio", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
    { name: "Tentang Kami", path: "/about" },
    { name: "Kontak", path: "/contact" },
  ];
}


export async function getPosts() {
  const [rows] = await db.execute("SELECT id, title, slug, excerpt, featured_image, tags_json, meta_title, meta_description, status, author, created_at, updated_at FROM posts ORDER BY created_at DESC");
  return rows.map((r) => ({
    id: r.id, title: r.title, slug: r.slug, excerpt: r.excerpt,
      featuredImage: r.featured_image, tags: parseTags(r.tags_json),
    metaTitle: r.meta_title, metaDescription: r.meta_description,
    status: r.status, author: r.author,
    createdAt: r.created_at, updatedAt: r.updated_at,
  }));
}

export async function getPublishedPosts() {
  const [rows] = await db.execute("SELECT id, title, slug, excerpt, featured_image, tags_json, meta_title, meta_description, status, author, created_at, updated_at FROM posts WHERE status = 'published' ORDER BY created_at DESC");
  return rows.map((r) => ({
    id: r.id, title: r.title, slug: r.slug, excerpt: r.excerpt,
      featuredImage: r.featured_image, tags: parseTags(r.tags_json),
    metaTitle: r.meta_title, metaDescription: r.meta_description,
    status: r.status, author: r.author,
    createdAt: r.created_at, updatedAt: r.updated_at,
  }));
}

export async function getPost(id) {
  const [rows] = await db.execute("SELECT * FROM posts WHERE id = ?", [id]);
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.id, title: r.title, slug: r.slug, excerpt: r.excerpt, content: r.content,
      featuredImage: r.featured_image, tags: parseTags(r.tags_json),
    metaTitle: r.meta_title, metaDescription: r.meta_description,
    status: r.status, author: r.author,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export async function getPostBySlug(slug) {
  const [rows] = await db.execute("SELECT * FROM posts WHERE slug = ?", [slug]);
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.id, title: r.title, slug: r.slug, excerpt: r.excerpt, content: r.content,
      featuredImage: r.featured_image, tags: parseTags(r.tags_json),
    metaTitle: r.meta_title, metaDescription: r.meta_description,
    status: r.status, author: r.author,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function mapLandingPage(r) {
  if (!r) return null;
  return {
    id: r.id, slug: r.slug, title: r.title,
    metaTitle: r.meta_title, metaDescription: r.meta_description,
    badgeText: r.badge_text,
    heroHeadline: r.hero_headline, heroSubtext: r.hero_subtext, heroImage: r.hero_image,
    ctaText: r.cta_text, ctaTarget: r.cta_target, accentColor: r.accent_color || "#0A4DA6",
    sections: JSON.parse(r.sections_json || "[]"),
    trustBadges: JSON.parse(r.trust_badges_json || "[]"),
    ctaBandHeading: r.cta_band_heading, ctaBandText: r.cta_band_text,
    formTitle: r.form_title, formSubtext: r.form_subtext,
    mapEnabled: !!r.map_enabled,
    mapLat: r.map_lat != null ? Number(r.map_lat) : null,
    mapLng: r.map_lng != null ? Number(r.map_lng) : null,
    mapAddress: r.map_address,
    testimonials: JSON.parse(r.testimonials_json || "[]"),
    formEnabled: !!r.form_enabled,
    status: r.status,
    // Generalized campaign-engine fields (safe defaults keep old rows unchanged).
    heroLayout: r.hero_layout || "parallax",
    heroEyebrow: r.hero_eyebrow || "",
    secondaryCtaText: r.secondary_cta_text || "",
    secondaryCtaTarget: r.secondary_cta_target || "",
    formFields: JSON.parse(r.form_fields_json || "[]"),
    noindex: !!r.noindex,
    publishedAt: r.published_at,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export async function getLandingPages() {
  const [rows] = await db.execute(
    "SELECT * FROM landing_pages WHERE status = 'published' AND (published_at IS NULL OR published_at <= NOW()) ORDER BY updated_at DESC"
  );
  return rows.map(mapLandingPage);
}

export async function getAdminLandingPages() {
  const [rows] = await db.execute("SELECT * FROM landing_pages ORDER BY updated_at DESC");
  return rows.map(mapLandingPage);
}

export async function getLandingPageBySlug(slug) {
  const [rows] = await db.execute(
    "SELECT * FROM landing_pages WHERE slug = ? AND status = 'published' AND (published_at IS NULL OR published_at <= NOW())",
    [slug]
  );
  return mapLandingPage(rows[0]);
}

export async function getLandingPageById(id) {
  const [rows] = await db.execute("SELECT * FROM landing_pages WHERE id = ?", [id]);
  return mapLandingPage(rows[0]);
}

export async function upsertLandingPage(data) {
  const {
    id, slug, title, metaTitle, metaDescription,
    badgeText, heroHeadline, heroSubtext, heroImage, ctaText, ctaTarget,
    accentColor, sections, trustBadges, ctaBandHeading, ctaBandText,
    formTitle, formSubtext, formEnabled, status,
    mapEnabled, mapLat, mapLng, mapAddress,
    testimonials,
    heroLayout, heroEyebrow, secondaryCtaText, secondaryCtaTarget,
    formFields, noindex, publishedAt,
  } = data;
  const sectionsJson = JSON.stringify(sections || []);
  const trustBadgesJson = JSON.stringify(trustBadges || []);
  const testimonialsJson = JSON.stringify(testimonials || []);
  const formFieldsJson = JSON.stringify(formFields || []);
  const v = {
    slug, title,
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
    badgeText: badgeText || null,
    heroHeadline: heroHeadline || null,
    heroSubtext: heroSubtext || null,
    heroImage: heroImage || null,
    ctaText: ctaText || null,
    ctaTarget: ctaTarget || null,
    accentColor: accentColor || "#0A4DA6",
    sectionsJson,
    trustBadgesJson,
    ctaBandHeading: ctaBandHeading || null,
    ctaBandText: ctaBandText || null,
    formTitle: formTitle || null,
    formSubtext: formSubtext || null,
    mapEnabled: mapEnabled ? 1 : 0,
    mapLat: mapLat != null && mapLat !== "" ? Number(mapLat) : null,
    mapLng: mapLng != null && mapLng !== "" ? Number(mapLng) : null,
    mapAddress: mapAddress || null,
    testimonialsJson,
    formEnabled: formEnabled ? 1 : 0,
    status: status || "draft",
    heroLayout: heroLayout || "parallax",
    heroEyebrow: heroEyebrow || null,
    secondaryCtaText: secondaryCtaText || null,
    secondaryCtaTarget: secondaryCtaTarget || null,
    formFieldsJson,
    noindex: noindex ? 1 : 0,
    publishedAt: publishedAt || null,
  };
  if (id) {
    await db.execute(
      `UPDATE landing_pages SET slug=?, title=?, meta_title=?, meta_description=?, badge_text=?, hero_headline=?, hero_subtext=?, hero_image=?, cta_text=?, cta_target=?, accent_color=?, sections_json=?, trust_badges_json=?, cta_band_heading=?, cta_band_text=?, form_title=?, form_subtext=?, map_enabled=?, map_lat=?, map_lng=?, map_address=?, testimonials_json=?, form_enabled=?, status=?, hero_layout=?, hero_eyebrow=?, secondary_cta_text=?, secondary_cta_target=?, form_fields_json=?, noindex=?, published_at=? WHERE id=?`,
      [v.slug, v.title, v.metaTitle, v.metaDescription, v.badgeText, v.heroHeadline, v.heroSubtext, v.heroImage, v.ctaText, v.ctaTarget, v.accentColor, v.sectionsJson, v.trustBadgesJson, v.ctaBandHeading, v.ctaBandText, v.formTitle, v.formSubtext, v.mapEnabled, v.mapLat, v.mapLng, v.mapAddress, v.testimonialsJson, v.formEnabled, v.status, v.heroLayout, v.heroEyebrow, v.secondaryCtaText, v.secondaryCtaTarget, v.formFieldsJson, v.noindex, v.publishedAt, id]
    );
    return id;
  }
  const [res] = await db.execute(
    `INSERT INTO landing_pages (slug, title, meta_title, meta_description, badge_text, hero_headline, hero_subtext, hero_image, cta_text, cta_target, accent_color, sections_json, trust_badges_json, cta_band_heading, cta_band_text, form_title, form_subtext, map_enabled, map_lat, map_lng, map_address, testimonials_json, form_enabled, status, hero_layout, hero_eyebrow, secondary_cta_text, secondary_cta_target, form_fields_json, noindex, published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [v.slug, v.title, v.metaTitle, v.metaDescription, v.badgeText, v.heroHeadline, v.heroSubtext, v.heroImage, v.ctaText, v.ctaTarget, v.accentColor, v.sectionsJson, v.trustBadgesJson, v.ctaBandHeading, v.ctaBandText, v.formTitle, v.formSubtext, v.mapEnabled, v.mapLat, v.mapLng, v.mapAddress, v.testimonialsJson, v.formEnabled, v.status, v.heroLayout, v.heroEyebrow, v.secondaryCtaText, v.secondaryCtaTarget, v.formFieldsJson, v.noindex, v.publishedAt]
  );
  return res.insertId;
}

export async function deleteLandingPage(id) {
  await db.execute("DELETE FROM landing_pages WHERE id = ?", [id]);
}

/* ─── Landing Page Leads (generic across campaigns) ──────────────────── */

function mapLandingPageLead(r) {
  if (!r) return null;
  let answers = {};
  if (r.answers_json) {
    try { answers = JSON.parse(r.answers_json); } catch { answers = {}; }
  }
  return {
    id: r.id, landingPageId: r.landing_page_id,
    name: r.name, whatsapp: r.whatsapp, email: r.email, city: r.city,
    message: r.message, answers,
    status: r.status, source: r.source,
    utmSource: r.utm_source, utmMedium: r.utm_medium, utmCampaign: r.utm_campaign,
    utmContent: r.utm_content, utmTerm: r.utm_term, referrer: r.referrer,
    adminNotes: r.admin_notes,
    createdAt: r.created_at, updatedAt: r.updated_at,
    // Joined convenience fields (only present when selected via a JOIN).
    landingPageTitle: r.landing_page_title, landingPageSlug: r.landing_page_slug,
  };
}

export async function createLandingPageLead(data) {
  const {
    landingPageId, name, whatsapp, email, city, message, answers,
    source, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, referrer,
  } = data;
  const [res] = await db.execute(
    `INSERT INTO landing_page_leads
      (landing_page_id, name, whatsapp, email, city, message, answers_json, source, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      landingPageId, name, whatsapp, email || null, city || null, message || null,
      JSON.stringify(answers || {}), source || null,
      utmSource || null, utmMedium || null, utmCampaign || null, utmContent || null, utmTerm || null,
      referrer || null,
    ]
  );
  return res.insertId;
}

export async function getLandingPageLeads({
  landingPageId, status, city, q, dateFrom, dateTo, page = 1, pageSize = 20,
} = {}) {
  const where = [];
  const params = [];
  if (landingPageId) { where.push("l.landing_page_id = ?"); params.push(landingPageId); }
  if (status) { where.push("l.status = ?"); params.push(status); }
  if (city) { where.push("l.city = ?"); params.push(city); }
  if (q) {
    where.push("(l.name LIKE ? OR l.whatsapp LIKE ? OR l.email LIKE ? OR l.answers_json LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  if (dateFrom) { where.push("l.created_at >= ?"); params.push(dateFrom); }
  if (dateTo) { where.push("l.created_at <= ?"); params.push(dateTo); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const [[{ total }]] = await db.execute(
    `SELECT COUNT(*) AS total FROM landing_page_leads l ${whereSql}`,
    params
  );

  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.min(200, Math.max(1, Number(pageSize) || 20));
  const offset = (safePage - 1) * safePageSize;

  const [rows] = await db.execute(
    `SELECT l.*, lp.title AS landing_page_title, lp.slug AS landing_page_slug
     FROM landing_page_leads l
     LEFT JOIN landing_pages lp ON lp.id = l.landing_page_id
     ${whereSql}
     ORDER BY l.created_at DESC
     LIMIT ${offset}, ${safePageSize}`,
    params
  );

  return {
    data: rows.map(mapLandingPageLead),
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.max(1, Math.ceil(total / safePageSize)),
  };
}

export async function getLandingPageLeadById(id) {
  const [rows] = await db.execute(
    `SELECT l.*, lp.title AS landing_page_title, lp.slug AS landing_page_slug
     FROM landing_page_leads l
     LEFT JOIN landing_pages lp ON lp.id = l.landing_page_id
     WHERE l.id = ?`,
    [id]
  );
  return mapLandingPageLead(rows[0]);
}

export async function updateLandingPageLead(id, { status, adminNotes } = {}) {
  const sets = [];
  const params = [];
  if (status !== undefined) { sets.push("status = ?"); params.push(status); }
  if (adminNotes !== undefined) { sets.push("admin_notes = ?"); params.push(adminNotes); }
  if (sets.length === 0) return;
  params.push(id);
  await db.execute(`UPDATE landing_page_leads SET ${sets.join(", ")} WHERE id = ?`, params);
}

export async function getLandingPageLeadStats(landingPageId) {
  const params = [];
  let where = "";
  if (landingPageId) { where = "WHERE landing_page_id = ?"; params.push(landingPageId); }
  const [rows] = await db.execute(
    `SELECT status, COUNT(*) AS count FROM landing_page_leads ${where} GROUP BY status`,
    params
  );
  const stats = {};
  for (const r of rows) stats[r.status] = r.count;
  return stats;
}
