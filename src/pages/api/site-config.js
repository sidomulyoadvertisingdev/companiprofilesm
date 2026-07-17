import db from "../../lib/db.js";

export const prerender = false;

function rowToSite(r) {
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

export async function GET() {
  const [rows] = await db.execute("SELECT * FROM site_config WHERE id = 1");
  return new Response(JSON.stringify({ data: rowToSite(rows[0]) }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
}

export async function PUT({ request }) {
  const b = await request.json();
  await db.execute(
    `UPDATE site_config SET
      name=?, short_name=?, tagline=?, description=?,
      address_street=?, address_city=?, address_region=?,
      address_postal_code=?, address_country=?, geo_lat=?, geo_lng=?,
      phone=?, phone_display=?, email=?, operational_hours=?,
      maps_url=?, maps_embed=?, logo=?, hero_image=?,
      social_json=?, service_area_json=?,
      footer_links_json=?, copyright_text=?
     WHERE id=1`,
    [
      b.name, b.shortName, b.tagline, b.description,
      b.address?.street, b.address?.city, b.address?.region,
      b.address?.postalCode, b.address?.country,
      b.geo?.latitude, b.geo?.longitude,
      b.phone, b.phoneDisplay, b.email, b.operationalHours,
      b.mapsUrl, b.mapsEmbed, b.logo, b.heroImage,
      JSON.stringify(b.social || []), JSON.stringify(b.serviceArea || []),
      JSON.stringify(b.footerLinks || []), b.copyrightText || "All rights reserved.",
    ]
  );
  return GET();
}
