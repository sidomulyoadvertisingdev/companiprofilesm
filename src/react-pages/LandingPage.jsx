import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight, FiCheck, FiSend, FiStar, FiShield, FiClock,
  FiTruck, FiAward, FiHeadphones, FiThumbsUp, FiZap, FiGift, FiMapPin,
  FiChevronLeft, FiChevronRight,
} from "react-icons/fi";

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
    const items = section.items || [];
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
  return null;
}

export default function LandingPage({ initialData }) {
  const page = initialData || {};
  const accent = page.accentColor || "#0A4DA6";
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

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

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a1a]">
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent} 0%, #07142b 100%)` }}
      >
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center text-white">
          {page.badgeText && (
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-medium mb-6 ring-1 ring-white/20"
            >
              <FiStar className="text-yellow-300" /> {page.badgeText}
            </motion.span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 drop-shadow"
          >
            {page.heroHeadline}
          </motion.h1>

          {page.heroSubtext && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-base md:text-lg max-w-2xl mx-auto mb-9 text-white/85 leading-relaxed"
            >
              {page.heroSubtext}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            {page.ctaText && (
              <button
                onClick={handleCta}
                data-track="cta-hero"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg bg-white shadow-lg hover:scale-105 hover:shadow-xl transition-all"
                style={{ color: accent }}
              >
                {page.ctaText} <FiArrowRight />
              </button>
            )}
          </motion.div>

          {page.heroImage && (
            <motion.img
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              src={page.heroImage}
              alt={page.title}
              className="mx-auto rounded-3xl shadow-2xl ring-1 ring-white/15 max-h-80 object-cover"
              loading="lazy"
            />
          )}

          {/* trust badges (dinamis dari admin) */}
          {page.trustBadges && page.trustBadges.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {page.trustBadges.map((b, i) => {
                const Icon = ICONS[b.icon] || FiCheck;
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-xs font-medium ring-1 ring-white/15"
                  >
                    <Icon className="text-sm" /> {b.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </section>

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
        <section className="max-w-xl mx-auto px-6 py-12">
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
            {sent ? (
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
