import { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck, FiSend } from "react-icons/fi";

function SectionRenderer({ section }) {
  if (!section) return null;
  if (section.type === "text") {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        {section.heading && <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#1d1d1f] dark:text-white" style={{ color: section.headingColor || undefined }}>{section.heading}</h2>}
        <p className="text-base leading-relaxed text-[#6e6e73] dark:text-slate-300" style={{ whiteSpace: "pre-line" }}>{section.body}</p>
      </div>
    );
  }
  if (section.type === "image") {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        {section.heading && <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-[#1d1d1f] dark:text-white">{section.heading}</h2>}
        {section.image && <img src={section.image} alt={section.heading || "Gambar"} className="w-full rounded-2xl shadow-lg" loading="lazy" />}
      </div>
    );
  }
  if (section.type === "features") {
    const items = section.items || [];
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        {section.heading && <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#1d1d1f] dark:text-white">{section.heading}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <div key={i} className="bg-[#f5f5f7] dark:bg-slate-800/60 rounded-2xl p-5" data-track="section-feature">
              <div className="flex items-center gap-2 mb-2">
                <FiCheck className="text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-[#1d1d1f] dark:text-white">{it.title}</h3>
              </div>
              {it.desc && <p className="text-sm text-[#6e6e73] dark:text-slate-300">{it.desc}</p>}
            </div>
          ))}
        </div>
      </div>
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
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent} 0%, #0a0a1a 120%)` }}>
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold leading-tight mb-5"
          >
            {page.heroHeadline}
          </motion.h1>
          {page.heroSubtext && (
            <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 text-white/85">{page.heroSubtext}</p>
          )}
          {page.heroImage && (
            <img src={page.heroImage} alt={page.title} className="mx-auto mb-8 rounded-2xl shadow-2xl max-h-80 object-cover" loading="lazy" />
          )}
          {page.ctaText && (
            <button
              onClick={handleCta}
              data-track="cta-hero"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg bg-white text-[#0a0a1a] hover:scale-105 transition-transform"
              style={{ color: accent }}
            >
              {page.ctaText} <FiArrowRight />
            </button>
          )}
        </div>
      </section>

      {/* SECTIONS */}
      {(page.sections || []).map((s, i) => (
        <SectionRenderer key={i} section={s} />
      ))}

      {/* CTA MIDDLE */}
      {page.ctaText && (
        <div className="max-w-3xl mx-auto px-6 py-10 text-center">
          <button
            onClick={handleCta}
            data-track="cta-bottom"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg text-white hover:scale-105 transition-transform"
            style={{ background: accent }}
          >
            {page.ctaText} <FiArrowRight />
          </button>
        </div>
      )}

      {/* LEAD FORM */}
      {page.formEnabled && (
        <section className="max-w-xl mx-auto px-6 py-12">
          <div className="bg-[#f5f5f7] dark:bg-slate-800/60 rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-2 text-[#1d1d1f] dark:text-white">Tertarik? Hubungi kami</h2>
            <p className="text-sm text-[#6e6e73] dark:text-slate-300 mb-6">Isi form, tim kami akan segera menghubungi Anda.</p>
            {sent ? (
              <div className="text-center py-8">
                <FiCheck className="mx-auto text-4xl text-green-600 dark:text-green-400 mb-3" />
                <p className="font-semibold text-[#1d1d1f] dark:text-white">Terima kasih! Pesan Anda terkirim.</p>
              </div>
            ) : (
              <form data-track-form="lead" onSubmit={submitForm} className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Nama Anda"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[#1d1d1f] dark:text-white outline-none focus:ring-2"
                  style={{ "--tw-ring-color": accent }}
                />
                <input
                  required
                  type="tel"
                  placeholder="No. WhatsApp / HP"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[#1d1d1f] dark:text-white outline-none focus:ring-2"
                  style={{ "--tw-ring-color": accent }}
                />
                <textarea
                  placeholder="Pesan / Kebutuhan"
                  rows="3"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[#1d1d1f] dark:text-white outline-none focus:ring-2"
                  style={{ "--tw-ring-color": accent }}
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white disabled:opacity-60"
                  style={{ background: accent }}
                >
                  <FiSend /> {sending ? "Mengirim…" : "Kirim Pesan"}
                </button>
              </form>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
