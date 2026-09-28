import { createContext, useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiMapPin,
  FiFrown,
  FiTrash2,
  FiClock,
  FiThumbsUp,
  FiShield,
  FiClipboard,
  FiEdit3,
  FiGift,
  FiSettings,
  FiHeart,
  FiUsers,
  FiUser,
  FiHome,
  FiPhone,
  FiMail,
  FiTag,
  FiHelpCircle,
  FiPackage,
} from "react-icons/fi";

// Data and helpers shared by every ad-campaign landing template (see
// TEMPLATES below) and by the admin editor: page-setting defaults, derived
// section structure, colors and small utilities. Each template only decides
// layout and styling, so a campaign can switch template without losing any
// behaviour.

// True inside the admin's live-preview iframe: forms render and validate as
// usual but never POST a lead or open WhatsApp.
export const PreviewContext = createContext(false);

// postMessage type the admin editor uses to push the unsaved campaign into
// the preview iframe; the iframe answers `${PREVIEW_MESSAGE}-ready`.
export const PREVIEW_MESSAGE = "ad-campaign-preview";

export const PREVIEW_NOTICE = "Mode preview: data tidak dikirim.";

// Landing templates an admin can choose per campaign, stored as
// pageSettings.template. "cinematic" is the original look and the fallback
// for campaigns saved before templates existed.
export const TEMPLATES = [
  {
    value: "cinematic",
    label: "Cinematic",
    desc: "Hero video layar penuh ala Netflix, deretan poster produk bergaya gelap.",
  },
  {
    value: "split",
    label: "Modern Split",
    desc: "Terang & profesional: hero dua kolom (teks + foto/video), kartu bersih, form di samping.",
  },
  {
    value: "sales",
    label: "Sales Page",
    desc: "Satu kolom mobile-first untuk trafik iklan: bar promo, countdown, CTA berulang.",
  },
];

export function templateOf(campaign) {
  const value = campaign.pageSettings?.template;
  return TEMPLATES.some((t) => t.value === value) ? value : "cinematic";
}

// Derived structure every template needs: the sections list, the (first)
// steps section rendered next to the lead form, and the configurator — which
// only counts once it has at least one live product, so CTAs never point at
// an empty #pilih-produk anchor.
//
// A "form" section is a position marker: the lead form renders there instead
// of at the end of the page, and every steps section then renders on its own
// (stepsSection is only set when the form still pairs with the first steps).
export function campaignModel(campaign) {
  const sections = Array.isArray(campaign.sections) ? campaign.sections : [];
  const formSection = sections.find((s) => s.type === "form");
  const stepsSection = formSection ? undefined : sections.find((s) => s.type === "steps");
  const configurator = sections.find(
    (s) => s.type === "configurator" && (s.items || []).some((it) => it.active !== false && it.title)
  );
  return { sections, stepsSection, formSection, configurator, ctaTarget: configurator ? "#pilih-produk" : undefined };
}

// Whether the Sales Page template repeats the main CTA after a section. The
// admin can switch it per section (section.ctaAfter); by default it follows
// the sections that usually end a persuasion block.
export function salesCtaAfter(section) {
  return section.ctaAfter ?? ["benefits", "gallery", "testimonials"].includes(section.type);
}

// Built-in section subheadings, used when a section never had one set; the
// admin shows these as the field's value. An empty string hides it.
export const SUBHEADING_DEFAULTS = {
  configurator: "Klik produk untuk melihat varian & minta sample.",
  problems: "Kami memahami tantangan Anda, karena itu kami hadir dengan solusi yang tepat.",
  benefits: "Dirancang khusus untuk kebutuhan operasional SPPG yang dinamis.",
  areas: "Prioritas untuk SPPG aktif di 3 wilayah ini.",
  gallery: "Lihat langsung tampilan sample label removable pada ompreng.",
  testimonials: "Kata SPPG yang sudah mencoba label removable kami.",
  steps: "Proses mudah, cepat, dan tanpa biaya.",
};

export function subheadingOf(section) {
  return section.subheading ?? SUBHEADING_DEFAULTS[section.type] ?? "";
}

// Translucent version of any CSS color (hex, rgb(), named) for soft
// backgrounds, without having to parse what the admin typed.
export function tint(color, percent) {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

// Ticks once a second towards `end` (a datetime-local string). Starts as null
// and only computes after mount so server and client render the same markup.
export function useCountdown(end) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    if (!end) return undefined;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [end]);
  const target = end ? new Date(end).getTime() : NaN;
  if (!end || now === null || Number.isNaN(target)) return null;
  const left = Math.max(0, Math.floor((target - now) / 1000));
  return {
    done: left === 0,
    days: Math.floor(left / 86400),
    hours: Math.floor((left % 86400) / 3600),
    minutes: Math.floor((left % 3600) / 60),
    seconds: left % 60,
  };
}

export function activeItems(section) {
  return (section?.items || []).filter((it) => it.active !== false);
}

export const NAVY = "#0B1E3D";

export const GOLD = "#D4AF37";

// Primary CTA color — reuses the site's own brand blue (tailwind.config.js
// `brand.primary`) instead of orange, per brand guidance.
export const BLUE = "#2563EB";

export const GREEN = "#16A34A";

// Page-level copy stored in page_settings_json (editable in the admin's
// "Teks Lainnya" card). A key that was never set falls back to the original
// copy; one the admin cleared ("") is hidden.
export const PAGE_SETTING_DEFAULTS = {
  topbarEnabled: true,
  topbarLogo: "",
  topbarBrand: "SIDOMULYO ADVERTISING",
  topbarTagline: "Solusi Visual untuk Bisnis Anda",
  topbarNavProduct: "Produk",
  topbarNavSteps: "Cara Kerja",
  topbarNavAreas: "Area Layanan",
  topbarNavTestimonials: "Testimoni",
  topbarNavFaq: "FAQ",
  topbarCtaText: "Minta Sample Gratis",
  topbarCtaMobileText: "Sample Gratis",
  topbarCtaTarget: "",
  topbarButtonColor: BLUE,
  topbarBackgroundColor: "#0a0a1a",
  heroHighlight: "GRATIS",
  ctaBandButtonText: "",
  footerTagline: "Partner Visual untuk Operasional SPPG yang Lebih Baik",
  footerEnabled: true,
  footerKeywords: ["Label", "Sticker", "Desain Custom", "Cetak Berkualitas"],
  footerLogo: "",
  footerBrand: "SIDOMULYO ADVERTISING",
  footerBrandTagline: "Solusi Visual untuk Bisnis Anda",
  footerBackgroundColor: NAVY,
  footerTextColor: "#ffffff",
  footerBrandColor: BLUE,
  footerWhatsappColor: GREEN,
  footerWhatsappTitle: null,
  footerWhatsappLine1: "di WhatsApp kami",
  footerWhatsappLine2: "Kami siap membantu Anda.",
  footerWhatsappUrl: "",
  formPrivacyNote: "Data Anda aman dan hanya digunakan untuk keperluan pengiriman sample.",
  formSubmitText: "Kirim Permintaan Sample",
  // Reassurance line under the hero CTA (e.g. "Gratis, tanpa kewajiban
  // order"). Empty = hidden.
  heroCtaNote: "",
  // content_name sent with the Meta Pixel Lead event; empty = campaign slug.
  leadEventName: "",
  // Template choice and the theme knobs used by the "split" and "sales"
  // templates (the cinematic template keeps its original fixed palette).
  template: "cinematic",
  themeCtaColor: GREEN,
  themeHeadingColor: NAVY,
  themeSurfaceColor: "#F1F5F9",
  splitMediaSide: "right",
  splitHeroForm: false,
  salesAnnouncementEnabled: true,
  salesAnnouncementText: "Promo terbatas — sample GRATIS untuk SPPG aktif",
  salesCountdownEnd: "",
  salesCountdownLabel: "Promo berakhir dalam",
  salesHeroColor: "",
};

export function settingText(campaign, key) {
  const value = campaign.pageSettings?.[key];
  return value === undefined || value === null ? PAGE_SETTING_DEFAULTS[key] : value;
}

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function isWaLink(target) {
  return typeof target === "string" && /wa\.me|api\.whatsapp\.com/.test(target);
}

// Icon-key -> react-icons/fi component lookup. Section/item JSON stores a
// plain string key (e.g. "frown", "shield"); this is never a photo/image —
// photos are handled separately via ImagePlaceholder below.
export const ICON_MAP = {
  frown: FiFrown,
  broom: FiTrash2,
  clock: FiClock,
  hand: FiThumbsUp,
  shield: FiShield,
  document: FiClipboard,
  pencil: FiEdit3,
  gift: FiGift,
  gear: FiSettings,
  settings: FiSettings,
  heart: FiHeart,
  users: FiUsers,
  check: FiCheckCircle,
};

export const FORM_FIELD_ICONS = {
  name: FiHome,
  pic_name: FiUser,
  whatsapp: FiPhone,
  email: FiMail,
  city: FiMapPin,
  district: FiTag,
  address: FiMapPin,
  tray_type: FiPackage,
  daily_portion: FiClipboard,
  current_label: FiTag,
  pain_point: FiHelpCircle,
  notes: FiEdit3,
};

// Only links whose target section is actually on the page are shown, so a
// campaign without e.g. testimonials doesn't get a dead "Testimoni" link.
export function navLinks(campaign, hasConfigurator) {
  const types = new Set((campaign.sections || []).map((s) => s.type));
  return [
    [hasConfigurator ? "#pilih-produk" : "#produk", "topbarNavProduct", true],
    ["#cara-kerja", "topbarNavSteps", types.has("steps") || campaign.formEnabled],
    ["#area-layanan", "topbarNavAreas", types.has("areas")],
    ["#testimoni", "topbarNavTestimonials", types.has("testimonials")],
    ["#faq", "topbarNavFaq", types.has("faq")],
  ].map(([href, key, show]) => [href, settingText(campaign, key), show])
    .filter(([, label, show]) => show && String(label || "").trim());
}

export const PHONE_RE = /^(\+?62|0)8[0-9]{7,12}$/;

// Common Indonesian honorifics — skipped when deriving an initial so e.g.
// "Ibu Sri Wahyuni" and "Ibu Dewi Lestari" don't both show "I".
export const HONORIFICS = ["ibu", "bapak", "bu", "pak", "sdr", "sdri"];

export function initialFromName(name) {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  const word = words.find((w) => !HONORIFICS.includes(w.toLowerCase())) || words[0];
  return (word || "?").charAt(0).toUpperCase();
}

export const DEFAULT_CONTENT_OPTIONS = [
  "Barcode",
  "Nama SPPG",
  "Jam",
  "Tanggal",
  "Menu Makanan",
  "Himbauan",
  "CP SPPG",
  "Kandungan Gizi",
];

// Popup copy — each key is editable on the "Pilih Produk" section in admin;
// an empty field falls back to these.
export const CONFIGURATOR_TEXT_DEFAULTS = {
  variantLabel: "Pilih varian",
  contentLabel: "Mau isi label apa saja?",
  addressLabel: "Ketik nama SPPG Anda",
  nameLabel: "Nama SPPG",
  submitText: "Kirim Alamat ke WhatsApp",
  waGreeting: "Halo Sidomulyo, saya mau",
};

export function configText(section, key) {
  const value = (section[key] || "").trim();
  if (key === "addressLabel" && value === "Kirim alamat SPPG Anda") return CONFIGURATOR_TEXT_DEFAULTS.addressLabel;
  return value || CONFIGURATOR_TEXT_DEFAULTS[key];
}

export const DEFAULT_ORDER_OPTIONS = [
  "Kirim sample ke SPPG saya (gratis)",
  "Kirim sample ke SPPG & saya order sekalian",
];

// Variants are `{ name, image }` objects; older campaigns stored plain name
// strings, which are still accepted (they just have no photo of their own).
export function normalizeVariants(list) {
  return (Array.isArray(list) ? list : [])
    .map((v) => (typeof v === "string" ? { name: v.trim(), image: "" } : { name: String(v?.name || "").trim(), image: v?.image || "" }))
    .filter((v) => v.name);
}

export function cleanList(list) {
  return (Array.isArray(list) ? list : []).map((s) => String(s || "").trim()).filter(Boolean);
}

// Same wa.me / api.whatsapp.com phone extraction the lead API uses for its
// follow-up link, done client-side here so the message can carry the whole
// configurator summary.
export function extractWaPhone(target) {
  if (!target) return null;
  const m = String(target).match(/wa\.me\/(\d+)|[?&]phone=(\d+)/);
  return m ? m[1] || m[2] : null;
}

export const darkInput =
  "w-full rounded-md bg-black/40 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/60";

export function splitTwoLines(text) {
  if (!text) return [text || "", ""];
  const idx = text.indexOf(". ");
  if (idx === -1) return [text, ""];
  return [text.slice(0, idx + 1), text.slice(idx + 2)];
}

// Fallback reverse geocoding (no API key needed) for the product popup's
// "Rekomendasi Maps" button, used when Google Maps is unavailable or fails.
export async function reverseGeocodeAddress(latitude, longitude) {
  const providers = [
    {
      url: `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&addressdetails=1&accept-language=id`,
      read: (data) => data?.display_name?.trim() || "",
    },
    {
      url: `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}&lang=default`,
      read: (data) => {
        const props = data?.features?.[0]?.properties || {};
        return [props.name, props.street, props.housenumber, props.district, props.city || props.county, props.state, props.country]
          .filter(Boolean)
          .join(", ");
      },
    },
  ];
  for (const provider of providers) {
    try {
      const res = await fetch(provider.url, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) continue;
      const address = provider.read(await res.json());
      if (address) return address;
    } catch {
      continue;
    }
  }
  return "";
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const UTM_STORAGE_KEY = "ad-campaign-utm";

// UTM params of the ad click. Read from the URL, and remembered for the tab
// session so a lead still carries them if the visitor's URL loses the query
// string (e.g. after reloading from a hash link or an in-app browser hop).
export function readUtm() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = Object.fromEntries(UTM_KEYS.map((k) => [k, params.get(k)]).filter(([, v]) => v));
  let stored = {};
  try {
    if (Object.keys(fromUrl).length) sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
    else stored = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "{}");
  } catch {
    stored = {};
  }
  const utm = Object.keys(fromUrl).length ? fromUrl : stored;
  return {
    utmSource: utm.utm_source || null,
    utmMedium: utm.utm_medium || null,
    utmCampaign: utm.utm_campaign || null,
    utmContent: utm.utm_content || null,
    utmTerm: utm.utm_term || null,
  };
}

// Conversion tracking, called only after the lead API answered OK — never on
// a bare button click. Meta Pixel gets the standard Lead event; a GTM
// dataLayer (if the page has one) gets `ad_campaign_lead`.
export function trackLead(campaign, extra = {}) {
  const name = settingText(campaign, "leadEventName") || campaign.slug;
  window.fbq?.("track", "Lead", { content_name: name, ...extra });
  window.dataLayer?.push({ event: "ad_campaign_lead", lead_name: name, campaign_slug: campaign.slug, ...extra });
  window.dispatchEvent(new CustomEvent(LEAD_EVENT));
}

// Fired on window after a lead is saved, so page chrome (e.g. a sticky CTA)
// can get out of the way of the success message.
export const LEAD_EVENT = "ad-campaign-lead";
