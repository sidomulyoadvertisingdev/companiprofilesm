// Seeds the "Free Sample Label Ompreng SPPG" ad campaign.
// Mirrors the env/db-loading convention of scripts/seed.mjs (imports the
// pool from src/lib/db.js, which loads dotenv), but targets the standalone
// ad_campaigns / ad_campaign_leads tables owned by src/lib/ad-campaigns.js.
import db from "../src/lib/db.js";
import { ensureAdCampaignSchema } from "../src/lib/ad-campaigns.js";

await ensureAdCampaignSchema();

const SLUG = "sample-label-ompreng-sppg";

// Demo media shipped with the repo in public/campaigns/sppg/ (committed, so
// it deploys with the code — unlike public/uploads/, which is gitignored).
// These are rendered mockups for demos; replace any of them via the admin
// editor's upload buttons, or point these paths at new files and re-seed.
const ASSETS = "/campaigns/sppg";

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
    "Khusus SPPG area Salatiga, Semarang & Magelang. Tempel rapi, mudah dilepas, cepat diganti, tetap jelas dibaca.",
  // Full-screen looping background video behind the hero (Netflix-style):
  // an animated wall of SPPG label designs. heroImage is its first frame,
  // used as the poster while it loads and as the social-share image.
  heroImage: `${ASSETS}/hero-poster.jpg`,
  heroVideo: `${ASSETS}/hero.mp4`,
  heroBadges: ["Removable", "Praktis", "Bersih", "Profesional"],
  heroTrustPoints: [
    { icon: "check", label: "Mudah dilepas" },
    { icon: "gear", label: "Custom sesuai kebutuhan" },
    { icon: "users", label: "Cocok untuk operasional harian SPPG" },
  ],
  primaryCtaText: "Minta Sample Gratis",
  // Leads into the "Pilih Produk" row right under the hero (the configurator
  // section below), the page's main conversion flow.
  primaryCtaTarget: "#pilih-produk",
  secondaryCtaText: "Chat WhatsApp",
  secondaryCtaTarget: `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PREFILL}`,
  sections: [
    {
      // "Pilih Produk" — Netflix-style auto-scrolling product row rendered
      // right under the video hero. Clicking a product opens a popup with its
      // photo, variants, label-content checkboxes and the two order buttons;
      // the visitor then sends their SPPG address to WhatsApp (number taken
      // from secondaryCtaTarget). Product photos are 2:3 posters; each
      // variant's photo replaces the product photo in the popup when picked.
      type: "configurator",
      heading: "Pilih Produk",
      subheading: "Klik produk untuk melihat varian & minta sample.",
      badge: "Sample Gratis untuk SPPG",
      // Popup copy (all editable in admin).
      variantLabel: "Pilih varian",
      contentLabel: "Mau isi label apa saja?",
      addressLabel: "Ketik nama SPPG Anda",
      nameLabel: "Nama SPPG",
      submitText: "Kirim Alamat ke WhatsApp",
      waGreeting: "Halo Sidomulyo, saya mau",
      contentOptions: [
        "Barcode",
        "Nama SPPG",
        "Jam",
        "Tanggal",
        "Menu Makanan",
        "Himbauan",
        "CP SPPG",
        "Kandungan Gizi",
      ],
      orderOptions: [
        "Kirim sample ke SPPG saya (gratis)",
        "Kirim sample ke SPPG & saya order sekalian",
      ],
      items: [
        {
          image: `${ASSETS}/poster-label.webp`,
          title: "Label Ompreng Removable",
          desc: "Tempel rapi, mudah dilepas tanpa bekas lem.",
          variants: [
            { name: "5 x 3 cm", image: `${ASSETS}/label-5x3.webp` },
            { name: "7 x 5 cm", image: `${ASSETS}/label-7x5.webp` },
            { name: "10 x 5 cm", image: `${ASSETS}/label-10x5.webp` },
          ],
          active: true,
        },
        {
          image: `${ASSETS}/poster-segel.webp`,
          title: "Stiker Segel Ompreng",
          desc: "Segel tutup ompreng agar makanan tetap aman sampai sekolah.",
          variants: [
            { name: "Bulat 5 cm", image: `${ASSETS}/segel-bulat.webp` },
            { name: "Kotak 5 x 5 cm", image: `${ASSETS}/segel-kotak.webp` },
            { name: "Strip 10 x 2 cm", image: `${ASSETS}/segel-strip.webp` },
          ],
          active: true,
        },
        {
          image: `${ASSETS}/poster-gizi.webp`,
          title: "Label Informasi Gizi",
          desc: "Cantumkan menu, kandungan gizi & barcode dalam satu label.",
          variants: [
            { name: "Standar 7 x 5 cm", image: `${ASSETS}/gizi-standar.webp` },
            { name: "Lengkap 10 x 7 cm", image: `${ASSETS}/gizi-lengkap.webp` },
          ],
          active: true,
        },
      ],
    },
  ],
  // The page is now video hero -> "Pilih Produk" -> CTA band -> footer. The
  // old problems/benefits/gallery/steps/areas/testimonials/FAQ sections and
  // the long sample form were removed; the product popup replaces the form.
  formEnabled: false,
  formTitle: null,
  formSubtext: null,
  formFields: [],
  ctaBandHeading: "Jangan langsung order banyak. Coba sample-nya dulu.",
  ctaBandText: "Lihat sendiri apakah label removable ini cocok untuk operasional SPPG Anda.",
  ctaBandBadges: [
    { icon: "shield", label: "Praktis" },
    { icon: "gear", label: "Efisien" },
    { icon: "heart", label: "Dukung Gizi Anak Indonesia" },
  ],
  whatsappShortcutText: "Ketik: SAMPLE SPPG",
  // Misc page copy (admin: "Teks Lainnya").
  pageSettings: {
    heroHighlight: "GRATIS",
    ctaBandButtonText: "Minta Sample Gratis Sekarang",
    footerTagline: "Partner Visual untuk Operasional SPPG yang Lebih Baik",
    footerKeywords: ["Label", "Sticker", "Desain Custom", "Cetak Berkualitas"],
    formPrivacyNote: "Data Anda aman dan hanya digunakan untuk keperluan pengiriman sample.",
  },
};

const [existingRows] = await db.execute("SELECT id FROM ad_campaigns WHERE slug = ?", [SLUG]);
const existingId = existingRows[0]?.id;

const cols = [
  "slug", "title", "status", "meta_title", "meta_description", "og_image", "canonical_url",
  "noindex", "published_at", "accent_color", "hero_eyebrow", "hero_headline", "hero_subtext",
  "hero_image", "hero_video", "hero_badges_json", "hero_trust_points_json", "primary_cta_text", "primary_cta_target",
  "secondary_cta_text", "secondary_cta_target", "sections_json", "form_enabled", "form_title",
  "form_subtext", "form_fields_json", "cta_band_heading", "cta_band_text", "cta_band_badges_json",
  "whatsapp_shortcut_text", "page_settings_json",
];

const values = [
  campaign.slug, campaign.title, campaign.status, campaign.metaTitle, campaign.metaDescription,
  campaign.ogImage, campaign.canonicalUrl, campaign.noindex ? 1 : 0, campaign.publishedAt,
  campaign.accentColor, campaign.heroEyebrow, campaign.heroHeadline, campaign.heroSubtext,
  campaign.heroImage, campaign.heroVideo, JSON.stringify(campaign.heroBadges), JSON.stringify(campaign.heroTrustPoints),
  campaign.primaryCtaText, campaign.primaryCtaTarget, campaign.secondaryCtaText, campaign.secondaryCtaTarget,
  JSON.stringify(campaign.sections), campaign.formEnabled ? 1 : 0, campaign.formTitle,
  campaign.formSubtext, JSON.stringify(campaign.formFields), campaign.ctaBandHeading,
  campaign.ctaBandText, JSON.stringify(campaign.ctaBandBadges), campaign.whatsappShortcutText,
  JSON.stringify(campaign.pageSettings),
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
