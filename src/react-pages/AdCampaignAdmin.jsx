import { useEffect, useState, useCallback } from "react";
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
} from "react-icons/fi";

// Self-contained admin mini-app for the ad-campaigns feature. Does NOT
// import anything from AdminDashboard.jsx (that import only goes one way:
// AdminDashboard.jsx renders this component as its "campaigns" tab). Also
// still reachable directly at /admin/campaigns as its own standalone page —
// see the `embedded` prop below for how the two render modes differ.

const SECTION_TYPES = [
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

function SectionItemEditor({ type, item, onChange, onRemove }) {
  const set = (key, val) => onChange({ ...item, [key]: val });
  return (
    <div className="rounded-xl border border-slate-200 p-3 mb-2 bg-slate-50">
      <div className="flex justify-between items-start mb-2">
        <label className="inline-flex items-center gap-1.5 text-xs">
          <input type="checkbox" checked={item.active !== false} onChange={(e) => set("active", e.target.checked)} />
          Aktif
        </label>
        <button type="button" onClick={onRemove} className="text-red-500">
          <FiTrash2 size={14} />
        </button>
      </div>
      {type === "faq" ? (
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
                onChange={(e) => updateSection(i, { type: e.target.value })}
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
              className="mb-3"
              placeholder="Badge (opsional)"
              value={section.badge || ""}
              onChange={(e) => updateSection(i, { badge: e.target.value })}
            />
            <div>
              {(section.items || []).map((item, j) => (
                <SectionItemEditor
                  key={j}
                  type={section.type}
                  item={item}
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
                <FiPlus /> Tambah item
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
        <ImageUploadField label="Hero Image" value={form.heroImage} onChange={(v) => set("heroImage", v)} />
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Campaigns</h2>
        <button
          onClick={() => setEditing(emptyCampaign())}
          className="bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5"
        >
          <FiPlus /> Campaign Baru
        </button>
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">Memuat...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-sm text-slate-500">Belum ada campaign.</p>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{c.title}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      c.status === "published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">/promo/{c.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/promo/${c.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-500 hover:text-slate-800"
                  title="Buka halaman"
                >
                  <FiExternalLink size={16} />
                </a>
                <button onClick={() => setEditing(c)} className="text-xs font-medium px-3 py-1.5 rounded-lg border">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-300 text-red-600"
                >
                  Hapus
                </button>
              </div>
            </Card>
          ))}
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

  const waHref = `https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <>
      <tr className="border-b border-slate-100 text-sm">
        <td className="py-2.5 pr-3">{lead.name}</td>
        <td className="py-2.5 pr-3">{lead.whatsapp}</td>
        <td className="py-2.5 pr-3">{lead.city || "-"}</td>
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
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded-lg border inline-flex items-center gap-1"
            >
              <FiMessageCircle size={12} /> WA
            </a>
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
          <TextInput placeholder="Cari nama/wa/email" value={filters.q} onChange={(e) => setFilter("q", e.target.value)} />
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
                  <th className="pb-2 pr-3">Nama</th>
                  <th className="pb-2 pr-3">WhatsApp</th>
                  <th className="pb-2 pr-3">Kota</th>
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

// `embedded`: true when rendered as a tab inside AdminDashboard.jsx (the
// dashboard's own sidebar/topbar/content-width chrome already applies, so
// this skips its standalone full-page background, back-link, and heading
// to avoid doubling up). Defaults to false for the standalone /admin/campaigns
// route, which still works on its own as a direct/bookmarkable URL.
export default function AdCampaignAdmin({ embedded = false } = {}) {
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

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("campaigns")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            tab === "campaigns" ? "bg-blue-700 text-white" : "bg-white border"
          }`}
        >
          Campaigns
        </button>
        <button
          onClick={() => setTab("leads")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold ${
            tab === "leads" ? "bg-blue-700 text-white" : "bg-white border"
          }`}
        >
          Leads
        </button>
      </div>

      {tab === "campaigns" ? <CampaignsTab /> : <LeadsTab />}
    </>
  );

  if (embedded) return body;

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">{body}</div>
    </div>
  );
}
