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
    "Khusus SPPG area Salatiga, Semarang & Magelang. Tempel rapi, mudah dilepas, cepat diganti, tetap jelas dibaca.",
  // Left empty on purpose — real product photography is uploaded manually
  // through the admin editor afterward. The component renders a clean
  // "foto belum diupload" placeholder whenever this is empty.
  heroImage: "",
  heroBadges: ["Removable", "Praktis", "Bersih", "Profesional"],
  heroTrustPoints: [
    { icon: "check", label: "Mudah dilepas" },
    { icon: "gear", label: "Custom sesuai kebutuhan" },
    { icon: "users", label: "Cocok untuk operasional harian SPPG" },
  ],
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
          icon: "frown",
          title: "Label susah dilepas",
          desc: "Label biasa meninggalkan bekas dan sulit dibersihkan dari ompreng.",
          active: true,
        },
        {
          icon: "broom",
          title: "Bekas lem bikin ompreng terlihat kotor",
          desc: "Sisa lem membuat ompreng terlihat tidak bersih dan kurang profesional.",
          active: true,
        },
        {
          icon: "clock",
          title: "Ganti label harian makan waktu",
          desc: "Proses lepas-pasang label yang lama mengganggu efisiensi operasional.",
          active: true,
        },
      ],
    },
    {
      type: "benefits",
      heading: "Solusi Label Removable untuk Ompreng SPPG",
      items: [
        {
          icon: "hand",
          title: "Mudah dilepas tanpa ribet",
          desc: "Bisa dilepas dengan mudah tanpa meninggalkan bekas lem.",
          active: true,
        },
        {
          icon: "shield",
          title: "Tetap menempel dengan rapi saat digunakan",
          desc: "Tidak mudah lepas, tetap rapi meski dalam proses distribusi.",
          active: true,
        },
        {
          icon: "document",
          title: "Ukuran ringkas tapi tetap jelas dibaca",
          desc: "Informasi penting terlihat jelas dan mudah dibaca.",
          active: true,
        },
        {
          icon: "pencil",
          title: "Bisa custom menu, batch, dan tujuan sekolah",
          desc: "Desain dan informasi label bisa disesuaikan dengan kebutuhan SPPG Anda.",
          active: true,
        },
      ],
    },
    {
      type: "gallery",
      heading: "Contoh Sample Label Removable",
      items: [
        // `image` is left empty on purpose — real product photography is
        // uploaded manually through the admin editor. Renders as a clean
        // placeholder, never a broken image.
        { image: "", caption: "Label pada ompreng stainless", active: true },
        { image: "", caption: "Label menempel rapi di permukaan", active: true },
        { image: "", caption: "Proses melepas label tanpa bekas", active: true },
        { image: "", caption: "Contoh custom info menu & batch", active: true },
      ],
    },
    {
      type: "steps",
      heading: "Minta Sample Gratis, Coba Langsung di Ompreng Anda",
      badge: "1 sample kit per SPPG",
      items: [
        { number: "1", title: "Isi data SPPG", desc: "Isi formulir singkat di samping.", active: true },
        {
          number: "2",
          title: "Kami kirim sample",
          desc: "Sample akan kami kirim ke alamat SPPG Anda.",
          active: true,
        },
        {
          number: "3",
          title: "Tes tempel & lepas sendiri",
          desc: "Coba langsung kualitas label removable kami.",
          active: true,
        },
      ],
    },
    {
      type: "areas",
      heading: "Area Free Sample",
      items: [
        // icon holds the area photo URL for this section type — left empty
        // on purpose; uploaded later via the admin editor. Renders as a
        // clean placeholder, never a broken image.
        { icon: "", title: "Salatiga", desc: "Area utama layanan free sample.", active: true },
        { icon: "", title: "Semarang", desc: "Termasuk dalam area free sample.", active: true },
        { icon: "", title: "Magelang", desc: "Termasuk dalam area free sample.", active: true },
      ],
    },
    {
      // PLACEHOLDER CONTENT: these names/quotes are illustrative sample copy,
      // not real customers. Replace with genuine testimonials (or remove the
      // items) via the admin editor before this campaign goes live — do not
      // publish fabricated testimonials attributed to invented people.
      //
      // Deliberately NOT set in Salatiga/Semarang/Magelang (the campaign's
      // free-sample target area) — these read as broader social proof from
      // SPPG elsewhere already using the product, kept distinct from the
      // "free sample available in these 3 cities" claim above.
      type: "testimonials",
      heading: "Kata SPPG yang Sudah Mencoba",
      items: [
        // `avatar` left empty on purpose — the component falls back to an
        // initials avatar; real photos can be uploaded later via the admin.
        {
          name: "Ibu Sri Wahyuni",
          role: "Kepala Dapur, SPPG Jakarta Timur",
          quote:
            "Dulu label sering ninggalin bekas lem di ompreng, sekarang tinggal ditempel dan dilepas, jauh lebih cepat pas jam sibuk.",
          rating: 5,
          avatar: "",
          active: true,
        },
        {
          name: "Bapak Agus Setiawan",
          role: "Koordinator Operasional, SPPG Bandung",
          quote:
            "Timnya bantu custom info menu dan batch sesuai kebutuhan kami. Prosesnya cepat dan hasilnya tetap rapi dipakai harian.",
          rating: 5,
          avatar: "",
          active: true,
        },
        {
          name: "Ibu Dewi Lestari",
          role: "Penanggung Jawab Gizi, SPPG Surabaya",
          quote:
            "Sample-nya beneran gratis dan kualitasnya bagus. Setelah cocok kami lanjut cetak rutin untuk kebutuhan operasional.",
          rating: 5,
          avatar: "",
          active: true,
        },
        {
          name: "Bapak Hendra Kurniawan",
          role: "Ketua Tim Dapur, SPPG Yogyakarta",
          quote:
            "Ukurannya pas, tidak menutupi tampilan ompreng, tapi informasi menu tetap kebaca jelas dari jarak agak jauh.",
          rating: 5,
          avatar: "",
          active: true,
        },
        {
          name: "Ibu Ratna Puspita",
          role: "Kepala Dapur, SPPG Solo",
          quote:
            "Proses gantinya jadi jauh lebih singkat dibanding label lama kami. Tim dapur jadi bisa fokus ke hal lain saat jam sibuk.",
          rating: 5,
          avatar: "",
          active: true,
        },
        {
          name: "Bapak Yusuf Maulana",
          role: "Koordinator Logistik, SPPG Malang",
          quote:
            "Awalnya ragu soal daya rekatnya, ternyata tetap menempel kuat selama distribusi tapi tetap mudah dilepas saat dicuci.",
          rating: 4,
          avatar: "",
          active: true,
        },
        {
          name: "Ibu Nur Aisyah",
          role: "Penanggung Jawab Gizi, SPPG Bogor",
          quote:
            "Sample kit yang dikirim lengkap dan mudah dicoba sendiri. Respons timnya juga cepat waktu kami tanya-tanya.",
          rating: 5,
          avatar: "",
          active: true,
        },
        {
          name: "Bapak Dedi Ramdani",
          role: "Kepala Dapur, SPPG Tangerang",
          quote:
            "Ompreng jadi terlihat lebih rapi dan profesional dibanding pakai spidol atau label yang gampang luntur.",
          rating: 5,
          avatar: "",
          active: true,
        },
        {
          name: "Ibu Fitriani Rahayu",
          role: "Koordinator Operasional, SPPG Depok",
          quote:
            "Kami request custom batas konsumsi dan waktu produksi, hasilnya sesuai dan tetap jelas dibaca oleh tim distribusi.",
          rating: 5,
          avatar: "",
          active: true,
        },
        {
          name: "Bapak Rizky Pratama",
          role: "Ketua Tim Dapur, SPPG Cirebon",
          quote:
            "Sudah coba beberapa jenis label sebelumnya, ini yang paling praktis untuk kebutuhan harian dapur kami.",
          rating: 5,
          avatar: "",
          active: true,
        },
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
  formTitle: "Ajukan Sample Gratis",
  formSubtext: "Isi data berikut, kami akan segera menghubungi Anda.",
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
  ctaBandBadges: [
    { icon: "shield", label: "Praktis" },
    { icon: "gear", label: "Efisien" },
    { icon: "heart", label: "Dukung Gizi Anak Indonesia" },
  ],
  whatsappShortcutText: "Ketik: SAMPLE SPPG",
};

const [existingRows] = await db.execute("SELECT id FROM ad_campaigns WHERE slug = ?", [SLUG]);
const existingId = existingRows[0]?.id;

const cols = [
  "slug", "title", "status", "meta_title", "meta_description", "og_image", "canonical_url",
  "noindex", "published_at", "accent_color", "hero_eyebrow", "hero_headline", "hero_subtext",
  "hero_image", "hero_badges_json", "hero_trust_points_json", "primary_cta_text", "primary_cta_target",
  "secondary_cta_text", "secondary_cta_target", "sections_json", "form_enabled", "form_title",
  "form_subtext", "form_fields_json", "cta_band_heading", "cta_band_text", "cta_band_badges_json",
  "whatsapp_shortcut_text",
];

const values = [
  campaign.slug, campaign.title, campaign.status, campaign.metaTitle, campaign.metaDescription,
  campaign.ogImage, campaign.canonicalUrl, campaign.noindex ? 1 : 0, campaign.publishedAt,
  campaign.accentColor, campaign.heroEyebrow, campaign.heroHeadline, campaign.heroSubtext,
  campaign.heroImage, JSON.stringify(campaign.heroBadges), JSON.stringify(campaign.heroTrustPoints),
  campaign.primaryCtaText, campaign.primaryCtaTarget, campaign.secondaryCtaText, campaign.secondaryCtaTarget,
  JSON.stringify(campaign.sections), campaign.formEnabled ? 1 : 0, campaign.formTitle,
  campaign.formSubtext, JSON.stringify(campaign.formFields), campaign.ctaBandHeading,
  campaign.ctaBandText, JSON.stringify(campaign.ctaBandBadges), campaign.whatsappShortcutText,
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
console.log(
  "NOTE: the testimonials section uses illustrative placeholder quotes — replace with real customer testimonials (or remove them) via /admin/campaigns before publishing."
);

process.exit(0);
