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
  return [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Catalog", path: "/catalog" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
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
    formEnabled: !!r.form_enabled,
    status: r.status,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export async function getLandingPages() {
  const [rows] = await db.execute("SELECT * FROM landing_pages WHERE status = 'published' ORDER BY updated_at DESC");
  return rows.map(mapLandingPage);
}

export async function getAdminLandingPages() {
  const [rows] = await db.execute("SELECT * FROM landing_pages ORDER BY updated_at DESC");
  return rows.map(mapLandingPage);
}

export async function getLandingPageBySlug(slug) {
  const [rows] = await db.execute("SELECT * FROM landing_pages WHERE slug = ? AND status = 'published'", [slug]);
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
  } = data;
  const sectionsJson = JSON.stringify(sections || []);
  const trustBadgesJson = JSON.stringify(trustBadges || []);
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
    formEnabled: formEnabled ? 1 : 0,
    status: status || "draft",
  };
  if (id) {
    await db.execute(
      `UPDATE landing_pages SET slug=?, title=?, meta_title=?, meta_description=?, badge_text=?, hero_headline=?, hero_subtext=?, hero_image=?, cta_text=?, cta_target=?, accent_color=?, sections_json=?, trust_badges_json=?, cta_band_heading=?, cta_band_text=?, form_title=?, form_subtext=?, form_enabled=?, status=? WHERE id=?`,
      [v.slug, v.title, v.metaTitle, v.metaDescription, v.badgeText, v.heroHeadline, v.heroSubtext, v.heroImage, v.ctaText, v.ctaTarget, v.accentColor, v.sectionsJson, v.trustBadgesJson, v.ctaBandHeading, v.ctaBandText, v.formTitle, v.formSubtext, v.formEnabled, v.status, id]
    );
    return id;
  }
  const [res] = await db.execute(
    `INSERT INTO landing_pages (slug, title, meta_title, meta_description, badge_text, hero_headline, hero_subtext, hero_image, cta_text, cta_target, accent_color, sections_json, trust_badges_json, cta_band_heading, cta_band_text, form_title, form_subtext, form_enabled, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [v.slug, v.title, v.metaTitle, v.metaDescription, v.badgeText, v.heroHeadline, v.heroSubtext, v.heroImage, v.ctaText, v.ctaTarget, v.accentColor, v.sectionsJson, v.trustBadgesJson, v.ctaBandHeading, v.ctaBandText, v.formTitle, v.formSubtext, v.formEnabled, v.status]
  );
  return res.insertId;
}

export async function deleteLandingPage(id) {
  await db.execute("DELETE FROM landing_pages WHERE id = ?", [id]);
}
