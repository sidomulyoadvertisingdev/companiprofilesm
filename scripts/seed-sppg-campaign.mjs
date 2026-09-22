// Seeds the "Free Sample Label Ompreng SPPG" campaign landing page at /lp/sample-sppg.
// Mirrors scripts/seed.mjs conventions (env/db loading via src/lib/db.js, initSchema first).
//
// NOTE: secondary_cta_target below uses a PLACEHOLDER WhatsApp number
// (6280000000000). Replace it with the real number via the admin editor
// (Landing Page > Free Sample Label Ompreng SPPG > CTA Target Sekunder)
// before going live.
import db from "../src/lib/db.js";
import { initSchema } from "../src/lib/schema.js";

await initSchema();

const WA_PLACEHOLDER = "6280000000000";
const waText = encodeURIComponent(
  "Halo Sidomulyo Advertising, saya ingin meminta FREE SAMPLE Label Ompreng Removable untuk SPPG."
);

const sections = [
  {
    type: "features",
    heading: "Masalah yang sering terjadi di SPPG",
    items: [
      { icon: "", title: "Label susah dilepas", desc: "Label biasa bisa meninggalkan bekas dan membuat proses pembersihan lebih lama.", active: true },
      { icon: "", title: "Bekas lem bikin ompreng kotor", desc: "Ompreng digunakan berulang sehingga kebersihan permukaan sangat penting.", active: true },
      { icon: "", title: "Ganti label harian makan waktu", desc: "Menu, batch, waktu, dan tujuan dapat berubah setiap hari.", active: true },
    ],
  },
  {
    type: "features",
    heading: "Solusi Label Removable untuk Ompreng SPPG",
    items: [
      { icon: "", title: "Mudah dilepas", desc: "Dirancang untuk penggunaan ompreng berulang.", active: true },
      { icon: "", title: "Tetap rapi saat digunakan", desc: "Menempel cukup baik untuk proses operasional dan distribusi.", active: true },
      { icon: "", title: "Ringkas tetapi jelas", desc: "Ukuran tidak mengganggu ompreng namun informasi tetap mudah dibaca.", active: true },
      { icon: "", title: "Custom sesuai kebutuhan", desc: "Bisa dibuat per menu, batch, batas konsumsi, dan tujuan sekolah.", active: true },
    ],
  },
  {
    type: "steps",
    heading: "Minta Sample Gratis, Coba Langsung di Ompreng Anda",
    badge: "1 Sample Kit per SPPG",
    items: [
      { number: 1, title: "Isi data SPPG", desc: "Isi form singkat dengan data SPPG dan alamat pengiriman." },
      { number: 2, title: "Kami kirim sample", desc: "Tim kami mengirimkan sample kit label removable ke alamat Anda." },
      { number: 3, title: "Tes tempel & lepas sendiri", desc: "Coba langsung di ompreng Anda untuk memastikan cocok dengan kebutuhan." },
    ],
  },
  {
    type: "features",
    heading: "Area Free Sample",
    items: [
      { icon: "FiMapPin", title: "Salatiga", desc: "Area layanan free sample tahap awal.", active: true },
      { icon: "FiMapPin", title: "Semarang", desc: "Area layanan free sample tahap awal.", active: true },
      { icon: "FiMapPin", title: "Magelang", desc: "Area layanan free sample tahap awal.", active: true },
    ],
  },
  {
    type: "faq",
    heading: "Pertanyaan yang Sering Diajukan",
    items: [
      { question: "Apakah sample benar-benar gratis?", answer: "Ya, sample kit diberikan gratis untuk 1 SPPG di area layanan tahap awal (Salatiga, Semarang, Magelang).", active: true },
      { question: "Apakah bisa custom?", answer: "Bisa. Setelah sample cocok, label dapat dicustom sesuai menu, batch, batas konsumsi, dan tujuan sekolah.", active: true },
      { question: "Apakah label mudah dilepas?", answer: "Ya, label dirancang removable sehingga mudah dilepas tanpa meninggalkan banyak bekas lem di ompreng.", active: true },
      { question: "Bahan stikernya apa?", answer: "Kami menggunakan bahan stiker removable food-grade yang aman untuk kontak dengan wadah makanan.", active: true },
      { question: "Berapa ukuran sample?", answer: "Ukuran sample menyesuaikan ukuran ompreng standar SPPG, dan dapat disesuaikan lagi saat pemesanan penuh.", active: true },
      { question: "Apakah bisa untuk ompreng stainless?", answer: "Bisa, label removable ini kompatibel dengan permukaan ompreng stainless maupun plastik food-grade.", active: true },
      { question: "Berapa lama pengiriman sample?", answer: "Estimasi pengiriman sample sekitar 2-5 hari kerja setelah data SPPG kami terima dan verifikasi.", active: true },
      { question: "Setelah cocok apakah bisa cetak banyak?", answer: "Bisa. Tim kami akan membantu proses pemesanan cetak dalam jumlah besar setelah sample dinyatakan cocok.", active: true },
    ],
  },
];

const formFields = [
  { key: "name_sppg", label: "Nama SPPG", type: "text", required: true },
  { key: "pic_name", label: "Nama PIC / Penanggung Jawab", type: "text", required: true },
  { key: "whatsapp", label: "Nomor WhatsApp", type: "tel", required: true },
  { key: "email", label: "Email", type: "email", required: false },
  { key: "city", label: "Kota", type: "select", required: true, options: ["Salatiga", "Semarang", "Magelang"] },
  { key: "district", label: "Kecamatan", type: "text", required: false },
  { key: "address", label: "Alamat Lengkap SPPG", type: "textarea", required: true },
  { key: "tray_type", label: "Jenis Ompreng", type: "text", required: false },
  { key: "daily_portion", label: "Perkiraan Porsi per Hari", type: "text", required: false },
  { key: "current_label", label: "Label yang Dipakai Saat Ini", type: "text", required: false },
  { key: "pain_point", label: "Masalah Utama", type: "select", required: false, options: ["Sulit dilepas", "Bekas lem", "Lama menulis manual", "Ukuran kurang cocok", "Ingin coba bahan removable", "Lainnya"] },
  { key: "notes", label: "Catatan", type: "textarea", required: false },
];

// NOTE on key mapping: the "name" DB column is sourced from the `name_sppg`
// field (SPPG identity), not `pic_name` — the SPPG org name is the lead's
// identity here, not the individual contact person. See
// DynamicLeadForm.extractLeadColumns() in src/react-pages/LandingPage.jsx.

const trustBadges = [
  { icon: "FiCheck", label: "Removable" },
  { icon: "FiZap", label: "Praktis" },
  { icon: "FiThumbsUp", label: "Bersih" },
  { icon: "FiAward", label: "Profesional" },
];

const row = {
  slug: "sample-sppg",
  title: "Free Sample Label Ompreng SPPG",
  meta_title: "Free Sample Label Ompreng Removable untuk SPPG | Sidomulyo Advertising",
  meta_description: "Coba gratis sample label ompreng removable khusus SPPG area Salatiga, Semarang & Magelang. Mudah dilepas, bersih, cepat diganti.",
  badge_text: null,
  hero_headline: "Coba GRATIS Sample Label Ompreng Removable untuk SPPG",
  hero_subtext: "Khusus SPPG area Salatiga, Semarang & Magelang. Tinggal tempel, mudah dilepas, cepat diganti, tetap jelas dibaca.",
  hero_image: "/hero-product.webp",
  cta_text: "Minta Sample Gratis",
  cta_target: "#sample-form",
  accent_color: "#0A4DA6",
  sections_json: JSON.stringify(sections),
  trust_badges_json: JSON.stringify(trustBadges),
  cta_band_heading: "Jangan langsung order banyak. Coba sample-nya dulu.",
  cta_band_text: "Lihat sendiri apakah label removable ini cocok untuk operasional SPPG Anda.",
  form_title: "Minta Sample Gratis",
  form_subtext: "Isi data SPPG, tim kami akan mengirimkan sample ke alamat Anda.",
  form_enabled: 1,
  status: "published",
  map_enabled: 0,
  map_lat: null,
  map_lng: null,
  map_address: null,
  testimonials_json: JSON.stringify([]),
  hero_layout: "product",
  hero_eyebrow: "LABEL OMPRENG SPPG",
  secondary_cta_text: "Chat WhatsApp",
  secondary_cta_target: `https://wa.me/${WA_PLACEHOLDER}?text=${waText}`,
  form_fields_json: JSON.stringify(formFields),
  noindex: 0,
  published_at: null,
};

const [[existing]] = await db.execute("SELECT id FROM landing_pages WHERE slug = ?", [row.slug]);

if (existing) {
  await db.execute(
    `UPDATE landing_pages SET
      title=?, meta_title=?, meta_description=?, badge_text=?, hero_headline=?, hero_subtext=?, hero_image=?,
      cta_text=?, cta_target=?, accent_color=?, sections_json=?, trust_badges_json=?, cta_band_heading=?, cta_band_text=?,
      form_title=?, form_subtext=?, form_enabled=?, status=?, map_enabled=?, map_lat=?, map_lng=?, map_address=?,
      testimonials_json=?, hero_layout=?, hero_eyebrow=?, secondary_cta_text=?, secondary_cta_target=?,
      form_fields_json=?, noindex=?, published_at=?
     WHERE id=?`,
    [
      row.title, row.meta_title, row.meta_description, row.badge_text, row.hero_headline, row.hero_subtext, row.hero_image,
      row.cta_text, row.cta_target, row.accent_color, row.sections_json, row.trust_badges_json, row.cta_band_heading, row.cta_band_text,
      row.form_title, row.form_subtext, row.form_enabled, row.status, row.map_enabled, row.map_lat, row.map_lng, row.map_address,
      row.testimonials_json, row.hero_layout, row.hero_eyebrow, row.secondary_cta_text, row.secondary_cta_target,
      row.form_fields_json, row.noindex, row.published_at,
      existing.id,
    ]
  );
  console.log(`Updated existing landing page "sample-sppg" (id=${existing.id}).`);
} else {
  const [res] = await db.execute(
    `INSERT INTO landing_pages
      (slug, title, meta_title, meta_description, badge_text, hero_headline, hero_subtext, hero_image,
       cta_text, cta_target, accent_color, sections_json, trust_badges_json, cta_band_heading, cta_band_text,
       form_title, form_subtext, form_enabled, status, map_enabled, map_lat, map_lng, map_address,
       testimonials_json, hero_layout, hero_eyebrow, secondary_cta_text, secondary_cta_target,
       form_fields_json, noindex, published_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      row.slug, row.title, row.meta_title, row.meta_description, row.badge_text, row.hero_headline, row.hero_subtext, row.hero_image,
      row.cta_text, row.cta_target, row.accent_color, row.sections_json, row.trust_badges_json, row.cta_band_heading, row.cta_band_text,
      row.form_title, row.form_subtext, row.form_enabled, row.status, row.map_enabled, row.map_lat, row.map_lng, row.map_address,
      row.testimonials_json, row.hero_layout, row.hero_eyebrow, row.secondary_cta_text, row.secondary_cta_target,
      row.form_fields_json, row.noindex, row.published_at,
    ]
  );
  console.log(`Inserted new landing page "sample-sppg" (id=${res.insertId}).`);
}

console.log("Seed complete. Visit /lp/sample-sppg");
console.log(`IMPORTANT: replace the placeholder WhatsApp number (${WA_PLACEHOLDER}) via the admin editor before going live.`);
await db.end();
