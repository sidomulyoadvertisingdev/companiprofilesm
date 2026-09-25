import { useEffect, useState, useCallback } from "react";
import AdCampaignAnalytics from "./AdCampaignAnalytics.jsx";
import {
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiUpload,
  FiExternalLink,
  FiDownload,
  FiMessageCircle,
  FiArrowLeft,
  FiUsers,
  FiBarChart2,
  FiSearch,
  FiGrid,
} from "react-icons/fi";

// Self-contained admin mini-app for the ad-campaigns feature. Does NOT
// import anything from AdminDashboard.jsx (that import only goes one way:
// AdminDashboard.jsx renders this component as its "campaigns" tab). Also
// still reachable directly at /admin/campaigns as its own standalone page —
// see the `embedded` prop below for how the two render modes differ.

const SECTION_TYPES = [
  { value: "configurator", label: "Pilih Produk (tampil di bawah hero)" },
  { value: "problems", label: "Problems" },
  { value: "benefits", label: "Benefits" },
  { value: "steps", label: "Steps" },
  { value: "areas", label: "Areas" },
  { value: "gallery", label: "Gallery (Sample Produk)" },
  { value: "testimonials", label: "Testimoni Pelanggan" },
  { value: "faq", label: "FAQ" },
];

const FIELD_TYPES = ["text", "tel", "email", "select", "textarea"];

const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "sample_approved",
  "sample_sent",
  "sample_received",
  "follow_up",
  "quotation",
  "order",
  "not_interested",
];

const LEAD_STATUS_LABELS = {
  new: "Baru",
  contacted: "Sudah Dihubungi",
  qualified: "Qualified",
  sample_approved: "Sample Disetujui",
  sample_sent: "Sample Terkirim",
  sample_received: "Sample Diterima",
  follow_up: "Follow Up",
  quotation: "Penawaran",
  order: "Order",
  not_interested: "Tidak Tertarik",
};

// Known field keys from the default SPPG campaign's form_fields_json —
// shown with a proper Indonesian label instead of the raw snake_case key.
// Any other campaign's custom field keys fall back to `humanizeKey` below,
// so this stays readable even for fields nobody's added a label for yet.
const ANSWER_LABELS = {
  pic_name: "Nama PIC / Penanggung Jawab",
  district: "Kecamatan",
  address: "Alamat Lengkap",
  tray_type: "Jenis Ompreng",
  daily_portion: "Perkiraan Porsi per Hari",
  current_label: "Label yang Dipakai Saat Ini",
  pain_point: "Masalah Utama",
  notes: "Catatan",
  // "Pilih Produk" configurator answers.
  produk: "Produk",
  varian: "Varian",
  isi_label: "Isi Label",
  pilihan: "Pilihan Pengiriman",
  gps_latitude: "Latitude GPS",
  gps_longitude: "Longitude GPS",
};

// The landing page's built-in section subheadings, shown here as the field's
// current value when a section never had one set, so the admin edits the
// text visitors actually see. Clearing the field hides the subheading.
const SUBHEADING_DEFAULTS = {
  configurator: "Klik produk untuk melihat varian & minta sample.",
  problems: "Kami memahami tantangan Anda, karena itu kami hadir dengan solusi yang tepat.",
  benefits: "Dirancang khusus untuk kebutuhan operasional SPPG yang dinamis.",
  areas: "Prioritas untuk SPPG aktif di 3 wilayah ini.",
  gallery: "Lihat langsung tampilan sample label removable pada ompreng.",
  testimonials: "Kata SPPG yang sudah mencoba label removable kami.",
  steps: "Proses mudah, cepat, dan tanpa biaya.",
};

// Same idea for page_settings_json (see PAGE_SETTING_DEFAULTS in
// AdCampaignLanding.jsx).
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
  topbarButtonColor: "#2563EB",
  topbarBackgroundColor: "#0a0a1a",
  heroHighlight: "GRATIS",
  ctaBandButtonText: "",
  footerTagline: "Partner Visual untuk Operasional SPPG yang Lebih Baik",
  footerEnabled: true,
  footerKeywords: ["Label", "Sticker", "Desain Custom", "Cetak Berkualitas"],
  footerLogo: "",
  footerBrand: "SIDOMULYO ADVERTISING",
  footerBrandTagline: "Solusi Visual untuk Bisnis Anda",
  footerBackgroundColor: "#0B1E3D",
  footerBrandColor: "#2563EB",
  footerWhatsappColor: "#16A34A",
  footerWhatsappTitle: null,
  footerWhatsappLine1: "di WhatsApp kami",
  footerWhatsappLine2: "Kami siap membantu Anda.",
  footerWhatsappUrl: "",
  formPrivacyNote: "Data Anda aman dan hanya digunakan untuk keperluan pengiriman sample.",
};

// Popup copy fields of a "Pilih Produk" section; empty = landing default.
const CONFIGURATOR_TEXT_FIELDS = [
  ["variantLabel", "Judul pilihan varian", "Pilih varian"],
  ["contentLabel", "Judul pilihan isi label", "Mau isi label apa saja?"],
  ["addressLabel", "Judul form alamat", "Kirim alamat SPPG Anda"],
  ["nameLabel", "Label kolom nama", "Nama SPPG"],
  ["submitText", "Teks tombol kirim", "Kirim Alamat ke WhatsApp"],
  ["waGreeting", "Pembuka pesan WhatsApp", "Halo Sidomulyo, saya mau"],
];

// Defaults for a freshly added "Pilih Produk" section — mirror the landing
// page's own fallbacks so the admin sees (and can edit) what visitors get.
const CONFIGURATOR_DEFAULTS = {
  heading: "Pilih Produk",
  contentOptions: ["Barcode", "Nama SPPG", "Jam", "Tanggal", "Menu Makanan", "Himbauan", "CP SPPG", "Kandungan Gizi"],
  orderOptions: ["Kirim sample ke SPPG saya (gratis)", "Kirim sample ke SPPG & saya order sekalian"],
};

function humanizeKey(key) {
  return ANSWER_LABELS[key] || String(key || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function api(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

async function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Upload gagal");
  return data.url;
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}

function ImageUploadField({ value, onChange, label = "Gambar" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="" className="w-14 h-14 rounded-lg object-cover border" />}
        <TextInput value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="URL gambar" />
        <label className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-300 cursor-pointer hover:bg-slate-50">
          <FiUpload /> {uploading ? "..." : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </Field>
  );
}

function VideoUploadField({ value, onChange, label = "Video", hint }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-3">
        <TextInput value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="URL video (.mp4 / .webm)" />
        <label className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-300 cursor-pointer hover:bg-slate-50">
          <FiUpload /> {uploading ? "Mengunggah..." : "Upload"}
          <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-300 text-red-500 hover:bg-red-50"
          >
            Hapus
          </button>
        )}
      </div>
      {value && (
        <video src={value} muted loop autoPlay playsInline className="mt-3 w-full max-w-sm rounded-xl border bg-black aspect-video object-cover" />
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </Field>
  );
}

const emptyCampaign = () => ({
  slug: "",
  title: "",
  status: "draft",
  metaTitle: "",
  metaDescription: "",
  ogImage: "",
  canonicalUrl: "",
  noindex: false,
  publishedAt: "",
  accentColor: "#0A4DA6",
  heroEyebrow: "",
  heroHeadline: "",
  heroSubtext: "",
  heroImage: "",
  heroVideo: "",
  heroBadges: [],
  heroTrustPoints: [],
  primaryCtaText: "",
  primaryCtaTarget: "",
  secondaryCtaText: "",
  secondaryCtaTarget: "",
  sections: [],
  formEnabled: false,
  formTitle: "",
  formSubtext: "",
  formFields: [],
  ctaBandHeading: "",
  ctaBandText: "",
  ctaBandBadges: [],
  whatsappShortcutText: "",
  pageSettings: {},
});

// Small {icon, label} array editor — used for both hero trust points and
// CTA band badges. `icon` is a plain string key (e.g. "check", "shield")
// looked up against AdCampaignLanding.jsx's ICON_MAP, not a URL/upload.
function IconLabelRepeater({ label, items, onChange }) {
  const list = items || [];
  return (
    <Field label={label}>
      <div className="space-y-2">
        {list.map((it, i) => (
          <div key={i} className="flex gap-2">
            <TextInput
              placeholder="Icon (mis. check, shield, gear, heart, users)"
              value={it.icon || ""}
              onChange={(e) => {
                const next = [...list];
                next[i] = { ...next[i], icon: e.target.value };
                onChange(next);
              }}
            />
            <TextInput
              placeholder="Label"
              value={it.label || ""}
              onChange={(e) => {
                const next = [...list];
                next[i] = { ...next[i], label: e.target.value };
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(list.filter((_, idx) => idx !== i))}
              className="shrink-0 text-red-500 px-2"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...list, { icon: "", label: "" }])}
          className="text-xs font-medium text-blue-600 inline-flex items-center gap-1"
        >
          <FiPlus /> Tambah item
        </button>
      </div>
    </Field>
  );
}

function BadgesRepeater({ badges, onChange }) {
  const list = badges || [];
  return (
    <Field label="Badges">
      <div className="space-y-2">
        {list.map((b, i) => (
          <div key={i} className="flex gap-2">
            <TextInput
              value={b}
              onChange={(e) => {
                const next = [...list];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(list.filter((_, idx) => idx !== i))}
              className="shrink-0 text-red-500 px-2"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...list, ""])}
          className="text-xs font-medium text-blue-600 inline-flex items-center gap-1"
        >
          <FiPlus /> Tambah badge
        </button>
      </div>
    </Field>
  );
}

// Variants of a "Pilih Produk" product: a name plus an optional photo that
// replaces the product photo in the landing page popup when picked. Older
// campaigns stored plain strings; those are read as { name, image: "" }.
function VariantsRepeater({ variants, onChange }) {
  const list = (variants || []).map((v) => (typeof v === "string" ? { name: v, image: "" } : v));

  function update(i, patch) {
    const next = [...list];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  return (
    <div className="mt-2 rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium text-slate-600 mb-2">
        Varian (opsional) — foto varian menggantikan foto produk saat varian dipilih
      </p>
      {list.map((v, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-2.5 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <TextInput
              placeholder="Nama varian (mis. 7 x 4 cm)"
              value={v.name || ""}
              onChange={(e) => update(i, { name: e.target.value })}
            />
            <button
              type="button"
              onClick={() => onChange(list.filter((_, idx) => idx !== i))}
              className="shrink-0 p-2 text-red-500"
              aria-label="Hapus varian"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
          <ImageUploadField label="Foto varian" value={v.image || ""} onChange={(url) => update(i, { image: url })} />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...list, { name: "", image: "" }])}
        className="text-xs font-medium text-blue-600 inline-flex items-center gap-1"
      >
        <FiPlus /> Tambah varian
      </button>
    </div>
  );
}

function SectionItemEditor({ type, item, index, onChange, onRemove, onMove }) {
  const set = (key, val) => onChange({ ...item, [key]: val });
  return (
    <div className="rounded-xl border border-slate-200 p-3 mb-2 bg-slate-50">
      <div className="flex items-center gap-3 mb-2">
        {type === "configurator" && (
          <span className="text-xs font-semibold text-slate-700">
            Produk #{index + 1}
            {item.title ? ` — ${item.title}` : ""}
          </span>
        )}
        <label className="inline-flex items-center gap-1.5 text-xs">
          <input type="checkbox" checked={item.active !== false} onChange={(e) => set("active", e.target.checked)} />
          Aktif
        </label>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" onClick={() => onMove(-1)} className="p-1 text-slate-500" aria-label="Naikkan">
            <FiChevronUp size={14} />
          </button>
          <button type="button" onClick={() => onMove(1)} className="p-1 text-slate-500" aria-label="Turunkan">
            <FiChevronDown size={14} />
          </button>
          <button type="button" onClick={onRemove} className="p-1 text-red-500" aria-label="Hapus">
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
      {type === "configurator" ? (
        <>
          <ImageUploadField
            label="Foto produk (poster, rasio 2:3)"
            value={item.image || ""}
            onChange={(url) => set("image", url)}
          />
          <TextInput
            className="mt-2 mb-2"
            placeholder="Nama produk (mis. Label Ompreng Removable)"
            value={item.title || ""}
            onChange={(e) => set("title", e.target.value)}
          />
          <TextInput
            className="mb-2"
            placeholder="Deskripsi singkat (opsional)"
            value={item.desc || ""}
            onChange={(e) => set("desc", e.target.value)}
          />
          <VariantsRepeater variants={item.variants} onChange={(v) => set("variants", v)} />
        </>
      ) : type === "faq" ? (
        <>
          <TextInput
            className="mb-2"
            placeholder="Pertanyaan"
            value={item.question || ""}
            onChange={(e) => set("question", e.target.value)}
          />
          <TextArea
            rows={2}
            placeholder="Jawaban"
            value={item.answer || ""}
            onChange={(e) => set("answer", e.target.value)}
          />
        </>
      ) : type === "gallery" ? (
        <>
          <ImageUploadField
            label="Foto sample produk"
            value={item.image || ""}
            onChange={(url) => set("image", url)}
          />
          <TextInput
            className="mt-2"
            placeholder="Keterangan foto (opsional, mis. Label Nasi Ayam Teriyaki)"
            value={item.caption || ""}
            onChange={(e) => set("caption", e.target.value)}
          />
        </>
      ) : type === "testimonials" ? (
        <>
          <ImageUploadField
            label="Foto (opsional, kosongkan untuk avatar inisial)"
            value={item.avatar || ""}
            onChange={(url) => set("avatar", url)}
          />
          <TextInput
            className="mt-2 mb-2"
            placeholder="Nama pemberi testimoni"
            value={item.name || ""}
            onChange={(e) => set("name", e.target.value)}
          />
          <TextInput
            className="mb-2"
            placeholder="Jabatan / Nama SPPG (mis. Kepala Dapur SPPG Salatiga)"
            value={item.role || ""}
            onChange={(e) => set("role", e.target.value)}
          />
          <TextArea
            rows={3}
            className="mb-2"
            placeholder="Isi testimoni"
            value={item.quote || ""}
            onChange={(e) => set("quote", e.target.value)}
          />
          <TextInput
            type="number"
            min="1"
            max="5"
            placeholder="Rating bintang (1-5, opsional)"
            value={item.rating ?? ""}
            onChange={(e) => set("rating", e.target.value ? Number(e.target.value) : null)}
          />
        </>
      ) : (
        <>
          {type === "steps" && (
            <TextInput
              className="mb-2"
              placeholder="Nomor"
              value={item.number || ""}
              onChange={(e) => set("number", e.target.value)}
            />
          )}
          <TextInput
            className="mb-2"
            placeholder={
              type === "areas" ? "URL foto (opsional, kosongkan untuk placeholder)" : "Icon key (mis. frown, hand, shield)"
            }
            value={item.icon || ""}
            onChange={(e) => set("icon", e.target.value)}
          />
          <TextInput
            className="mb-2"
            placeholder="Judul"
            value={item.title || ""}
            onChange={(e) => set("title", e.target.value)}
          />
          <TextArea
            rows={2}
            placeholder="Deskripsi"
            value={item.desc || ""}
            onChange={(e) => set("desc", e.target.value)}
          />
        </>
      )}
    </div>
  );
}

function newSectionItem(type) {
  if (type === "configurator") return { image: "", title: "", desc: "", variants: [], active: true };
  if (type === "faq") return { question: "", answer: "", active: true };
  if (type === "steps") return { number: "", icon: "", title: "", desc: "", active: true };
  if (type === "gallery") return { image: "", caption: "", active: true };
  if (type === "testimonials") return { name: "", role: "", quote: "", rating: 5, avatar: "", active: true };
  return { icon: "", title: "", desc: "", active: true };
}

function SectionsRepeater({ sections, onChange }) {
  const list = sections || [];

  function updateSection(i, patch) {
    const next = [...list];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function remove(i) {
    onChange(list.filter((_, idx) => idx !== i));
  }
  function addSection() {
    onChange([...list, { type: "problems", heading: "", badge: "", items: [] }]);
  }

  return (
    <Field label="Sections">
      <div className="space-y-3">
        {list.map((section, i) => (
          <div key={i} className="rounded-xl border border-slate-300 p-4">
            <div className="flex items-center gap-2 mb-3">
              <select
                value={section.type}
                onChange={(e) => {
                  const type = e.target.value;
                  const patch = { type };
                  if (type === "configurator") {
                    if (!section.heading) patch.heading = CONFIGURATOR_DEFAULTS.heading;
                    if (!section.contentOptions) patch.contentOptions = CONFIGURATOR_DEFAULTS.contentOptions;
                    if (!section.orderOptions) patch.orderOptions = CONFIGURATOR_DEFAULTS.orderOptions;
                  }
                  updateSection(i, patch);
                }}
                className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium"
              >
                {SECTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div className="ml-auto flex items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} className="p-1 text-slate-500">
                  <FiChevronUp size={14} />
                </button>
                <button type="button" onClick={() => move(i, 1)} className="p-1 text-slate-500">
                  <FiChevronDown size={14} />
                </button>
                <button type="button" onClick={() => remove(i)} className="p-1 text-red-500">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
            <TextInput
              className="mb-2"
              placeholder="Heading"
              value={section.heading || ""}
              onChange={(e) => updateSection(i, { heading: e.target.value })}
            />
            <TextInput
              className="mb-2"
              placeholder="Subheading (opsional)"
              value={section.subheading ?? SUBHEADING_DEFAULTS[section.type] ?? ""}
              onChange={(e) => updateSection(i, { subheading: e.target.value })}
            />
            <TextInput
              className="mb-3"
              placeholder="Badge (opsional)"
              value={section.badge || ""}
              onChange={(e) => updateSection(i, { badge: e.target.value })}
            />
            {section.type === "configurator" && (
              <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                <p className="text-xs text-slate-500 mb-2">
                  Item di bawah = kartu produk yang berjalan ke samping. Saat diklik muncul popup: foto, varian, isi label,
                  lalu 2 tombol pengiriman → pengunjung mengisi alamat → terkirim ke WhatsApp (nomor diambil dari
                  &quot;Secondary CTA Target&quot;).
                </p>
                <label className="block text-xs font-medium text-slate-600 mb-1">Pilihan isi label (satu per baris)</label>
                <TextArea
                  rows={5}
                  value={(section.contentOptions || []).join("\n")}
                  onChange={(e) => updateSection(i, { contentOptions: e.target.value.split("\n") })}
                />
                <label className="block text-xs font-medium text-slate-600 mt-3 mb-1">Teks di popup produk</label>
                <div className="grid sm:grid-cols-2 gap-x-3">
                  {CONFIGURATOR_TEXT_FIELDS.map(([key, label, placeholder]) => (
                    <div key={key} className="mb-2">
                      <span className="block text-[11px] text-slate-500 mb-0.5">{label}</span>
                      <TextInput
                        placeholder={placeholder}
                        value={section[key] || ""}
                        onChange={(e) => updateSection(i, { [key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <label className="block text-xs font-medium text-slate-600 mt-3 mb-1">Teks pilihan pengiriman</label>
                {[0, 1].map((k) => (
                  <TextInput
                    key={k}
                    className="mb-2"
                    placeholder={CONFIGURATOR_DEFAULTS.orderOptions[k]}
                    value={(section.orderOptions || [])[k] || ""}
                    onChange={(e) => {
                      const orderOptions = [...(section.orderOptions || ["", ""])];
                      orderOptions[k] = e.target.value;
                      updateSection(i, { orderOptions });
                    }}
                  />
                ))}
              </div>
            )}
            <div>
              {(section.items || []).map((item, j) => (
                <SectionItemEditor
                  key={j}
                  index={j}
                  type={section.type}
                  item={item}
                  onMove={(dir) => {
                    const k = j + dir;
                    const items = [...(section.items || [])];
                    if (k < 0 || k >= items.length) return;
                    [items[j], items[k]] = [items[k], items[j]];
                    updateSection(i, { items });
                  }}
                  onChange={(next) => {
                    const items = [...(section.items || [])];
                    items[j] = next;
                    updateSection(i, { items });
                  }}
                  onRemove={() => {
                    const items = (section.items || []).filter((_, idx) => idx !== j);
                    updateSection(i, { items });
                  }}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  updateSection(i, { items: [...(section.items || []), newSectionItem(section.type)] })
                }
                className="text-xs font-medium text-blue-600 inline-flex items-center gap-1"
              >
                <FiPlus /> {section.type === "configurator" ? "Tambah produk" : "Tambah item"}
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addSection}
          className="text-xs font-medium text-blue-600 inline-flex items-center gap-1"
        >
          <FiPlus /> Tambah section
        </button>
      </div>
    </Field>
  );
}

function FormFieldsRepeater({ fields, onChange }) {
  const list = fields || [];

  function update(i, patch) {
    const next = [...list];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function remove(i) {
    onChange(list.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...list, { key: "", label: "", type: "text", required: false, options: [] }]);
  }

  return (
    <Field label="Form Fields">
      <div className="space-y-3">
        {list.map((f, i) => (
          <div key={i} className="rounded-xl border border-slate-300 p-3 grid grid-cols-2 gap-2">
            <TextInput placeholder="key" value={f.key || ""} onChange={(e) => update(i, { key: e.target.value })} />
            <TextInput
              placeholder="label"
              value={f.label || ""}
              onChange={(e) => update(i, { label: e.target.value })}
            />
            <select
              value={f.type || "text"}
              onChange={(e) => update(i, { type: e.target.value })}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
            >
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={!!f.required}
                onChange={(e) => update(i, { required: e.target.checked })}
              />
              Wajib
            </label>
            {f.type === "select" && (
              <TextInput
                className="col-span-2"
                placeholder="Options (pisahkan koma)"
                value={(f.options || []).join(",")}
                onChange={(e) => update(i, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              />
            )}
            <TextInput
              className="col-span-2"
              placeholder="Placeholder (opsional)"
              value={f.placeholder || ""}
              onChange={(e) => update(i, { placeholder: e.target.value })}
            />
            <button type="button" onClick={() => remove(i)} className="col-span-2 text-xs text-red-500 text-left">
              <FiTrash2 className="inline mr-1" size={12} /> Hapus field
            </button>
          </div>
        ))}
        <button type="button" onClick={add} className="text-xs font-medium text-blue-600 inline-flex items-center gap-1">
          <FiPlus /> Tambah field
        </button>
      </div>
    </Field>
  );
}

function CampaignForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(initial || emptyCampaign());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const pageSetting = (key) => form.pageSettings?.[key] ?? PAGE_SETTING_DEFAULTS[key];
  const setPageSetting = (key, val) =>
    setForm((f) => ({ ...f, pageSettings: { ...(f.pageSettings || {}), [key]: val } }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, publishedAt: form.publishedAt || null };
      const saved = form.id
        ? await api(`/api/admin/ad-campaigns?id=${form.id}`, { method: "PUT", body: JSON.stringify(payload) })
        : await api("/api/admin/ad-campaigns", { method: "POST", body: JSON.stringify(payload) });
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>}

      <Card className="mb-4">
        <h3 className="font-semibold mb-3">Dasar</h3>
        <div className="grid sm:grid-cols-2 gap-x-4">
          <Field label="Slug">
            <TextInput value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
          </Field>
          <Field label="Title">
            <TextInput value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Published At">
            <TextInput
              type="datetime-local"
              value={form.publishedAt ? String(form.publishedAt).slice(0, 16) : ""}
              onChange={(e) => set("publishedAt", e.target.value)}
            />
          </Field>
          <Field label="Accent Color">
            <TextInput value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} />
          </Field>
          <Field label="Noindex">
            <label className="inline-flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={!!form.noindex} onChange={(e) => set("noindex", e.target.checked)} />
              Sembunyikan dari mesin pencari
            </label>
          </Field>
        </div>
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold mb-3">SEO</h3>
        <Field label="Meta Title">
          <TextInput value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
        </Field>
        <Field label="Meta Description">
          <TextArea rows={2} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
        </Field>
        <ImageUploadField label="OG Image" value={form.ogImage} onChange={(v) => set("ogImage", v)} />
        <Field label="Canonical URL">
          <TextInput value={form.canonicalUrl} onChange={(e) => set("canonicalUrl", e.target.value)} />
        </Field>
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold mb-1">Topbar</h3>
        <p className="text-xs text-slate-500 mb-4">Pengaturan ini berlaku untuk campaign yang sedang diedit. Kosongkan label menu untuk menyembunyikannya.</p>
        <Field label="Tampilkan topbar">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={pageSetting("topbarEnabled") !== false} onChange={(e) => setPageSetting("topbarEnabled", e.target.checked)} />
            Tampilkan topbar di halaman campaign
          </label>
        </Field>
        <ImageUploadField label="Logo topbar (opsional)" value={pageSetting("topbarLogo")} onChange={(v) => setPageSetting("topbarLogo", v)} />
        <div className="grid sm:grid-cols-2 gap-x-4">
          <Field label="Nama brand">
            <TextInput value={pageSetting("topbarBrand")} onChange={(e) => setPageSetting("topbarBrand", e.target.value)} />
          </Field>
          <Field label="Tagline brand">
            <TextInput value={pageSetting("topbarTagline")} onChange={(e) => setPageSetting("topbarTagline", e.target.value)} />
          </Field>
          {[
            ["topbarNavProduct", "Menu Produk"],
            ["topbarNavSteps", "Menu Cara Kerja"],
            ["topbarNavAreas", "Menu Area Layanan"],
            ["topbarNavTestimonials", "Menu Testimoni"],
            ["topbarNavFaq", "Menu FAQ"],
          ].map(([key, label]) => (
            <Field key={key} label={label}>
              <TextInput value={pageSetting(key)} onChange={(e) => setPageSetting(key, e.target.value)} />
            </Field>
          ))}
          <Field label="Teks tombol (desktop)">
            <TextInput value={pageSetting("topbarCtaText")} onChange={(e) => setPageSetting("topbarCtaText", e.target.value)} />
          </Field>
          <Field label="Teks tombol (mobile)">
            <TextInput value={pageSetting("topbarCtaMobileText")} onChange={(e) => setPageSetting("topbarCtaMobileText", e.target.value)} />
          </Field>
          <Field label="Tujuan tombol" hint="Kosongkan untuk mengikuti tujuan CTA utama. Bisa berupa #sample-form atau URL lengkap.">
            <TextInput value={pageSetting("topbarCtaTarget")} onChange={(e) => setPageSetting("topbarCtaTarget", e.target.value)} />
          </Field>
          <Field label="Warna tombol dan ikon brand" hint="Kode warna CSS, misalnya #2563EB.">
            <TextInput value={pageSetting("topbarButtonColor")} onChange={(e) => setPageSetting("topbarButtonColor", e.target.value)} />
          </Field>
          <Field label="Warna topbar saat halaman digulir" hint="Kode warna CSS, misalnya #0a0a1a.">
            <TextInput value={pageSetting("topbarBackgroundColor")} onChange={(e) => setPageSetting("topbarBackgroundColor", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold mb-3">Hero</h3>
        <Field label="Eyebrow">
          <TextInput value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} />
        </Field>
        <Field label="Headline">
          <TextArea rows={2} value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} />
        </Field>
        <Field label="Subtext">
          <TextArea rows={2} value={form.heroSubtext} onChange={(e) => set("heroSubtext", e.target.value)} />
        </Field>
        <VideoUploadField
          label="Hero Background Video"
          value={form.heroVideo}
          onChange={(v) => set("heroVideo", v)}
          hint="Diputar otomatis tanpa suara & berulang di belakang judul hero. Format MP4 (H.264) atau WebM, maks 50 MB — idealnya 10–30 detik, di bawah 10 MB agar cepat dimuat."
        />
        <ImageUploadField label="Hero Image (poster / fallback video)" value={form.heroImage} onChange={(v) => set("heroImage", v)} />
        <BadgesRepeater badges={form.heroBadges} onChange={(v) => set("heroBadges", v)} />
        <IconLabelRepeater
          label="Trust points (3 ikon kecil di bawah tombol CTA)"
          items={form.heroTrustPoints}
          onChange={(v) => set("heroTrustPoints", v)}
        />
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold mb-3">CTA</h3>
        <div className="grid sm:grid-cols-2 gap-x-4">
          <Field label="Primary CTA Text">
            <TextInput value={form.primaryCtaText} onChange={(e) => set("primaryCtaText", e.target.value)} />
          </Field>
          <Field label="Primary CTA Target">
            <TextInput value={form.primaryCtaTarget} onChange={(e) => set("primaryCtaTarget", e.target.value)} />
          </Field>
          <Field label="Secondary CTA Text">
            <TextInput value={form.secondaryCtaText} onChange={(e) => set("secondaryCtaText", e.target.value)} />
          </Field>
          <Field
            label="Secondary CTA Target"
            hint='Tombol "Chat WhatsApp" di hero mengarahkan pengunjung ke form isian dulu, bukan langsung buka chat. Link wa.me di sini dipakai sebagai sumber nomor WhatsApp untuk pesan follow-up otomatis setelah pengunjung submit form.'
          >
            <TextInput value={form.secondaryCtaTarget} onChange={(e) => set("secondaryCtaTarget", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold mb-3">Sections</h3>
        <SectionsRepeater sections={form.sections} onChange={(v) => set("sections", v)} />
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold mb-3">CTA Band</h3>
        <Field label="Heading">
          <TextArea rows={2} value={form.ctaBandHeading} onChange={(e) => set("ctaBandHeading", e.target.value)} />
        </Field>
        <Field label="Text">
          <TextArea rows={2} value={form.ctaBandText} onChange={(e) => set("ctaBandText", e.target.value)} />
        </Field>
        <Field label="WhatsApp shortcut text">
          <TextInput value={form.whatsappShortcutText} onChange={(e) => set("whatsappShortcutText", e.target.value)} />
        </Field>
        <IconLabelRepeater
          label="Badges (3 ikon kecil di sisi CTA band)"
          items={form.ctaBandBadges}
          onChange={(v) => set("ctaBandBadges", v)}
        />
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold mb-1">Footer</h3>
        <p className="text-xs text-slate-500 mb-4">Atur identitas, pesan tengah, dan kontak WhatsApp di bagian bawah halaman.</p>
        <Field label="Tampilkan footer">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={pageSetting("footerEnabled") !== false} onChange={(e) => setPageSetting("footerEnabled", e.target.checked)} />
            Tampilkan footer di halaman campaign
          </label>
        </Field>
        <ImageUploadField label="Logo footer (opsional)" value={pageSetting("footerLogo")} onChange={(v) => setPageSetting("footerLogo", v)} />
        <div className="grid sm:grid-cols-2 gap-x-4">
          <Field label="Nama brand footer">
            <TextInput value={pageSetting("footerBrand")} onChange={(e) => setPageSetting("footerBrand", e.target.value)} />
          </Field>
          <Field label="Tagline brand footer">
            <TextInput value={pageSetting("footerBrandTagline")} onChange={(e) => setPageSetting("footerBrandTagline", e.target.value)} />
          </Field>
          <Field label="Judul pesan tengah">
            <TextInput value={pageSetting("footerTagline")} onChange={(e) => setPageSetting("footerTagline", e.target.value)} />
          </Field>
          <Field label="Kata kunci footer (satu per baris)">
            <TextArea rows={4} value={(pageSetting("footerKeywords") || []).join("\n")} onChange={(e) => setPageSetting("footerKeywords", e.target.value.split("\n"))} />
          </Field>
          <Field label="Judul WhatsApp" hint="Kosongkan untuk menyembunyikan blok WhatsApp footer. Sebelum diubah, memakai WhatsApp shortcut text di CTA Band.">
            <TextInput value={pageSetting("footerWhatsappTitle") ?? form.whatsappShortcutText ?? ""} onChange={(e) => setPageSetting("footerWhatsappTitle", e.target.value)} />
          </Field>
          <Field label="Teks WhatsApp baris 1">
            <TextInput value={pageSetting("footerWhatsappLine1")} onChange={(e) => setPageSetting("footerWhatsappLine1", e.target.value)} />
          </Field>
          <Field label="Teks WhatsApp baris 2">
            <TextInput value={pageSetting("footerWhatsappLine2")} onChange={(e) => setPageSetting("footerWhatsappLine2", e.target.value)} />
          </Field>
          <Field label="Link WhatsApp footer" hint="Opsional. Isi URL https://wa.me/... agar seluruh blok kontak dapat diklik.">
            <TextInput value={pageSetting("footerWhatsappUrl")} onChange={(e) => setPageSetting("footerWhatsappUrl", e.target.value)} />
          </Field>
          <Field label="Warna latar footer">
            <TextInput value={pageSetting("footerBackgroundColor")} onChange={(e) => setPageSetting("footerBackgroundColor", e.target.value)} />
          </Field>
          <Field label="Warna teks footer">
            <TextInput value={pageSetting("footerTextColor")} onChange={(e) => setPageSetting("footerTextColor", e.target.value)} />
          </Field>
          <Field label="Warna ikon brand">
            <TextInput value={pageSetting("footerBrandColor")} onChange={(e) => setPageSetting("footerBrandColor", e.target.value)} />
          </Field>
          <Field label="Warna ikon WhatsApp">
            <TextInput value={pageSetting("footerWhatsappColor")} onChange={(e) => setPageSetting("footerWhatsappColor", e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold mb-3">Teks Lainnya</h3>
        <Field label="Kata yang di-highlight di headline" hint='Ditampilkan sebagai pil hijau, mis. "GRATIS". Kosongkan untuk tanpa highlight.'>
          <TextInput value={pageSetting("heroHighlight")} onChange={(e) => setPageSetting("heroHighlight", e.target.value)} />
        </Field>
        <Field label="Teks tombol CTA band" hint='Kosongkan untuk memakai Primary CTA Text + " Sekarang".'>
          <TextInput value={pageSetting("ctaBandButtonText")} onChange={(e) => setPageSetting("ctaBandButtonText", e.target.value)} />
        </Field>
        <Field label="Catatan privasi di bawah form sample">
          <TextInput value={pageSetting("formPrivacyNote")} onChange={(e) => setPageSetting("formPrivacyNote", e.target.value)} />
        </Field>
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold mb-3">Form Sample</h3>
        <Field label="Aktifkan form">
          <label className="inline-flex items-center gap-1.5 text-sm">
            <input type="checkbox" checked={!!form.formEnabled} onChange={(e) => set("formEnabled", e.target.checked)} />
            Tampilkan form lead di halaman
          </label>
        </Field>
        <Field label="Form Title">
          <TextInput value={form.formTitle} onChange={(e) => set("formTitle", e.target.value)} />
        </Field>
        <Field label="Form Subtext">
          <TextArea rows={2} value={form.formSubtext} onChange={(e) => set("formSubtext", e.target.value)} />
        </Field>
        <FormFieldsRepeater fields={form.formFields} onChange={(v) => set("formFields", v)} />
      </Card>

      <div className="flex gap-2 sticky bottom-0 bg-[#f5f5f7]/95 backdrop-blur py-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl font-semibold text-sm border">
          Batal
        </button>
      </div>
    </form>
  );
}

function CampaignsTab() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null=list, {} for new, object for edit
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/api/admin/ad-campaigns");
      setCampaigns(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id) {
    if (!confirm("Hapus campaign ini? Semua leads terkait akan ikut terhapus.")) return;
    await api(`/api/admin/ad-campaigns?id=${id}`, { method: "DELETE" });
    load();
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesQuery = `${campaign.title} ${campaign.slug}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (!statusFilter || campaign.status === statusFilter);
  });
  const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / pageSize));
  const visibleCampaigns = filteredCampaigns.slice((page - 1) * pageSize, page * pageSize);

  if (editing !== null) {
    return (
      <CampaignForm
        initial={editing.id ? editing : null}
        onSaved={() => {
          setEditing(null);
          load();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block">
            <FiSearch aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Cari campaign"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Cari campaign..."
              className="w-56 rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-500"
            />
          </label>
          <select
            aria-label="Filter status campaign"
            value={statusFilter}
            onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
          >
            <option value="">Semua status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <button
          onClick={() => setEditing(emptyCampaign())}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
        >
          <FiPlus /> Tambah Campaign
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4">Nama Campaign</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Dibuat</th>
              <th className="px-5 py-4">Landing Page</th>
              <th className="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">Memuat campaign...</td></tr>
            ) : visibleCampaigns.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">Tidak ada campaign yang sesuai.</td></tr>
            ) : visibleCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <span className="font-semibold text-slate-900">{campaign.title}</span>
                  <span className="mt-1 block text-xs text-slate-500">/promo/{campaign.slug}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${campaign.status === "published" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {campaign.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600">{campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}</td>
                <td className="px-5 py-4">
                  <a href={`/promo/${campaign.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-blue-700 hover:underline">
                    Buka halaman <FiExternalLink size={14} />
                  </a>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(campaign)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                    <button onClick={() => handleDelete(campaign.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>Menampilkan {filteredCampaigns.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredCampaigns.length)} dari {filteredCampaigns.length} campaign</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage((current) => Math.max(current - 1, 1))} disabled={page <= 1} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 disabled:opacity-40">Sebelumnya</button>
            <span>Halaman {page} dari {totalPages}</span>
            <button type="button" onClick={() => setPage((current) => Math.min(current + 1, totalPages))} disabled={page >= totalPages} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 disabled:opacity-40">Berikutnya</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LeadRow({ lead, onUpdated }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(lead.adminNotes || "");
  const [status, setStatus] = useState(lead.status);
  const [saving, setSaving] = useState(false);

  async function save(patch) {
    setSaving(true);
    try {
      const updated = await api(`/api/admin/ad-campaign-leads?id=${lead.id}`, {
        method: "PUT",
        body: JSON.stringify(patch),
      });
      onUpdated(updated);
    } finally {
      setSaving(false);
    }
  }

  const waHref = lead.whatsapp ? `https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, "")}` : "";

  return (
    <>
      <tr className="border-b border-slate-100 text-sm">
        <td className="py-2.5 pr-3">{lead.name}</td>
        <td className="py-2.5 pr-3">{lead.whatsapp || "-"}</td>
        <td className="max-w-xs py-2.5 pr-3 text-xs text-slate-600">{lead.answers?.address || lead.city || "-"}</td>
        <td className="py-2.5 pr-3">{lead.campaignTitle}</td>
        <td className="py-2.5 pr-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              save({ status: e.target.value });
            }}
            className="text-xs rounded-lg border border-slate-300 px-2 py-1"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABELS[s] || s}
              </option>
            ))}
          </select>
        </td>
        <td className="py-2.5 pr-3 text-xs text-slate-500">
          {lead.createdAt ? new Date(lead.createdAt).toLocaleString("id-ID") : "-"}
        </td>
        <td className="py-2.5 pr-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 rounded-lg border inline-flex items-center gap-1"
              >
                <FiMessageCircle size={12} /> WA
              </a>
            )}
            <button
              onClick={() => save({ status: "sample_sent" })}
              className="text-xs px-2 py-1 rounded-lg border"
              disabled={saving}
            >
              Sample Terkirim
            </button>
            <button
              onClick={() => save({ status: "follow_up" })}
              className="text-xs px-2 py-1 rounded-lg border"
              disabled={saving}
            >
              Follow Up
            </button>
            <button
              onClick={() => save({ status: "order" })}
              className="text-xs px-2 py-1 rounded-lg border"
              disabled={saving}
            >
              Order
            </button>
            <button onClick={() => setExpanded((v) => !v)} className="text-xs px-2 py-1 rounded-lg border">
              {expanded ? "Tutup" : "Detail"}
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-slate-100 bg-slate-50">
          <td colSpan={7} className="p-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Email</p>
                <p className="text-sm mb-3">{lead.email || "-"}</p>
                <p className="text-xs font-semibold text-slate-500 mb-1">Message</p>
                <p className="text-sm mb-3">{lead.message || "-"}</p>
                <p className="text-xs font-semibold text-slate-500 mb-1">Jawaban Lengkap</p>
                {Object.keys(lead.answers || {}).length > 0 ? (
                  <dl className="text-sm bg-white border rounded-lg divide-y divide-slate-100 overflow-hidden">
                    {Object.entries(lead.answers || {}).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-2 px-3 py-2">
                        <dt className="text-xs font-medium text-slate-500">{humanizeKey(key)}</dt>
                        <dd className="text-sm text-[#1d1d1f] break-words">
                          {Array.isArray(value) ? value.join(", ") : String(value ?? "") || "-"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm text-slate-400">-</p>
                )}
                <p className="text-xs font-semibold text-slate-500 mt-3 mb-1">UTM</p>
                <p className="text-xs text-slate-500">
                  source={lead.utmSource || "-"} medium={lead.utmMedium || "-"} campaign={lead.utmCampaign || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Catatan Admin</p>
                <TextArea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
                <button
                  onClick={() => save({ adminNotes: notes })}
                  disabled={saving}
                  className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-700 text-white"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function LeadsTab() {
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState({ items: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ campaignId: "", status: "", city: "", q: "", dateFrom: "", dateTo: "", page: 1 });

  useEffect(() => {
    api("/api/admin/ad-campaigns").then(setCampaigns).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.campaignId) params.set("campaignId", filters.campaignId);
      if (filters.status) params.set("status", filters.status);
      if (filters.city) params.set("city", filters.city);
      if (filters.q) params.set("q", filters.q);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);
      params.set("page", filters.page);
      const data = await api(`/api/admin/ad-campaign-leads?${params.toString()}`);
      setLeads(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  function setFilter(key, val) {
    setFilters((f) => ({ ...f, [key]: val, page: key === "page" ? val : 1 }));
  }

  function exportCsvUrl() {
    const params = new URLSearchParams();
    if (filters.campaignId) params.set("campaignId", filters.campaignId);
    if (filters.status) params.set("status", filters.status);
    if (filters.city) params.set("city", filters.city);
    if (filters.q) params.set("q", filters.q);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    params.set("format", "csv");
    return `/api/admin/ad-campaign-leads?${params.toString()}`;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold">Leads</h2>
        <a
          href={exportCsvUrl()}
          className="text-xs font-medium px-3 py-2 rounded-xl border inline-flex items-center gap-1.5"
        >
          <FiDownload size={14} /> Export CSV
        </a>
      </div>

      <Card className="mb-4">
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <select
            value={filters.campaignId}
            onChange={(e) => setFilter("campaignId", e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Semua Campaign</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilter("status", e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Semua Status</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABELS[s] || s}
              </option>
            ))}
          </select>
          <TextInput placeholder="Kota" value={filters.city} onChange={(e) => setFilter("city", e.target.value)} />
          <TextInput placeholder="Cari nama SPPG/alamat/WA" value={filters.q} onChange={(e) => setFilter("q", e.target.value)} />
          <TextInput type="date" value={filters.dateFrom} onChange={(e) => setFilter("dateFrom", e.target.value)} />
          <TextInput type="date" value={filters.dateTo} onChange={(e) => setFilter("dateTo", e.target.value)} />
        </div>
      </Card>

      <Card>
        {loading ? (
          <p className="text-sm text-slate-500">Memuat...</p>
        ) : leads.items.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada leads.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                  <th className="pb-2 pr-3">Nama SPPG</th>
                  <th className="pb-2 pr-3">WhatsApp</th>
                  <th className="pb-2 pr-3">Alamat SPPG</th>
                  <th className="pb-2 pr-3">Campaign</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2 pr-3">Tanggal</th>
                  <th className="pb-2 pr-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {leads.items.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onUpdated={(updated) =>
                      setLeads((prev) => ({
                        ...prev,
                        items: prev.items.map((l) => (l.id === updated.id ? updated : l)),
                      }))
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <span>
            Halaman {leads.page} dari {leads.totalPages} ({leads.total} leads)
          </span>
          <div className="flex gap-2">
            <button
              disabled={leads.page <= 1}
              onClick={() => setFilter("page", leads.page - 1)}
              className="px-2.5 py-1 rounded-lg border disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={leads.page >= leads.totalPages}
              onClick={() => setFilter("page", leads.page + 1)}
              className="px-2.5 py-1 rounded-lg border disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// The same three tabs work inside the dashboard sidebar and on the standalone route.
export default function AdCampaignAdmin({ embedded = false, googleMapsApiKey = "" } = {}) {
  const [tab, setTab] = useState("campaigns");

  const body = (
    <>
      {!embedded && (
        <>
          <a href="/admin" className="text-sm text-blue-600 font-medium inline-flex items-center gap-1.5 mb-4">
            <FiArrowLeft aria-hidden="true" /> Dashboard Utama
          </a>
          <h1 className="text-2xl font-bold mb-1">Ad Campaigns</h1>
          <p className="text-sm text-slate-500 mb-6">
            Kelola landing page campaign iklan dan leads secara terpisah dari CMS utama.
          </p>
        </>
      )}

      <div role="tablist" aria-label="Bagian landing page campaign" className="mb-5 flex gap-1 overflow-x-auto border-b border-slate-200">
        <button
          role="tab"
          aria-selected={tab === "campaigns"}
          onClick={() => setTab("campaigns")}
          className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            tab === "campaigns" ? "border-blue-700 text-blue-700" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <FiGrid aria-hidden="true" /> Campaigns
        </button>
        <button
          role="tab"
          aria-selected={tab === "leads"}
          onClick={() => setTab("leads")}
          className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            tab === "leads" ? "border-blue-700 text-blue-700" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <FiUsers aria-hidden="true" /> Leads
        </button>
        <button
          role="tab"
          aria-selected={tab === "analytics"}
          onClick={() => setTab("analytics")}
          className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            tab === "analytics" ? "border-blue-700 text-blue-700" : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <FiBarChart2 aria-hidden="true" /> Analisa Iklan
        </button>
      </div>

      {tab === "campaigns" ? <CampaignsTab /> : tab === "leads" ? <LeadsTab /> : <AdCampaignAnalytics googleMapsApiKey={googleMapsApiKey} onOpenLeads={() => setTab("leads")} />}
    </>
  );

  if (embedded) return body;

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="w-full px-4 sm:px-6 py-6">{body}</div>
    </div>
  );
}
