// Site-wide configuration — single source of truth for company identity.
// Fase 2: disinkronkan dari tabel `site_config` via API.

export const site = {
  name: "Sidomulyo Advertising & Printing",
  shortName: "Sidomulyo Advertising",
  tagline: "Solusi Percetakan & Advertising Profesional",
  description:
    "Sidomulyo Advertising & Printing adalah perusahaan percetakan dan advertising profesional di Salatiga. Didukung mesin tercanggih, kami melayani neon box, digital printing, huruf timbul, branding, dan berbagai kebutuhan cetak dengan hasil cepat jadi dan berkualitas.",
  address: {
    street: "Jl. Kartini No.108, Sidorejo",
    city: "Salatiga",
    region: "Jawa Tengah",
    postalCode: "50711",
    country: "ID",
  },
  geo: { latitude: -7.3329, longitude: 110.5048 },
  phone: "6288808888880", // nomor WA (tanpa +)
  phoneDisplay: "0888 0888 8880",
  email: "sosmedsidomulyo@gmail.com",
  operationalHours:
    "Setiap Hari: 08.00 – 22.00",
  mapsUrl:
    "https://maps.app.goo.gl/9ZQzJmZ2uKwYqiop9",
  mapsEmbed:
    "https://www.google.com/maps?q=SIDOMULYO+ADVERTISING+%26+PRINTING,+Jl.+Kartini+No.108,+Salatiga,+Jawa+Tengah&output=embed",
  logo: "/sm-logo.png",
  heroImage: "/hero-product.webp",
  social: [
    { label: "WhatsApp", href: "https://wa.me/6288808888880" },
    { label: "Instagram", href: "https://instagram.com/sidomulyo_adv" },
    { label: "TikTok Shop", href: "https://shop.tiktok.com", logo: "/logo-tiktokshop.webp" },
    { label: "Shopee", href: "https://shopee.co.id", logo: "/logo-shopee.webp" },
    { label: "Tokopedia", href: "https://tokopedia.com", logo: "/logo-tokopedia.webp" },
  ],
  serviceArea: ["Salatiga", "Semarang", "Surakarta", "Jawa Tengah"],
};
