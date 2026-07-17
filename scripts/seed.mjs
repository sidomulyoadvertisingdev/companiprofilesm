import db from "../src/lib/db.js";
import { initSchema } from "../src/lib/schema.js";
import { site } from "../src/data/site.js";
import { services } from "../src/data/services.js";
import { products } from "../src/data/products.js";
import { portfolio } from "../src/data/portfolio.js";
import { partners } from "../src/data/partners.js";
import { testimonials } from "../src/data/testimonials.js";
import { hashPassword } from "../src/lib/auth.js";

await initSchema();

// site_config (id forced to 1)
await db.execute(
  `INSERT INTO site_config
    (id, name, short_name, tagline, description, address_street, address_city,
     address_region, address_postal_code, address_country, geo_lat, geo_lng,
     phone, phone_display, email, operational_hours, maps_url, maps_embed,
     logo, hero_image, social_json, service_area_json)
   VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE
     name=VALUES(name), short_name=VALUES(short_name), tagline=VALUES(tagline),
     description=VALUES(description), address_street=VALUES(address_street),
     address_city=VALUES(address_city), address_region=VALUES(address_region),
     address_postal_code=VALUES(address_postal_code), address_country=VALUES(address_country),
     geo_lat=VALUES(geo_lat), geo_lng=VALUES(geo_lng), phone=VALUES(phone),
     phone_display=VALUES(phone_display), email=VALUES(email),
     operational_hours=VALUES(operational_hours), maps_url=VALUES(maps_url),
     maps_embed=VALUES(maps_embed), logo=VALUES(logo), hero_image=VALUES(hero_image),
     social_json=VALUES(social_json), service_area_json=VALUES(service_area_json)`,
  [
    site.name, site.shortName, site.tagline, site.description,
    site.address.street, site.address.city, site.address.region,
    site.address.postalCode, site.address.country,
    site.geo.latitude, site.geo.longitude,
    site.phone, site.phoneDisplay, site.email, site.operationalHours,
    site.mapsUrl, site.mapsEmbed, site.logo, site.heroImage,
    JSON.stringify(site.social), JSON.stringify(site.serviceArea),
  ]
);

for (const s of services) {
  await db.execute(
    `INSERT INTO services (id, slug, title, icon, image, short_desc, long_desc, features_json, \`order\`)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       slug=VALUES(slug), title=VALUES(title), icon=VALUES(icon), image=VALUES(image),
       short_desc=VALUES(short_desc), long_desc=VALUES(long_desc),
       features_json=VALUES(features_json), \`order\`=\`order\``,
    [s.id, s.slug, s.title, s.icon, s.image, s.shortDesc, s.longDesc, JSON.stringify(s.features), s.order]
  );
}

for (const p of products) {
  await db.execute(
    `INSERT INTO products (id, slug, title, category, price_text, image, short_desc, long_desc, \`order\`)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       slug=VALUES(slug), title=VALUES(title), category=VALUES(category),
       price_text=VALUES(price_text), image=VALUES(image),
       short_desc=VALUES(short_desc), long_desc=VALUES(long_desc), \`order\`=\`order\``,
    [p.id, p.slug, p.title, p.category, p.priceText, p.image, p.shortDesc, p.longDesc, p.order]
  );
}

for (const p of portfolio) {
  await db.execute(
    `INSERT INTO portfolio (id, title, category, client, year, image, description, \`order\`)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title=VALUES(title), category=VALUES(category), client=VALUES(client),
       year=VALUES(year), image=VALUES(image), description=VALUES(description), \`order\`=\`order\``,
    [p.id, p.title, p.category, p.client, p.year, p.image, p.description, p.order]
  );
}

for (const p of partners) {
  await db.execute(
    `INSERT INTO partners (id, name, logo, website, \`order\`)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name=VALUES(name), logo=VALUES(logo), website=VALUES(website), \`order\`=\`order\``,
    [p.id, p.name, p.logo, p.website, p.order]
  );
}

for (const t of testimonials) {
  await db.execute(
    `INSERT INTO testimonials (id, name, role, company, quote, avatar, \`order\`)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), company=VALUES(company),
       quote=VALUES(quote), avatar=VALUES(avatar), \`order\`=\`order\``,
    [t.id, t.name, t.role, t.company, t.quote, t.avatar, t.order]
  );
}

// Default admin (email: admin@sidomulyo.com / password: admin123)
const [[existing]] = await db.execute("SELECT id FROM admins WHERE email = ?", ["admin@sidomulyo.com"]);
if (!existing) {
  await db.execute(
    "INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    ["Administrator", "admin@sidomulyo.com", hashPassword("admin123"), "admin"]
  );
}

console.log("Seed complete. Admin: admin@sidomulyo.com / admin123");
await db.end();
