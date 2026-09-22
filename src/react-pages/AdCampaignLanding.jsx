import { Fragment, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiChevronDown,
  FiChevronRight,
  FiMessageCircle,
  FiArrowRight,
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
  FiLock,
  FiImage,
  FiPackage,
  FiSend,
  FiStar,
} from "react-icons/fi";

// Self-contained ad-campaign landing page. Deliberately does NOT import
// anything from LandingPage.jsx / the general CMS landing-page engine —
// this component is a standalone parallel feature.

const NAVY = "#0B1E3D";
const GOLD = "#D4AF37";
// Primary CTA color — reuses the site's own brand blue (tailwind.config.js
// `brand.primary`) instead of orange, per brand guidance.
const BLUE = "#2563EB";
const GREEN = "#16A34A";

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

// Icon-key -> react-icons/fi component lookup. Section/item JSON stores a
// plain string key (e.g. "frown", "shield"); this is never a photo/image —
// photos are handled separately via ImagePlaceholder below.
const ICON_MAP = {
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

const FORM_FIELD_ICONS = {
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

// Clean, deliberate empty-state for any photo field that hasn't been
// uploaded yet through the admin editor — never a broken <img>.
function ImagePlaceholder({ label = "Foto akan ditambahkan", className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 dark:border-white/15 dark:bg-white/[0.03] dark:text-slate-500 ${className}`}
    >
      <FiImage size={28} aria-hidden="true" />
      <span className="text-xs font-medium text-center px-3">{label}</span>
    </div>
  );
}

function CtaButton({ text, target, variant = "primary", className = "", accent, arrow, icon: Icon }) {
  if (!text) return null;
  const showArrow = arrow !== undefined ? arrow : variant === "primary";
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold text-sm sm:text-base transition-transform active:scale-[0.98] shadow-sm";
  const styles = "text-white hover:opacity-90";
  const style = { backgroundColor: accent };

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
      {Icon && <Icon aria-hidden="true" />}
      {text}
      {showArrow && <FiArrowRight aria-hidden="true" />}
    </a>
  );
}

function TopNav({ campaign, accent }) {
  const sampleTarget = campaign.primaryCtaTarget || "#sample-form";
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0a0a1a]/95 backdrop-blur border-b border-slate-200 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <a href="#produk" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <span
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-extrabold text-xs sm:text-sm shrink-0"
            style={{ backgroundColor: accent }}
          >
            S
          </span>
          <span className="leading-tight min-w-0">
            <span className="block text-xs sm:text-sm font-bold text-[#1d1d1f] dark:text-white truncate max-w-[130px] sm:max-w-none">
              SIDOMULYO ADVERTISING
            </span>
            <span className="hidden sm:block text-[9px] font-medium tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Solusi Visual untuk Bisnis Anda
            </span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4b5563] dark:text-slate-300">
          <a href="#produk" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
            Produk
          </a>
          <a href="#cara-kerja" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
            Cara Kerja
          </a>
          <a href="#area-layanan" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
            Area Layanan
          </a>
          <a href="#testimoni" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
            Testimoni
          </a>
          <a href="#faq" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        <a
          href={sampleTarget}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shrink-0"
          style={{ backgroundColor: BLUE }}
        >
          <FiGift aria-hidden="true" /> <span className="hidden sm:inline">Minta Sample Gratis</span>
          <span className="sm:hidden">Sample Gratis</span>
        </a>
      </div>
    </header>
  );
}

// Splits a headline string and wraps the given word(s) as a filled green pill,
// matching the mockup where "GRATIS" appears as a badge inline in the headline.
function HighlightedHeadline({ text, highlight = "GRATIS" }) {
  if (!text) return null;
  const parts = text.split(new RegExp(`(${highlight})`, "g"));
  return (
    <>
      {parts.map((part, i) =>
        part === highlight ? (
          <span
            key={i}
            className="inline-block align-middle text-white text-[0.85em] font-extrabold px-2.5 py-0.5 rounded-full mx-0.5"
            style={{ backgroundColor: GREEN }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function HeroBadgeStack({ badges }) {
  const active = (badges || []).filter(Boolean);
  if (!active.length) return null;
  return (
    <div
      className="absolute -top-4 right-3 sm:-top-6 sm:right-6 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-center gap-0.5 shadow-lg border-4 border-white p-2 z-10"
      style={{ backgroundColor: NAVY }}
    >
      {active.map((b, i) => (
        <span
          key={i}
          className="text-[9px] sm:text-[10px] font-extrabold uppercase leading-tight tracking-wide"
          style={{ color: String(b).toLowerCase() === "praktis" ? "#4ADE80" : "#ffffff" }}
        >
          {b}
        </span>
      ))}
    </div>
  );
}

function Hero({ campaign, accent }) {
  const badges = Array.isArray(campaign.heroBadges) ? campaign.heroBadges : [];
  const trustPoints = Array.isArray(campaign.heroTrustPoints) ? campaign.heroTrustPoints : [];

  return (
    <section
      id="produk"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0a1a] dark:to-[#0a0a1a] pt-10 pb-16 sm:pt-16 sm:pb-24 scroll-mt-16"
    >
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: NAVY }}>
            <HighlightedHeadline text={campaign.heroHeadline} />
          </h1>
          {campaign.heroSubtext && (
            <p className="mt-4 text-base sm:text-lg text-[#4b5563] dark:text-slate-300 max-w-xl">
              {campaign.heroSubtext}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <CtaButton text={campaign.primaryCtaText} target={campaign.primaryCtaTarget} accent={BLUE} icon={FiGift} />
            <CtaButton
              text={campaign.secondaryCtaText}
              target={campaign.secondaryCtaTarget}
              accent={GREEN}
              arrow={false}
              icon={FiMessageCircle}
            />
          </div>

          {trustPoints.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-7">
              {trustPoints.map((tp, i) => {
                const Icon = ICON_MAP[tp.icon] || FiCheckCircle;
                const color = i === 0 ? GREEN : i === 1 ? accent : NAVY;
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#374151] dark:text-slate-300"
                  >
                    <Icon style={{ color }} aria-hidden="true" />
                    {tp.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="order-2 relative">
          {campaign.heroImage ? (
            <img
              src={campaign.heroImage}
              alt={campaign.title}
              className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3] md:aspect-square"
              loading="eager"
            />
          ) : (
            <ImagePlaceholder
              label="Foto produk akan ditambahkan"
              className="w-full aspect-[4/3] md:aspect-square rounded-3xl shadow-xl"
            />
          )}
          <HeroBadgeStack badges={badges} />
        </div>
      </div>
    </section>
  );
}

function IconCard({ icon, title, desc, iconBg, iconColor, delay = 0 }) {
  const Icon = ICON_MAP[icon] || FiCheckCircle;
  return (
    <Reveal
      delay={delay}
      className="rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-lg mb-4"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        <Icon aria-hidden="true" />
      </div>
      <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-1.5">{title}</h3>
      {desc && <p className="text-sm text-[#6e6e73] dark:text-slate-400 leading-relaxed">{desc}</p>}
    </Reveal>
  );
}

function SectionHeading({ heading, subheading }) {
  return (
    <Reveal className="text-center max-w-2xl mx-auto mb-10">
      <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY }}>
        {heading}
      </h2>
      {subheading && (
        <p className="mt-2 text-sm sm:text-base text-[#6e6e73] dark:text-slate-400">{subheading}</p>
      )}
    </Reveal>
  );
}

function ProblemsSection({ section }) {
  const items = (section.items || []).filter((it) => it.active !== false);
  if (!items.length) return null;
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 bg-sky-50/70 dark:bg-white/[0.03]">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          heading={section.heading}
          subheading="Kami memahami tantangan Anda, karena itu kami hadir dengan solusi yang tepat."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <IconCard
              key={i}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
              iconBg="#FEE2E2"
              iconColor="#DC2626"
              delay={i * 0.06}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection({ section }) {
  const items = (section.items || []).filter((it) => it.active !== false);
  if (!items.length) return null;
  return (
    <section id="solusi" className="py-14 sm:py-20 px-4 sm:px-6 bg-green-50/60 dark:bg-white/[0.03] scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          heading={section.heading}
          subheading="Dirancang khusus untuk kebutuhan operasional SPPG yang dinamis."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => {
            const blue = i % 2 === 0;
            return (
              <IconCard
                key={i}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                iconBg={blue ? "#DBEAFE" : "#DCFCE7"}
                iconColor={blue ? "#2563EB" : "#16A34A"}
                delay={i * 0.06}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, accent }) {
  return (
    <div className="flex-1 text-center max-w-[260px] sm:max-w-none">
      <div
        className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-base font-bold text-white mb-3"
        style={{ backgroundColor: accent }}
      >
        {step.number || "•"}
      </div>
      <h4 className="font-semibold text-sm text-[#1d1d1f] dark:text-white mb-1">{step.title}</h4>
      {step.desc && <p className="text-xs text-[#6e6e73] dark:text-slate-400 leading-relaxed">{step.desc}</p>}
    </div>
  );
}

function StepsInfo({ section, accent }) {
  const items = (section.items || []).filter((it) => it.active !== false);
  return (
    <div>
      <Reveal>
        {section.badge && (
          <span
            className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 text-white"
            style={{ backgroundColor: GREEN }}
          >
            {section.badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: NAVY }}>
          {section.heading}
        </h2>
        <p className="text-sm sm:text-base text-[#6e6e73] dark:text-slate-400 mb-8">
          Proses mudah, cepat, dan tanpa biaya.
        </p>
      </Reveal>
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-4">
          {items.map((step, i) => (
            <Fragment key={i}>
              <StepCard step={step} accent={accent} />
              {i < items.length - 1 && (
                <div className="hidden sm:flex items-center justify-center text-slate-300 dark:text-white/20 pt-3">
                  <FiChevronRight size={20} aria-hidden="true" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

const PHONE_RE = /^(\+?62|0)8[0-9]{7,12}$/;

function LeadFormCard({ campaign, accent }) {
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
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden text-center p-8">
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
            style={{ backgroundColor: GREEN }}
          >
            <FiMessageCircle /> Lanjut Chat WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden">
      <div className="px-6 sm:px-8 py-6" style={{ backgroundColor: NAVY }}>
        {campaign.formTitle && (
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5">{campaign.formTitle}</h2>
        )}
        {campaign.formSubtext && <p className="text-sm text-slate-300">{campaign.formSubtext}</p>}
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
        {submitError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2">
            <FiAlertCircle /> {submitError}
          </div>
        )}
        {fields.map((f) => {
          const Icon = FORM_FIELD_ICONS[f.key] || (f.type === "tel" ? FiPhone : f.type === "email" ? FiMail : f.type === "textarea" ? FiEdit3 : FiUser);
          return (
            <div key={f.key}>
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#1d1d1f] dark:text-slate-200 mb-1.5">
                <Icon className="shrink-0" style={{ color: accent }} aria-hidden="true" />
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
          );
        })}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-white text-sm sm:text-base disabled:opacity-60"
          style={{ backgroundColor: BLUE }}
        >
          {submitting ? (
            "Mengirim..."
          ) : (
            <>
              <FiSend aria-hidden="true" /> Kirim Permintaan Sample
            </>
          )}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-[#6e6e73] dark:text-slate-400 pt-1">
          <FiLock aria-hidden="true" /> Data Anda aman dan hanya digunakan untuk keperluan pengiriman sample.
        </p>
      </form>
    </div>
  );
}

function SampleSection({ stepsSection, campaign, accent }) {
  if (!stepsSection && !campaign.formEnabled) return null;
  return (
    <section
      id="cara-kerja"
      className="py-14 sm:py-20 px-4 sm:px-6 bg-white dark:bg-[#0a0a1a] scroll-mt-16"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <Reveal>{stepsSection ? <StepsInfo section={stepsSection} accent={accent} /> : <div />}</Reveal>
        <Reveal delay={0.1}>
          <LeadFormCard campaign={campaign} accent={accent} />
        </Reveal>
      </div>
    </section>
  );
}

function AreaCard({ item, delay }) {
  return (
    <Reveal delay={delay} className="relative rounded-2xl overflow-hidden shadow-sm aspect-[4/3]">
      {item.icon ? (
        <img src={item.icon} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <ImagePlaceholder label="Foto belum diupload" className="w-full h-full" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-white text-sm font-semibold">
          <FiMapPin aria-hidden="true" /> {item.title}
        </span>
      </div>
    </Reveal>
  );
}

function AreasSection({ section }) {
  const items = (section.items || []).filter((it) => it.active !== false);
  if (!items.length) return null;
  return (
    <section id="area-layanan" className="py-14 sm:py-20 px-4 sm:px-6 bg-white dark:bg-[#0a0a1a] scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading heading={section.heading} subheading="Prioritas untuk SPPG aktif di 3 wilayah ini." />
        <div className="grid sm:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <AreaCard key={i} item={item} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCard({ item, delay }) {
  return (
    <Reveal delay={delay} className="relative rounded-xl overflow-hidden shadow-sm aspect-square">
      {item.image ? (
        <img src={item.image} alt={item.caption || "Sample produk"} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <ImagePlaceholder label="Foto belum diupload" className="w-full h-full" />
      )}
      {item.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
          <span className="text-white text-xs font-medium leading-tight">{item.caption}</span>
        </div>
      )}
    </Reveal>
  );
}

function GallerySection({ section }) {
  const items = (section.items || []).filter((it) => it.active !== false);
  if (!items.length) return null;
  return (
    <section id="produk-sample" className="py-14 sm:py-20 px-4 sm:px-6 bg-white dark:bg-[#0a0a1a] scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          heading={section.heading}
          subheading="Lihat langsung tampilan sample label removable pada ompreng."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <GalleryCard key={i} item={item} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Common Indonesian honorifics — skipped when deriving an initial so e.g.
// "Ibu Sri Wahyuni" and "Ibu Dewi Lestari" don't both show "I".
const HONORIFICS = ["ibu", "bapak", "bu", "pak", "sdr", "sdri"];

function initialFromName(name) {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  const word = words.find((w) => !HONORIFICS.includes(w.toLowerCase())) || words[0];
  return (word || "?").charAt(0).toUpperCase();
}

function Avatar({ name, image, accent }) {
  if (image) {
    return <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover shrink-0" loading="lazy" />;
  }
  const initial = initialFromName(name);
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ backgroundColor: accent }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

// Plain (non-scroll-reveal) card — used inside the auto-scrolling marquee,
// where a viewport-triggered entrance animation would refire oddly as
// duplicated cards continuously scroll in and out of view.
function TestimonialCard({ item, accent }) {
  const rating = Number(item.rating) || 0;
  return (
    <div className="w-[280px] sm:w-[340px] shrink-0 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-6 shadow-sm">
      {rating > 0 && (
        <div className="flex items-center gap-0.5 mb-3" aria-label={`Rating ${rating} dari 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <FiStar
              key={i}
              size={14}
              className={i < rating ? "fill-current" : ""}
              style={{ color: i < rating ? "#F59E0B" : "#D1D5DB" }}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
      {item.quote && (
        <p className="text-sm text-[#374151] dark:text-slate-300 leading-relaxed mb-5">&ldquo;{item.quote}&rdquo;</p>
      )}
      <div className="flex items-center gap-3">
        <Avatar name={item.name} image={item.avatar} accent={accent} />
        <div className="min-w-0">
          <p className="font-semibold text-sm text-[#1d1d1f] dark:text-white truncate">{item.name}</p>
          {item.role && <p className="text-xs text-[#6e6e73] dark:text-slate-400 truncate">{item.role}</p>}
        </div>
      </div>
    </div>
  );
}

// Auto-scrolling "running" testimonial strip. Reuses the project's existing
// `animate-infinite-scroll` keyframe (tailwind.config.js) — a seamless loop
// achieved by rendering the item list twice back-to-back and translating
// exactly -50%. Pauses on hover/focus and respects prefers-reduced-motion.
function TestimonialsSection({ section, accent }) {
  const items = (section.items || []).filter((it) => it.active !== false);
  if (!items.length) return null;
  const loop = items.length > 2 ? [...items, ...items] : items;
  return (
    <section
      id="testimoni"
      className="py-14 sm:py-20 bg-slate-50 dark:bg-white/[0.03] scroll-mt-16 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          heading={section.heading}
          subheading="Kata SPPG yang sudah mencoba label removable kami."
        />
      </div>
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 bg-gradient-to-r from-slate-50 dark:from-[#0a0a1a] to-transparent z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 bg-gradient-to-l from-slate-50 dark:from-[#0a0a1a] to-transparent z-10"
          aria-hidden="true"
        />
        <div
          className="flex w-max gap-5 px-4 sm:px-6 animate-infinite-scroll [animation-duration:60s] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {loop.map((item, i) => (
            <TestimonialCard key={i} item={item} accent={accent} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ section, accent }) {
  const items = (section.items || []).filter((it) => it.active !== false);
  const [openIndex, setOpenIndex] = useState(0);
  if (!items.length) return null;
  return (
    <section id="faq" className="py-14 sm:py-20 px-4 sm:px-6 bg-white dark:bg-[#0a0a1a] scroll-mt-16">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY }}>
            {section.heading}
          </h2>
        </Reveal>
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center gap-3 text-left px-5 py-4"
                  aria-expanded={isOpen}
                >
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: `${accent}1a`, color: accent }}
                  >
                    <FiHelpCircle aria-hidden="true" />
                  </span>
                  <span className="flex-1 font-medium text-[#1d1d1f] dark:text-white text-sm sm:text-base">
                    {item.question}
                  </span>
                  <FiChevronDown
                    className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: accent }}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pl-12 sm:pl-16 text-sm text-[#6e6e73] dark:text-slate-400 leading-relaxed">
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

function SectionsLoop({ sections, stepsSection, accent }) {
  if (!Array.isArray(sections)) return null;
  return sections.map((section, idx) => {
    const key = `${section.type}-${idx}`;
    if (section.type === "problems") return <ProblemsSection key={key} section={section} />;
    if (section.type === "benefits") return <SolutionSection key={key} section={section} />;
    if (section.type === "areas") return <AreasSection key={key} section={section} />;
    if (section.type === "gallery") return <GallerySection key={key} section={section} />;
    if (section.type === "testimonials") return <TestimonialsSection key={key} section={section} accent={accent} />;
    if (section.type === "faq") return <FaqSection key={key} section={section} accent={accent} />;
    // "steps" is rendered together with the lead form by SampleSection, not here.
    if (section.type === "steps" && section !== stepsSection) {
      return <StepsInfoStandalone key={key} section={section} accent={accent} />;
    }
    return null;
  });
}

// Fallback in the unlikely case a campaign has more than one "steps" section —
// renders any extra ones as a plain info block instead of silently dropping them.
function StepsInfoStandalone({ section, accent }) {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-white/[0.03]">
      <div className="max-w-5xl mx-auto">
        <StepsInfo section={section} accent={accent} />
      </div>
    </section>
  );
}

function splitTwoLines(text) {
  if (!text) return [text || "", ""];
  const idx = text.indexOf(". ");
  if (idx === -1) return [text, ""];
  return [text.slice(0, idx + 1), text.slice(idx + 2)];
}

function CtaBand({ campaign }) {
  if (!campaign.ctaBandHeading && !campaign.ctaBandText) return null;
  const [line1, line2] = splitTwoLines(campaign.ctaBandHeading);
  const badges = Array.isArray(campaign.ctaBandBadges) ? campaign.ctaBandBadges : [];

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ backgroundColor: NAVY }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <Reveal className="text-center md:text-left">
          {campaign.ctaBandHeading && (
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
              <span className="block text-white">{line1}</span>
              {line2 && <span className="block" style={{ color: GOLD }}>{line2}</span>}
            </h2>
          )}
          {campaign.ctaBandText && <p className="text-slate-300 mb-6">{campaign.ctaBandText}</p>}
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <CtaButton
              text={campaign.primaryCtaText ? `${campaign.primaryCtaText} Sekarang` : null}
              target={campaign.primaryCtaTarget}
              accent={BLUE}
              icon={FiGift}
            />
          </div>
          {campaign.whatsappShortcutText && (
            <p className="mt-4 text-xs sm:text-sm text-slate-400 inline-flex items-center gap-1.5 justify-center md:justify-start">
              <FiMessageCircle /> {campaign.whatsappShortcutText}
            </p>
          )}
        </Reveal>

        {badges.length > 0 && (
          <Reveal delay={0.1} className="flex flex-row md:flex-col flex-wrap gap-4 justify-center md:justify-start">
            {badges.map((b, i) => {
              const Icon = ICON_MAP[b.icon] || FiShield;
              return (
                <span key={i} className="inline-flex items-center gap-2.5 text-sm sm:text-base font-medium text-white">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#93C5FD" }}
                  >
                    <Icon aria-hidden="true" />
                  </span>
                  {b.label}
                </span>
              );
            })}
          </Reveal>
        )}
      </div>
    </section>
  );
}

const FOOTER_KEYWORDS = ["Label", "Sticker", "Desain Custom", "Cetak Berkualitas"];

function Footer({ campaign }) {
  return (
    <footer className="pt-12 pb-8 px-4 sm:px-6" style={{ backgroundColor: NAVY }}>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-8 items-center text-center sm:text-left">
        <div className="flex items-center gap-2.5 justify-center sm:justify-start">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0"
            style={{ backgroundColor: "#2563EB" }}
          >
            S
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-white">SIDOMULYO ADVERTISING</span>
            <span className="block text-[9px] font-medium tracking-widest uppercase text-slate-400">
              Solusi Visual untuk Bisnis Anda
            </span>
          </span>
        </div>

        <div>
          <p className="text-sm sm:text-base font-bold text-white mb-1.5">
            Partner Visual untuk Operasional SPPG yang Lebih Baik
          </p>
          <p className="text-[11px] uppercase tracking-widest text-slate-400">
            {FOOTER_KEYWORDS.join(" | ")}
          </p>
        </div>

        {campaign.whatsappShortcutText && (
          <div className="flex items-center gap-2.5 justify-center sm:justify-end">
            <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: GREEN }}>
              <FiMessageCircle className="text-white" aria-hidden="true" />
            </span>
            <span className="text-left">
              <span className="block text-sm font-bold text-white">{campaign.whatsappShortcutText}</span>
              <span className="block text-xs text-slate-400">di WhatsApp kami</span>
              <span className="block text-xs text-slate-400">Kami siap membantu Anda.</span>
            </span>
          </div>
        )}
      </div>
    </footer>
  );
}

function StickyMobileCta({ campaign }) {
  if (!campaign.primaryCtaText) return null;
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0a0a1a]/95 backdrop-blur border-t border-slate-200 dark:border-white/10 px-4 py-3"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <CtaButton text={campaign.primaryCtaText} target={campaign.primaryCtaTarget} accent={BLUE} className="w-full" icon={FiGift} />
    </div>
  );
}

export default function AdCampaignLanding({ campaign }) {
  const accent = campaign.accentColor || "#0A4DA6";
  const sections = Array.isArray(campaign.sections) ? campaign.sections : [];
  const stepsSection = sections.find((s) => s.type === "steps");

  return (
    <main className="pb-24 md:pb-0">
      <TopNav campaign={campaign} accent={accent} />
      <Hero campaign={campaign} accent={accent} />
      <SectionsLoop sections={sections} stepsSection={stepsSection} accent={accent} />
      <SampleSection stepsSection={stepsSection} campaign={campaign} accent={accent} />
      <CtaBand campaign={campaign} />
      <Footer campaign={campaign} />
      <StickyMobileCta campaign={campaign} />
    </main>
  );
}
