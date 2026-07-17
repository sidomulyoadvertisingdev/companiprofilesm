// Server-side read access to the database (used during SSR).
import db from "./db.js";

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
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];
}
