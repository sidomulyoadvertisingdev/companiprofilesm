import { useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
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
  CtaButton,
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
  cleanList,
  navLinks,
  settingText,
  splitTwoLines,
  subheadingOf,
  tint,
} from "./config.js";

// "Modern Split" template: light, corporate look. Two-column hero (copy next
// to the photo/video, or next to the lead form), clean white cards, product
// grid instead of posters. Colors come from the campaign's accent color plus
// the theme settings (themeCtaColor, themeHeadingColor, themeSurfaceColor).

function useTheme(campaign) {
  return {
    accent: campaign.accentColor || "#0A4DA6",
    cta: settingText(campaign, "themeCtaColor") || "#16A34A",
    heading: settingText(campaign, "themeHeadingColor") || "#0B1E3D",
    surface: settingText(campaign, "themeSurfaceColor") || "#F1F5F9",
  };
}

function BrandMark({ logo, brand, color, className = "h-9" }) {
  if (logo) return <img src={logo} alt={brand || "Logo"} className={`${className} w-auto object-contain shrink-0`} />;
  return (
    <span
      className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0"
      style={{ backgroundColor: color }}
    >
      {brand?.trim().charAt(0) || "S"}
    </span>
  );
}

function Header({ campaign, theme, ctaTarget }) {
  const brand = settingText(campaign, "topbarBrand");
  const tagline = settingText(campaign, "topbarTagline");
  const ctaText = settingText(campaign, "topbarCtaText");
  const mobileCtaText = settingText(campaign, "topbarCtaMobileText");
  const target = settingText(campaign, "topbarCtaTarget") || ctaTarget || campaign.primaryCtaTarget || "#sample-form";

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <a href="#produk" className="flex items-center gap-2.5 min-w-0">
          <BrandMark logo={settingText(campaign, "topbarLogo")} brand={brand} color={theme.accent} />
          <span className="leading-tight min-w-0">
            <span className="block text-sm font-extrabold truncate max-w-[150px] sm:max-w-none" style={{ color: theme.heading }}>
              {brand}
            </span>
            {tagline && <span className="hidden sm:block text-[11px] text-slate-500">{tagline}</span>}
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks(campaign, Boolean(ctaTarget)).map(([href, label]) => (
            <a key={href} href={href} className="hover:text-slate-900 transition-colors">
              {label}
            </a>
          ))}
        </nav>
        {(ctaText || mobileCtaText) && (
          <a
            href={target}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold text-white shrink-0 hover:opacity-90"
            style={{ backgroundColor: theme.cta }}
          >
            <span className="hidden sm:inline">{ctaText || mobileCtaText}</span>
            <span className="sm:hidden">{mobileCtaText || ctaText}</span>
            <FiArrowRight aria-hidden="true" />
          </a>
        )}
      </div>
    </header>
  );
}

function HeroMedia({ campaign, theme }) {
  if (campaign.heroVideo) {
    return (
      <video
        className="w-full aspect-[4/3] object-cover rounded-3xl shadow-2xl"
        src={campaign.heroVideo}
        poster={campaign.heroImage || undefined}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
    );
  }
  if (campaign.heroImage) {
    return (
      <img
        src={campaign.heroImage}
        alt={campaign.heroHeadline || ""}
        className="w-full aspect-[4/3] object-cover rounded-3xl shadow-2xl"
        loading="eager"
        fetchpriority="high"
      />
    );
  }
  return (
    <div
      className="w-full aspect-[4/3] rounded-3xl flex items-center justify-center text-white/70"
      style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.heading})` }}
    >
      <FiImage size={48} aria-hidden="true" />
    </div>
  );
}

function Hero({ campaign, theme, ctaTarget, heroForm }) {
  const target = ctaTarget || campaign.primaryCtaTarget || "#sample-form";
  const badges = cleanList(campaign.heroBadges);
  const trustPoints = Array.isArray(campaign.heroTrustPoints) ? campaign.heroTrustPoints : [];
  const mediaLeft = settingText(campaign, "splitMediaSide") === "left";

  return (
    <section
      id="produk"
      className="relative overflow-hidden scroll-mt-16"
      style={{ background: `linear-gradient(180deg, ${tint(theme.accent, 8)} 0%, #ffffff 100%)` }}
    >
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full blur-3xl"
        style={{ backgroundColor: tint(theme.accent, 18) }}
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className={mediaLeft ? "lg:order-2" : ""}>
          {campaign.heroEyebrow && (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase px-3 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: tint(theme.accent, 12), color: theme.accent }}
            >
              <FiStar aria-hidden="true" /> {campaign.heroEyebrow}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.12] tracking-tight" style={{ color: theme.heading }}>
            <HighlightedHeadline
              text={campaign.heroHeadline}
              highlight={settingText(campaign, "heroHighlight")}
              color={theme.cta}
              pillClassName="inline-block align-middle text-white text-[0.8em] font-extrabold px-3 py-0.5 rounded-lg mx-0.5 -rotate-2"
            />
          </h1>
          {campaign.heroSubtext && <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl">{campaign.heroSubtext}</p>}

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <CtaButton text={campaign.primaryCtaText} target={target} accent={theme.cta} icon={FiGift} className="!px-7 !py-4" />
            {campaign.secondaryCtaText && (
              <a
                href={target}
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold text-sm sm:text-base border-2 bg-white hover:bg-slate-50 transition-colors"
                style={{ borderColor: theme.accent, color: theme.accent }}
              >
                <FiMessageCircle aria-hidden="true" /> {campaign.secondaryCtaText}
              </a>
            )}
          </div>

          {settingText(campaign, "heroCtaNote") && (
            <p className="mt-3 text-sm text-slate-500">{settingText(campaign, "heroCtaNote")}</p>
          )}

          {trustPoints.length > 0 && (
            <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {trustPoints.map((tp, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white"
                    style={{ backgroundColor: theme.cta }}
                  >
                    <FiCheck size={12} aria-hidden="true" />
                  </span>
                  {tp.label}
                </li>
              ))}
            </ul>
          )}

          {badges.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {badges.map((b, i) => (
                <span key={i} className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-600">
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={mediaLeft ? "lg:order-1" : ""}>
          {heroForm ? (
            <LeadFormCard
              campaign={campaign}
              accent={theme.accent}
              headerColor={theme.heading}
              buttonColor={theme.cta}
              cardClassName="rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200"
            />
          ) : (
            <HeroMedia campaign={campaign} theme={theme} />
          )}
        </div>
      </div>
    </section>
  );
}

function Heading({ section, theme, align = "center" }) {
  const sub = subheadingOf(section);
  return (
    <Reveal className={`mb-10 ${align === "center" ? "text-center max-w-2xl mx-auto" : ""}`}>
      {section.badge && (
        <span className="inline-block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: theme.accent }}>
          {section.badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ color: theme.heading }}>
        {section.heading}
      </h2>
      {sub && <p className="mt-3 text-sm sm:text-base text-slate-500">{sub}</p>}
    </Reveal>
  );
}

function Configurator({ section, campaign, theme, googleMapsApiKey }) {
  const products = activeItems(section).filter((it) => it.title);
  const [openIdx, setOpenIdx] = useState(-1);
  if (!products.length) return null;
  return (
    <section id="pilih-produk" className="py-14 sm:py-20 px-4 sm:px-6 bg-white scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Heading section={{ ...section, heading: section.heading || "Pilih Produk" }} theme={theme} />
        {/* Flex instead of grid so a short last row (e.g. 3 products) stays centered. */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {products.map((p, i) => (
            <Reveal key={i} delay={i * 0.05} className="w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
              <button
                type="button"
                onClick={() => setOpenIdx(i)}
                className="group w-full text-left rounded-2xl bg-white ring-1 ring-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <span className="block aspect-[4/5] bg-slate-100 overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-slate-300">
                      <FiImage size={32} aria-hidden="true" />
                    </span>
                  )}
                </span>
                <span className="block p-4">
                  <span className="block font-bold text-sm sm:text-base" style={{ color: theme.heading }}>
                    {p.title}
                  </span>
                  {p.desc && <span className="block mt-1 text-xs text-slate-500 line-clamp-2">{p.desc}</span>}
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold" style={{ color: theme.accent }}>
                    Pilih produk <FiArrowRight aria-hidden="true" />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
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
    </section>
  );
}

// Problems on the left as a "before" list, the pitch on the right — reads as
// a comparison instead of another card grid.
function Problems({ section, theme }) {
  const items = activeItems(section);
  if (!items.length) return null;
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6" style={{ backgroundColor: theme.surface }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
        <Heading section={section} theme={theme} align="left" />
        <div className="space-y-3">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.05} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <span className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <FiX aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-slate-900">{item.title}</span>
                {item.desc && <span className="block mt-1 text-sm text-slate-500 leading-relaxed">{item.desc}</span>}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits({ section, theme }) {
  const items = activeItems(section);
  if (!items.length) return null;
  return (
    <section id="solusi" className="py-14 sm:py-20 px-4 sm:px-6 bg-white scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Heading section={section} theme={theme} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] || FiCheckCircle;
            return (
              <Reveal key={i} delay={i * 0.05} className="rounded-2xl p-6 ring-1 ring-slate-200 hover:shadow-lg transition-shadow">
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4"
                  style={{ backgroundColor: tint(theme.accent, 12), color: theme.accent }}
                >
                  <Icon aria-hidden="true" />
                </span>
                <h3 className="font-bold text-slate-900 mb-1.5">{item.title}</h3>
                {item.desc && <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StepsTimeline({ section, theme }) {
  const items = activeItems(section);
  return (
    <div>
      <Heading section={section} theme={theme} align="left" />
      <ol className="relative space-y-6 border-l-2 ml-5" style={{ borderColor: tint(theme.accent, 25) }}>
        {items.map((step, i) => (
          <Reveal key={i} delay={i * 0.05} className="relative pl-8">
            <span
              className="absolute -left-[21px] top-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ring-4 ring-white"
              style={{ backgroundColor: theme.accent }}
            >
              {step.number || i + 1}
            </span>
            <h3 className="font-bold text-slate-900 pt-2">{step.title}</h3>
            {step.desc && <p className="mt-1 text-sm text-slate-500 leading-relaxed">{step.desc}</p>}
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

function SampleSection({ stepsSection, campaign, theme, heroForm }) {
  const showForm = campaign.formEnabled && !heroForm;
  if (!stepsSection && !showForm) return null;
  return (
    <section id="cara-kerja" className="py-14 sm:py-20 px-4 sm:px-6 scroll-mt-16" style={{ backgroundColor: theme.surface }}>
      <div className={`max-w-6xl mx-auto grid gap-10 lg:gap-14 items-start ${stepsSection && showForm ? "lg:grid-cols-2" : "max-w-3xl"}`}>
        {stepsSection && <StepsTimeline section={stepsSection} theme={theme} />}
        {showForm && (
          <Reveal delay={0.1}>
            <LeadFormCard
              campaign={campaign}
              accent={theme.accent}
              headerColor={theme.heading}
              buttonColor={theme.cta}
              cardClassName="rounded-3xl bg-white shadow-xl ring-1 ring-slate-200"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Areas({ section, theme }) {
  const items = activeItems(section);
  if (!items.length) return null;
  return (
    <section id="area-layanan" className="py-14 sm:py-20 px-4 sm:px-6 bg-white scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Heading section={section} theme={theme} />
        <div className="grid sm:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.05} className="rounded-2xl overflow-hidden ring-1 ring-slate-200 bg-white">
              {item.icon ? (
                <img src={item.icon} alt={item.title} loading="lazy" className="w-full aspect-[16/10] object-cover" />
              ) : (
                <ImagePlaceholder label="Foto belum diupload" className="w-full aspect-[16/10] !rounded-none border-0" />
              )}
              <div className="p-4 flex items-center gap-2 font-semibold text-slate-900">
                <FiMapPin style={{ color: theme.accent }} aria-hidden="true" /> {item.title}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ section, theme }) {
  const items = activeItems(section);
  if (!items.length) return null;
  return (
    <section id="produk-sample" className="py-14 sm:py-20 px-4 sm:px-6 bg-white scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Heading section={section} theme={theme} />
        <div className="columns-2 sm:columns-3 gap-4 [&>*]:mb-4">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.04} className="break-inside-avoid rounded-2xl overflow-hidden ring-1 ring-slate-200 bg-white">
              {item.image ? (
                <img src={item.image} alt={item.caption || "Sample produk"} loading="lazy" className="w-full h-auto" />
              ) : (
                <ImagePlaceholder label="Foto belum diupload" className="w-full aspect-square !rounded-none border-0" />
              )}
              {item.caption && <p className="px-3 py-2.5 text-xs font-medium text-slate-600">{item.caption}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ section, theme }) {
  const items = activeItems(section);
  if (!items.length) return null;
  return (
    <section id="testimoni" className="py-14 sm:py-20 px-4 sm:px-6 scroll-mt-16" style={{ backgroundColor: theme.surface }}>
      <div className="max-w-6xl mx-auto">
        <Heading section={section} theme={theme} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const rating = Number(item.rating) || 0;
            return (
              <Reveal key={i} delay={i * 0.05} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 flex flex-col">
                <span className="text-5xl leading-none font-serif" style={{ color: tint(theme.accent, 40) }} aria-hidden="true">
                  &ldquo;
                </span>
                {item.quote && <p className="text-sm text-slate-700 leading-relaxed flex-1">{item.quote}</p>}
                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <Avatar name={item.name} image={item.avatar} accent={theme.accent} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-slate-900 truncate">{item.name}</p>
                    {item.role && <p className="text-xs text-slate-500 truncate">{item.role}</p>}
                  </div>
                  {rating > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                      <FiStar className="fill-current" aria-hidden="true" /> {rating}
                    </span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Faq({ section, theme }) {
  const items = activeItems(section);
  const [openIndex, setOpenIndex] = useState(0);
  if (!items.length) return null;
  return (
    <section id="faq" className="py-14 sm:py-20 px-4 sm:px-6 bg-white scroll-mt-16">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.6fr] gap-10 items-start">
        <Heading section={section} theme={theme} align="left" />
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left font-semibold text-slate-900"
                  aria-expanded={isOpen}
                >
                  {item.question}
                  <FiChevronDown className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} style={{ color: theme.accent }} />
                </button>
                {isOpen && <p className="pb-5 -mt-1 text-sm text-slate-500 leading-relaxed">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Offer({ section, campaign, theme, ctaTarget }) {
  const items = activeItems(section);
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <Reveal className="max-w-3xl mx-auto text-center rounded-[2rem] ring-1 ring-slate-200 px-6 py-10 sm:px-12" style={{ backgroundColor: tint(theme.accent, 5) }}>
        <Heading section={section} theme={theme} />
        {items.length > 0 && (
          <ul className="-mt-4 mb-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FiCheckCircle style={{ color: theme.cta }} aria-hidden="true" /> {item.title}
              </li>
            ))}
          </ul>
        )}
        <CtaButton
          text={section.ctaText || campaign.primaryCtaText}
          target={ctaTarget || campaign.primaryCtaTarget || "#sample-form"}
          accent={theme.cta}
          icon={FiGift}
          className="!px-8 !py-4"
        />
        {section.note && <p className="mt-4 text-xs text-slate-500">{section.note}</p>}
      </Reveal>
    </section>
  );
}

function CtaBand({ campaign, theme, ctaTarget }) {
  if (!campaign.ctaBandHeading && !campaign.ctaBandText) return null;
  const [line1, line2] = splitTwoLines(campaign.ctaBandHeading);
  const badges = Array.isArray(campaign.ctaBandBadges) ? campaign.ctaBandBadges : [];
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
      <Reveal
        className="max-w-6xl mx-auto rounded-[2rem] px-6 py-10 sm:px-12 sm:py-14 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.heading})` }}
      >
        <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            {campaign.ctaBandHeading && (
              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                {line1} {line2 && <span className="opacity-80">{line2}</span>}
              </h2>
            )}
            {campaign.ctaBandText && <p className="mt-3 text-white/80">{campaign.ctaBandText}</p>}
            <div className="mt-7">
              <CtaButton
                text={settingText(campaign, "ctaBandButtonText") || (campaign.primaryCtaText ? `${campaign.primaryCtaText} Sekarang` : null)}
                target={ctaTarget || campaign.primaryCtaTarget}
                accent={theme.cta}
                icon={FiGift}
              />
            </div>
            {campaign.whatsappShortcutText && (
              <p className="mt-4 text-sm text-white/70 inline-flex items-center gap-1.5">
                <FiMessageCircle aria-hidden="true" /> {campaign.whatsappShortcutText}
              </p>
            )}
          </div>
          {badges.length > 0 && (
            <ul className="space-y-3">
              {badges.map((b, i) => {
                const Icon = ICON_MAP[b.icon] || FiShield;
                return (
                  <li key={i} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium">
                    <Icon aria-hidden="true" /> {b.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Reveal>
    </section>
  );
}

function Footer({ campaign, theme }) {
  const brand = settingText(campaign, "footerBrand");
  const tagline = settingText(campaign, "footerTagline");
  const whatsappTitle = settingText(campaign, "footerWhatsappTitle") ?? campaign.whatsappShortcutText;
  const rawWhatsappUrl = settingText(campaign, "footerWhatsappUrl");
  const whatsappUrl = /^https?:\/\//i.test(rawWhatsappUrl || "") ? rawWhatsappUrl : "";
  const keywords = cleanList(settingText(campaign, "footerKeywords"));

  return (
    <footer
      className="px-4 sm:px-6 py-10"
      style={{ backgroundColor: settingText(campaign, "footerBackgroundColor"), color: settingText(campaign, "footerTextColor") }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <BrandMark
            logo={settingText(campaign, "footerLogo")}
            brand={brand}
            color={settingText(campaign, "footerBrandColor") || theme.accent}
            className="h-11"
          />
          <div>
            {brand && <p className="font-bold text-sm">{brand}</p>}
            {settingText(campaign, "footerBrandTagline") && <p className="text-xs opacity-70">{settingText(campaign, "footerBrandTagline")}</p>}
          </div>
        </div>
        {(tagline || keywords.length > 0) && (
          <div className="md:text-center">
            {tagline && <p className="text-sm font-semibold">{tagline}</p>}
            {keywords.length > 0 && (
              <div className="mt-2 flex flex-wrap md:justify-center gap-1.5">
                {keywords.map((k) => (
                  <span
                    key={k}
                    className="text-[11px] px-2 py-0.5 rounded-full border opacity-70"
                    style={{ borderColor: tint(settingText(campaign, "footerTextColor") || "#ffffff", 35) }}
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {whatsappTitle && (
          <a
            href={whatsappUrl || undefined}
            target={whatsappUrl ? "_blank" : undefined}
            rel={whatsappUrl ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-white self-start md:self-auto"
            style={{ backgroundColor: settingText(campaign, "footerWhatsappColor") || theme.cta }}
          >
            <FiMessageCircle size={20} aria-hidden="true" />
            <span className="text-left leading-tight">
              <span className="block text-sm font-bold">{whatsappTitle}</span>
              {settingText(campaign, "footerWhatsappLine1") && (
                <span className="block text-xs opacity-80">{settingText(campaign, "footerWhatsappLine1")}</span>
              )}
            </span>
          </a>
        )}
      </div>
    </footer>
  );
}

function StickyMobileCta({ campaign, theme, ctaTarget }) {
  if (!campaign.primaryCtaText) return null;
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-3"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <CtaButton text={campaign.primaryCtaText} target={ctaTarget || campaign.primaryCtaTarget} accent={theme.cta} className="w-full" icon={FiGift} />
    </div>
  );
}

const SECTION_COMPONENTS = {
  problems: Problems,
  benefits: Benefits,
  areas: Areas,
  gallery: Gallery,
  testimonials: Testimonials,
  faq: Faq,
};

export default function SplitTemplate({ campaign, googleMapsApiKey }) {
  const theme = useTheme(campaign);
  const { sections, stepsSection, formSection, configurator, ctaTarget } = campaignModel(campaign);
  // The lead form moves into the hero only when the admin asked for it and
  // the form is actually enabled.
  const heroForm = Boolean(settingText(campaign, "splitHeroForm")) && campaign.formEnabled;

  return (
    <main className="pb-24 md:pb-0 bg-white text-slate-900">
      {settingText(campaign, "topbarEnabled") !== false && <Header campaign={campaign} theme={theme} ctaTarget={ctaTarget} />}
      <Hero campaign={campaign} theme={theme} ctaTarget={ctaTarget} heroForm={heroForm} />
      {configurator && <Configurator section={configurator} campaign={campaign} theme={theme} googleMapsApiKey={googleMapsApiKey} />}
      {sections.map((section, idx) => {
        const key = `${section.type}-${idx}`;
        if (section.type === "form") {
          return <SampleSection key={key} campaign={campaign} theme={theme} heroForm={heroForm} />;
        }
        if (section.type === "offer") {
          return <Offer key={key} section={section} campaign={campaign} theme={theme} ctaTarget={ctaTarget} />;
        }
        if (section.type === "steps" && section !== stepsSection) {
          return (
            <section key={key} className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
              <div className="max-w-3xl mx-auto">
                <StepsTimeline section={section} theme={theme} />
              </div>
            </section>
          );
        }
        const Component = SECTION_COMPONENTS[section.type];
        return Component ? <Component key={key} section={section} theme={theme} /> : null;
      })}
      {!formSection && <SampleSection stepsSection={stepsSection} campaign={campaign} theme={theme} heroForm={heroForm} />}
      <CtaBand campaign={campaign} theme={theme} ctaTarget={ctaTarget} />
      {settingText(campaign, "footerEnabled") !== false && <Footer campaign={campaign} theme={theme} />}
      <StickyMobileCta campaign={campaign} theme={theme} ctaTarget={ctaTarget} />
    </main>
  );
}
