import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight, FiCheck, FiSend, FiStar, FiShield, FiClock,
  FiTruck, FiAward, FiHeadphones, FiThumbsUp, FiZap, FiGift, FiMapPin,
  FiChevronLeft, FiChevronRight, FiChevronDown, FiMessageCircle,
} from "react-icons/fi";

import { CardContainer, CardBody, CardItem } from "../components/ui/3d-card.jsx";
import { HeroParallax } from "../components/ui/hero-parallax.jsx";
import { getProducts } from "../lib/content.js";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// Map nama ikon (dari admin) ke komponen Fi agar trust badge dinamis.
const ICONS = {
  FiShield, FiClock, FiTruck, FiHeadphones, FiThumbsUp, FiZap, FiGift, FiMapPin, FiAward, FiCheck, FiStar,
};

// Fires a pixel-oriented event on window.fbq/gtag/ttq when present, so Meta
// Pixel / GA4 / TikTok Pixel can be wired later without touching this file.
// No-ops silently when none of those globals exist (no pixel infra is
// bootstrapped by this project today).
function fireExternalEvent(name, payload = {}) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.fbq === "function") window.fbq("trackCustom", name, payload);
    if (typeof window.gtag === "function") window.gtag("event", name, payload);
    if (typeof window.ttq?.track === "function") window.ttq.track(name, payload);
  } catch {
    /* ignore */
  }
}

// Mirrors tracker.js's campaign/UTM capture so the lead POST body carries the
// same attribution context as analytics events for this page view.
function getUtmContext() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmContent: params.get("utm_content") || "",
    utmTerm: params.get("utm_term") || "",
    referrer: typeof document !== "undefined" ? document.referrer || "" : "",
  };
}

function TestimonialSlider({ page }) {
  const items = page.testimonials || [];
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (items.length === 0) return null;
  const accent = page.accentColor || "#0A4DA6";
  const go = (n) => setIdx((n + items.length) % items.length);

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-3xl mx-auto px-6 py-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#1d1d1f] dark:text-white">
        Apa Kata Pelanggan Kami
      </h2>
      <div className="relative">
        <div className="overflow-hidden rounded-3xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {items.map((t, i) => (
              <div key={i} className="w-full shrink-0 px-1">
                <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-8 shadow-sm ring-1 ring-black/5 dark:ring-white/10 text-center">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" loading="lazy" />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${accent}, #0a0a1a)` }}
                    >
                      {(t.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  {t.rating > 0 && (
                    <div className="flex items-center justify-center gap-0.5 mb-3 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <FiStar key={s} className={s < t.rating ? "text-yellow-400" : "text-slate-300 dark:text-slate-600"} />
                      ))}
                    </div>
                  )}
                  <p className="text-[#1d1d1f] dark:text-white leading-relaxed mb-4" style={{ whiteSpace: "pre-line" }}>
                    “{t.quote}”
                  </p>
                  <p className="font-semibold text-[#1d1d1f] dark:text-white">{t.name}</p>
                  {t.role && <p className="text-sm text-[#6e6e73] dark:text-slate-400">{t.role}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {items.length > 1 && (
          <>
            <button
              onClick={() => go(idx - 1)}
              aria-label="Sebelumnya"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-700 shadow flex items-center justify-center text-[#1d1d1f] dark:text-white hover:scale-110 transition"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => go(idx + 1)}
              aria-label="Berikutnya"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-700 shadow flex items-center justify-center text-[#1d1d1f] dark:text-white hover:scale-110 transition"
            >
              <FiChevronRight />
            </button>
            <div className="flex items-center justify-center gap-2 mt-5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Testimoni ${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === idx ? "bg-[#0A4DA6] w-6" : "bg-slate-300 dark:bg-slate-600"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
}

function MapSection({ page }) {
  if (!page.mapEnabled) return null;
  const hasCoords = page.mapLat != null && page.mapLng != null;
  const q = hasCoords ? `${page.mapLat},${page.mapLng}` : encodeURIComponent(page.mapAddress || "");
  if (!q) return null;
  const src = `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center text-[#1d1d1f] dark:text-white">Lokasi Kami</h2>
      {page.mapAddress && (
        <p className="text-center text-[#6e6e73] dark:text-slate-300 mb-5 flex items-center justify-center gap-2">
          <FiMapPin /> {page.mapAddress}
        </p>
      )}
      <div className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10">
        <iframe
          title="Lokasi usaha"
          src={src}
          width="100%"
          height="360"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="text-center mt-4">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white text-sm hover:scale-105 transition-transform"
          style={{ background: page.accentColor || "#0A4DA6" }}
        >
          <FiMapPin /> Buka di Google Maps
        </a>
      </div>
    </motion.section>
  );
}

function SectionRenderer({ section }) {
  if (!section) return null;
  if (section.type === "text") {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-6 py-12"
      >
        {section.heading && (
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-[#1d1d1f] dark:text-white">
            {section.heading}
          </h2>
        )}
        <p className="text-base leading-relaxed text-[#6e6e73] dark:text-slate-300 text-center" style={{ whiteSpace: "pre-line" }}>
          {section.body}
        </p>
      </motion.div>
    );
  }
  if (section.type === "image") {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 py-10"
      >
        {section.heading && (
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-center text-[#1d1d1f] dark:text-white">
            {section.heading}
          </h2>
        )}
        {section.image && (
          <img
            src={section.image}
            alt={section.heading || "Gambar"}
            className="w-full rounded-3xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
            loading="lazy"
          />
        )}
      </motion.div>
    );
  }
  if (section.type === "features") {
    const items = (section.items || []).filter((it) => it.active !== false);
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-12"
      >
        {section.heading && (
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#1d1d1f] dark:text-white">
            {section.heading}
          </h2>
        )}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {items.map((it, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              data-track="section-feature"
              className="group relative flex flex-col items-center text-center bg-white dark:bg-slate-800/60 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow border border-[#eef0f3] dark:border-slate-700/50"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden shadow-md bg-[#f5f5f7] dark:bg-slate-700/50">
                {it.icon ? (
                  <img src={it.icon} alt={it.title || "icon"} className="w-full h-full object-contain p-2" loading="lazy" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white"
                    style={{ background: "linear-gradient(135deg, var(--lp-accent), #0a0a1a)" }}
                  >
                    <FiCheck className="text-xl" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-1">{it.title}</h3>
              {it.desc && <p className="text-sm text-[#6e6e73] dark:text-slate-300 leading-relaxed">{it.desc}</p>}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  }
  if (section.type === "steps") {
    const items = section.items || [];
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-12"
      >
        <div className="text-center mb-8">
          {section.badge && (
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-3 text-white" style={{ background: "var(--lp-accent)" }}>
              {section.badge}
            </span>
          )}
          {section.heading && (
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] dark:text-white">
              {section.heading}
            </h2>
          )}
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {items.map((it, i) => (
            <motion.div key={i} variants={fadeUp} className="relative text-center bg-white dark:bg-slate-800/60 rounded-2xl p-6 shadow-sm border border-[#eef0f3] dark:border-slate-700/50">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg shadow-md"
                style={{ background: "linear-gradient(135deg, var(--lp-accent), #0a0a1a)" }}
              >
                {it.number || i + 1}
              </div>
              <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-1">{it.title}</h3>
              {it.desc && <p className="text-sm text-[#6e6e73] dark:text-slate-300 leading-relaxed">{it.desc}</p>}
              {i < items.length - 1 && (
                <div className="hidden sm:block absolute top-6 -right-3 text-[#d1d5db] dark:text-slate-600">
                  <FiArrowRight />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  }
  if (section.type === "faq") {
    const items = (section.items || []).filter((it) => it.active !== false);
    return <FaqSection heading={section.heading} items={items} />;
  }
  return null;
}

function FaqSection({ heading, items }) {
  const [open, setOpen] = useState(0);
  if (!items || items.length === 0) return null;
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-3xl mx-auto px-6 py-12"
    >
      {heading && (
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-[#1d1d1f] dark:text-white">
          {heading}
        </h2>
      )}
      <div className="space-y-3">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="bg-white dark:bg-slate-800/60 rounded-2xl border border-[#eef0f3] dark:border-slate-700/50 overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold text-[#1d1d1f] dark:text-white text-sm md:text-base">{it.question}</span>
                <FiChevronDown className={`shrink-0 text-[#6e6e73] dark:text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm text-[#6e6e73] dark:text-slate-300 leading-relaxed" style={{ whiteSpace: "pre-line" }}>
                  {it.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// Single-product hero layout ("hero_layout: product") — used by focused
// campaigns like a free-sample offer, as opposed to the parallax catalog hero.
function ProductHero({ page }) {
  const accent = page.accentColor || "#0A4DA6";

  function scrollToForm(e) {
    if (page.ctaTarget && page.ctaTarget.startsWith("#")) {
      e.preventDefault();
      document.querySelector(page.ctaTarget)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f5f7] to-white dark:from-[#0a0a1a] dark:to-[#0a0a1a] pt-10 pb-14 md:pt-16 md:pb-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left column (desktop) / top (mobile): copy + CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="order-1">
          {page.heroEyebrow && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-4 text-white" style={{ background: accent }}>
              {page.heroEyebrow}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-[#1d1d1f] dark:text-white mb-4">
            {page.heroHeadline}
          </h1>
          {page.heroSubtext && (
            <p className="text-base md:text-lg text-[#6e6e73] dark:text-slate-300 mb-6 leading-relaxed">
              {page.heroSubtext}
            </p>
          )}

          {/* Mobile hero image sits between copy and CTA per spec */}
          {page.heroImage && (
            <div className="md:hidden mb-6 rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10">
              <img src={page.heroImage} alt={page.title || "Produk"} className="w-full h-auto object-cover" loading="eager" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-6">
            {page.ctaText && (
              <a
                href={page.ctaTarget || "#"}
                onClick={scrollToForm}
                data-track="hero-cta-primary"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white shadow-lg hover:scale-105 transition-transform"
                style={{ background: accent }}
              >
                {page.ctaText} <FiArrowRight />
              </a>
            )}
            {page.secondaryCtaText && page.secondaryCtaTarget && (
              <a
                href={page.secondaryCtaTarget}
                target="_blank"
                rel="noreferrer"
                data-track="hero-cta-secondary"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold border-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ borderColor: accent, color: accent }}
              >
                <FiMessageCircle /> {page.secondaryCtaText}
              </a>
            )}
          </div>

          {page.trustBadges && page.trustBadges.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {page.trustBadges.map((b, i) => {
                const Icon = ICONS[b.icon] || FiCheck;
                return (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-semibold text-[#1d1d1f] dark:text-white">
                    <Icon className="text-sm" style={{ color: accent }} /> {b.label}
                  </span>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Right column (desktop only — mobile shows image above) */}
        {page.heroImage && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="order-2 hidden md:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
              <img src={page.heroImage} alt={page.title || "Produk"} className="w-full h-auto object-cover" loading="eager" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky mobile CTA bar */}
      {page.ctaText && (
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 bg-white/95 dark:bg-[#0a0a1a]/95 backdrop-blur border-t border-black/5 dark:border-white/10 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <a
            href={page.ctaTarget || "#"}
            onClick={scrollToForm}
            data-track="hero-cta-primary"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white shadow-lg"
            style={{ background: accent }}
          >
            {page.ctaText} <FiArrowRight />
          </a>
        </div>
      )}
    </section>
  );
}

// Dynamic lead form driven by page.formFields (form_fields_json). Falls back
// to the classic 3-field /api/contact form when formFields is empty, so
// every already-published landing page keeps its exact current behavior.
function DynamicLeadForm({ page }) {
  const accent = page.accentColor || "#0A4DA6";
  const fields = page.formFields || [];
  const [values, setValues] = useState(() => {
    const init = {};
    for (const f of fields) init[f.key] = "";
    return init;
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState(null);

  function setField(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
    if (!started) {
      setStarted(true);
      fireExternalEvent("SampleForm_Start", { landingPage: page.slug });
    }
  }

  // Key convention: fields literally named name/whatsapp/email/city map to the
  // dedicated lead columns; everything else rides in `answers`. A campaign
  // may alias its identity field (e.g. SPPG's `name_sppg`) — see comment below.
  function extractLeadColumns() {
    const answers = { ...values };
    const name = values.name ?? values.name_sppg ?? "";
    const whatsapp = values.whatsapp ?? "";
    const email = values.email ?? "";
    const city = values.city ?? "";
    return { name, whatsapp, email, city, answers };
  }

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const { name, whatsapp, email, city, answers } = extractLeadColumns();
      const utm = getUtmContext();
      const res = await fetch("/api/landing-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landingPageSlug: page.slug,
          name, whatsapp, email, city,
          answers,
          ...utm,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Gagal mengirim data. Silakan coba lagi.");
        setSending(false);
        return;
      }
      fireExternalEvent("SampleForm_Submit", { landingPage: page.slug });
      setResult(data);
      setSent(true);
    } catch {
      setError("Gagal mengirim data. Periksa koneksi Anda dan coba lagi.");
    }
    setSending(false);
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-[#fafafa] dark:bg-slate-900 text-[#1d1d1f] dark:text-white outline-none focus:ring-2";

  if (sent) {
    const displayName = (values.name || values.name_sppg || "").trim();
    const waTarget = page.secondaryCtaTarget || result?.secondaryCtaTarget || "";
    const waText = encodeURIComponent(`Halo, saya sudah mengisi form request sample untuk ${displayName || "SPPG kami"}.`);
    const waHref = waTarget
      ? (waTarget.includes("?") ? `${waTarget.split("?")[0]}?text=${waText}` : `${waTarget}?text=${waText}`)
      : "";
    return (
      <div className="text-center py-10">
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-white mb-4"
          style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
        >
          <FiCheck className="text-3xl" />
        </div>
        <p className="font-semibold text-[#1d1d1f] dark:text-white">Terima kasih! Permintaan sample Anda terkirim.</p>
        <p className="text-sm text-[#6e6e73] dark:text-slate-400 mt-1 mb-5">Tim kami akan menghubungi Anda secepatnya.</p>
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white shadow-md hover:scale-105 transition-transform"
            style={{ background: "#16a34a" }}
          >
            <FiMessageCircle /> Lanjut Chat WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form data-track-form="sample-lead" onSubmit={submit} className="space-y-4">
      {fields.map((f) => {
        if (f.type === "select") {
          return (
            <div key={f.key}>
              <select
                required={!!f.required}
                value={values[f.key] || ""}
                onChange={(e) => setField(f.key, e.target.value)}
                className={inputCls}
                style={{ "--tw-ring-color": accent }}
              >
                <option value="" disabled>{f.label || f.key}</option>
                {(f.options || []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          );
        }
        if (f.type === "textarea") {
          return (
            <textarea
              key={f.key}
              required={!!f.required}
              rows="3"
              placeholder={f.placeholder || f.label}
              value={values[f.key] || ""}
              onChange={(e) => setField(f.key, e.target.value)}
              className={inputCls}
              style={{ "--tw-ring-color": accent }}
            />
          );
        }
        return (
          <input
            key={f.key}
            required={!!f.required}
            type={f.type || "text"}
            placeholder={f.placeholder || f.label}
            value={values[f.key] || ""}
            onChange={(e) => setField(f.key, e.target.value)}
            className={inputCls}
            style={{ "--tw-ring-color": accent }}
          />
        );
      })}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100"
        style={{ background: accent }}
      >
        <FiSend /> {sending ? "Mengirim…" : "Kirim Permintaan"}
      </button>
      <p className="text-xs text-center text-[#6e6e73] dark:text-slate-500">
        Data Anda aman dan hanya digunakan untuk proses pengiriman sample.
      </p>
    </form>
  );
}

export default function LandingPage({ initialData, productsData }) {
  const page = initialData || {};
  const accent = page.accentColor || "#0A4DA6";
  const [products, setProducts] = useState(productsData || []);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!productsData || productsData.length === 0) {
      getProducts().then((res) => {
        if (res && res.length > 0) {
          setProducts(
            res.map((p) => ({
              title: p.title,
              category: p.category,
              priceText: p.priceText,
              thumbnail: p.image || "/catalog-1.webp",
              link: "/catalog",
            }))
          );
        }
      });
    }
  }, [productsData]);

  const heroProducts = products.length > 0 ? products : [
    { title: page.title || "Hero Product", thumbnail: page.heroImage || "/catalog-1.webp", link: page.ctaTarget || "#" },
    { title: "Neon Box Akrilik LED", thumbnail: "/catalog-1.webp", link: "/catalog" },
    { title: "Banner Flexi High Res", thumbnail: "/catalog-2.webp", link: "/catalog" },
    { title: "Huruf Timbul Stainless", thumbnail: "/catalog-3.webp", link: "/catalog" },
    { title: "Buku & Brosur Profil", thumbnail: "/catalog-4.webp", link: "/catalog" },
    { title: "Stiker & Label Custom", thumbnail: "/catalog-5.webp", link: "/catalog" },
  ];

  function handleCta() {
    if (page.ctaTarget) {
      window.location.href = page.ctaTarget;
    }
  }

  async function submitForm(e) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject: `Lead dari landing: ${page.title}` }),
      });
      setSent(true);
    } catch {
      setSent(true);
    }
    setSending(false);
  }

  const isProductHero = page.heroLayout === "product";

  return (
    <main className={`min-h-screen bg-white dark:bg-[#0a0a1a] ${isProductHero ? "pb-20 md:pb-0" : ""}`}>
      {/* HERO */}
      {isProductHero ? (
        <ProductHero page={page} />
      ) : (
        <HeroParallax
          title={page.heroHeadline}
          subtitle={page.heroSubtext}
          badgeText={page.badgeText}
          ctaText={page.ctaText}
          ctaLink={page.ctaTarget}
          accentColor={accent}
          products={heroProducts}
        />
      )}

      {/* TRUST BADGES (parallax hero only — product hero shows its own inline badge row) */}
      {!isProductHero && page.trustBadges && page.trustBadges.length > 0 && (
        <div className="bg-slate-900/90 backdrop-blur py-6 px-6 border-y border-white/10 relative z-30">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 text-white">
            {page.trustBadges.map((b, i) => {
              const Icon = ICONS[b.icon] || FiCheck;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-xs font-semibold ring-1 ring-white/15"
                >
                  <Icon className="text-sm text-blue-400" /> {b.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTIONS */}
      {(page.sections || []).map((s, i) => (
        <SectionRenderer key={i} section={s} />
      ))}

      {/* MAP / LOCATION */}
      <MapSection page={page} />

      {/* TESTIMONI SLIDER */}
      <TestimonialSlider page={page} />

      {/* CTA BAND (dinamis dari admin) */}
      {page.ctaText && (page.ctaBandHeading || page.ctaBandText) && (
        <div className="px-6 py-12">
          <div
            className="max-w-4xl mx-auto rounded-3xl px-8 py-10 text-center text-white shadow-xl"
            style={{ background: `linear-gradient(135deg, ${accent}, #07142b)` }}
          >
            <FiAward className="mx-auto text-4xl mb-3 text-white/90" />
            {page.ctaBandHeading && (
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{page.ctaBandHeading}</h3>
            )}
            {page.ctaBandText && (
              <p className="text-white/80 mb-6 max-w-xl mx-auto">{page.ctaBandText}</p>
            )}
            <button
              onClick={handleCta}
              data-track="cta-bottom"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg bg-white hover:scale-105 transition-transform"
              style={{ color: accent }}
            >
              {page.ctaText} <FiArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* LEAD FORM */}
      {page.formEnabled && (
        <section id="sample-form" className="max-w-xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-white dark:bg-slate-800/70 rounded-3xl p-8 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
          >
            {page.formTitle && (
              <div
                className="absolute -top-5 left-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg"
                style={{ background: accent }}
              >
                <FiSend /> {page.formTitle}
              </div>
            )}
            <h2 className="text-2xl font-bold mt-3 mb-2 text-[#1d1d1f] dark:text-white">
              {page.formTitle || "Tertarik? Hubungi kami"}
            </h2>
            <p className="text-sm text-[#6e6e73] dark:text-slate-300 mb-6">
              {page.formSubtext || "Isi form, tim kami akan segera menghubungi Anda."}
            </p>
            {page.formFields && page.formFields.length > 0 ? (
              <DynamicLeadForm page={page} />
            ) : sent ? (
              <div className="text-center py-10">
                <div
                  className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-white mb-4"
                  style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
                >
                  <FiCheck className="text-3xl" />
                </div>
                <p className="font-semibold text-[#1d1d1f] dark:text-white">Terima kasih! Pesan Anda terkirim.</p>
                <p className="text-sm text-[#6e6e73] dark:text-slate-400 mt-1">Tim kami akan menghubungi Anda secepatnya.</p>
              </div>
            ) : (
              <form data-track-form="lead" onSubmit={submitForm} className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Nama Anda"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-[#fafafa] dark:bg-slate-900 text-[#1d1d1f] dark:text-white outline-none focus:ring-2"
                  style={{ "--tw-ring-color": accent }}
                />
                <input
                  required
                  type="tel"
                  placeholder="No. WhatsApp / HP"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-[#fafafa] dark:bg-slate-900 text-[#1d1d1f] dark:text-white outline-none focus:ring-2"
                  style={{ "--tw-ring-color": accent }}
                />
                <textarea
                  placeholder="Pesan / Kebutuhan"
                  rows="3"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-[#fafafa] dark:bg-slate-900 text-[#1d1d1f] dark:text-white outline-none focus:ring-2"
                  style={{ "--tw-ring-color": accent }}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100"
                  style={{ background: accent }}
                >
                  <FiSend /> {sending ? "Mengirim…" : "Kirim Pesan"}
                </button>
                <p className="text-xs text-center text-[#6e6e73] dark:text-slate-500">
                  Data Anda aman dan hanya digunakan untuk follow-up penawaran.
                </p>
              </form>
            )}
          </motion.div>
        </section>
      )}
    </main>
  );
}
