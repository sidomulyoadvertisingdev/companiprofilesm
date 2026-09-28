// Seeds three demo copies of the "Free Sample Label Ompreng SPPG" ad, one per
// landing template (cinematic / split / sales), so the templates can be
// compared side by side with identical content:
//   /promo/sample-label-ompreng-sppg-cinematic
//   /promo/sample-label-ompreng-sppg-split
//   /promo/sample-label-ompreng-sppg-sales
// The live campaign (/promo/sample-label-ompreng-sppg) is not touched. The
// copies are noindex so they never compete with it in search.
import db from "../src/lib/db.js";
import { ensureAdCampaignSchema } from "../src/lib/ad-campaigns.js";
import { SLUG, WHATSAPP_NUMBER, sppgCampaign, upsertCampaignRow } from "./lib/sppg-campaign.mjs";

await ensureAdCampaignSchema();

const ASSETS = "/campaigns/sppg";

// Extra sections so every template shows its full layout (the live campaign
// only has the product row). Same copy for all three templates. No
// testimonials on purpose: the demo must not carry invented customer quotes.
const SHOWCASE_SECTIONS = [
  {
    type: "problems",
    heading: "Masalah Label Ompreng yang Sering Terjadi",
    badge: "",
    items: [
      { icon: "frown", title: "Lem membekas di ompreng", desc: "Sisa lem sulit dibersihkan dan membuat ompreng terlihat kotor.", active: true },
      { icon: "clock", title: "Ganti label makan waktu", desc: "Menu berganti tiap hari, mengelupas label lama memperlambat persiapan.", active: true },
      { icon: "broom", title: "Tulisan cepat luntur", desc: "Label kena uap dan air cuci sehingga informasi tidak terbaca.", active: true },
    ],
  },
  {
    type: "benefits",
    heading: "Kenapa Label Removable Sidomulyo",
    badge: "",
    items: [
      { icon: "hand", title: "Mudah dilepas", desc: "Tempel rapi, lepas bersih tanpa bekas lem.", active: true },
      { icon: "shield", title: "Tahan uap & air", desc: "Tulisan tetap jelas sampai makanan diterima sekolah.", active: true },
      { icon: "gear", title: "Custom sesuai kebutuhan", desc: "Isi nama SPPG, menu, tanggal, jam, gizi, hingga barcode.", active: true },
      { icon: "users", title: "Cocok untuk operasional harian", desc: "Siap untuk ratusan hingga ribuan porsi per hari.", active: true },
    ],
  },
  {
    type: "gallery",
    heading: "Contoh Sample Produk",
    badge: "",
    items: [
      { image: `${ASSETS}/label-7x5.webp`, caption: "Label ompreng 7 x 5 cm", active: true },
      { image: `${ASSETS}/label-10x5.webp`, caption: "Label ompreng 10 x 5 cm", active: true },
      { image: `${ASSETS}/segel-bulat.webp`, caption: "Stiker segel bulat 5 cm", active: true },
      { image: `${ASSETS}/segel-strip.webp`, caption: "Stiker segel strip", active: true },
      { image: `${ASSETS}/gizi-standar.webp`, caption: "Label informasi gizi standar", active: true },
      { image: `${ASSETS}/gizi-lengkap.webp`, caption: "Label informasi gizi lengkap", active: true },
    ],
  },
  {
    type: "steps",
    heading: "Cara Minta Sample Gratis",
    badge: "Gratis",
    items: [
      { number: "1", title: "Pilih produk", desc: "Pilih label, varian ukuran, dan isi label yang dibutuhkan.", active: true },
      { number: "2", title: "Kirim data SPPG", desc: "Cari nama SPPG Anda, cek alamat, lalu kirim ke WhatsApp.", active: true },
      { number: "3", title: "Sample dikirim", desc: "Tim kami menyiapkan dan mengirim sample ke SPPG Anda.", active: true },
    ],
  },
  {
    type: "areas",
    heading: "Area Layanan",
    badge: "",
    items: [
      { icon: "", title: "Salatiga", desc: "", active: true },
      { icon: "", title: "Semarang", desc: "", active: true },
      { icon: "", title: "Magelang", desc: "", active: true },
    ],
  },
  {
    type: "faq",
    heading: "Pertanyaan yang Sering Diajukan",
    badge: "",
    items: [
      { question: "Apakah sample benar-benar gratis?", answer: "Ya. Sample dikirim gratis untuk SPPG aktif di area layanan kami.", active: true },
      { question: "Apakah label meninggalkan bekas lem?", answer: "Tidak. Label removable dirancang agar bisa dilepas bersih dari ompreng.", active: true },
      { question: "Bisa custom isi label?", answer: "Bisa. Pilih isi label seperti nama SPPG, menu, tanggal, jam, gizi, dan barcode saat memilih produk.", active: true },
      { question: "Berapa lama sample sampai?", answer: "Tim kami akan menghubungi via WhatsApp untuk konfirmasi dan jadwal pengiriman.", active: true },
    ],
  },
];

// Per-template page settings on top of the shared ad copy.
const TEMPLATE_VARIANTS = [
  { template: "cinematic", label: "Cinematic", settings: {} },
  {
    template: "split",
    label: "Modern Split",
    settings: {
      themeCtaColor: "#16A34A",
      themeHeadingColor: "#0B1E3D",
      themeSurfaceColor: "#F1F5F9",
      splitMediaSide: "right",
      splitHeroForm: false,
    },
  },
  {
    template: "sales",
    label: "Sales Page",
    settings: {
      themeCtaColor: "#16A34A",
      themeHeadingColor: "#0B1E3D",
      themeSurfaceColor: "#E2E8F0",
      salesAnnouncementEnabled: true,
      salesAnnouncementText: "Sample GRATIS untuk SPPG aktif di Salatiga, Semarang & Magelang",
      // Demo date; change or clear it in the admin (Tema Warna card).
      salesCountdownEnd: "2026-10-31T23:59",
      salesCountdownLabel: "Promo sample gratis berakhir dalam",
      salesHeroColor: "",
    },
  },
];

for (const { template, label, settings } of TEMPLATE_VARIANTS) {
  const base = sppgCampaign();
  await upsertCampaignRow(db, {
    ...base,
    slug: `${SLUG}-${template}`,
    title: `${base.title} — Template ${label}`,
    noindex: true,
    sections: [...base.sections, ...SHOWCASE_SECTIONS],
    pageSettings: { ...base.pageSettings, template, ...settings },
  });
  console.log(`  URL: /promo/${SLUG}-${template}`);
}

console.log(`Placeholder WhatsApp number used: ${WHATSAPP_NUMBER} — replace via /admin/campaigns before going live.`);

process.exit(0);
