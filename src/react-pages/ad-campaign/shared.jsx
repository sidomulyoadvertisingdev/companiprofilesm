import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMaps } from "../../lib/google-maps-client.js";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiMessageCircle,
  FiArrowRight,
  FiEdit3,
  FiGift,
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
  FiImage,
  FiSend,
  FiCheck,
  FiShoppingCart,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";
import {
  PreviewContext,
  readUtm,
  trackLead,
  reverseGeocodeAddress,
  PREVIEW_NOTICE,
  NAVY,
  BLUE,
  GREEN,
  settingText,
  fadeUp,
  isWaLink,
  FORM_FIELD_ICONS,
  PHONE_RE,
  initialFromName,
  DEFAULT_CONTENT_OPTIONS,
  configText,
  DEFAULT_ORDER_OPTIONS,
  normalizeVariants,
  cleanList,
  extractWaPhone,
  darkInput,
} from "./config.js";

// Components shared by every ad-campaign landing template: lead form, the
// "Pilih Produk" popup and small building blocks. Data helpers live in
// config.js.

export function Reveal({ children, className, style, delay = 0 }) {
  return (
    <motion.div
      className={className}
      style={style}
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

// Clean, deliberate empty-state for any photo field that hasn't been
// uploaded yet through the admin editor — never a broken <img>.
export function ImagePlaceholder({ label = "Foto akan ditambahkan", className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 dark:border-white/15 dark:bg-white/[0.03] dark:text-slate-500 ${className}`}
    >
      <FiImage size={28} aria-hidden="true" />
      <span className="text-xs font-medium text-center px-3">{label}</span>
    </div>
  );
}

export function CtaButton({ text, target, variant = "primary", className = "", accent, arrow, icon: Icon }) {
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

// Splits a headline string and wraps the given word(s) as a filled green pill,
// matching the mockup where "GRATIS" appears as a badge inline in the headline.
export function HighlightedHeadline({
  text,
  highlight,
  color = GREEN,
  pillClassName = "inline-block align-middle text-white text-[0.85em] font-extrabold px-2.5 py-0.5 rounded-full mx-0.5",
}) {
  if (!text) return null;
  if (!highlight) return text;
  // Escape so an admin-typed word with regex characters can't break the split.
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "g"));
  return (
    <>
      {parts.map((part, i) =>
        part === highlight ? (
          <span key={i} className={pillClassName} style={{ backgroundColor: color }}>
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
export function HeroBackground({ video, image }) {
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

// headerColor / buttonColor / cardClassName let each template restyle the
// card; the defaults are the cinematic template's original look.
export function LeadFormCard({
  campaign,
  accent,
  headerColor = NAVY,
  buttonColor = BLUE,
  cardClassName = "rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm",
}) {
  const preview = useContext(PreviewContext);
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

  // Bring the thank-you card (with the WhatsApp follow-up button) into view:
  // it is much shorter than the form, so without this the visitor is left
  // looking at whatever section follows.
  useEffect(() => {
    if (success) document.getElementById("sample-form")?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [success]);

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

    if (preview) {
      setSubmitting(false);
      setSubmitError(PREVIEW_NOTICE);
      return;
    }

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
          ...readUtm(),
          referrer: document.referrer || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data.message || "Gagal mengirim, coba lagi.");
        return;
      }
      trackLead(campaign);
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
      <div id="sample-form" className={`${cardClassName} overflow-hidden text-center p-8 scroll-mt-20`}>
        <FiCheckCircle className="mx-auto text-4xl mb-4" style={{ color: accent }} />
        <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2">Terima kasih!</h3>
        <p className="text-sm text-[#6e6e73] dark:text-slate-400 mb-2">
          Data Anda sudah kami terima.
        </p>
        {waTarget && (
          <>
            <p className="text-sm font-semibold text-[#1d1d1f] dark:text-white mb-5 max-w-sm mx-auto">
              Satu langkah lagi: klik tombol WhatsApp di bawah supaya tim kami bisa langsung follow up permintaan Anda lebih cepat.
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
    <div id="sample-form" className={`${cardClassName} overflow-hidden scroll-mt-20`}>
      <div className="px-6 sm:px-8 py-6" style={{ backgroundColor: headerColor }}>
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
          style={{ backgroundColor: buttonColor }}
        >
          {submitting ? (
            "Mengirim..."
          ) : (
            <>
              <FiSend aria-hidden="true" /> {settingText(campaign, "formSubmitText") || "Kirim"}
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

export function Avatar({ name, image, accent }) {
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

export function Chip({ selected, onClick, children, check, thumb }) {
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

// The popup keeps its dark look in every template; ctaColor / altColor only
// recolor the two order buttons and the send button to match the page.
export function ProductModal({ product, section, campaign, googleMapsApiKey, onClose, ctaColor = GREEN, altColor = BLUE }) {
  const preview = useContext(PreviewContext);
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
  const [info, setInfo] = useState({ name: "", address: "" });
  const [sppgId, setSppgId] = useState(null);
  const [manualSppg, setManualSppg] = useState(false);
  const [registeredAddress, setRegisteredAddress] = useState("");
  const [sppgMatches, setSppgMatches] = useState([]);
  const [sppgLoading, setSppgLoading] = useState(false);
  const [addressSource, setAddressSource] = useState("database");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [detectingAddress, setDetectingAddress] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [detectedCoords, setDetectedCoords] = useState(null);
  const [waUrl, setWaUrl] = useState("");
  const scrollRef = useRef(null);
  const locatingRef = useRef(false);
  // The big photo follows the selected variant's own photo, falling back to
  // the product photo when that variant has none (or nothing is picked yet).
  const photo = variants.find((v) => v.name === variant)?.image || product.image;

  useEffect(() => {
    if (sppgId || manualSppg || info.name.trim().length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSppgLoading(true);
      try {
        const response = await fetch(`/api/sppg-directory?q=${encodeURIComponent(info.name.trim())}`, { signal: controller.signal });
        if (response.ok) setSppgMatches(await response.json());
      } catch (error) {
        if (error.name !== "AbortError") setSppgMatches([]);
      } finally {
        if (!controller.signal.aborted) setSppgLoading(false);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [info.name, sppgId, manualSppg]);

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

  const detectAddress = useCallback(async () => {
    if (locatingRef.current) return;
    if (!navigator.geolocation) {
      setLocationError("Browser ini tidak mendukung lokasi. Isi alamat secara manual.");
      return;
    }
    locatingRef.current = true;
    setDetectingAddress(true);
    setLocationError("");
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 60000,
        });
      });
      const { latitude, longitude } = position.coords;
      window.sidomulyoTrackLocation?.(latitude, longitude);
      let address = "";
      if (googleMapsApiKey) {
        try {
          const maps = await loadGoogleMaps(googleMapsApiKey);
          const geocoder = new maps.Geocoder();
          const { results } = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });
          address = results?.[0]?.formatted_address || "";
        } catch {
          address = "";
        }
      }
      if (!address) address = await reverseGeocodeAddress(latitude, longitude);
      if (!address) throw new Error("Alamat tidak ditemukan. Isi alamat secara manual.");
      setInfo((current) => ({ ...current, address }));
      setAddressSource("maps");
      setDetectedCoords({ lat: latitude, lng: longitude });
      setErrors((current) => ({ ...current, address: undefined }));
    } catch (err) {
      const message = err?.code === 1
        ? "Izin lokasi ditolak. Aktifkan izin lokasi di browser atau isi alamat manual."
        : err?.code === 2 || err?.code === 3
          ? "Lokasi belum dapat dideteksi. Coba lagi atau isi alamat manual."
          : err?.message || "Alamat gagal dideteksi. Isi alamat secara manual.";
      setLocationError(message);
    } finally {
      locatingRef.current = false;
      setDetectingAddress(false);
    }
  }, [googleMapsApiKey]);

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
      `Status SPPG: ${manualSppg ? "Belum terdaftar" : "Terdaftar"}`,
      `Alamat: ${info.address.trim()}`,
      `Sumber alamat: ${addressSource === "database" ? "Database SPPG" : addressSource === "maps" ? "Rekomendasi Maps" : "Diisi manual"}`,
      addressSource === "maps" && detectedCoords ? `Titik lokasi: https://www.google.com/maps?q=${detectedCoords.lat},${detectedCoords.lng}` : null,
    ];
    return lines.filter((l) => l !== null).join("\n");
  }

  async function handleSend(e) {
    e.preventDefault();
    const errs = {};
    if (manualSppg && info.name.trim().length < 2) errs.name = "Ketik nama SPPG minimal 2 karakter";
    else if (!manualSppg && !sppgId) errs.name = "Pilih dari daftar atau pilih opsi SPPG belum terdaftar";
    if (!info.address.trim()) errs.address = "Wajib diisi";
    if (preview && !Object.keys(errs).length) errs.form = PREVIEW_NOTICE;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/ad-campaign-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignSlug: campaign.slug,
          source: "product_configurator",
          sppgId,
          manualSppg,
          name: info.name,
          answers: {
            produk: product.title,
            varian: variant || "-",
            isi_label: contents.join(", "),
            pilihan: orderOption,
            address: info.address,
            address_source: addressSource,
            ...(addressSource === "maps" && detectedCoords ? { gps_latitude: detectedCoords.lat, gps_longitude: detectedCoords.lng } : {}),
          },
          ...readUtm(),
          referrer: document.referrer || null,
        }),
      });
      if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data.message || "Data belum lengkap." });
        return;
      }
      if (!res.ok) {
        setErrors({ form: "Data belum berhasil divalidasi. Coba kirim lagi." });
        return;
      }
      trackLead(campaign, { content_category: product.title });
    } catch {
      setErrors({ form: "Koneksi terputus. Coba kirim lagi." });
      return;
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
                      style={{ backgroundColor: i === 0 ? ctaColor : altColor }}
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
              <div className="space-y-3">
                <div className="relative">
                  <input
                    className={darkInput}
                    aria-label={configText(section, "nameLabel")}
                    autoComplete="organization"
                    placeholder="Ketik nama SPPG Anda"
                    value={info.name}
                    onChange={(e) => {
                      setInfo({ name: e.target.value, address: "" });
                      setSppgId(null);
                      if (!manualSppg) setAddressSource("database");
                      setRegisteredAddress("");
                      setSppgMatches([]);
                      setDetectedCoords(null);
                    }}
                  />
                  {!sppgId && !manualSppg && info.name.trim().length >= 2 && (
                    <div className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-white/20 bg-[#252525] shadow-xl">
                      {sppgMatches.map((item) => (
                        <button key={item.id} type="button" className="block w-full border-b border-white/10 px-4 py-3 text-left text-sm text-white hover:bg-white/10" onClick={() => {
                          setSppgId(item.id);
                          setManualSppg(false);
                          setRegisteredAddress(item.address);
                          setInfo({ name: item.name, address: item.address });
                          setAddressSource("database");
                          setSppgMatches([]);
                          setLocationError("");
                          setErrors((current) => ({ ...current, name: undefined, address: undefined }));
                        }}>
                          <span className="block font-semibold">{item.name}</span>
                          <span className="block text-xs text-white/60">{item.address}</span>
                        </button>
                      ))}
                      {!sppgLoading && !sppgMatches.length && <p className="px-4 py-3 text-xs text-white/60">Nama SPPG tidak ditemukan dalam database.</p>}
                      <button type="button" className="block w-full px-4 py-3 text-left text-sm font-semibold text-green-300 hover:bg-white/10" onClick={() => {
                        setManualSppg(true);
                        setSppgId(null);
                        setSppgMatches([]);
                        setInfo((current) => ({ ...current, address: "" }));
                        setAddressSource("manual");
                        setErrors((current) => ({ ...current, name: undefined }));
                      }}>SPPG belum ada di database — ketik manual</button>
                    </div>
                  )}
                  {sppgId && <p className="mt-1 text-xs text-green-400">SPPG terdaftar ✓</p>}
                  {manualSppg && <div className="mt-2 flex items-center gap-3 text-xs"><span className="text-amber-300">SPPG belum terdaftar — isi nama dan alamat manual.</span><button type="button" className="underline text-white" onClick={() => { setManualSppg(false); setInfo({ name: "", address: "" }); setAddressSource("database"); setDetectedCoords(null); }}>Cari di database</button></div>}
                  {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                </div>
                {(sppgId || manualSppg) && <div>
                  <label htmlFor="sppg-address" className="block text-sm text-white/70 mb-2">Alamat SPPG</label>
                  <div className="mb-2 flex flex-wrap gap-2 text-xs">
                    {sppgId && <button type="button" onClick={() => { setAddressSource("database"); setInfo((v) => ({ ...v, address: registeredAddress })); setDetectedCoords(null); }} className={`rounded-md border px-3 py-2 ${addressSource === "database" ? "border-green-400 text-green-300" : "border-white/25 text-white/70"}`}>Alamat database</button>}
                    <button type="button" onClick={() => { setAddressSource("manual"); setInfo((v) => ({ ...v, address: "" })); setDetectedCoords(null); setLocationError(""); }} className={`rounded-md border px-3 py-2 ${addressSource === "manual" ? "border-green-400 text-green-300" : "border-white/25 text-white/70"}`}>Ketik sendiri</button>
                    <button type="button" onClick={detectAddress} disabled={detectingAddress} className={`rounded-md border px-3 py-2 disabled:opacity-50 ${addressSource === "maps" ? "border-green-400 text-green-300" : "border-white/25 text-white/70"}`}>{detectingAddress ? "Mendeteksi..." : "Rekomendasi Maps"}</button>
                  </div>
                  <textarea
                    id="sppg-address"
                    className={darkInput}
                    rows={3}
                    placeholder="Alamat lengkap (jalan, desa/kelurahan, kecamatan, kota)"
                    value={info.address}
                    readOnly={addressSource === "database"}
                    onChange={(e) => { setInfo((current) => ({ ...current, address: e.target.value })); setAddressSource("manual"); setDetectedCoords(null); }}
                  />
                  <p className="mt-2 text-xs text-white/60">{manualSppg ? "Belum ada alamat pembanding di database. Periksa alamat pengiriman sebelum dikirim." : addressSource === "database" ? "Alamat awal sesuai data SPPG dari admin." : info.address.trim().toLocaleLowerCase("id-ID") === registeredAddress.trim().toLocaleLowerCase("id-ID") ? "Teks alamat sama dengan data SPPG dari admin." : "Teks alamat tidak sama dengan data SPPG admin. Periksa apakah lokasi pengiriman benar."}</p>
                  {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
                </div>}
              </div>
              {locationError && <p role="alert" className="mt-2 text-xs text-amber-300">{locationError}</p>}
              {errors.form && <p className="mt-3 text-sm text-red-400">{errors.form}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-md px-8 py-4 text-base sm:text-lg font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ backgroundColor: ctaColor }}
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
