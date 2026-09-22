// Seeds the "Free Sample Label Ompreng SPPG" ad campaign.
// Mirrors the env/db-loading convention of scripts/seed.mjs (imports the
// pool from src/lib/db.js, which loads dotenv), but targets the standalone
// ad_campaigns / ad_campaign_leads tables owned by src/lib/ad-campaigns.js.
import db from "../src/lib/db.js";
import { ensureAdCampaignSchema } from "../src/lib/ad-campaigns.js";

await ensureAdCampaignSchema();

const SLUG = "sample-label-ompreng-sppg";

// TODO(placeholder): replace with the real WhatsApp business number before
// this campaign goes live — see the final report for details.
const WHATSAPP_NUMBER = "6280000000000";
const WHATSAPP_PREFILL = encodeURIComponent(
  "Halo Sidomulyo Advertising, saya ingin meminta FREE SAMPLE Label Ompreng Removable untuk SPPG."
);

const campaign = {
  slug: SLUG,
  title: "Free Sample Label Ompreng SPPG",
  status: "published",
  metaTitle: "Free Sample Label Ompreng Removable untuk SPPG | Sidomulyo Advertising",
  metaDescription:
    "Coba gratis sample label ompreng removable khusus SPPG area Salatiga, Semarang & Magelang. Mudah dilepas, bersih, cepat diganti.",
  ogImage: null,
  canonicalUrl: null,
  noindex: false,
  publishedAt: null,
  accentColor: "#0A4DA6",
  heroEyebrow: "LABEL OMPRENG SPPG",
  heroHeadline: "Coba GRATIS Sample Label Ompreng Removable untuk SPPG",
  heroSubtext:
    "Khusus SPPG area Salatiga, Semarang & Magelang. Tinggal tempel, mudah dilepas, cepat diganti, tetap jelas dibaca.",
  heroImage: "/hero-product.webp",
  heroBadges: ["Removable", "Praktis", "Bersih", "Profesional"],
  primaryCtaText: "Minta Sample Gratis",
  primaryCtaTarget: "#sample-form",
  secondaryCtaText: "Chat WhatsApp",
  secondaryCtaTarget: `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PREFILL}`,
  sections: [
    {
      type: "problems",
      heading: "Masalah yang sering terjadi di SPPG",
      items: [
        {
          title: "Label susah dilepas",
          desc: "Label biasa bisa meninggalkan bekas dan membuat proses pembersihan lebih lama.",
          active: true,
        },
        {
          title: "Bekas lem bikin ompreng kotor",
          desc: "Ompreng digunakan berulang sehingga kebersihan permukaan sangat penting.",
          active: true,
        },
        {
          title: "Ganti label harian makan waktu",
          desc: "Menu, batch, waktu, dan tujuan dapat berubah setiap hari.",
          active: true,
        },
      ],
    },
    {
      type: "benefits",
      heading: "Solusi Label Removable untuk Ompreng SPPG",
      items: [
        { title: "Mudah dilepas", desc: "Dirancang untuk penggunaan ompreng berulang.", active: true },
        {
          title: "Tetap rapi saat digunakan",
          desc: "Menempel cukup baik untuk proses operasional dan distribusi.",
          active: true,
        },
        {
          title: "Ringkas tetapi jelas",
          desc: "Ukuran tidak mengganggu ompreng namun informasi tetap mudah dibaca.",
          active: true,
        },
        {
          title: "Custom sesuai kebutuhan",
          desc: "Bisa dibuat per menu, batch, batas konsumsi, dan tujuan sekolah.",
          active: true,
        },
      ],
    },
    {
      type: "steps",
      heading: "Minta Sample Gratis, Coba Langsung di Ompreng Anda",
      badge: "1 Sample Kit per SPPG",
      items: [
        { number: "1", title: "Isi data SPPG", desc: "Lengkapi formulir singkat di bawah halaman ini.", active: true },
        {
          number: "2",
          title: "Kami kirim sample",
          desc: "Tim kami mengirimkan sample kit ke alamat SPPG Anda.",
          active: true,
        },
        {
          number: "3",
          title: "Tes tempel & lepas sendiri",
          desc: "Coba langsung di ompreng untuk memastikan cocok dengan operasional harian.",
          active: true,
        },
      ],
    },
    {
      type: "areas",
      heading: "Area Free Sample",
      items: [
        { title: "Salatiga", desc: "Area utama layanan free sample.", active: true },
        { title: "Semarang", desc: "Termasuk dalam area free sample.", active: true },
        { title: "Magelang", desc: "Termasuk dalam area free sample.", active: true },
      ],
    },
    {
      type: "faq",
      heading: "Pertanyaan yang Sering Diajukan",
      items: [
        {
          question: "Apakah sample benar-benar gratis?",
          answer: "Ya, sample kit label ompreng removable diberikan gratis untuk SPPG di area Salatiga, Semarang, dan Magelang, satu kit per SPPG.",
          active: true,
        },
        {
          question: "Apakah bisa custom?",
          answer: "Bisa. Setelah sample cocok, label dapat dicustom sesuai menu, batch, batas konsumsi, dan tujuan sekolah.",
          active: true,
        },
        {
          question: "Apakah label mudah dilepas?",
          answer: "Ya, label ini dirancang removable sehingga mudah dilepas dari permukaan ompreng tanpa meninggalkan banyak bekas.",
          active: true,
        },
        {
          question: "Bahan stikernya apa?",
          answer: "Menggunakan bahan stiker food-grade yang aman untuk kontak dengan wadah makanan dan tahan terhadap kondisi lembap ringan.",
          active: true,
        },
        {
          question: "Berapa ukuran sample?",
          answer: "Sample dikirim dalam ukuran standar yang umum dipakai di ompreng SPPG; ukuran custom bisa didiskusikan setelah Anda mencoba sample.",
          active: true,
        },
        {
          question: "Apakah bisa untuk ompreng stainless?",
          answer: "Bisa, label ini kompatibel dengan permukaan ompreng stainless maupun plastik food-grade yang umum digunakan SPPG.",
          active: true,
        },
        {
          question: "Berapa lama pengiriman sample?",
          answer: "Estimasi pengiriman sample sekitar 2-5 hari kerja tergantung lokasi SPPG setelah data Anda kami terima.",
          active: true,
        },
        {
          question: "Setelah cocok apakah bisa cetak banyak?",
          answer: "Bisa, tim kami akan membantu proses cetak dalam jumlah besar sesuai kebutuhan operasional SPPG Anda sehari-hari.",
          active: true,
        },
      ],
    },
  ],
  formEnabled: true,
  formTitle: "Minta Sample Gratis",
  formSubtext: "Isi data SPPG, tim kami akan mengirimkan sample ke alamat Anda.",
  formFields: [
    { key: "name", label: "Nama SPPG", type: "text", required: true },
    { key: "pic_name", label: "Nama PIC / Penanggung Jawab", type: "text", required: true },
    { key: "whatsapp", label: "Nomor WhatsApp", type: "tel", required: true },
    { key: "email", label: "Email", type: "email", required: false },
    { key: "city", label: "Kota", type: "select", required: true, options: ["Salatiga", "Semarang", "Magelang"] },
    { key: "district", label: "Kecamatan", type: "text", required: false },
    { key: "address", label: "Alamat Lengkap SPPG", type: "textarea", required: true },
    { key: "tray_type", label: "Jenis Ompreng", type: "text", required: false },
    { key: "daily_portion", label: "Perkiraan Porsi per Hari", type: "text", required: false },
    { key: "current_label", label: "Label yang Dipakai Saat Ini", type: "text", required: false },
    {
      key: "pain_point",
      label: "Masalah Utama",
      type: "select",
      required: false,
      options: [
        "Sulit dilepas",
        "Bekas lem",
        "Lama menulis manual",
        "Ukuran kurang cocok",
        "Ingin coba bahan removable",
        "Lainnya",
      ],
    },
    { key: "notes", label: "Catatan", type: "textarea", required: false },
  ],
  ctaBandHeading: "Jangan langsung order banyak. Coba sample-nya dulu.",
  ctaBandText: "Lihat sendiri apakah label removable ini cocok untuk operasional SPPG Anda.",
  whatsappShortcutText: "Ketik: SAMPLE SPPG",
};

const [existingRows] = await db.execute("SELECT id FROM ad_campaigns WHERE slug = ?", [SLUG]);
const existingId = existingRows[0]?.id;

const cols = [
  "slug", "title", "status", "meta_title", "meta_description", "og_image", "canonical_url",
  "noindex", "published_at", "accent_color", "hero_eyebrow", "hero_headline", "hero_subtext",
  "hero_image", "hero_badges_json", "primary_cta_text", "primary_cta_target", "secondary_cta_text",
  "secondary_cta_target", "sections_json", "form_enabled", "form_title", "form_subtext",
  "form_fields_json", "cta_band_heading", "cta_band_text", "whatsapp_shortcut_text",
];

const values = [
  campaign.slug, campaign.title, campaign.status, campaign.metaTitle, campaign.metaDescription,
  campaign.ogImage, campaign.canonicalUrl, campaign.noindex ? 1 : 0, campaign.publishedAt,
  campaign.accentColor, campaign.heroEyebrow, campaign.heroHeadline, campaign.heroSubtext,
  campaign.heroImage, JSON.stringify(campaign.heroBadges), campaign.primaryCtaText,
  campaign.primaryCtaTarget, campaign.secondaryCtaText, campaign.secondaryCtaTarget,
  JSON.stringify(campaign.sections), campaign.formEnabled ? 1 : 0, campaign.formTitle,
  campaign.formSubtext, JSON.stringify(campaign.formFields), campaign.ctaBandHeading,
  campaign.ctaBandText, campaign.whatsappShortcutText,
];

if (existingId) {
  await db.execute(
    `UPDATE ad_campaigns SET ${cols.map((c) => `${c} = ?`).join(", ")} WHERE id = ?`,
    [...values, existingId]
  );
  console.log(`Updated ad campaign "${SLUG}" (id=${existingId}).`);
} else {
  await db.execute(
    `INSERT INTO ad_campaigns (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`,
    values
  );
  console.log(`Inserted ad campaign "${SLUG}".`);
}

console.log(`URL: /promo/${SLUG}`);
console.log(`Placeholder WhatsApp number used: ${WHATSAPP_NUMBER} — replace via /admin/campaigns before going live.`);

process.exit(0);
