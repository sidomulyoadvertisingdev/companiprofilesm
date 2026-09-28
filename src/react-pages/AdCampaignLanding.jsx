import { Fragment, useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiMapPin,
  FiChevronDown,
  FiChevronRight,
  FiMessageCircle,
  FiGift,
  FiShield,
  FiHelpCircle,
  FiImage,
  FiStar,
} from "react-icons/fi";
import {
  Reveal,
  ImagePlaceholder,
  CtaButton,
  HighlightedHeadline,
  HeroBackground,
  LeadFormCard,
  Avatar,
  ProductModal,
} from "./ad-campaign/shared.jsx";
import {
  NAVY,
  GOLD,
  BLUE,
  GREEN,
  PreviewContext,
  settingText,
  templateOf,
  campaignModel,
  ICON_MAP,
  navLinks,
  cleanList,
  splitTwoLines,
} from "./ad-campaign/config.js";
import SplitTemplate from "./ad-campaign/SplitTemplate.jsx";
import SalesTemplate from "./ad-campaign/SalesTemplate.jsx";

// Self-contained ad-campaign landing page. Deliberately does NOT import
// anything from LandingPage.jsx / the general CMS landing-page engine —
// this component is a standalone parallel feature.
//
// The components in this file make up the original "cinematic" template;
// the default export picks the template set in pageSettings.template.

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
// SPPG name/address, which saves a lead and hands the full order summary
// to Sidomulyo's WhatsApp.
// Content comes from a `type: "configurator"` entry in sections_json.
// ---------------------------------------------------------------------------


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


function ConfiguratorSection({ section, campaign, googleMapsApiKey }) {
  const products = (section.items || []).filter((it) => it.active !== false && it.title);
  const [openIdx, setOpenIdx] = useState(-1);

  if (!products.length) return null;

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

        <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-8 px-4 sm:px-0">
          {products.map((p, i) => (
            <PosterCard key={i} item={p} index={i} onSelect={() => setOpenIdx(i)} />
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

function CinematicTemplate({ campaign, googleMapsApiKey }) {
  const accent = campaign.accentColor || "#0A4DA6";
  const { sections, stepsSection, configurator, ctaTarget } = campaignModel(campaign);

  return (
    <main className="pb-24 md:pb-0">
      {settingText(campaign, "topbarEnabled") !== false && <TopNav campaign={campaign} ctaTarget={ctaTarget} />}
      <Hero campaign={campaign} ctaTarget={ctaTarget} />
      {configurator && <ConfiguratorSection section={configurator} campaign={campaign} googleMapsApiKey={googleMapsApiKey} />}
      <SectionsLoop sections={sections} stepsSection={stepsSection} accent={accent} />
      <SampleSection stepsSection={stepsSection} campaign={campaign} accent={accent} />
      <CtaBand campaign={campaign} />
      {settingText(campaign, "footerEnabled") !== false && <Footer campaign={campaign} />}
      <StickyMobileCta campaign={campaign} ctaTarget={ctaTarget} />
    </main>
  );
}

const TEMPLATE_COMPONENTS = {
  cinematic: CinematicTemplate,
  split: SplitTemplate,
  sales: SalesTemplate,
};

// `preview` is set by the admin's live-preview iframe (see
// AdCampaignPreview.jsx) so forms there never create real leads.
export default function AdCampaignLanding({ campaign, googleMapsApiKey, preview = false }) {
  const Template = TEMPLATE_COMPONENTS[templateOf(campaign)];
  return (
    <PreviewContext.Provider value={preview}>
      <Template campaign={campaign} googleMapsApiKey={googleMapsApiKey} />
    </PreviewContext.Provider>
  );
}
