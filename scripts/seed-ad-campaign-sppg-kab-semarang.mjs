// Seeds the conversion-focused "Sample Label SPPG" landing page for the
// Kabupaten Semarang Meta Ads campaign: /promo/sample-label-sppg-kab-semarang
//
// One goal only: the visitor fills the short sample-request form. Section
// order follows the ad's promise ("Masih bingung pilih label ompreng? Coba
// dulu sebelum order"): hero -> problems -> solution -> product proof ->
// benefits -> how it works -> offer -> form -> FAQ -> final CTA.
//
// The existing /promo/sample-label-ompreng-sppg campaign is not touched.
// Re-running updates this campaign in place (matched by slug) and keeps the
// WhatsApp number already set on it (or on the original SPPG campaign).
import db from "../src/lib/db.js";
import { ensureAdCampaignSchema } from "../src/lib/ad-campaigns.js";
import { SLUG as ORIGINAL_SLUG, WHATSAPP_NUMBER as PLACEHOLDER_NUMBER, upsertCampaignRow } from "./lib/sppg-campaign.mjs";

await ensureAdCampaignSchema();

const SLUG = "sample-label-sppg-kab-semarang";
const ASSETS = "/campaigns/sppg";

// The lead API only reads the phone number from this link (for the
// post-submit WhatsApp follow-up button); reuse whatever number the admin
// already configured instead of resetting it to the placeholder.
const [waRows] = await db.execute(
  "SELECT slug, secondary_cta_target FROM ad_campaigns WHERE slug IN (?, ?)",
  [SLUG, ORIGINAL_SLUG]
);
const existingWa =
  waRows.find((r) => r.slug === SLUG)?.secondary_cta_target ||
  waRows.find((r) => r.slug === ORIGINAL_SLUG)?.secondary_cta_target ||
  null;
const whatsappTarget = existingWa || `https://wa.me/${PLACEHOLDER_NUMBER}`;

const campaign = {
  slug: SLUG,
  title: "Sample Label SPPG Gratis — Kabupaten Semarang",
  status: "published",
  metaTitle: "Sample Label Ompreng SPPG Gratis | Sidomulyo Printing & Advertising",
  metaDescription:
    "Masih bingung pilih label ompreng? Minta sample label SPPG gratis, desain disesuaikan, dikirim ke lokasi SPPG Anda. Tanpa kewajiban order.",
  ogImage: `${ASSETS}/hero-poster.jpg`,
  canonicalUrl: null,
  noindex: false,
  publishedAt: null,
  accentColor: "#0A4DA6",

  // SECTION 1 — Hero. Continues the ad's question and answers it with the
  // offer; one CTA, reassurance right under it.
  heroEyebrow: "Untuk Pengelola SPPG",
  heroHeadline: "Masih bingung pilih label ompreng? Coba sample GRATIS dulu.",
  heroSubtext:
    "Kami cetak sample label sesuai kebutuhan SPPG Anda dan kirim langsung ke lokasi. Nilai hasilnya sendiri sebelum memutuskan order.",
  heroImage: `${ASSETS}/hero-poster.jpg`,
  heroVideo: `${ASSETS}/hero.mp4`,
  heroBadges: [],
  heroTrustPoints: [
    { icon: "pencil", label: "Desain disesuaikan dengan SPPG Anda" },
    { icon: "gift", label: "Sample dikirim ke lokasi SPPG" },
    { icon: "check", label: "Tanpa kewajiban order" },
  ],
  primaryCtaText: "Minta Sample Gratis",
  primaryCtaTarget: "#sample-form",
  // No second hero button (one goal); the link only supplies the WhatsApp
  // number for the follow-up shown after a successful submit.
  secondaryCtaText: null,
  secondaryCtaTarget: whatsappTarget,

  sections: [
    // SECTION 2 — Problem / pain.
    {
      type: "problems",
      heading: "Label ompreng kelihatan sepele, tapi dipakai setiap hari",
      subheading: "Ini yang paling sering membuat pengelola SPPG ragu sebelum memesan:",
      badge: "",
      ctaAfter: false,
      items: [
        { icon: "frown", title: "Bingung pilih model dan ukuran", desc: "Banyak pilihan bahan dan ukuran, tapi belum tahu mana yang pas untuk ompreng Anda.", active: true },
        { icon: "frown", title: "Takut bahannya tidak cocok", desc: "Khawatir susah dilepas, meninggalkan bekas, atau tulisannya cepat pudar.", active: true },
        { icon: "frown", title: "Hasil desain tidak rapi", desc: "Label seadanya membuat ompreng terlihat kurang tertata saat dibagikan.", active: true },
        { icon: "frown", title: "Sayang anggaran kalau salah pesan", desc: "Sudah cetak banyak, ternyata tidak cocok dipakai di operasional.", active: true },
        { icon: "frown", title: "Dapur sudah sibuk", desc: "Tim tidak punya waktu mengurus desain dan cetak sendiri.", active: true },
      ],
    },
    // SECTION 3 — Solution.
    {
      type: "benefits",
      heading: "Coba dulu sebelum Anda memutuskan pesan.",
      subheading: "Anda cukup isi data SPPG. Sisanya kami bantu sampai sample sampai di tangan Anda:",
      badge: "",
      ctaAfter: false,
      items: [
        { icon: "document", title: "Bantu pilih model label", desc: "Kami sarankan bahan dan ukuran yang sesuai dengan ompreng dan kebutuhan Anda.", active: true },
        { icon: "pencil", title: "Desain dibuatkan", desc: "Belum punya desain? Kami susun dari data SPPG Anda.", active: true },
        { icon: "gear", title: "Dicetak rapi", desc: "Sample dicetak sesuai bahan dan desain yang Anda pilih.", active: true },
        { icon: "gift", title: "Dikirim ke lokasi SPPG", desc: "Sample diantar ke SPPG, tinggal Anda coba di ompreng sendiri.", active: true },
      ],
    },
    // SECTION 4 — Visual product proof. Captions answer "what does it look
    // like / what fits on it", not decoration.
    {
      type: "gallery",
      heading: "Lihat dulu hasilnya",
      subheading: "Beberapa model yang bisa Anda minta sebagai sample.",
      badge: "",
      ctaAfter: true,
      items: [
        { image: `${ASSETS}/label-7x5.webp`, caption: "Label 7 x 5 cm — muat nama SPPG, menu, dan tanggal.", active: true },
        { image: `${ASSETS}/label-10x5.webp`, caption: "Label 10 x 5 cm — info lebih lengkap, tetap jelas dibaca.", active: true },
        { image: `${ASSETS}/label-5x3.webp`, caption: "Label 5 x 3 cm — ringkas untuk tanggal atau kode.", active: true },
        { image: `${ASSETS}/gizi-lengkap.webp`, caption: "Label info gizi — menu, kandungan gizi, dan barcode.", active: true },
        { image: `${ASSETS}/segel-bulat.webp`, caption: "Segel bulat — tanda ompreng sudah ditutup.", active: true },
        { image: `${ASSETS}/segel-strip.webp`, caption: "Segel strip — ditempel melintang di tutup ompreng.", active: true },
      ],
    },
    // SECTION 5 — Benefits (features turned into outcomes).
    {
      type: "benefits",
      heading: "Yang Anda dapatkan",
      subheading: "",
      badge: "",
      ctaAfter: false,
      items: [
        { icon: "pencil", title: "Tidak perlu ikut desain jadi", desc: "Isi label mengikuti kebutuhan SPPG: nama, menu, tanggal, jam, gizi, atau barcode.", active: true },
        { icon: "gift", title: "Cek dulu sebelum keluar anggaran", desc: "Sample gratis, jadi Anda bisa menilai bahan dan hasil cetak lebih dulu.", active: true },
        { icon: "hand", title: "Praktis saat ompreng dipakai ulang", desc: "Pilih bahan removable bila label perlu dilepas saat ompreng dicuci.", active: true },
        { icon: "clock", title: "Tim dapur tidak direpotkan", desc: "Desain, cetak, dan pengiriman kami yang urus.", active: true },
        { icon: "shield", title: "Tanpa kewajiban order", desc: "Kalau belum cocok, Anda tidak perlu memesan.", active: true },
      ],
    },
    // SECTION 6 — How it works.
    {
      type: "steps",
      heading: "Cara minta sample",
      subheading: "Empat langkah, tanpa biaya.",
      badge: "",
      ctaAfter: false,
      items: [
        { number: "1", title: "Isi data SPPG", desc: "Nama SPPG, lokasi, dan nomor WhatsApp PIC.", active: true },
        { number: "2", title: "Pilih kebutuhan label", desc: "Pilih jenis label, atau tulis kebutuhan Anda di catatan.", active: true },
        { number: "3", title: "Tim menyiapkan sample", desc: "Kami konfirmasi lewat WhatsApp, lalu sample dicetak.", active: true },
        { number: "4", title: "Sample dikirim", desc: "Sample sampai di SPPG, silakan coba langsung di ompreng Anda.", active: true },
      ],
    },
    // SECTION 7 — Sample offer.
    {
      type: "offer",
      heading: "Jangan langsung pesan. Coba dulu.",
      subheading: "Kami siapkan sample label sesuai kebutuhan SPPG Anda, supaya Anda bisa menilai hasilnya langsung.",
      badge: "Sample Gratis",
      ctaText: "Minta Sample Gratis",
      note: "Isi data SPPG Anda. Tim kami akan menghubungi lewat WhatsApp untuk konfirmasi kebutuhan sample.",
      items: [
        { title: "Gratis, tanpa kewajiban order", active: true },
        { title: "Desain disesuaikan dengan SPPG Anda", active: true },
        { title: "Dikirim langsung ke lokasi SPPG", active: true },
      ],
    },
    // SECTION 8 — Form (position marker; fields are in formFields below).
    { type: "form" },
    // SECTION 9 — Objection handling.
    {
      type: "faq",
      heading: "Pertanyaan yang sering ditanyakan",
      subheading: "",
      badge: "",
      ctaAfter: false,
      items: [
        { question: "Apakah sample benar-benar gratis?", answer: "Ya. Sample dan pengirimannya gratis untuk SPPG di area layanan kami. Tidak ada biaya yang ditagihkan untuk sample.", active: true },
        { question: "Apakah bisa custom desain?", answer: "Bisa. Isi label seperti nama SPPG, menu, tanggal, jam, kandungan gizi, atau barcode disesuaikan dengan kebutuhan Anda.", active: true },
        { question: "Apakah ukurannya bisa disesuaikan?", answer: "Bisa. Tersedia beberapa ukuran standar, dan ukuran bisa disesuaikan dengan ompreng yang Anda pakai.", active: true },
        { question: "Bagaimana kalau belum punya desain?", answer: "Tidak masalah. Tim kami bantu buatkan desainnya dari data SPPG yang Anda kirim.", active: true },
        { question: "Berapa lama proses sample?", answer: "Setelah form masuk, tim kami menghubungi Anda lewat WhatsApp untuk konfirmasi kebutuhan dan jadwal pengiriman sample.", active: true },
        { question: "Apakah bisa dikirim ke luar Kabupaten Semarang?", answer: "Saat ini kami prioritaskan SPPG di Kabupaten Semarang. Di luar area itu, tetap isi form. Tim kami akan mengabari apakah sample bisa dikirim.", active: true },
        { question: "Setelah dapat sample, apakah wajib order?", answer: "Tidak. Sample untuk Anda nilai dulu. Kalau cocok, baru kita bicarakan pesanannya.", active: true },
      ],
    },
  ],

  // SECTION 8 — Form: six short fields. `name` / `whatsapp` / `city` are the
  // lead's core columns (name = SPPG name, shown first in the leads list);
  // the rest are stored as answers.
  formEnabled: true,
  formTitle: "Minta Sample Label untuk SPPG Anda",
  formSubtext: "Cukup isi data singkat ini. Tim kami menghubungi Anda lewat WhatsApp.",
  formFields: [
    { key: "pic_name", label: "Nama PIC", type: "text", required: true, placeholder: "Nama Anda" },
    { key: "name", label: "Nama SPPG", type: "text", required: true, placeholder: "Nama SPPG Anda" },
    { key: "city", label: "Kecamatan / Kabupaten", type: "text", required: true, placeholder: "Contoh: Ungaran, Kab. Semarang" },
    { key: "whatsapp", label: "Nomor WhatsApp", type: "tel", required: true, placeholder: "08xxxxxxxxxx" },
    {
      key: "label_need",
      label: "Kebutuhan label",
      type: "select",
      required: true,
      options: ["Label ompreng", "Stiker segel ompreng", "Label info gizi", "Belum tahu, minta dibantu pilih"],
    },
    { key: "notes", label: "Catatan (opsional)", type: "textarea", required: false, placeholder: "Contoh: jumlah porsi per hari, ukuran yang diinginkan" },
  ],

  // SECTION 10 — Final CTA. Split on ". " into two lines by the template.
  ctaBandHeading: "Tidak perlu menebak labelnya cocok atau tidak. Coba langsung.",
  ctaBandText: "Sample gratis, dikirim ke SPPG Anda, tanpa kewajiban order.",
  ctaBandBadges: [],
  // Left empty so the page shows no WhatsApp hint without a link (single
  // goal: the form); the follow-up message then has no keyword prefix.
  whatsappShortcutText: null,

  pageSettings: {
    template: "sales",
    // White + blue page, green only on buttons for contrast.
    themeCtaColor: "#16A34A",
    themeHeadingColor: "#0B1E3D",
    themeSurfaceColor: "#EEF3FA",
    salesHeroColor: "#0A4DA6",
    salesAnnouncementEnabled: true,
    salesAnnouncementText: "Sample label SPPG gratis — kami cetak dan kirim ke SPPG Anda",
    // No countdown: the offer has no real deadline.
    salesCountdownEnd: "",
    topbarEnabled: true,
    topbarBrand: "SIDOMULYO PRINTING & ADVERTISING",
    heroHighlight: "GRATIS",
    heroCtaNote: "Gratis dan tanpa kewajiban order. Isi form kurang dari 1 menit.",
    ctaBandButtonText: "Minta Sample Gratis",
    formSubmitText: "Kirim Sample ke SPPG Saya",
    formPrivacyNote: "Data hanya dipakai untuk proses sample dan follow-up kebutuhan Anda.",
    leadEventName: "Lead - Sample Label SPPG",
    footerEnabled: true,
    footerBrand: "Sidomulyo Printing & Advertising",
    footerTagline: "Label dan segel ompreng untuk SPPG",
    footerKeywords: [],
    footerWhatsappUrl: "",
  },
};

await upsertCampaignRow(db, campaign);

console.log(`URL: /promo/${SLUG}`);
if (!existingWa) {
  console.log(`Placeholder WhatsApp number used: ${PLACEHOLDER_NUMBER} — set the real one via /admin/campaigns.`);
}

process.exit(0);
