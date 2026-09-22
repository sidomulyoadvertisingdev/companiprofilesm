import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiChevronDown,
  FiMessageCircle,
  FiArrowRight,
} from "react-icons/fi";

// Self-contained ad-campaign landing page. Deliberately does NOT import
// anything from LandingPage.jsx / the general CMS landing-page engine —
// this component is a standalone parallel feature.

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function Reveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function isWaLink(target) {
  return typeof target === "string" && /wa\.me|api\.whatsapp\.com/.test(target);
}

function CtaButton({ text, target, variant = "primary", className = "", accent }) {
  if (!text) return null;
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold text-sm sm:text-base transition-transform active:scale-[0.98] shadow-sm";
  const styles =
    variant === "primary"
      ? "text-white hover:opacity-90"
      : "border-2 bg-white/90 hover:bg-white dark:bg-transparent dark:text-white";
  const style =
    variant === "primary"
      ? { backgroundColor: accent }
      : { borderColor: accent, color: accent };

  const isAnchor = typeof target === "string" && target.startsWith("#");
  const href = target || "#";

  return (
    <a
      href={href}
      target={isAnchor ? undefined : "_blank"}
      rel={isAnchor ? undefined : "noopener noreferrer"}
      className={`${base} ${styles} ${className}`}
      style={style}
    >
      {text}
      <FiArrowRight aria-hidden="true" />
    </a>
  );
}

function Hero({ campaign, accent }) {
  const badges = Array.isArray(campaign.heroBadges) ? campaign.heroBadges : [];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a1a] dark:to-[#0a0a1a] pt-10 pb-16 sm:pt-16 sm:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
        <div className="order-1">
          {campaign.heroEyebrow && (
            <span
              className="inline-block text-xs sm:text-sm font-bold tracking-wide uppercase px-3 py-1 rounded-full mb-4"
              style={{ color: accent, backgroundColor: `${accent}1a` }}
            >
              {campaign.heroEyebrow}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-[#1d1d1f] dark:text-white">
            {campaign.heroHeadline}
          </h1>
          {campaign.heroSubtext && (
            <p className="mt-4 text-base sm:text-lg text-[#4b5563] dark:text-slate-300 max-w-xl">
              {campaign.heroSubtext}
            </p>
          )}

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {badges.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"
                >
                  <FiCheckCircle style={{ color: accent }} />
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="order-2 md:order-2">
          <img
            src={campaign.heroImage || "/hero-product.webp"}
            alt={campaign.title}
            className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3] md:aspect-square"
            loading="eager"
          />
        </div>

        <div className="order-3 md:order-3 hidden md:flex flex-wrap gap-3 mt-2">
          <CtaButton text={campaign.primaryCtaText} target={campaign.primaryCtaTarget} accent={accent} />
          <CtaButton
            text={campaign.secondaryCtaText}
            target={campaign.secondaryCtaTarget}
            variant="secondary"
            accent={accent}
          />
        </div>

        <div className="order-3 md:hidden flex flex-col gap-3">
          <CtaButton text={campaign.primaryCtaText} target={campaign.primaryCtaTarget} accent={accent} className="w-full" />
          <CtaButton
            text={campaign.secondaryCtaText}
            target={campaign.secondaryCtaTarget}
            variant="secondary"
            accent={accent}
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}

function CardGrid({ heading, badge, items, accent }) {
  const active = (items || []).filter((it) => it.active !== false);
  if (!active.length) return null;
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          {badge && (
            <span
              className="inline-block text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full mb-3"
              style={{ color: accent, backgroundColor: `${accent}1a` }}
            >
              {badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white">{heading}</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {active.map((item, i) => (
            <Reveal
              key={i}
              delay={i * 0.06}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ backgroundColor: `${accent}1a`, color: accent }}
              >
                {item.icon ? (
                  <img src={item.icon} alt="" className="w-6 h-6 object-contain" />
                ) : (
                  <FiCheckCircle />
                )}
              </div>
              <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-1.5">{item.title}</h3>
              {item.desc && (
                <p className="text-sm text-[#6e6e73] dark:text-slate-400 leading-relaxed">{item.desc}</p>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepsSection({ heading, badge, items, accent }) {
  const active = (items || []).filter((it) => it.active !== false);
  if (!active.length) return null;
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-white/[0.03]">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          {badge && (
            <span
              className="inline-block text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full mb-3"
              style={{ color: accent, backgroundColor: `${accent}1a` }}
            >
              {badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white">{heading}</h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-6 relative">
          {active.map((item, i) => (
            <Reveal key={i} delay={i * 0.08} className="relative text-center">
              <div
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-lg font-bold text-white mb-4"
                style={{ backgroundColor: accent }}
              >
                {item.number || i + 1}
              </div>
              <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-1.5">{item.title}</h3>
              {item.desc && (
                <p className="text-sm text-[#6e6e73] dark:text-slate-400 leading-relaxed">{item.desc}</p>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ heading, items, accent }) {
  const active = (items || []).filter((it) => it.active !== false);
  const [openIndex, setOpenIndex] = useState(0);
  if (!active.length) return null;
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white">{heading}</h2>
        </Reveal>
        <div className="space-y-3">
          {active.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-[#1d1d1f] dark:text-white text-sm sm:text-base">
                    {item.question}
                  </span>
                  <FiChevronDown
                    className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: accent }}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-[#6e6e73] dark:text-slate-400 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SectionsLoop({ sections, accent }) {
  if (!Array.isArray(sections)) return null;
  return sections.map((section, idx) => {
    const key = `${section.type}-${idx}`;
    if (section.type === "problems" || section.type === "benefits" || section.type === "areas") {
      const badge = section.type === "areas" ? section.badge || "Area Free Sample" : section.badge;
      const items =
        section.type === "areas"
          ? (section.items || []).map((it) => ({ ...it, icon: it.icon }))
          : section.items;
      return <CardGrid key={key} heading={section.heading} badge={badge} items={items} accent={accent} />;
    }
    if (section.type === "steps") {
      return (
        <StepsSection key={key} heading={section.heading} badge={section.badge} items={section.items} accent={accent} />
      );
    }
    if (section.type === "faq") {
      return <FaqSection key={key} heading={section.heading} items={section.items} accent={accent} />;
    }
    return null;
  });
}

function CtaBand({ campaign, accent }) {
  if (!campaign.ctaBandHeading && !campaign.ctaBandText) return null;
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ backgroundColor: `${accent}0d` }}>
      <Reveal className="max-w-3xl mx-auto text-center">
        {campaign.ctaBandHeading && (
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white mb-3">
            {campaign.ctaBandHeading}
          </h2>
        )}
        {campaign.ctaBandText && (
          <p className="text-[#4b5563] dark:text-slate-300 mb-6">{campaign.ctaBandText}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <CtaButton text={campaign.primaryCtaText} target={campaign.primaryCtaTarget} accent={accent} />
        </div>
        {campaign.whatsappShortcutText && (
          <p className="mt-4 text-xs sm:text-sm text-[#6e6e73] dark:text-slate-400 inline-flex items-center gap-1.5 justify-center">
            <FiMessageCircle /> {campaign.whatsappShortcutText}
          </p>
        )}
      </Reveal>
    </section>
  );
}

const PHONE_RE = /^(\+?62|0)8[0-9]{7,12}$/;

function LeadForm({ campaign, accent }) {
  const fields = useMemo(
    () => (Array.isArray(campaign.formFields) ? campaign.formFields : []),
    [campaign.formFields]
  );
  const initial = useMemo(() => {
    const obj = {};
    for (const f of fields) obj[f.key] = "";
    return obj;
  }, [fields]);

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(null);

  if (!campaign.formEnabled) return null;

  function setField(key, value) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function validate() {
    const errs = {};
    for (const f of fields) {
      const val = (values[f.key] || "").trim();
      if (f.required && !val) {
        errs[f.key] = "Wajib diisi";
        continue;
      }
      if (f.type === "tel" && val && !PHONE_RE.test(val.replace(/[\s-]/g, ""))) {
        errs[f.key] = "Nomor WhatsApp tidak valid";
      }
      if (f.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errs[f.key] = "Email tidak valid";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);

    // Known top-level lead identity fields; everything else is a dynamic answer.
    // (See form_fields_json seed comment: `name`, `whatsapp`, `email`, `city`
    // map to the lead's core columns; the rest goes into `answers`.)
    const KNOWN = ["name", "whatsapp", "email", "city"];
    const answers = {};
    for (const f of fields) {
      if (!KNOWN.includes(f.key)) answers[f.key] = values[f.key];
    }

    const params = new URLSearchParams(window.location.search);

    try {
      const res = await fetch("/api/ad-campaign-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignSlug: campaign.slug,
          name: values.name,
          whatsapp: values.whatsapp,
          email: values.email,
          city: values.city,
          message: values.message,
          answers,
          utmSource: params.get("utm_source"),
          utmMedium: params.get("utm_medium"),
          utmCampaign: params.get("utm_campaign"),
          utmContent: params.get("utm_content"),
          utmTerm: params.get("utm_term"),
          referrer: document.referrer || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data.message || "Gagal mengirim, coba lagi.");
        return;
      }
      setSuccess(data);
    } catch {
      setSubmitError("Gagal mengirim, periksa koneksi internet Anda.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    const waTarget = isWaLink(success.secondaryCtaTarget) ? success.secondaryCtaTarget : null;
    return (
      <section id="sample-form" className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-lg mx-auto text-center rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-sm">
          <FiCheckCircle className="mx-auto text-4xl mb-4" style={{ color: accent }} />
          <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2">Terima kasih!</h3>
          <p className="text-sm text-[#6e6e73] dark:text-slate-400 mb-6">
            Data Anda sudah kami terima. Tim kami akan segera menghubungi Anda.
          </p>
          {waTarget && (
            <a
              href={waTarget}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-white text-sm"
              style={{ backgroundColor: accent }}
            >
              <FiMessageCircle /> Lanjut Chat WhatsApp
            </a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="sample-form" className="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-white/[0.03]">
      <div className="max-w-lg mx-auto">
        <Reveal className="text-center mb-8">
          {campaign.formTitle && (
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white mb-2">
              {campaign.formTitle}
            </h2>
          )}
          {campaign.formSubtext && (
            <p className="text-sm sm:text-base text-[#6e6e73] dark:text-slate-400">{campaign.formSubtext}</p>
          )}
        </Reveal>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 sm:p-8 shadow-sm space-y-4"
        >
          {submitError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">
              <FiAlertCircle /> {submitError}
            </div>
          )}
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-[#1d1d1f] dark:text-slate-200 mb-1.5">
                {f.label} {f.required && <span className="text-red-500">*</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={values[f.key] || ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ "--tw-ring-color": accent }}
                />
              ) : f.type === "select" ? (
                <select
                  value={values[f.key] || ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                >
                  <option value="">Pilih...</option>
                  {(f.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  value={values[f.key] || ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl border border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                />
              )}
              {errors[f.key] && <p className="mt-1 text-xs text-red-500">{errors[f.key]}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full py-3.5 font-semibold text-white text-sm sm:text-base disabled:opacity-60"
            style={{ backgroundColor: accent }}
          >
            {submitting ? "Mengirim..." : campaign.primaryCtaText || "Kirim"}
          </button>
        </form>
      </div>
    </section>
  );
}

function StickyMobileCta({ campaign, accent }) {
  if (!campaign.primaryCtaText) return null;
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0a0a1a]/95 backdrop-blur border-t border-slate-200 dark:border-white/10 px-4 py-3"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <CtaButton text={campaign.primaryCtaText} target={campaign.primaryCtaTarget} accent={accent} className="w-full" />
    </div>
  );
}

export default function AdCampaignLanding({ campaign }) {
  const accent = campaign.accentColor || "#0A4DA6";

  return (
    <main className="pb-24 md:pb-0">
      <Hero campaign={campaign} accent={accent} />
      <SectionsLoop sections={campaign.sections} accent={accent} />
      <CtaBand campaign={campaign} accent={accent} />
      <LeadForm campaign={campaign} accent={accent} />
      <footer className="py-8 px-4 text-center text-xs text-[#6e6e73] dark:text-slate-500 flex items-center justify-center gap-1.5">
        <FiMapPin /> Sidomulyo Advertising & Printing
      </footer>
      <StickyMobileCta campaign={campaign} accent={accent} />
    </main>
  );
}
