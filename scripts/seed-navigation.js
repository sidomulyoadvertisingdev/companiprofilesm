import db from "../src/lib/db.js";
import { initSchema } from "../src/lib/schema.js";

const DEFAULT_SERVICES = [
  {
    slug: "brand-strategy",
    title: "Brand Strategy & Positioning",
    icon: "FiTrendingUp",
    image: "/service-banner.webp",
    short_desc: "Riset intelijen pasar, arsitektur brand, dan positioning strategis korporasi.",
    long_desc: "Membangun landasan brand yang kuat dan relevan dengan tren pasar korporasi. Kami membantu Anda merumuskan pesan kunci, posisi pasar, serta pedoman brand jangka panjang yang memicu pertumbuhan reputasi bisnis.",
    features_json: JSON.stringify([
      "Brand Audit & Market Intelligence",
      "Core Positioning & Value Proposition",
      "Brand Architecture Framework",
      "Comprehensive Brand Style Guide"
    ]),
    order: 1
  },
  {
    slug: "creative-design",
    title: "Creative & Visual Design Systems",
    icon: "FiLayout",
    image: "/service-banner.webp",
    short_desc: "Pengembangan sistem visual berkelas dunia dan komunikasi korporat.",
    long_desc: "Mentransformasikan strategi menjadi sistem visual yang memukau. Tim desainer kami merancang logo, materi komunikasi korporat, hingga aset promosi bernilai tinggi secara presisi.",
    features_json: JSON.stringify([
      "Corporate Logo & Visual Identity",
      "Annual Reports & Executive Pitch Decks",
      "Marketing Collateral & Brochures",
      "Digital Asset & Motion Graphic Kits"
    ]),
    order: 2
  },
  {
    slug: "advertising-campaign",
    title: "Integrated Advertising Campaigns",
    icon: "FiZap",
    image: "/service-banner.webp",
    short_desc: "Perencanaan dan eksekusi kampanye periklanan skala besar Out-of-Home (OOH).",
    long_desc: "Kampanye periklanan terarah untuk menarik perhatian pasar sasaran. Mulai dari titik Out-of-Home (OOH) strategis, billboard outdoor, hingga media promosi komersial di titik vital publik.",
    features_json: JSON.stringify([
      "Out-of-Home (OOH) Billboard Placement",
      "Commercial Retail & Event Display",
      "Transit Advertising & Vehicle Wrap",
      "Multi-Channel Campaign Activation"
    ]),
    order: 3
  },
  {
    slug: "corporate-branding",
    title: "Corporate Signage & Environmental Graphics",
    icon: "FiLayers",
    image: "/service-neonbox.webp",
    short_desc: "Rekayasa neon box akrilik/LED dan huruf timbul eksklusif untuk gedung.",
    long_desc: "Spesialis dalam rekayasa signage 3D, neon box akrilik/LED modern, serta branding fasad gedung untuk memberikan kesan profesional dan berwibawa pada lokasi fisik perusahaan Anda.",
    features_json: JSON.stringify([
      "Architectural 3D Letters (Stainless/Acrylic)",
      "High-Lumen LED Neon Box Systems",
      "Facade & Office Interior Branding",
      "Wayfinding & Exhibition Structures"
    ]),
    order: 4
  },
  {
    slug: "production-support",
    title: "Precision Production & Heavy-Duty Support",
    icon: "FiPrinter",
    image: "/service-banner.webp",
    short_desc: "Armada mesin percetakan presisi tinggi untuk eksekusi fisik tanpa kompromi.",
    long_desc: "Dukungan workshop internal dengan mesin cetak digital skala besar generasi terbaru. Menjamin ketepatan warna, ketajaman resolusi, dan daya tahan material luar ruangan dalam batas waktu ketat.",
    features_json: JSON.stringify([
      "Large Format Outdoor & Indoor Printing",
      "High-Resolution UV & Eco-Solvent Printing",
      "Material Engineering & Finishing QC",
      "Professional On-Site Installation"
    ]),
    order: 5
  }
];

const DEFAULT_NAV_MENU = [
  { id: "home", name: "Beranda", path: "/", order: 1, is_active: true },
  {
    id: "services",
    name: "Layanan",
    path: "/services",
    order: 2,
    has_dropdown: true,
    is_active: true,
    dropdown_items: [
      { id: "brand-strategy", title: "Brand Strategy & Positioning", desc: "Riset intelijen pasar, arsitektur brand, dan positioning strategis korporasi.", path: "/services/brand-strategy" },
      { id: "creative-design", title: "Creative & Visual Design", desc: "Pengembangan sistem visual berkelas dunia dan komunikasi korporat.", path: "/services/creative-design" },
      { id: "advertising-campaign", title: "Advertising Campaigns (OOH)", desc: "Perencanaan dan eksekusi kampanye periklanan skala besar Out-of-Home (OOH).", path: "/services/advertising-campaign" },
      { id: "corporate-branding", title: "Corporate Branding & Signage", desc: "Rekayasa neon box akrilik/LED dan huruf timbul eksklusif untuk gedung.", path: "/services/corporate-branding" },
      { id: "production-support", title: "Production & Execution Support", desc: "Armada mesin percetakan presisi tinggi untuk eksekusi fisik tanpa kompromi.", path: "/services/production-support" }
    ]
  },
  { id: "portfolio", name: "Portofolio", path: "/portfolio", order: 3, is_active: true },
  { id: "blog", name: "Blog", path: "/blog", order: 4, is_active: true },
  { id: "about", name: "Tentang Kami", path: "/about", order: 5, is_active: true },
  { id: "contact", name: "Kontak", path: "/contact", order: 6, is_active: true }
];

async function runSeeder() {
  console.log("🌱 Initializing schema & seeding dynamic content...");
  await initSchema();

  // 1. Seed Navigation Menu in site_config
  await db.execute("UPDATE site_config SET nav_json = ? WHERE id = 1", [JSON.stringify(DEFAULT_NAV_MENU)]);
  console.log("✅ Dynamic Navigation Menu seeded successfully!");

  // 2. Seed Services Table
  for (const s of DEFAULT_SERVICES) {
    await db.execute(
      `INSERT INTO services (slug, title, icon, image, short_desc, long_desc, features_json, \`order\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       title=VALUES(title), icon=VALUES(icon), image=VALUES(image),
       short_desc=VALUES(short_desc), long_desc=VALUES(long_desc),
       features_json=VALUES(features_json), \`order\`=VALUES(\`order\`)`,
      [s.slug, s.title, s.icon, s.image, s.short_desc, s.long_desc, s.features_json, s.order]
    );
  }
  console.log("✅ Strategic Services seeded successfully!");

  console.log("🎉 Seeding complete! All 5 dedicated service detail pages & dropdown links are 100% active!");
  process.exit(0);
}

runSeeder().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
