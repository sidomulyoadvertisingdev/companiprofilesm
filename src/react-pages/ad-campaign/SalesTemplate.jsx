import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiClock,
  FiGift,
  FiImage,
  FiMapPin,
  FiMessageCircle,
  FiShield,
  FiStar,
  FiX,
} from "react-icons/fi";
import {
  Avatar,
  HighlightedHeadline,
  ImagePlaceholder,
  LeadFormCard,
  ProductModal,
  Reveal,
} from "./shared.jsx";
import {
  ICON_MAP,
  activeItems,
  campaignModel,
  LEAD_EVENT,
  cleanList,
  salesCtaAfter,
  settingText,
  splitTwoLines,
  subheadingOf,
  tint,
  useCountdown,
} from "./config.js";

// "Sales Page" template: a single narrow column built for mobile ad traffic.
// Promo bar with an optional live countdown, a colored hero, checklist-style
// sections and the main CTA repeated after every block, ending in an offer
// box. Colors: accent (hero/headings), themeCtaColor (every CTA button),
// salesHeroColor (optional hero override), themeSurfaceColor (page backdrop).

function useTheme(campaign) {
  const accent = campaign.accentColor || "#0A4DA6";
  return {
    accent,
    cta: settingText(campaign, "themeCtaColor") || "#16A34A",
    heading: settingText(campaign, "themeHeadingColor") || "#0B1E3D",
    surface: settingText(campaign, "themeSurfaceColor") || "#F1F5F9",
    hero: settingText(campaign, "salesHeroColor") || accent,
  };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function Countdown({ end, label, dark = false }) {
  const left = useCountdown(end);
  if (!left || left.done) return null;
  const units = [
    ...(left.days ? [[left.days, "Hari"]] : []),
    [left.hours, "Jam"],
    [left.minutes, "Menit"],
    [left.seconds, "Detik"],
  ];
  return (
    <div className="text-center">
      {label && (
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${dark ? "text-slate-600" : "text-white/80"}`}>
          <FiClock className="inline -mt-0.5 mr-1" aria-hidden="true" />
          {label}
        </p>
      )}
      <div className="flex justify-center gap-2">
        {units.map(([value, unit]) => (
          <span
            key={unit}
            className={`w-16 rounded-xl py-2 ${dark ? "bg-slate-900 text-white" : "bg-white text-slate-900"} shadow-sm`}
          >
            <span className="block text-2xl font-black tabular-nums leading-none">{pad(value)}</span>
            <span className={`block mt-1 text-[10px] font-semibold uppercase ${dark ? "text-white/60" : "text-slate-500"}`}>{unit}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function BigCta({ text, target, color, pulse = false }) {
  if (!text) return null;
  const isAnchor = typeof target === "string" && target.startsWith("#");
  return (
    <a
      href={target || "#sample-form"}
      target={isAnchor ? undefined : "_blank"}
      rel={isAnchor ? undefined : "noopener noreferrer"}
      className={`relative w-full inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base sm:text-lg font-extrabold text-white uppercase tracking-wide shadow-[0_6px_0_rgba(0,0,0,0.18)] active:translate-y-1 active:shadow-none transition-transform ${pulse ? "motion-safe:animate-pulse" : ""}`}
      style={{ backgroundColor: color }}
    >
      <FiGift aria-hidden="true" /> {text} <FiArrowRight aria-hidden="true" />
    </a>
  );
}

function PromoBar({ campaign, theme }) {
  const text = settingText(campaign, "salesAnnouncementText");
  const end = settingText(campaign, "salesCountdownEnd");
  const left = useCountdown(end);
  if (settingText(campaign, "salesAnnouncementEnabled") === false || !text) return null;
  return (
    <div className="sticky top-0 z-30 text-white text-center text-xs sm:text-sm font-bold px-4 py-2.5" style={{ backgroundColor: theme.cta }}>
      {text}
      {left && !left.done && (
        <span className="ml-2 inline-block rounded-md bg-black/20 px-2 py-0.5 tabular-nums">
          {left.days ? `${left.days}h ` : ""}
          {pad(left.hours)}:{pad(left.minutes)}:{pad(left.seconds)}
        </span>
      )}
    </div>
  );
}

function Brand({ campaign, theme }) {
  const brand = settingText(campaign, "topbarBrand");
  const logo = settingText(campaign, "topbarLogo");
  return (
    <div className="flex items-center justify-center gap-2 py-4 bg-white border-b border-slate-100">
      {logo ? (
        <img src={logo} alt={brand || "Logo"} className="h-8 w-auto object-contain" />
      ) : (
        <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-extrabold" style={{ backgroundColor: theme.accent }}>
          {brand?.trim().charAt(0) || "S"}
        </span>
      )}
      {brand && <span className="text-sm font-extrabold tracking-wide" style={{ color: theme.heading }}>{brand}</span>}
    </div>
  );
}

function Hero({ campaign, theme, target }) {
  const trustPoints = Array.isArray(campaign.heroTrustPoints) ? campaign.heroTrustPoints : [];
  const badges = cleanList(campaign.heroBadges);
  const media = campaign.heroVideo || campaign.heroImage;
  return (
    <section id="produk" className="text-white scroll-mt-12" style={{ background: `linear-gradient(180deg, ${theme.hero} 0%, ${tint(theme.hero, 85)} 100%)` }}>
      <div className="px-5 pt-8 pb-10 text-center">
        {(campaign.heroEyebrow || badges.length > 0) && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {campaign.heroEyebrow && (
              <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white text-slate-900">
                {campaign.heroEyebrow}
              </span>
            )}
            {badges.map((b, i) => (
              <span key={i} className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/40">
                {b}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-[1.9rem] sm:text-4xl font-black leading-[1.15]">
          <HighlightedHeadline
            text={campaign.heroHeadline}
            highlight={settingText(campaign, "heroHighlight")}
            color="#FDE047"
            pillClassName="inline px-1.5 mx-0.5 rounded text-slate-900 box-decoration-clone"
          />
        </h1>
        {campaign.heroSubtext && <p className="mt-4 text-base text-white/90">{campaign.heroSubtext}</p>}

        {media && (
          <div className="mt-6 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-2xl">
            {campaign.heroVideo ? (
              <video className="w-full aspect-video object-cover" src={campaign.heroVideo} poster={campaign.heroImage || undefined} autoPlay muted loop playsInline aria-hidden="true" />
            ) : (
              <img src={campaign.heroImage} alt={campaign.heroHeadline || ""} className="w-full h-auto" loading="eager" fetchpriority="high" />
            )}
          </div>
        )}

        <div className="mt-7">
          <BigCta text={campaign.primaryCtaText} target={target} color={theme.cta} pulse />
        </div>
        {settingText(campaign, "heroCtaNote") && (
          <p className="mt-3 text-xs sm:text-sm text-white/85">{settingText(campaign, "heroCtaNote")}</p>
        )}

        {settingText(campaign, "salesCountdownEnd") && (
          <div className="mt-7">
            <Countdown end={settingText(campaign, "salesCountdownEnd")} label={settingText(campaign, "salesCountdownLabel")} />
          </div>
        )}

        {trustPoints.length > 0 && (
          <ul className="mt-7 space-y-2 text-left inline-block">
            {trustPoints.map((tp, i) => (
              <li key={i} className="flex items-center gap-2 text-sm font-semibold">
                <FiCheck className="shrink-0 text-[#FDE047]" size={18} aria-hidden="true" /> {tp.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Block({ id, section, theme, children, tone = "white" }) {
  const sub = subheadingOf(section);
  return (
    <section id={id} className={`px-5 py-10 scroll-mt-12 ${tone === "soft" ? "" : "bg-white"}`} style={tone === "soft" ? { backgroundColor: tint(theme.accent, 6) } : undefined}>
      <Reveal className="text-center mb-7">
        {section.badge && (
          <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 text-white" style={{ backgroundColor: theme.accent }}>
            {section.badge}
          </span>
        )}
        {section.heading && (
          <h2 className="text-2xl font-black leading-tight" style={{ color: theme.heading }}>
            {section.heading}
          </h2>
        )}
        {sub && <p className="mt-2 text-sm text-slate-500">{sub}</p>}
      </Reveal>
      {children}
    </section>
  );
}

function RepeatCta({ campaign, theme, target }) {
  if (!campaign.primaryCtaText) return null;
  return (
    <div className="px-5 pb-10">
      <BigCta text={campaign.primaryCtaText} target={target} color={theme.cta} />
    </div>
  );
}

function Configurator({ section, campaign, theme, googleMapsApiKey }) {
  const products = activeItems(section).filter((it) => it.title);
  const [openIdx, setOpenIdx] = useState(-1);
  if (!products.length) return null;
  return (
    <Block id="pilih-produk" section={{ ...section, heading: section.heading || "Pilih Produk" }} theme={theme}>
      <div className="space-y-3">
        {products.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="w-full flex items-center gap-4 rounded-2xl bg-white p-3 text-left ring-2 ring-slate-100 hover:ring-4 transition-all"
            style={{ "--tw-ring-color": tint(theme.accent, 30) }}
          >
            <span className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              {p.image ? (
                <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-slate-300">
                  <FiImage size={24} aria-hidden="true" />
                </span>
              )}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-extrabold text-slate-900">{p.title}</span>
              {p.desc && <span className="block mt-0.5 text-xs text-slate-500 line-clamp-2">{p.desc}</span>}
            </span>
            <span className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: theme.cta }}>
              <FiChevronRight aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
      {openIdx !== -1 && (
        <ProductModal
          key={openIdx}
          product={products[openIdx]}
          section={section}
          campaign={campaign}
          googleMapsApiKey={googleMapsApiKey}
          onClose={() => setOpenIdx(-1)}
          ctaColor={theme.cta}
          altColor={theme.accent}
        />
      )}
    </Block>
  );
}

function CheckList({ items, bad = false, theme }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const Icon = bad ? FiX : ICON_MAP[item.icon] || FiCheck;
        return (
          <Reveal key={i} delay={i * 0.04} className={`flex gap-3 rounded-2xl p-4 ${bad ? "bg-red-50" : "bg-white ring-1 ring-slate-100"}`}>
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white"
              style={{ backgroundColor: bad ? "#EF4444" : theme.cta }}
            >
              <Icon aria-hidden="true" />
            </span>
            <span>
              <span className="block font-bold text-slate-900">{item.title}</span>
              {item.desc && <span className="block mt-0.5 text-sm text-slate-600 leading-relaxed">{item.desc}</span>}
            </span>
          </Reveal>
        );
      })}
    </ul>
  );
}

function Steps({ section, theme }) {
  const items = activeItems(section);
  return (
    <ol className="space-y-4">
      {items.map((step, i) => (
        <Reveal key={i} delay={i * 0.04} className="flex gap-4 items-start">
          <span className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black text-white shrink-0" style={{ backgroundColor: theme.accent }}>
            {step.number || i + 1}
          </span>
          <span className="pt-1">
            <span className="block font-bold text-slate-900">{step.title}</span>
            {step.desc && <span className="block mt-0.5 text-sm text-slate-600">{step.desc}</span>}
          </span>
        </Reveal>
      ))}
    </ol>
  );
}

function Testimonials({ items, theme }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const rating = Number(item.rating) || 0;
        return (
          <Reveal key={i} delay={i * 0.04} className="flex gap-3 items-end">
            <Avatar name={item.name} image={item.avatar} accent={theme.accent} />
            <div className="flex-1 rounded-2xl rounded-bl-sm bg-white p-4 shadow-sm ring-1 ring-slate-100">
              {rating > 0 && (
                <div className="flex gap-0.5 mb-1.5" aria-label={`Rating ${rating} dari 5`}>
                  {Array.from({ length: 5 }).map((_, k) => (
                    <FiStar key={k} size={13} className={k < rating ? "fill-current text-amber-400" : "text-slate-300"} aria-hidden="true" />
                  ))}
                </div>
              )}
              {item.quote && <p className="text-sm text-slate-700 leading-relaxed">{item.quote}</p>}
              <p className="mt-2 text-xs font-bold text-slate-900">
                {item.name}
                {item.role && <span className="font-normal text-slate-500"> · {item.role}</span>}
              </p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

function Faq({ items, theme }) {
  const [openIndex, setOpenIndex] = useState(-1);
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="rounded-xl bg-white ring-1 ring-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-bold text-slate-900"
              aria-expanded={isOpen}
            >
              {item.question}
              <FiChevronDown className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} style={{ color: theme.accent }} />
            </button>
            {isOpen && <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}

// Dedicated block selling the offer: checklist, CTA and a reassurance note.
function OfferSection({ section, campaign, theme, target }) {
  const items = activeItems(section);
  const sub = subheadingOf(section);
  return (
    <section className="px-5 py-10 bg-white">
      <Reveal
        className="rounded-3xl p-6 text-center text-white shadow-xl"
        style={{ background: `linear-gradient(160deg, ${theme.hero}, ${theme.heading})` }}
      >
        {section.badge && (
          <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white text-slate-900 mb-3">
            {section.badge}
          </span>
        )}
        {section.heading && <h2 className="text-2xl font-black leading-tight">{section.heading}</h2>}
        {sub && <p className="mt-2 text-sm text-white/85">{sub}</p>}
        {items.length > 0 && (
          <ul className="mt-5 space-y-2 text-left inline-block">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm font-semibold">
                <FiCheck className="shrink-0 text-[#FDE047]" size={18} aria-hidden="true" /> {item.title}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6">
          <BigCta text={section.ctaText || campaign.primaryCtaText} target={target} color={theme.cta} />
        </div>
        {section.note && <p className="mt-3 text-xs text-white/80">{section.note}</p>}
      </Reveal>
    </section>
  );
}

function FormSection({ campaign, theme, stepsSection }) {
  if (!stepsSection && !campaign.formEnabled) return null;
  return (
    <section id="cara-kerja" className="px-5 py-10 scroll-mt-12" style={{ backgroundColor: tint(theme.accent, 6) }}>
      {stepsSection && (
        <div className="mb-8">
          <Reveal className="text-center mb-6">
            <h2 className="text-2xl font-black" style={{ color: theme.heading }}>{stepsSection.heading}</h2>
            {subheadingOf(stepsSection) && <p className="mt-2 text-sm text-slate-500">{subheadingOf(stepsSection)}</p>}
          </Reveal>
          <Steps section={stepsSection} theme={theme} />
        </div>
      )}
      {campaign.formEnabled && (
        <LeadFormCard
          campaign={campaign}
          accent={theme.accent}
          headerColor={theme.heading}
          buttonColor={theme.cta}
          cardClassName="rounded-3xl bg-white shadow-lg ring-1 ring-slate-200"
        />
      )}
    </section>
  );
}

// One renderer per section type; each returns the block body, or null to
// skip the section (and its repeated CTA) when it has nothing to show.
function renderSection(section, theme) {
  const items = activeItems(section);
  if (!items.length) return null;
  switch (section.type) {
    case "problems":
      return { tone: "soft", body: <CheckList items={items} bad theme={theme} /> };
    case "benefits":
      return { id: "solusi", body: <CheckList items={items} theme={theme} /> };
    case "steps":
      return { tone: "soft", body: <Steps section={section} theme={theme} /> };
    case "gallery":
      return {
        id: "produk-sample",
        body: (
          <div className="grid grid-cols-2 gap-3">
            {items.map((item, i) => (
              <figure key={i} className="rounded-xl overflow-hidden bg-slate-100">
                {item.image ? (
                  <img src={item.image} alt={item.caption || "Sample produk"} loading="lazy" className="w-full aspect-square object-cover" />
                ) : (
                  <ImagePlaceholder label="Foto belum diupload" className="w-full aspect-square !rounded-none border-0" />
                )}
                {item.caption && <figcaption className="px-2 py-1.5 text-[11px] font-medium text-slate-600">{item.caption}</figcaption>}
              </figure>
            ))}
          </div>
        ),
      };
    case "areas":
      return {
        id: "area-layanan",
        body: (
          <div className="flex flex-wrap justify-center gap-2">
            {items.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 rounded-full bg-white pl-1 pr-4 py-1 ring-1 ring-slate-200 text-sm font-semibold text-slate-800">
                {item.icon ? (
                  <img src={item.icon} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: theme.accent }}>
                    <FiMapPin aria-hidden="true" />
                  </span>
                )}
                {item.title}
              </span>
            ))}
          </div>
        ),
      };
    case "testimonials":
      return { id: "testimoni", tone: "soft", body: <Testimonials items={items} theme={theme} /> };
    case "faq":
      return { id: "faq", body: <Faq items={items} theme={theme} /> };
    default:
      return null;
  }
}

function OfferBox({ campaign, theme, target }) {
  if (!campaign.ctaBandHeading && !campaign.ctaBandText) return null;
  const [line1, line2] = splitTwoLines(campaign.ctaBandHeading);
  const badges = Array.isArray(campaign.ctaBandBadges) ? campaign.ctaBandBadges : [];
  const end = settingText(campaign, "salesCountdownEnd");
  return (
    <section className="px-5 py-10 bg-white">
      <Reveal className="rounded-3xl border-[3px] border-dashed p-6 text-center" style={{ borderColor: theme.cta, backgroundColor: tint(theme.cta, 6) }}>
        {campaign.ctaBandHeading && (
          <h2 className="text-2xl font-black leading-tight" style={{ color: theme.heading }}>
            {line1} {line2 && <span style={{ color: theme.cta }}>{line2}</span>}
          </h2>
        )}
        {campaign.ctaBandText && <p className="mt-2 text-sm text-slate-600">{campaign.ctaBandText}</p>}
        {badges.length > 0 && (
          <ul className="mt-5 space-y-2 text-left">
            {badges.map((b, i) => {
              const Icon = ICON_MAP[b.icon] || FiShield;
              return (
                <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Icon style={{ color: theme.cta }} aria-hidden="true" /> {b.label}
                </li>
              );
            })}
          </ul>
        )}
        {end && (
          <div className="mt-6">
            <Countdown end={end} label={settingText(campaign, "salesCountdownLabel")} dark />
          </div>
        )}
        <div className="mt-6">
          <BigCta
            text={settingText(campaign, "ctaBandButtonText") || campaign.primaryCtaText}
            target={target}
            color={theme.cta}
            pulse
          />
        </div>
        {campaign.whatsappShortcutText && (
          <p className="mt-4 text-xs text-slate-500 inline-flex items-center gap-1.5">
            <FiMessageCircle aria-hidden="true" /> {campaign.whatsappShortcutText}
          </p>
        )}
      </Reveal>
    </section>
  );
}

function Footer({ campaign }) {
  const brand = settingText(campaign, "footerBrand");
  const tagline = settingText(campaign, "footerTagline");
  const rawWhatsappUrl = settingText(campaign, "footerWhatsappUrl");
  const whatsappUrl = /^https?:\/\//i.test(rawWhatsappUrl || "") ? rawWhatsappUrl : "";
  const whatsappTitle = settingText(campaign, "footerWhatsappTitle") ?? campaign.whatsappShortcutText;
  return (
    <footer
      className="px-5 py-8 text-center"
      style={{ backgroundColor: settingText(campaign, "footerBackgroundColor"), color: settingText(campaign, "footerTextColor") }}
    >
      {settingText(campaign, "footerLogo") && (
        <img src={settingText(campaign, "footerLogo")} alt={brand || "Logo"} className="h-10 w-auto mx-auto mb-3 object-contain" />
      )}
      {brand && <p className="text-sm font-bold">{brand}</p>}
      {tagline && <p className="mt-1 text-xs opacity-70">{tagline}</p>}
      {whatsappTitle && whatsappUrl && (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline">
          <FiMessageCircle aria-hidden="true" /> {whatsappTitle}
        </a>
      )}
      <p className="mt-4 text-[11px] opacity-50">{cleanList(settingText(campaign, "footerKeywords")).join(" · ")}</p>
    </footer>
  );
}

// Shown only once the hero (with its own CTA) is scrolled past, hidden while
// the lead form is on screen so it never covers the fields, and gone for
// good after a successful submit.
function StickyCta({ campaign, theme, target }) {
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    const onLead = () => setSubmitted(true);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(LEAD_EVENT, onLead);
    const form = document.getElementById("sample-form");
    const observer =
      form && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0.1 })
        : null;
    if (observer) observer.observe(form);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(LEAD_EVENT, onLead);
      observer?.disconnect();
    };
  }, []);
  if (!campaign.primaryCtaText) return null;
  const hidden = !pastHero || formVisible || submitted;
  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 pointer-events-none transition-transform duration-300 ${hidden ? "translate-y-[150%]" : ""}`}
      inert={hidden}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-md mx-auto px-4 pb-3 pointer-events-auto">
        <a
          href={target || "#sample-form"}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold text-white shadow-xl"
          style={{ backgroundColor: theme.cta }}
        >
          <FiGift aria-hidden="true" /> {campaign.primaryCtaText}
        </a>
      </div>
    </div>
  );
}

export default function SalesTemplate({ campaign, googleMapsApiKey }) {
  const theme = useTheme(campaign);
  const { sections, stepsSection, formSection, configurator, ctaTarget } = campaignModel(campaign);
  const target = ctaTarget || campaign.primaryCtaTarget || "#sample-form";

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: theme.surface }}>
      <PromoBar campaign={campaign} theme={theme} />
      <div className="max-w-md mx-auto bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
        {settingText(campaign, "topbarEnabled") !== false && <Brand campaign={campaign} theme={theme} />}
        <Hero campaign={campaign} theme={theme} target={target} />
        {configurator && <Configurator section={configurator} campaign={campaign} theme={theme} googleMapsApiKey={googleMapsApiKey} />}
        {sections.map((section, idx) => {
          // The first steps section sits right above the form instead.
          if (section === stepsSection) return null;
          const key = `${section.type}-${idx}`;
          if (section.type === "form") return <FormSection key={key} campaign={campaign} theme={theme} />;
          if (section.type === "offer") return <OfferSection key={key} section={section} campaign={campaign} theme={theme} target={target} />;
          const rendered = renderSection(section, theme);
          if (!rendered) return null;
          return (
            <div key={key} style={rendered.tone === "soft" ? { backgroundColor: tint(theme.accent, 6) } : undefined}>
              <Block id={rendered.id} section={section} theme={theme} tone={rendered.tone}>
                {rendered.body}
              </Block>
              {salesCtaAfter(section) && <RepeatCta campaign={campaign} theme={theme} target={target} />}
            </div>
          );
        })}
        {!formSection && <FormSection campaign={campaign} theme={theme} stepsSection={stepsSection} />}
        <OfferBox campaign={campaign} theme={theme} target={target} />
        {settingText(campaign, "footerEnabled") !== false && <Footer campaign={campaign} />}
      </div>
      <StickyCta campaign={campaign} theme={theme} target={target} />
    </main>
  );
}
