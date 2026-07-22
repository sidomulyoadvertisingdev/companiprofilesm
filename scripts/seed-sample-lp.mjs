import db from "../src/lib/db.js";
import { initSchema } from "../src/lib/schema.js";

await initSchema();

const sampleLandingPages = [
  {
    slug: "promo-neon-box",
    title: "Promo Neon Box Akrilik LED Premium",
    metaTitle: "Promo Neon Box Akrilik LED Premium | Sidomulyo Advertising Salatiga",
    metaDescription: "Dapatkan promo neon box akrilik LED kualitas premium untuk toko & kantor. Hasil cetak tajam, garansi pencahayaan, gratis konsultasi & desain!",
    badgeText: "PROMO SPESIAL PERCETAKAN SALATIGA",
    heroHeadline: "Bikin Toko Anda Makin Menonjol & Terlihat 24 Jam dengan Neon Box LED Premium",
    heroSubtext: "Sidomulyo Advertising menghadirkan Neon Box Akrilik dengan pencahayaan LED ultra-terang, tahan cuaca ekstrim, dan garansi resmi 1 tahun. Tingkatkan omset & kepercayaan pelanggan Anda sekarang!",
    heroImage: "/catalog-1.webp",
    ctaText: "Konsultasi WhatsApp Sekarang",
    ctaTarget: "https://wa.me/6288808888880?text=Halo%20Sidomulyo%20Advertising,%20saya%20tertarik%20dengan%20Promo%20Neon%20Box%20Akrilik",
    accentColor: "#0A4DA6",
    trustBadges: [
      { icon: "FiShield", label: "Garansi LED 1 Tahun" },
      { icon: "FiClock", label: "Pengerjaan 2-3 Hari" },
      { icon: "FiTruck", label: "Gratis Pemasangan Salatiga" },
      { icon: "FiAward", label: "Akrilik Premium Grade A" }
    ],
    sections: [
      {
        type: "features",
        heading: "Keunggulan Neon Box Akrilik Sidomulyo",
        items: [
          {
            title: "Lampu LED Ultra Bright",
            desc: "Hemat energi hingga 70% dengan pencahayaan terang merata tanpa bercak hitam."
          },
          {
            title: "Bahan Akrilik Murni",
            desc: "Warna tidak akan menguning meskipun terpapar sinar matahari dan hujan bertahun-tahun."
          },
          {
            title: "Frame Anti Karat",
            desc: "Konstruksi aluminium kokoh & rapi dengan pelindung silikon anti bocor air hujan."
          },
          {
            title: "Desain Custom Branding",
            desc: "Tim desainer berpengalaman siap bantu wujudkan visual terbaik untuk brand Anda."
          }
        ]
      },
      {
        type: "text",
        heading: "Mengapa Neon Box Sangat Penting Untuk Bisnis Anda?",
        body: "Penelitian menunjukkan bahwa 70% calon pelanggan memutuskan masuk ke toko atau kantor karena tertarik dengan visual papan nama di bagian depan.\n\nDengan Neon Box Akrilik LED dari Sidomulyo Advertising, bisnis Anda tampak lebih profesional, mewah, dan gampang ditemukan calon pembeli baik di siang maupun malam hari."
      }
    ],
    mapEnabled: 1,
    mapAddress: "Jl. Sidomulyo No. 12, Salatiga, Jawa Tengah",
    testimonials: [
      {
        name: "Budi Santoso",
        role: "Owner Kopi Kenangan Salatiga",
        quote: "Neon box dari Sidomulyo hasilnya sangat rapi dan lampunya terang sekali di malam hari. Penjualan toko kami meningkat pesat!",
        rating: 5
      },
      {
        name: "Siti Rahmawati",
        role: "Manager Klinik Skincare",
        quote: "Pengerjaan cepat & tepat waktu, harga bersaing, garansi jelas. Sangat memuaskan berlangganan di Sidomulyo Advertising!",
        rating: 5
      }
    ],
    ctaBandHeading: "Dapatkan Diskon 15% Untuk Pemesanan Bulan Ini!",
    ctaBandText: "Konsultasikan ukuran, bahan, dan lokasi pemasangan neon box Anda secara gratis bersama tim ahli kami.",
    formEnabled: 1,
    formTitle: "Konsultasi Neon Box Gratis",
    formSubtext: "Tinggalkan nama dan nomor WhatsApp Anda, tim kami akan segera menghubungi Anda dalam 5 menit.",
    status: "published"
  },
  {
    slug: "paket-kartu-nama",
    title: "Cetak Kartu Nama Premium Free Box Transparan",
    metaTitle: "Cetak Kartu Nama Premium Salatiga | Sidomulyo Advertising",
    metaDescription: "Cetak kartu nama bisnis profesional bahan Art Carton tebal, warna tajam, presisi, bonus Free Box Transparan. Pesan online cepat & praktis!",
    badgeText: "SOLUSI BRANDING BISNIS",
    heroHeadline: "Bangun Identitas Bisnis Profesional dengan Kartu Nama Premium",
    heroSubtext: "Setiap paket mencakup 100 lembar kartu nama dengan cetakan tajam, kertas Art Carton tebal, dan bonus Free Box Transparan agar tersimpan rapi & bersih.",
    heroImage: "/catalog-2.webp",
    ctaText: "Pesan Paket Kartu Nama",
    ctaTarget: "https://wa.me/6288808888880?text=Halo%20Sidomulyo,%20saya%20mau%20pesan%20Paket%20Kartu%20Nama%20Premium",
    accentColor: "#1e3a8a",
    trustBadges: [
      { icon: "FiCheck", label: "Bahan Art Carton 260gsm" },
      { icon: "FiGift", label: "Bonus Box Transparan" },
      { icon: "FiZap", label: "Cetak Cepat 1 Hari Jadi" }
    ],
    sections: [
      {
        type: "features",
        heading: "Mengapa Memilih Kartu Nama Kami?",
        items: [
          {
            title: "Cetak Tajam & Presisi",
            desc: "Mesin cetak digital offset resolusi tinggi menghasilkan warna kaya dan teks super tajam."
          },
          {
            title: "Pilihan Finishing Laminasi",
            desc: "Tersedia finishing Doff (elegan) atau Glossy (mengkilap) tahan gores & anti lengket."
          },
          {
            title: "Kemasan Box Transparan",
            desc: "Kartu nama tersimpan rapi, tidak mudah terlipat, dan mudah dibawa ke mana saja."
          }
        ]
      }
    ],
    mapEnabled: 0,
    testimonials: [
      {
        name: "Hendra Wijaya",
        role: "Property Consultant",
        quote: "Hasil cetak kartu namanya mantap banget, kertasnya tebal dan warnanya sesuai desain asli saya!",
        rating: 5
      }
    ],
    ctaBandHeading: "Tingkatkan Kesan Pertama Klien Anda!",
    ctaBandText: "Pesan kartu nama eksklusif Anda sekarang hanya Rp 20.000 per box.",
    formEnabled: 1,
    formTitle: "Form Order Kartu Nama",
    formSubtext: "Isi data Anda untuk pemesanan cepat via admin kami.",
    status: "published"
  }
];

for (const lp of sampleLandingPages) {
  const [existing] = await db.execute("SELECT id FROM landing_pages WHERE slug = ?", [lp.slug]);
  const sectionsJson = JSON.stringify(lp.sections);
  const trustBadgesJson = JSON.stringify(lp.trustBadges);
  const testimonialsJson = JSON.stringify(lp.testimonials);

  if (existing.length > 0) {
    await db.execute(
      `UPDATE landing_pages SET
        title=?, meta_title=?, meta_description=?, badge_text=?, hero_headline=?, hero_subtext=?,
        hero_image=?, cta_text=?, cta_target=?, accent_color=?, sections_json=?, trust_badges_json=?,
        cta_band_heading=?, cta_band_text=?, form_title=?, form_subtext=?, map_enabled=?, map_address=?,
        testimonials_json=?, form_enabled=?, status=? WHERE slug=?`,
      [
        lp.title, lp.metaTitle, lp.metaDescription, lp.badgeText, lp.heroHeadline, lp.heroSubtext,
        lp.heroImage, lp.ctaText, lp.ctaTarget, lp.accentColor, sectionsJson, trustBadgesJson,
        lp.ctaBandHeading, lp.ctaBandText, lp.formTitle, lp.formSubtext, lp.mapEnabled, lp.mapAddress || null,
        testimonialsJson, lp.formEnabled, lp.status, lp.slug
      ]
    );
    console.log(`Updated sample landing page: /lp/${lp.slug}`);
  } else {
    await db.execute(
      `INSERT INTO landing_pages (
        slug, title, meta_title, meta_description, badge_text, hero_headline, hero_subtext,
        hero_image, cta_text, cta_target, accent_color, sections_json, trust_badges_json,
        cta_band_heading, cta_band_text, form_title, form_subtext, map_enabled, map_address,
        testimonials_json, form_enabled, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lp.slug, lp.title, lp.metaTitle, lp.metaDescription, lp.badgeText, lp.heroHeadline, lp.heroSubtext,
        lp.heroImage, lp.ctaText, lp.ctaTarget, lp.accentColor, sectionsJson, trustBadgesJson,
        lp.ctaBandHeading, lp.ctaBandText, lp.formTitle, lp.formSubtext, lp.mapEnabled, lp.mapAddress || null,
        testimonialsJson, lp.formEnabled, lp.status
      ]
    );
    console.log(`Created sample landing page: /lp/${lp.slug}`);
  }
}

console.log("Seeding landing pages complete.");
await db.end();
