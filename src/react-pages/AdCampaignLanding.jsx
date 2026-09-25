import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  FiCheck,
  FiChevronLeft,
  FiShoppingCart,
  FiX,
  FiArrowLeft,
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

// Page-level copy stored in page_settings_json (editable in the admin's
// "Teks Lainnya" card). A key that was never set falls back to the original
// copy; one the admin cleared ("") is hidden.
const PAGE_SETTING_DEFAULTS = {
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
};

function settingText(campaign, key) {
  const value = campaign.pageSettings?.[key];
  return value === undefined || value === null ? PAGE_SETTING_DEFAULTS[key] : value;
}

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

// Only links whose target section is actually on the page are shown, so a
// campaign without e.g. testimonials doesn't get a dead "Testimoni" link.
function navLinks(campaign, hasConfigurator) {
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

// Transparent over the full-screen video hero (Netflix-style), then turns
// solid once the visitor scrolls past the top so it stays readable over the
// light content sections below.
function TopNav({ campaign, ctaTarget }) {
  const sampleTarget = settingText(campaign, "topbarCtaTarget") || ctaTarget || campaign.primaryCtaTarget || "#sample-form";
  const brandTarget = ctaTarget ? "#pilih-produk" : "#produk";
  const logo = settingText(campaign, "topbarLogo");
  const brand = settingText(campaign, "topbarBrand");
  const tagline = settingText(campaign, "topbarTagline");
  const ctaText = settingText(campaign, "topbarCtaText");
  const mobileCtaText = settingText(campaign, "topbarCtaMobileText");
  const buttonColor = settingText(campaign, "topbarButtonColor") || BLUE;
  const backgroundColor = settingText(campaign, "topbarBackgroundColor") || "#0a0a1a";
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-30 transition-colors duration-300 ${
        solid ? "backdrop-blur border-b border-white/10" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
      style={solid ? { backgroundColor } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        <a href={brandTarget} className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {logo ? (
            <img src={logo} alt={brand || "Logo campaign"} className="h-8 sm:h-9 w-auto object-contain shrink-0" />
          ) : (
            <span
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white font-extrabold text-xs sm:text-sm shrink-0"
              style={{ backgroundColor: buttonColor }}
            >
              {brand?.trim().charAt(0) || "S"}
            </span>
          )}
          <span className="leading-tight min-w-0">
            <span className="block text-xs sm:text-sm font-extrabold tracking-wide text-white truncate max-w-[130px] sm:max-w-none">
              {brand}
            </span>
            {tagline && <span className="hidden sm:block text-[9px] font-medium tracking-widest uppercase text-white/60">{tagline}</span>}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
          {navLinks(campaign, Boolean(ctaTarget)).map(([href, label]) => (
            <a key={href} href={href} className="hover:text-white transition-colors">
              {label}
            </a>
          ))}
        </nav>

        {(ctaText || mobileCtaText) && (
          <a
            href={sampleTarget}
            className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm shrink-0 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: buttonColor }}
          >
            <FiGift aria-hidden="true" /> <span className="hidden sm:inline">{ctaText || mobileCtaText}</span>
            <span className="sm:hidden">{mobileCtaText || ctaText}</span>
          </a>
        )}
      </div>
    </header>
  );
}

// Splits a headline string and wraps the given word(s) as a filled green pill,
// matching the mockup where "GRATIS" appears as a badge inline in the headline.
function HighlightedHeadline({ text, highlight }) {
  if (!text) return null;
  if (!highlight) return text;
  // Escape so an admin-typed word with regex characters can't break the split.
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "g"));
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

// Full-bleed background: the admin-uploaded video (muted, looping, inline so
// iOS autoplays it), with heroImage as its poster. Falls back to the image
// alone, then to a plain navy gradient, when nothing has been uploaded yet.
function HeroBackground({ video, image }) {
  if (video) {
    return (
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={video}
        poster={image || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    );
  }
  if (image) {
    return (
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchpriority="high"
      />
    );
  }
  return <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${NAVY}, #000)` }} />;
}

function Hero({ campaign, ctaTarget }) {
  // With a configurator section, the hero CTAs lead into it instead of the
  // plain sample form further down the page.
  const target = ctaTarget || campaign.primaryCtaTarget || "#sample-form";
  const badges = (Array.isArray(campaign.heroBadges) ? campaign.heroBadges : []).filter(Boolean);
  const trustPoints = Array.isArray(campaign.heroTrustPoints) ? campaign.heroTrustPoints : [];

  return (
    <section
      id="produk"
      className="relative isolate overflow-hidden bg-black min-h-[88svh] sm:min-h-[92vh] flex items-center justify-center scroll-mt-16"
    >
      <HeroBackground video={campaign.heroVideo} image={campaign.heroImage} />
      {/* Darkening overlay: an overall dim plus a radial vignette and a fade
          to black at top/bottom, so white text stays readable on any video. */}
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%), linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16 sm:pt-28 sm:pb-20 text-center">
        {(campaign.heroEyebrow || badges.length > 0) && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            {campaign.heroEyebrow && (
              <span className="inline-block text-[11px] sm:text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/15 text-white backdrop-blur-sm border border-white/20">
                {campaign.heroEyebrow}
              </span>
            )}
            {badges.map((b, i) => (
              <span
                key={i}
                className="inline-block text-[11px] sm:text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm"
                style={{ color: String(b).toLowerCase() === "praktis" ? "#4ADE80" : "#ffffff" }}
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1.15] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          <HighlightedHeadline text={campaign.heroHeadline} highlight={settingText(campaign, "heroHighlight")} />
        </h1>
        {campaign.heroSubtext && (
          <p className="mt-5 text-base sm:text-xl font-medium text-white/90 max-w-2xl mx-auto drop-shadow">
            {campaign.heroSubtext}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <CtaButton
            text={campaign.primaryCtaText}
            target={target}
            accent={BLUE}
            icon={FiGift}
            className="!rounded-md !px-8 !py-4 sm:!text-lg"
          />
          {/* Deliberately points at the form, not campaign.secondaryCtaTarget
              (a direct wa.me link) — visitors fill their data first, then
              get sent to WhatsApp with a prefilled message automatically
              after submitting (see LeadFormCard's success state below). */}
          <CtaButton
            text={campaign.secondaryCtaText}
            target={target}
            accent={GREEN}
            arrow={false}
            icon={FiMessageCircle}
            className="!rounded-md !px-8 !py-4 sm:!text-lg"
          />
        </div>

        {trustPoints.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8">
            {trustPoints.map((tp, i) => {
              const Icon = ICON_MAP[tp.icon] || FiCheckCircle;
              return (
                <span key={i} className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/85">
                  <Icon className="text-[#4ADE80]" aria-hidden="true" />
                  {tp.label}
                </span>
              );
            })}
          </div>
        )}
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
          subheading={section.subheading ?? "Kami memahami tantangan Anda, karena itu kami hadir dengan solusi yang tepat."}
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
          subheading={section.subheading ?? "Dirancang khusus untuk kebutuhan operasional SPPG yang dinamis."}
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
        {(section.subheading ?? "Proses mudah, cepat, dan tanpa biaya.") && (
          <p className="text-sm sm:text-base text-[#6e6e73] dark:text-slate-400 mb-8">
            {section.subheading ?? "Proses mudah, cepat, dan tanpa biaya."}
          </p>
        )}
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
    // Prefer the lead-specific link the API builds (prefilled with the
    // "SAMPLE SPPG" follow-up keyword + the submitter's name); fall back to
    // the generic hero WhatsApp CTA if that couldn't be built for some
    // reason (e.g. secondaryCtaTarget isn't a recognizable wa.me link).
    const waTarget = isWaLink(success.whatsappUrl)
      ? success.whatsappUrl
      : isWaLink(success.secondaryCtaTarget)
      ? success.secondaryCtaTarget
      : null;
    return (
      <div id="sample-form" className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden text-center p-8 scroll-mt-20">
        <FiCheckCircle className="mx-auto text-4xl mb-4" style={{ color: accent }} />
        <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2">Terima kasih!</h3>
        <p className="text-sm text-[#6e6e73] dark:text-slate-400 mb-2">
          Data Anda sudah kami terima.
        </p>
        {waTarget && (
          <>
            <p className="text-sm font-semibold text-[#1d1d1f] dark:text-white mb-5 max-w-sm mx-auto">
              Satu langkah lagi: klik tombol WhatsApp di bawah supaya tim kami bisa langsung follow up pesanan Anda lebih cepat.
            </p>
            <a
              href={waTarget}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white text-base shadow-md hover:scale-[1.02] transition-transform animate-pulse"
              style={{ backgroundColor: GREEN }}
            >
              <FiMessageCircle /> Chat WhatsApp Sekarang
            </a>
            <p className="text-xs text-[#6e6e73] dark:text-slate-500 mt-3">
              Pesan otomatis sudah kami siapkan, tinggal klik kirim.
            </p>
          </>
        )}
        {!waTarget && (
          <p className="text-sm text-[#6e6e73] dark:text-slate-400">
            Tim kami akan segera menghubungi Anda.
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      id="sample-form"
      className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm overflow-hidden scroll-mt-20"
    >
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

        {settingText(campaign, "formPrivacyNote") && (
          <p className="flex items-center justify-center gap-1.5 text-xs text-[#6e6e73] dark:text-slate-400 pt-1">
            <FiLock aria-hidden="true" /> {settingText(campaign, "formPrivacyNote")}
          </p>
        )}
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
        <SectionHeading heading={section.heading} subheading={section.subheading ?? "Prioritas untuk SPPG aktif di 3 wilayah ini."} />
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
          subheading={section.subheading ?? "Lihat langsung tampilan sample label removable pada ompreng."}
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
          subheading={section.subheading ?? "Kata SPPG yang sudah mencoba label removable kami."}
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

// ---------------------------------------------------------------------------
// "Pilih Produk" configurator — Netflix-style dark section rendered directly
// under the video hero: a row of product posters. Clicking one
// opens a modal (photo, variants, label contents, two order buttons), then
// SPPG name/WA/address, which saves a lead and hands the full order summary
// to Sidomulyo's WhatsApp.
// Content comes from a `type: "configurator"` entry in sections_json.
// ---------------------------------------------------------------------------

const DEFAULT_CONTENT_OPTIONS = [
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
const CONFIGURATOR_TEXT_DEFAULTS = {
  variantLabel: "Pilih varian",
  contentLabel: "Mau isi label apa saja?",
  addressLabel: "Kirim alamat SPPG Anda",
  nameLabel: "Nama SPPG",
  submitText: "Kirim Alamat ke WhatsApp",
  waGreeting: "Halo Sidomulyo, saya mau",
};

function configText(section, key) {
  return (section[key] || "").trim() || CONFIGURATOR_TEXT_DEFAULTS[key];
}

const DEFAULT_ORDER_OPTIONS = [
  "Kirim sample ke SPPG saya (gratis)",
  "Kirim sample ke SPPG & saya order sekalian",
];

// Variants are `{ name, image }` objects; older campaigns stored plain name
// strings, which are still accepted (they just have no photo of their own).
function normalizeVariants(list) {
  return (Array.isArray(list) ? list : [])
    .map((v) => (typeof v === "string" ? { name: v.trim(), image: "" } : { name: String(v?.name || "").trim(), image: v?.image || "" }))
    .filter((v) => v.name);
}

function cleanList(list) {
  return (Array.isArray(list) ? list : []).map((s) => String(s || "").trim()).filter(Boolean);
}

// Same wa.me / api.whatsapp.com phone extraction the lead API uses for its
// follow-up link, done client-side here so the message can carry the whole
// configurator summary.
function extractWaPhone(target) {
  if (!target) return null;
  const m = String(target).match(/wa\.me\/(\d+)|[?&]phone=(\d+)/);
  return m ? m[1] || m[2] : null;
}

// Big outlined rank number overlapping the card's left edge, as on
// Netflix's "Sedang Tren Sekarang" row.
function PosterNumber({ n }) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-0 bottom-1 z-0 font-black leading-none select-none text-[88px] sm:text-[120px] tracking-tighter"
      style={{ color: "#000", WebkitTextStroke: "3px rgba(255,255,255,0.9)" }}
    >
      {n}
    </span>
  );
}

function Chip({ selected, onClick, children, check, thumb }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold border transition-colors ${
        selected ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/20 hover:bg-white/10"
      }`}
    >
      {thumb && <img src={thumb} alt="" className="-ml-1.5 w-11 h-7 rounded object-cover" />}
      {check && (
        <span
          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center ${
            selected ? "border-black bg-black text-white" : "border-white/50"
          }`}
        >
          {selected && <FiCheck size={12} aria-hidden="true" />}
        </span>
      )}
      {children}
    </button>
  );
}

const darkInput =
  "w-full rounded-md bg-black/40 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/60";

function PosterCard({ item, index, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative shrink-0 pl-11 sm:pl-16 text-left focus:outline-none"
    >
      <PosterNumber n={index + 1} />
      <span
        className="relative z-10 block w-[132px] sm:w-[190px] aspect-[2/3] rounded-md overflow-hidden bg-[#1a1a2e] shadow-lg transition-transform duration-300 group-hover:scale-[1.05] group-focus-visible:ring-4"
        style={{ "--tw-ring-color": BLUE }}
      >
        {item.image ? (
          <img src={item.image} alt={item.title} loading="lazy" draggable="false" className="w-full h-full object-cover" />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-white/30">
            <FiImage size={32} aria-hidden="true" />
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <span className="block text-xs sm:text-sm font-bold text-white leading-tight">{item.title}</span>
        </span>
      </span>
    </button>
  );
}

function ProductModal({ product, section, campaign, onClose }) {
  const variants = normalizeVariants(product.variants);
  const contentOptions = cleanList(section.contentOptions).length
    ? cleanList(section.contentOptions)
    : DEFAULT_CONTENT_OPTIONS;
  const orderOptions = cleanList(section.orderOptions).length
    ? cleanList(section.orderOptions)
    : DEFAULT_ORDER_OPTIONS;

  const [variant, setVariant] = useState(variants.length === 1 ? variants[0].name : "");
  const [contents, setContents] = useState([]);
  const [orderOption, setOrderOption] = useState("");
  const [info, setInfo] = useState({ name: "", whatsapp: "", address: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const scrollRef = useRef(null);
  // The big photo follows the selected variant's own photo, falling back to
  // the product photo when that variant has none (or nothing is picked yet).
  const photo = variants.find((v) => v.name === variant)?.image || product.image;

  // Esc to close + lock page scroll behind the modal.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [orderOption]);

  function toggleContent(opt) {
    setContents((c) => (c.includes(opt) ? c.filter((x) => x !== opt) : [...c, opt]));
    setErrors((e) => ({ ...e, contents: undefined }));
  }

  function chooseOrder(opt) {
    const errs = {};
    if (variants.length && !variant) errs.variant = "Pilih varian terlebih dahulu";
    if (!contents.length) errs.contents = "Centang minimal satu isi label";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setOrderOption(opt);
  }

  function buildMessage() {
    const lines = [
      `${configText(section, "waGreeting")} ${orderOption.charAt(0).toLowerCase()}${orderOption.slice(1)}.`,
      "",
      `Produk: ${product.title}`,
      variant ? `Varian: ${variant}` : null,
      `Isi label: ${contents.join(", ")}`,
      "",
      `${configText(section, "nameLabel")}: ${info.name.trim()}`,
      `No. WA: ${info.whatsapp.trim()}`,
      `Alamat: ${info.address.trim()}`,
    ];
    return lines.filter((l) => l !== null).join("\n");
  }

  async function handleSend(e) {
    e.preventDefault();
    const errs = {};
    if (!info.name.trim()) errs.name = "Wajib diisi";
    if (!PHONE_RE.test(info.whatsapp.replace(/[\s-]/g, ""))) errs.whatsapp = "Nomor WhatsApp tidak valid";
    if (!info.address.trim()) errs.address = "Wajib diisi";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    const params = new URLSearchParams(window.location.search);
    try {
      const res = await fetch("/api/ad-campaign-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignSlug: campaign.slug,
          name: info.name,
          whatsapp: info.whatsapp,
          answers: {
            produk: product.title,
            varian: variant || "-",
            isi_label: contents.join(", "),
            pilihan: orderOption,
            address: info.address,
          },
          utmSource: params.get("utm_source"),
          utmMedium: params.get("utm_medium"),
          utmCampaign: params.get("utm_campaign"),
          utmContent: params.get("utm_content"),
          utmTerm: params.get("utm_term"),
          referrer: document.referrer || null,
        }),
      });
      if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data.message || "Data belum lengkap." });
        return;
      }
      // Any other failure (rate limit, network) still continues to WhatsApp —
      // the chat itself is the conversion that matters most here.
    } catch {
      // Same as above: fall through to WhatsApp.
    } finally {
      setSubmitting(false);
    }

    const phone = extractWaPhone(campaign.secondaryCtaTarget);
    if (!phone) {
      setWaUrl("none");
      return;
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`;
    setWaUrl(url);
    // A navigation (not window.open) so mobile browsers don't treat it as a
    // blocked popup after the await above; it opens the WhatsApp app directly.
    window.location.href = url;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        ref={scrollRef}
        className="relative w-full sm:max-w-3xl max-h-[92svh] overflow-y-auto rounded-t-2xl sm:rounded-xl bg-[#141414] text-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black flex items-center justify-center"
        >
          <FiX size={20} />
        </button>

        <div className="relative aspect-[16/10] sm:aspect-[16/8] bg-[#1a1a2e]">
          {photo ? (
            <AnimatePresence initial={false}>
              {/* Whole photo (object-contain) over a blurred copy of itself,
                  so any aspect ratio — a 2:3 product poster or a wide variant
                  shot — shows uncropped without empty bars. */}
              <motion.div
                key={photo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 overflow-hidden"
              >
                <img src={photo} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60" />
                <img
                  src={photo}
                  alt={variant ? `${product.title} — ${variant}` : product.title}
                  className="relative w-full h-full object-contain"
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <span className="w-full h-full flex items-center justify-center text-white/30">
              <FiImage size={40} aria-hidden="true" />
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
          <div className="absolute left-5 right-5 bottom-4 sm:left-8 sm:bottom-6">
            <h3 className="text-2xl sm:text-4xl font-black leading-tight drop-shadow">{product.title}</h3>
            {product.desc && <p className="mt-1 text-sm sm:text-base text-white/80 max-w-xl">{product.desc}</p>}
          </div>
        </div>

        <div className="px-5 pb-6 pt-3 sm:px-8 sm:pb-8">
          {!orderOption ? (
            <>
              {variants.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-white/70 mb-2.5">{configText(section, "variantLabel")}</p>
                  <div className="flex flex-wrap gap-2.5">
                    {variants.map(({ name: v, image }) => (
                      <Chip
                        key={v}
                        selected={variant === v}
                        thumb={image}
                        onClick={() => {
                          setVariant(v);
                          setErrors((e) => ({ ...e, variant: undefined }));
                        }}
                      >
                        {v}
                      </Chip>
                    ))}
                  </div>
                  {errors.variant && <p className="mt-2 text-xs text-red-400">{errors.variant}</p>}
                </div>
              )}

              <div className="mb-7">
                <p className="text-sm font-semibold text-white/70 mb-2.5">{configText(section, "contentLabel")}</p>
                <div className="flex flex-wrap gap-2.5">
                  {contentOptions.map((opt) => (
                    <Chip key={opt} check selected={contents.includes(opt)} onClick={() => toggleContent(opt)}>
                      {opt}
                    </Chip>
                  ))}
                </div>
                {errors.contents && <p className="mt-2 text-xs text-red-400">{errors.contents}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {orderOptions.map((opt, i) => {
                  const Icon = i === 0 ? FiGift : FiShoppingCart;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => chooseOrder(opt)}
                      className="inline-flex items-center justify-center gap-2.5 rounded-md px-5 py-4 text-sm sm:text-base font-bold text-white hover:opacity-90 transition-opacity text-left"
                      style={{ backgroundColor: i === 0 ? GREEN : BLUE }}
                    >
                      <Icon className="shrink-0" size={20} aria-hidden="true" />
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <form onSubmit={handleSend}>
              <button
                type="button"
                onClick={() => setOrderOption("")}
                className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4"
              >
                <FiArrowLeft aria-hidden="true" /> Kembali
              </button>
              <div className="mb-5 rounded-md bg-white/5 border border-white/10 p-4 text-sm text-white/70 leading-relaxed">
                <span className="block font-bold text-white">{orderOption}</span>
                {product.title}
                {variant && <> · {variant}</>} · {contents.join(", ")}
              </div>
              <p className="text-sm font-semibold text-white/70 mb-2.5">{configText(section, "addressLabel")}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <input
                    className={darkInput}
                    placeholder={configText(section, "nameLabel")}
                    value={info.name}
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <input
                    className={darkInput}
                    type="tel"
                    inputMode="tel"
                    placeholder="No. WhatsApp (08xx)"
                    value={info.whatsapp}
                    onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })}
                  />
                  {errors.whatsapp && <p className="mt-1 text-xs text-red-400">{errors.whatsapp}</p>}
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    className={darkInput}
                    rows={3}
                    placeholder="Alamat lengkap (jalan, desa/kelurahan, kecamatan, kota)"
                    value={info.address}
                    onChange={(e) => setInfo({ ...info, address: e.target.value })}
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
                </div>
              </div>
              {errors.form && <p className="mt-3 text-sm text-red-400">{errors.form}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-md px-8 py-4 text-base sm:text-lg font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ backgroundColor: GREEN }}
              >
                <FiMessageCircle aria-hidden="true" />
                {submitting ? "Mengirim..." : configText(section, "submitText")}
              </button>
              {waUrl && waUrl !== "none" && (
                <p className="mt-3 text-xs text-white/60 text-center">
                  WhatsApp tidak terbuka?{" "}
                  <a href={waUrl} className="underline text-white">
                    Klik di sini
                  </a>
                  .
                </p>
              )}
              {waUrl === "none" && (
                <p className="mt-3 text-sm text-green-400 text-center">
                  Terima kasih! Data Anda sudah kami terima, tim kami akan segera menghubungi.
                </p>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function ConfiguratorSection({ section, campaign }) {
  const products = (section.items || []).filter((it) => it.active !== false && it.title);
  const [openIdx, setOpenIdx] = useState(-1);
  const rowRef = useRef(null);

  if (!products.length) return null;

  const canSlide = products.length > 2;

  function scrollRow(dir) {
    const el = rowRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section id="pilih-produk" className="relative bg-black text-white overflow-hidden scroll-mt-16">
      {/* Netflix-style curved glowing divider between the hero and this row. */}
      <div aria-hidden="true" className="relative h-20 sm:h-28 -mt-px">
        <div
          className="absolute left-[-25%] w-[150%] top-4 h-[200%] rounded-[50%]"
          style={{ background: `linear-gradient(90deg, transparent 5%, ${BLUE} 30%, ${GOLD} 50%, ${BLUE} 70%, transparent 95%)` }}
        />
        <div
          className="absolute left-[-25%] w-[150%] top-[19px] h-[200%] rounded-[50%]"
          style={{ background: `radial-gradient(50% 30% at 50% 0%, ${NAVY} 0%, #000 100%)` }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pb-16 sm:pb-24">
        {section.badge && (
          <span className="inline-block text-[11px] sm:text-xs font-bold tracking-widest uppercase text-white/60 mb-1">
            {section.badge}
          </span>
        )}
        <h2 className="text-xl sm:text-3xl font-bold text-white">{section.heading || "Pilih Produk"}</h2>
        {(section.subheading ?? "Klik produk untuk melihat varian & minta sample.") && (
          <p className="mt-1 text-sm text-white/60">
            {section.subheading ?? "Klik produk untuk melihat varian & minta sample."}
          </p>
        )}

        <div className="relative -mx-4 sm:mx-0 mt-4">
          {canSlide && (
            <button
              type="button"
              onClick={() => scrollRow(-1)}
              aria-label="Geser ke kiri"
              className="hidden md:flex absolute left-0 top-4 bottom-4 z-20 w-10 items-center justify-center rounded-md bg-black/60 hover:bg-black/90 text-white"
            >
              <FiChevronLeft size={24} />
            </button>
          )}
          <div
            ref={rowRef}
            className={`flex gap-3 sm:gap-6 px-4 sm:px-12 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${canSlide ? "overflow-x-auto" : "flex-wrap"}`}
          >
            {products.map((p, i) => (
              <PosterCard key={i} item={p} index={i} onSelect={() => setOpenIdx(i)} />
            ))}
          </div>
          {canSlide && (
            <button
              type="button"
              onClick={() => scrollRow(1)}
              aria-label="Geser ke kanan"
              className="hidden md:flex absolute right-0 top-4 bottom-4 z-20 w-10 items-center justify-center rounded-md bg-black/60 hover:bg-black/90 text-white"
            >
              <FiChevronRight size={24} />
            </button>
          )}
        </div>
      </div>

      {openIdx !== -1 && (
        <ProductModal
          key={openIdx}
          product={products[openIdx]}
          section={section}
          campaign={campaign}
          onClose={() => setOpenIdx(-1)}
        />
      )}
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
              text={
                settingText(campaign, "ctaBandButtonText") ||
                (campaign.primaryCtaText ? `${campaign.primaryCtaText} Sekarang` : null)
              }
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


function Footer({ campaign }) {
  const footerTextColor = settingText(campaign, "footerTextColor");
  const logo = settingText(campaign, "footerLogo");
  const brand = settingText(campaign, "footerBrand");
  const brandTagline = settingText(campaign, "footerBrandTagline");
  const whatsappTitle = settingText(campaign, "footerWhatsappTitle") ?? campaign.whatsappShortcutText;
  const rawWhatsappUrl = settingText(campaign, "footerWhatsappUrl");
  const whatsappUrl = /^https?:\/\//i.test(rawWhatsappUrl || "") ? rawWhatsappUrl : "";
  const Contact = whatsappUrl ? "a" : "div";

  return (
    <footer className="pt-12 pb-8 px-4 sm:px-6" style={{ backgroundColor: settingText(campaign, "footerBackgroundColor") || NAVY, color: footerTextColor }}>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-8 items-center text-center sm:text-left">
        <div className="flex items-center gap-2.5 justify-center sm:justify-start">
          {logo ? (
            <img src={logo} alt={brand || "Logo campaign"} className="h-12 sm:h-14 w-auto object-contain shrink-0" />
          ) : (
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-extrabold text-sm shrink-0"
              style={{ backgroundColor: settingText(campaign, "footerBrandColor") || BLUE }}
            >
              {brand?.trim().charAt(0) || "S"}
            </span>
          )}
          <span className="leading-tight">
            {brand && <span className="block text-sm font-bold">{brand}</span>}
            {brandTagline && <span className="block text-[9px] font-medium tracking-widest uppercase opacity-70">{brandTagline}</span>}
          </span>
        </div>

        <div>
          {settingText(campaign, "footerTagline") && (
            <p className="text-sm sm:text-base font-bold mb-1.5">{settingText(campaign, "footerTagline")}</p>
          )}
          <p className="text-[11px] uppercase tracking-widest opacity-70">
            {cleanList(settingText(campaign, "footerKeywords")).join(" | ")}
          </p>
        </div>

        {whatsappTitle && (
          <Contact href={whatsappUrl || undefined} target={whatsappUrl ? "_blank" : undefined} rel={whatsappUrl ? "noopener noreferrer" : undefined} className="flex items-center gap-2.5 justify-center sm:justify-end">
            <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: settingText(campaign, "footerWhatsappColor") || GREEN }}>
              <FiMessageCircle className="text-white" aria-hidden="true" />
            </span>
            <span className="text-left">
              <span className="block text-sm font-bold">{whatsappTitle}</span>
              {settingText(campaign, "footerWhatsappLine1") && <span className="block text-xs opacity-70">{settingText(campaign, "footerWhatsappLine1")}</span>}
              {settingText(campaign, "footerWhatsappLine2") && <span className="block text-xs opacity-70">{settingText(campaign, "footerWhatsappLine2")}</span>}
            </span>
          </Contact>
        )}
      </div>
    </footer>
  );
}

function StickyMobileCta({ campaign, ctaTarget }) {
  if (!campaign.primaryCtaText) return null;
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0a0a1a]/95 backdrop-blur border-t border-slate-200 dark:border-white/10 px-4 py-3"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <CtaButton
        text={campaign.primaryCtaText}
        target={ctaTarget || campaign.primaryCtaTarget}
        accent={BLUE}
        className="w-full"
        icon={FiGift}
      />
    </div>
  );
}

export default function AdCampaignLanding({ campaign }) {
  const accent = campaign.accentColor || "#0A4DA6";
  const sections = Array.isArray(campaign.sections) ? campaign.sections : [];
  const stepsSection = sections.find((s) => s.type === "steps");
  // Only counts once it has at least one live product, so CTAs never point
  // at an empty #pilih-produk anchor.
  const configurator = sections.find(
    (s) => s.type === "configurator" && (s.items || []).some((it) => it.active !== false && it.title)
  );
  const ctaTarget = configurator ? "#pilih-produk" : undefined;

  return (
    <main className="pb-24 md:pb-0">
      {settingText(campaign, "topbarEnabled") !== false && <TopNav campaign={campaign} ctaTarget={ctaTarget} />}
      <Hero campaign={campaign} ctaTarget={ctaTarget} />
      {configurator && <ConfiguratorSection section={configurator} campaign={campaign} />}
      <SectionsLoop sections={sections} stepsSection={stepsSection} accent={accent} />
      <SampleSection stepsSection={stepsSection} campaign={campaign} accent={accent} />
      <CtaBand campaign={campaign} />
      {settingText(campaign, "footerEnabled") !== false && <Footer campaign={campaign} />}
      <StickyMobileCta campaign={campaign} ctaTarget={ctaTarget} />
    </main>
  );
}
