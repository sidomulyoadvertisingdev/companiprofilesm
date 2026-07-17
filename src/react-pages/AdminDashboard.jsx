import { useEffect, useState, useCallback, useRef } from "react";
import { getSite, getServices, getProducts, getPortfolio, getPartners, getTestimonials } from "../lib/content.js";
import { post, put, del, upload } from "../lib/admin-api.js";
import {
  FiGrid, FiBox, FiBriefcase, FiUsers, FiMessageSquare, FiSettings,
  FiBell, FiLogOut, FiChevronDown, FiTag, FiPercent, FiPlus, FiTrash2,
} from "react-icons/fi";

const TABS = [
  { key: "services", label: "Layanan", icon: FiGrid },
  { key: "products", label: "Produk", icon: FiBox },
  { key: "portfolio", label: "Portofolio", icon: FiBriefcase },
  { key: "partners", label: "Mitra", icon: FiUsers },
  { key: "testimonials", label: "Testimoni", icon: FiMessageSquare },
  { key: "marketplace", label: "Kode Redeem", icon: FiTag },
  { key: "redeem-rules", label: "Aturan Redeem", icon: FiPercent },
  { key: "site", label: "Profil Usaha", icon: FiSettings },
];

export default function AdminDashboard({ admin }) {
  const [tab, setTab] = useState("services");
  const [site, setSite] = useState(null);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [partners, setPartners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [marketplaceCodes, setMarketplaceCodes] = useState([]);
  const [redeemRules, setRedeemRules] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const load = useCallback(async () => {
    const [s, sv, p, pf, pt, t, mc, rr] = await Promise.all([
      getSite(), getServices(), getProducts(), getPortfolio(), getPartners(), getTestimonials(),
      fetch("/api/marketplace").then(r => r.json()).then(d => d.data || []),
      fetch("/api/admin/redeem-rules").then(r => r.json()).then(d => d.data || []),
    ]);
    setSite(s); setServices(sv); setProducts(p); setPortfolio(pf); setPartners(pt); setTestimonials(t); setMarketplaceCodes(mc); setRedeemRules(rr);
  }, []);

  useEffect(() => { load(); }, [load]);

  const logout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  const activeTab = TABS.find((t) => t.key === tab);

  return (
    <div className="min-h-screen bg-[#f5f5f7] lg:flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-[#0b1220] text-white flex flex-col transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-5 border-b border-white/10">
          <h1 className="font-bold text-lg leading-tight">CMS Sidomulyo</h1>
          <p className="text-xs text-slate-400">Panel Admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="text-lg shrink-0" />
                {t.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          title={activeTab?.label}
          admin={admin}
          onLogout={logout}
          onMenu={() => setSidebarOpen(true)}
        />

        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {tab === "services" && (
          <CrudTable
            title="Layanan"
            rows={services}
            fields={[
              { key: "title", label: "Judul" },
              { key: "slug", label: "Slug" },
              { key: "icon", label: "Icon", placeholder: "FiBox" },
              { key: "image", label: "Gambar", type: "image" },
              { key: "shortDesc", label: "Deskripsi Singkat" },
              { key: "longDesc", label: "Deskripsi" },
              { key: "order", label: "Urutan", type: "number" },
            ]}
            endpoint="services"
            onChanged={load}
          />
        )}
        {tab === "products" && (
          <CrudTable
            title="Produk"
            rows={products}
            fields={[
              { key: "title", label: "Judul" },
              { key: "slug", label: "Slug" },
              { key: "category", label: "Kategori" },
              { key: "priceText", label: "Harga" },
              { key: "image", label: "Gambar", type: "image" },
              { key: "shortDesc", label: "Deskripsi Singkat" },
              { key: "order", label: "Urutan", type: "number" },
            ]}
            endpoint="products"
            onChanged={load}
          />
        )}
        {tab === "portfolio" && (
          <CrudTable
            title="Portofolio"
            rows={portfolio}
            fields={[
              { key: "title", label: "Judul" },
              { key: "category", label: "Kategori" },
              { key: "client", label: "Klien" },
              { key: "year", label: "Tahun", type: "number" },
              { key: "image", label: "Gambar", type: "image" },
              { key: "description", label: "Deskripsi" },
              { key: "order", label: "Urutan", type: "number" },
            ]}
            endpoint="portfolio"
            onChanged={load}
          />
        )}
        {tab === "partners" && (
          <CrudTable
            title="Mitra / Klien"
            rows={partners}
            fields={[
              { key: "name", label: "Nama" },
              { key: "logo", label: "Logo", type: "image" },
              { key: "website", label: "Website" },
              { key: "order", label: "Urutan", type: "number" },
            ]}
            endpoint="partners"
            onChanged={load}
          />
        )}
        {tab === "testimonials" && (
          <CrudTable
            title="Testimoni"
            rows={testimonials}
            fields={[
              { key: "name", label: "Nama" },
              { key: "role", label: "Peran" },
              { key: "company", label: "Perusahaan" },
              { key: "quote", label: "Kutipan" },
              { key: "order", label: "Urutan", type: "number" },
            ]}
            endpoint="testimonials"
            onChanged={load}
          />
        )}
        {tab === "marketplace" && (
          <MarketplaceCodesTable codes={marketplaceCodes} />
        )}
        {tab === "redeem-rules" && (
          <RedeemRulesTable rules={redeemRules} products={products} onChanged={load} />
        )}
        {tab === "site" && site && (
          <>
            <SiteForm site={site} onChanged={load} />
            <AccountForm />
          </>
        )}
        </div>
      </div>
    </div>
  );
}

function Topbar({ title, admin, onLogout, onMenu }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const name = admin?.name || "Administrator";
  const email = admin?.email || "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 bg-white border-b h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Buka menu"
        >
          <FiGrid className="text-xl" />
        </button>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 text-[#6e6e73]"
          aria-label="Notifikasi"
        >
          <FiBell className="text-xl" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-gray-100"
          >
            <span className="h-9 w-9 rounded-full bg-orange-500 text-white grid place-items-center font-semibold">
              {initial}
            </span>
            <span className="hidden sm:block text-left leading-tight">
              <span className="block text-sm font-semibold">{name}</span>
              <span className="block text-xs text-[#6e6e73]">{email}</span>
            </span>
            <FiChevronDown className="text-[#6e6e73]" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-30">
              <div className="px-4 py-2 border-b sm:hidden">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-[#6e6e73]">{email}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function CrudTable({ title, rows, fields, endpoint, onChanged }) {
  const [editing, setEditing] = useState(null); // row or 'new'
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  const blank = () => Object.fromEntries(fields.map((f) => [f.key, ""]));

  const openNew = () => { setEditing("new"); setForm(blank()); setMsg(""); };
  const openEdit = (row) => { setEditing(row.id); setForm({ ...row }); setMsg(""); };
  const close = () => { setEditing(null); setForm({}); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing === "new") {
        await post(`/api/${endpoint}`, form);
      } else {
        await put(`/api/${endpoint}/${editing}`, form);
      }
      setMsg("Tersimpan");
      close();
      onChanged();
    } catch (err) {
      setMsg("Gagal: " + err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Hapus item ini?")) return;
    await del(`/api/${endpoint}/${id}`);
    onChanged();
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={openNew} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-400">
          + Tambah
        </button>
      </div>

      {msg && <p className="text-sm text-orange-600 mb-3">{msg}</p>}

      {editing ? (
        <form onSubmit={save} className="bg-white rounded-2xl p-6 shadow-sm space-y-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map((f) =>
              f.type === "image" ? (
                <ImageField
                  key={f.key}
                  label={f.label}
                  value={form[f.key] ?? ""}
                  onChange={(url) => setForm({ ...form, [f.key]: url })}
                />
              ) : (
                <div key={f.key}>
                  <label className="block text-sm font-medium mb-1">{f.label}</label>
                  <input
                    type={f.type || "text"}
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder={f.placeholder || ""}
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  />
                </div>
              )
            )}
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-400">
              Simpan
            </button>
            <button type="button" onClick={close} className="px-6 py-2 rounded-lg border hover:bg-gray-50">
              Batal
            </button>
          </div>
        </form>
      ) : null}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f5f5f7] text-left">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3 text-[#6e6e73]">{r.id}</td>
                <td className="px-4 py-3 font-medium">{r.title || r.name}</td>
                <td className="px-4 py-3 space-x-3">
                  <button onClick={() => openEdit(r)} className="text-orange-600 hover:underline">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-[#6e6e73]">Belum ada data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AccountForm() {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr(false);
    if (next !== confirm) {
      setErr(true);
      setMsg("Konfirmasi password tidak sama");
      return;
    }
    setBusy(true);
    try {
      await post("/api/auth/change-password", {
        currentPassword: cur,
        newPassword: next,
      });
      setMsg("Password berhasil diganti");
      setCur("");
      setNext("");
      setConfirm("");
    } catch (e2) {
      setErr(true);
      setMsg(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4 mt-6">
      <h2 className="text-xl font-bold mb-2">Ganti Password</h2>
      {msg && (
        <p className={`text-sm ${err ? "text-red-600" : "text-green-600"}`}>{msg}</p>
      )}
      <div className="grid md:grid-cols-3 gap-4">
        <F label="Password Lama" v={cur} onChange={setCur} type="password" />
        <F label="Password Baru" v={next} onChange={setNext} type="password" />
        <F label="Ulangi Password Baru" v={confirm} onChange={setConfirm} type="password" />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-400 disabled:opacity-50"
      >
        {busy ? "Menyimpan…" : "Ganti Password"}
      </button>
    </form>
  );
}

function ImageField({ label, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const { url } = await upload(file);
      onChange(url);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-14 w-14 object-cover rounded-lg border bg-gray-50"
          />
        ) : (
          <div className="h-14 w-14 rounded-lg border border-dashed grid place-items-center text-[10px] text-gray-400">
            kosong
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={pick}
            disabled={busy}
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:text-sm file:font-semibold hover:file:bg-orange-400 disabled:opacity-50"
          />
          <input
            type="text"
            className="mt-2 w-full border rounded-xl px-3 py-1.5 text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="/uploads/... atau URL"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      {busy && <p className="text-xs text-orange-600 mt-1">Mengunggah…</p>}
      {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
    </div>
  );
}

function SiteForm({ site, onChanged }) {
  const [form, setForm] = useState({
    name: site.name || "",
    shortName: site.shortName || "",
    tagline: site.tagline || "",
    description: site.description || "",
    addressStreet: site.address?.street || "",
    addressCity: site.address?.city || "",
    addressRegion: site.address?.region || "",
    addressPostalCode: site.address?.postalCode || "",
    phone: site.phone || "",
    phoneDisplay: site.phoneDisplay || "",
    email: site.email || "",
    operationalHours: site.operationalHours || "",
    mapsUrl: site.mapsUrl || "",
    logo: site.logo || "",
    heroImage: site.heroImage || "",
  });
  const [social, setSocial] = useState(site.social || []);
  const [footerLinks, setFooterLinks] = useState(site.footerLinks || []);
  const [copyrightText, setCopyrightText] = useState(site.copyrightText || "All rights reserved.");
  const [msg, setMsg] = useState("");

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name, shortName: form.shortName, tagline: form.tagline, description: form.description,
      address: { street: form.addressStreet, city: form.addressCity, region: form.addressRegion, postalCode: form.addressPostalCode, country: "ID" },
      phone: form.phone, phoneDisplay: form.phoneDisplay, email: form.email,
      operationalHours: form.operationalHours, mapsUrl: form.mapsUrl,
      logo: form.logo, heroImage: form.heroImage,
      geo: site.geo, mapsEmbed: site.mapsEmbed, serviceArea: site.serviceArea,
      social, footerLinks, copyrightText,
    };
    try {
      await put("/api/site-config", payload);
      setMsg("Tersimpan");
      onChanged();
    } catch (err) {
      setMsg("Gagal: " + err.message);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      {/* Profil Usaha */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold mb-2">Profil Usaha</h2>
        {msg && <p className="text-sm text-orange-600">{msg}</p>}
        <div className="grid md:grid-cols-2 gap-4">
          <F label="Nama" v={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <F label="Nama Pendek" v={form.shortName} onChange={(v) => setForm({ ...form, shortName: v })} />
          <F label="Tagline" v={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} full />
          <Fa label="Deskripsi" v={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <F label="Alamat Jalan" v={form.addressStreet} onChange={(v) => setForm({ ...form, addressStreet: v })} />
          <F label="Kota" v={form.addressCity} onChange={(v) => setForm({ ...form, addressCity: v })} />
          <F label="Provinsi" v={form.addressRegion} onChange={(v) => setForm({ ...form, addressRegion: v })} />
          <F label="Kode Pos" v={form.addressPostalCode} onChange={(v) => setForm({ ...form, addressPostalCode: v })} />
          <F label="WhatsApp (6288...)" v={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <F label="WhatsApp (tampilan)" v={form.phoneDisplay} onChange={(v) => setForm({ ...form, phoneDisplay: v })} />
          <F label="Email" v={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <F label="Jam Operasional" v={form.operationalHours} onChange={(v) => setForm({ ...form, operationalHours: v })} />
          <F label="Maps URL" v={form.mapsUrl} onChange={(v) => setForm({ ...form, mapsUrl: v })} full />
          <ImageField label="Logo" value={form.logo} onChange={(v) => setForm({ ...form, logo: v })} />
          <ImageField label="Gambar Hero" value={form.heroImage} onChange={(v) => setForm({ ...form, heroImage: v })} />
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Social Media</h2>
          <button
            type="button"
            onClick={() => setSocial([...social, { label: "", href: "", logo: "" }])}
            className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-orange-400"
          >
            + Tambah
          </button>
        </div>
        {social.length === 0 && <p className="text-sm text-[#6e6e73]">Belum ada social media.</p>}
        {social.map((s, i) => (
          <div key={i} className="p-3 bg-[#f5f5f7] rounded-xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-1 grid md:grid-cols-2 gap-3">
                <input
                  className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Label (Instagram, TikTok, dll)"
                  value={s.label}
                  onChange={(e) => { const n = [...social]; n[i] = { ...n[i], label: e.target.value }; setSocial(n); }}
                />
                <input
                  className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="URL (https://...)"
                  value={s.href}
                  onChange={(e) => { const n = [...social]; n[i] = { ...n[i], href: e.target.value }; setSocial(n); }}
                />
              </div>
              <button
                type="button"
                onClick={() => setSocial(social.filter((_, j) => j !== i))}
                className="text-red-500 hover:text-red-700 text-sm font-semibold shrink-0 mt-2"
              >
                Hapus
              </button>
            </div>
            <ImageField
              label="Ikon / Foto"
              value={s.logo || ""}
              onChange={(v) => { const n = [...social]; n[i] = { ...n[i], logo: v }; setSocial(n); }}
            />
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Link Footer (Navigasi)</h2>
          <button
            type="button"
            onClick={() => setFooterLinks([...footerLinks, { name: "", path: "/" }])}
            className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-orange-400"
          >
            + Tambah
          </button>
        </div>
        {footerLinks.length === 0 && <p className="text-sm text-[#6e6e73]">Belum ada link footer.</p>}
        {footerLinks.map((l, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-[#f5f5f7] rounded-xl">
            <input
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Nama (Home, Services, dll)"
              value={l.name}
              onChange={(e) => { const n = [...footerLinks]; n[i] = { ...n[i], name: e.target.value }; setFooterLinks(n); }}
            />
            <input
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Path (/services, /portfolio, dll)"
              value={l.path}
              onChange={(e) => { const n = [...footerLinks]; n[i] = { ...n[i], path: e.target.value }; setFooterLinks(n); }}
            />
            <button
              type="button"
              onClick={() => setFooterLinks(footerLinks.filter((_, j) => j !== i))}
              className="text-red-500 hover:text-red-700 text-sm font-semibold shrink-0"
            >
              Hapus
            </button>
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">Copyright Text</label>
          <input
            className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={copyrightText}
            onChange={(e) => setCopyrightText(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-400">
        Simpan Semua
      </button>
    </form>
  );
}

function F({ label, v, onChange, full, type = "text" }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        value={v}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Fa({ label, v, onChange }) {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        rows={3}
        className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        value={v}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function RedeemRulesTable({ rules, products, onChanged }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ product_id: "", discount_percent: 10, is_active: true });
  const [msg, setMsg] = useState("");

  const openNew = () => { setEditing("new"); setForm({ product_id: "", discount_percent: 10, is_active: true }); setMsg(""); };
  const openEdit = (r) => { setEditing(r.id); setForm({ product_id: r.product_id, discount_percent: r.discount_percent, is_active: !!r.is_active }); setMsg(""); };
  const close = () => { setEditing(null); setMsg(""); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing === "new") {
        await post("/api/admin/redeem-rules", form);
      } else {
        await put(`/api/admin/redeem-rules/${editing}`, form);
      }
      setMsg("Tersimpan");
      close();
      onChanged();
    } catch (err) { setMsg("Gagal: " + err.message); }
  };

  const remove = async (id) => {
    if (!confirm("Hapus aturan ini?")) return;
    await del(`/api/admin/redeem-rules/${id}`);
    onChanged();
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Aturan Redeem Diskon</h2>
          <p className="text-sm text-[#6e6e73] mt-1">
            Atur produk mana saja yang mendapat diskon dan besarnya persentase.
            Sistem akan memberikan diskon secara random kepada user.
          </p>
        </div>
        <button onClick={openNew} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-400 flex items-center gap-1">
          <FiPlus /> Tambah
        </button>
      </div>

      {msg && <p className="text-sm text-orange-600 mb-3">{msg}</p>}

      {editing && (
        <form onSubmit={save} className="bg-white rounded-2xl p-6 shadow-sm space-y-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Produk</label>
              <select
                className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.product_id}
                onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                required
              >
                <option value="">Pilih Produk</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Diskon (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.discount_percent}
                onChange={(e) => setForm({ ...form, discount_percent: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.is_active ? "1" : "0"}
                onChange={(e) => setForm({ ...form, is_active: e.target.value === "1" })}
              >
                <option value="1">Aktif</option>
                <option value="0">Nonaktif</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-400">Simpan</button>
            <button type="button" onClick={close} className="px-6 py-2 rounded-lg border hover:bg-gray-50">Batal</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f5f5f7] text-left">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Produk</th>
              <th className="px-4 py-3">Diskon</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3 text-[#6e6e73]">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {r.product_image && <img src={r.product_image} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                    <div>
                      <p className="font-medium">{r.product_title}</p>
                      <p className="text-xs text-[#6e6e73]">{r.product_category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold">
                    <FiPercent className="text-[10px]" /> {r.discount_percent}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  {r.is_active ? (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">Aktif</span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">Nonaktif</span>
                  )}
                </td>
                <td className="px-4 py-3 space-x-3">
                  <button onClick={() => openEdit(r)} className="text-orange-600 hover:underline">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-[#6e6e73]">Belum ada aturan redeem</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MarketplaceCodesTable({ codes }) {
  const [search, setSearch] = useState("");

  const filtered = codes.filter(
    (c) =>
      c.phone.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const total = codes.length;
  const used = codes.filter((c) => c.redeemed).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Kode Redeem Marketplace</h2>
          <p className="text-sm text-[#6e6e73] mt-1">
            {total} kode total · {used} sudah ditukar
          </p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari nomor atau kode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f5f7] text-left">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">No. Handphone</th>
                <th className="px-4 py-3">Kode Redeem</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal Dibuat</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3 text-[#6e6e73]">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{c.phone}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-orange-600">{c.code}</span>
                  </td>
                  <td className="px-4 py-3">
                    {c.redeemed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                        Ditukar
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                        Belum Ditukar
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#6e6e73]">
                    {new Date(c.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-[#6e6e73]">
                    {codes.length === 0 ? "Belum ada kode yang dibuat" : "Tidak ditemukan"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
