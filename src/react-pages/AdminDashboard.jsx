import { useEffect, useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { getSite, getServices, getProducts, getPortfolio, getPartners, getTestimonials } from "../lib/content.js";
import { post, put, del, upload } from "../lib/admin-api.js";
import {
  FiGrid, FiBox, FiBriefcase, FiUsers, FiMessageSquare, FiSettings,
  FiBell, FiLogOut, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiTag, FiPercent, FiPlus, FiTrash2,
  FiFileText, FiEdit3, FiSearch, FiCalendar, FiBarChart2, FiMapPin, FiMonitor,
  FiSun, FiMoon,
} from "react-icons/fi";
import {
  TbBold, TbItalic, TbStrikethrough, TbCode, TbH1, TbH2, TbH3,
  TbList, TbListNumbers, TbBlockquote, TbLink, TbPhoto, TbArrowBackUp, TbArrowForwardUp,
} from "react-icons/tb";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const TABS = [
  { key: "services", label: "Layanan", icon: FiGrid, group: "Konten" },
  { key: "products", label: "Produk", icon: FiBox, group: "Konten" },
  { key: "portfolio", label: "Portofolio", icon: FiBriefcase, group: "Konten" },
  { key: "posts", label: "Blog", icon: FiFileText, group: "Konten" },
  { key: "partners", label: "Mitra", icon: FiUsers, group: "Konten" },
  { key: "testimonials", label: "Testimoni", icon: FiMessageSquare, group: "Konten" },
  { key: "marketplace", label: "Kode Redeem", icon: FiTag, group: "Marketplace" },
  { key: "redeem-rules", label: "Aturan Redeem", icon: FiPercent, group: "Marketplace" },
  { key: "site", label: "Profil Usaha", icon: FiSettings, group: "Pengaturan" },
];

const GROUPS = ["Konten", "Marketplace", "Pengaturan"];

export default function AdminDashboard({ admin }) {
  const [tab, setTab] = useState(null);
  const [site, setSite] = useState(null);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [partners, setPartners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [marketplaceCodes, setMarketplaceCodes] = useState([]);
  const [redeemRules, setRedeemRules] = useState([]);
  const [posts, setPosts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_sidebar_collapsed") === "true";
    }
    return false;
  });
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("admin_theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      localStorage.setItem("admin_sidebar_collapsed", !c);
      return !c;
    });
  };

  const safeJson = async (url, fallback) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return fallback;
      const d = await res.json();
      return d?.data ?? fallback;
    } catch {
      return fallback;
    }
  };

  const load = useCallback(async () => {
    const [s, sv, p, pf, pt, t, mc, rr, po] = await Promise.all([
      getSite(), getServices(), getProducts(), getPortfolio(), getPartners(), getTestimonials(),
      safeJson("/api/marketplace", []),
      safeJson("/api/admin/redeem-rules", []),
      safeJson("/api/posts", []),
    ]);
    setSite(s); setServices(sv); setProducts(p); setPortfolio(pf); setPartners(pt);
    setTestimonials(t); setMarketplaceCodes(mc); setRedeemRules(rr); setPosts(po);
  }, []);

  useEffect(() => { load().catch(() => {}); }, [load]);

  const logout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  const activeTab = TABS.find((t) => t.key === tab);

  return (
    <div className="h-screen bg-[#f5f5f7] dark:bg-[#0f0f23] lg:flex lg:overflow-hidden transition-colors">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed z-40 inset-y-0 left-0 bg-white dark:bg-[#1a1a2e] border-r border-[#e5e5e5] dark:border-slate-700/50 flex flex-col transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "lg:w-[72px]" : "lg:w-[260px]"} w-[260px]`}>
        <div className={`px-5 py-5 border-b border-gray-100 dark:border-slate-700/50 ${collapsed ? "lg:px-3 lg:py-4" : ""}`}>
          <div className={`flex items-center gap-3 ${collapsed ? "lg:justify-center" : ""}`}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
              S
            </div>
            {!collapsed && (
              <div className="hidden lg:block">
                <h1 className="font-bold text-sm text-[#1d1d1f] dark:text-white leading-tight">Sidomulyo CMS</h1>
                <p className="text-[11px] text-[#6e6e73] dark:text-slate-400">Panel Admin</p>
              </div>
            )}
            <div className="hidden lg:block ml-auto">
              <button
                onClick={toggleCollapsed}
                className="p-1.5 rounded-lg text-[#6e6e73] dark:text-slate-400 hover:bg-[#f0f0f2] dark:hover:bg-slate-700 hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
                aria-label={collapsed ? "Perlebar sidebar" : "Kecilkan sidebar"}
              >
                {collapsed ? <FiChevronRight className="text-base" /> : <FiChevronLeft className="text-base" />}
              </button>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <div className="mb-3">
            <button
              onClick={() => { setTab(null); setSidebarOpen(false); }}
              title={collapsed ? "Dashboard" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                collapsed ? "lg:justify-center lg:px-0" : ""
              } ${
                !tab
                  ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm"
                  : "text-[#6e6e73] dark:text-slate-400 hover:bg-[#f5f5f7] dark:hover:bg-slate-700/50 hover:text-[#1d1d1f] dark:hover:text-white"
              }`}
            >
              <FiBarChart2 className={`text-base shrink-0 ${!tab ? "text-orange-500" : "text-[#6e6e73] dark:text-slate-400"}`} />
              {!collapsed && <span className="hidden lg:inline">Dashboard</span>}
              <span className="lg:hidden">Dashboard</span>
            </button>
          </div>
          {GROUPS.map((g) => (
            <div key={g} className="mb-3">
              {!collapsed && (
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#6e6e73] dark:text-slate-500">{g}</p>
              )}
              {TABS.filter((t) => t.group === g).map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    onClick={() => { setTab(t.key); setSidebarOpen(false); }}
                    title={collapsed ? t.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                      collapsed ? "lg:justify-center lg:px-0" : ""
                    } ${
                      tab === t.key
                        ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm"
                        : "text-[#6e6e73] dark:text-slate-400 hover:bg-[#f5f5f7] dark:hover:bg-slate-700/50 hover:text-[#1d1d1f] dark:hover:text-white"
                    }`}
                  >
                    <Icon className={`text-base shrink-0 ${tab === t.key ? "text-orange-500" : "text-[#6e6e73] dark:text-slate-400"}`} />
                    {!collapsed && <span className="hidden lg:inline">{t.label}</span>}
                    <span className="lg:hidden">{t.label}</span>
                    {!collapsed && t.key === "posts" && (
                      <span className="ml-auto text-[10px] bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-full font-semibold">
                        {posts.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className={`p-3 border-t border-gray-100 dark:border-slate-700/50 ${collapsed ? "lg:p-2" : ""}`}>
          <button
            onClick={logout}
            title={collapsed ? "Logout" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#6e6e73] dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
          >
            <FiLogOut className="text-base" />
            {!collapsed && <span className="hidden lg:inline">Logout</span>}
            <span className="lg:hidden">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <Topbar title={activeTab?.label || "Dashboard"} admin={admin} onLogout={logout} onMenu={() => setSidebarOpen(true)} dark={dark} onToggleDark={() => setDark((d) => !d)} />
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
          {!tab && <AnalyticsDashboard />}
          {tab === "services" && (
            <CrudTable rows={services} fields={[
              { key: "title", label: "Judul" }, { key: "slug", label: "Slug" },
              { key: "icon", label: "Icon", placeholder: "FiBox" },
              { key: "image", label: "Gambar", type: "image" },
              { key: "shortDesc", label: "Deskripsi Singkat" },
              { key: "longDesc", label: "Deskripsi" },
              { key: "order", label: "Urutan", type: "number" },
            ]} endpoint="services" onChanged={load} />
          )}
          {tab === "products" && (
            <CrudTable rows={products} fields={[
              { key: "title", label: "Judul" }, { key: "slug", label: "Slug" },
              { key: "category", label: "Kategori" }, { key: "priceText", label: "Harga" },
              { key: "image", label: "Gambar", type: "image" },
              { key: "shortDesc", label: "Deskripsi Singkat" },
              { key: "order", label: "Urutan", type: "number" },
            ]} endpoint="products" onChanged={load} />
          )}
          {tab === "portfolio" && (
            <CrudTable rows={portfolio} fields={[
              { key: "title", label: "Judul" }, { key: "category", label: "Kategori" },
              { key: "client", label: "Klien" }, { key: "year", label: "Tahun", type: "number" },
              { key: "image", label: "Gambar", type: "image" },
              { key: "description", label: "Deskripsi" },
              { key: "order", label: "Urutan", type: "number" },
            ]} endpoint="portfolio" onChanged={load} />
          )}
          {tab === "posts" && <BlogManager posts={posts} onChanged={load} />}
          {tab === "partners" && (
            <CrudTable rows={partners} fields={[
              { key: "name", label: "Nama" }, { key: "logo", label: "Logo", type: "image" },
              { key: "website", label: "Website" },
              { key: "order", label: "Urutan", type: "number" },
            ]} endpoint="partners" onChanged={load} />
          )}
          {tab === "testimonials" && (
            <CrudTable rows={testimonials} fields={[
              { key: "name", label: "Nama" }, { key: "role", label: "Peran" },
              { key: "company", label: "Perusahaan" }, { key: "quote", label: "Kutipan" },
              { key: "order", label: "Urutan", type: "number" },
            ]} endpoint="testimonials" onChanged={load} />
          )}
          {tab === "marketplace" && <MarketplaceCodesTable codes={marketplaceCodes} />}
          {tab === "redeem-rules" && <RedeemRulesTable rules={redeemRules} products={products} onChanged={load} />}
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

/* ─── Realtime Clock ──────────────────────────────────────────────────── */

function RealtimeClock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    : "--:--:--";
  const date = now
    ? now.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <div className="hidden sm:flex items-center gap-2 text-xs text-[#6e6e73] dark:text-slate-400 border-l border-[#e5e5e5] dark:border-slate-700 pl-3">
      <span suppressHydrationWarning className="font-mono font-semibold text-[#1d1d1f] dark:text-white text-sm tabular-nums">{time}</span>
      <span suppressHydrationWarning className="text-[10px]">{date}</span>
    </div>
  );
}

/* ─── Topbar ──────────────────────────────────────────────────────────── */

function Topbar({ title, admin, onLogout, onMenu, dark, onToggleDark }) {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifAllOpen, setNotifAllOpen] = useState(false);
  const ref = useRef(null);
  const notifRef = useRef(null);

  const notifs = [
    { id: 1, title: "Pesan baru dari klien", desc: "Andi meminta penawaran cetak brosur 1000 lembar untuk acara seminar", time: "5 menit lalu", unread: true },
    { id: 2, title: "Pesanan selesai", desc: "Order #1234 telah dikonfirmasi selesai dan siap dikirim", time: "1 jam lalu", unread: true },
    { id: 3, title: "Login baru terdeteksi", desc: "Admin login dari IP 192.168.1.10 menggunakan Chrome", time: "3 jam lalu", unread: true },
    { id: 4, title: "Pembayaran diterima", desc: "Transfer Rp 2.500.000 dari Budi untuk order spanduk", time: "Kemarin", unread: false },
    { id: 5, title: "Pengunjung website naik", desc: "Traffic meningkat 25% dibanding minggu lalu", time: "2 hari lalu", unread: false },
    { id: 6, title: "Testimoni baru", desc: "Rina memberikan testimoni bintang 5 untuk layanan cetak", time: "3 hari lalu", unread: false },
    { id: 7, title: "Produk baru ditambahkan", desc: "Banner vinyl 440gsm berhasil ditambahkan ke katalog", time: "4 hari lalu", unread: false },
    { id: 8, title: "Kode redeem digunakan", desc: "Kode DISKON20 ditukar oleh客户 PT Maju Jaya", time: "5 hari lalu", unread: false },
  ];
  const unreadCount = notifs.filter((n) => n.unread).length;

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const name = admin?.name || "Administrator";
  const email = admin?.email || "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 bg-white/70 dark:bg-[#1a1a2e]/70 backdrop-blur-md border-b border-[#e5e5e5] dark:border-slate-700/50 h-14 flex items-center justify-between px-4 sm:px-6 transition-colors">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="lg:hidden p-2 rounded-lg hover:bg-[#f0f0f2] dark:hover:bg-slate-700" aria-label="Buka menu">
          <FiGrid className="text-lg dark:text-slate-300" />
        </button>
        <h2 className="text-base font-bold text-[#1d1d1f] dark:text-white">{title}</h2>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <RealtimeClock />
        <button onClick={onToggleDark} className="p-2 rounded-full hover:bg-[#f0f0f2] dark:hover:bg-slate-700 text-[#6e6e73] dark:text-slate-400 transition-colors" aria-label="Toggle dark mode">
          {dark ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
        </button>
        <button className="relative p-2 rounded-full hover:bg-[#f0f0f2] dark:hover:bg-slate-700 text-[#6e6e73] dark:text-slate-400 transition-colors" aria-label="Pesan">
          <FiMessageSquare className="text-lg" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-[#1a1a2e]" />
        </button>
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen((o) => !o)} className="relative p-2 rounded-full hover:bg-[#f0f0f2] dark:hover:bg-slate-700 text-[#6e6e73] dark:text-slate-400 transition-colors" aria-label="Notifikasi">
            <FiBell className="text-lg" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-[#1a1a2e]" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1a1a2e] rounded-xl shadow-lg border border-[#e5e5e5] dark:border-slate-700 z-30 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#e5e5e5] dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-white">Notifikasi</h3>
                {unreadCount > 0 && <span className="text-[10px] bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-semibold">{unreadCount} baru</span>}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700/50">
                {notifs.slice(0, 5).map((n) => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-[#f5f5f7] dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${n.unread ? "bg-orange-50/40 dark:bg-orange-500/5" : ""}`}>
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.unread ? "bg-orange-500" : "bg-transparent"}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1d1d1f] dark:text-white">{n.title}</p>
                        <p className="text-xs text-[#6e6e73] dark:text-slate-400 mt-0.5 truncate">{n.desc}</p>
                        <p className="text-[10px] text-[#6e6e73] dark:text-slate-500 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-[#e5e5e5] dark:border-slate-700 text-center">
                <button onClick={() => { setNotifOpen(false); setNotifAllOpen(true); }} className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">Lihat Semua Notifikasi</button>
              </div>
            </div>
          )}
        </div>

        {notifAllOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setNotifAllOpen(false)} />
            <div className="relative bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e5e5e5] dark:border-slate-700 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-base font-bold text-[#1d1d1f] dark:text-white">Semua Notifikasi</h2>
                  <p className="text-xs text-[#6e6e73] dark:text-slate-400 mt-0.5">{unreadCount} belum dibaca</p>
                </div>
                <button onClick={() => setNotifAllOpen(false)} className="p-2 rounded-full hover:bg-[#f0f0f2] dark:hover:bg-slate-700 text-[#6e6e73] dark:text-slate-400 transition-colors">
                  <FiChevronDown className="text-lg rotate-90" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700/50">
                {notifs.map((n) => (
                  <div key={n.id} className={`px-6 py-4 hover:bg-[#f5f5f7] dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${n.unread ? "bg-orange-50/30 dark:bg-orange-500/5" : ""}`}>
                    <div className="flex items-start gap-3">
                      <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.unread ? "bg-orange-500" : "bg-transparent"}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#1d1d1f] dark:text-white">{n.title}</p>
                        <p className="text-xs text-[#6e6e73] dark:text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                        <p className="text-[10px] text-[#6e6e73] dark:text-slate-500 mt-1.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-[#e5e5e5] dark:border-slate-700 flex items-center justify-between shrink-0">
                <button className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">Tandai Semua Dibaca</button>
                <button className="text-xs font-semibold text-[#6e6e73] dark:text-slate-400 hover:text-[#1d1d1f] dark:hover:text-white">Hapus Semua</button>
              </div>
            </div>
          </div>
        )}
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-[#f0f0f2] dark:hover:bg-slate-700 transition-colors">
            <span className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white grid place-items-center font-semibold text-xs">
              {initial}
            </span>
            <span className="hidden sm:block text-left leading-tight">
              <span className="block text-xs font-semibold text-[#1d1d1f] dark:text-white">{name}</span>
              <span className="block text-[11px] text-[#6e6e73] dark:text-slate-400">{email}</span>
            </span>
            <FiChevronDown className="text-[#6e6e73] dark:text-slate-400 text-sm" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1a1a2e] rounded-xl shadow-lg border border-[#e5e5e5] dark:border-slate-700 py-1.5 z-30">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700 sm:hidden">
                <p className="text-sm font-semibold dark:text-white">{name}</p>
                <p className="text-xs text-[#6e6e73] dark:text-slate-400">{email}</p>
              </div>
              <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ─── Blog Manager ────────────────────────────────────────────────────── */

function BlogManager({ posts, onChanged }) {
  const [view, setView] = useState("list"); // 'list' | 'editor'
  const [editingPost, setEditingPost] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all' | 'draft' | 'published'
  const [search, setSearch] = useState("");

  const filtered = posts.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openNew = () => { setEditingPost(null); setView("editor"); };
  const openEdit = (p) => { setEditingPost(p); setView("editor"); };
  const back = () => { setView("list"); setEditingPost(null); onChanged(); };

  if (view === "editor") {
    return <BlogEditor post={editingPost} onBack={back} />;
  }

  const draftCount = posts.filter((p) => p.status === "draft").length;
  const publishedCount = posts.filter((p) => p.status === "published").length;

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-sm text-[#6e6e73] dark:text-slate-400">
            {publishedCount} dipublikasikan · {draftCount} draft
          </p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-orange-600 shadow-sm transition-colors">
          <FiPlus className="text-base" /> Tulis Artikel
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e73] dark:text-slate-500 text-sm" />
          <input
            type="text" placeholder="Cari judul artikel..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
        <div className="flex bg-[#f0f0f2] dark:bg-slate-700 rounded-xl p-0.5">
          {[["all", "Semua"], ["published", "Published"], ["draft", "Draft"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === k ? "bg-white dark:bg-slate-600 text-[#1d1d1f] dark:text-white shadow-sm" : "text-[#6e6e73] dark:text-slate-400 hover:text-[#1d1d1f] dark:hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            {p.featuredImage ? (
              <img src={p.featuredImage} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0 hidden sm:block" />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-[#f0f0f2] dark:bg-slate-700 flex items-center justify-center shrink-0 hidden sm:flex">
                <FiFileText className="text-gray-300 dark:text-slate-500 text-xl" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-white truncate">{p.title}</h3>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  p.status === "published" ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}>
                  {p.status}
                </span>
              </div>
              <p className="text-xs text-[#6e6e73] dark:text-slate-400 mt-0.5 flex items-center gap-2">
                <FiCalendar className="text-[10px]" />
                {new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                {p.tags?.length > 0 && (
                  <span className="ml-2 flex items-center gap-1">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="bg-[#f0f0f2] dark:bg-slate-700 text-[#6e6e73] dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px]">{t}</span>
                    ))}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-[#6e6e73] dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors" title="Edit">
                <FiEdit3 className="text-sm" />
              </button>
              <button onClick={async () => { if (confirm("Hapus artikel ini?")) { await del(`/api/posts/${p.id}`); onChanged(); } }}
                className="p-2 rounded-lg text-[#6e6e73] dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Hapus">
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-12 text-center">
            <FiFileText className="mx-auto text-4xl text-gray-200 dark:text-slate-600 mb-3" />
            <p className="text-sm text-[#6e6e73] dark:text-slate-400 font-medium">
              {posts.length === 0 ? "Belum ada artikel. Mulai tulis yang pertama!" : "Tidak ditemukan"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Blog Editor (TipTap Rich Text) ──────────────────────────────────── */

function BlogEditor({ post, onBack }) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || "");
  const [tags, setTags] = useState(post?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || post?.title || "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription || "");
  const [status, setStatus] = useState(post?.status || "draft");
  const [author, setAuthor] = useState(post?.author || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [seoOpen, setSeoOpen] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Mulai menulis artikel di sini..." }),
      CharacterCount,
    ],
    content: post?.content || "",
  });

  const autoSlug = (v) => {
    setTitle(v);
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) {
      setSlug(v.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 200));
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(""); }
  };
  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await upload(file);
      setFeaturedImage(url);
    } catch (err) { alert("Gagal upload: " + err.message); }
  };

  const save = async (newStatus) => {
    setSaving(true);
    setMsg("");
    try {
      const payload = {
        title, slug: slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 200),
        excerpt, content: editor?.getHTML() || "", featuredImage, tags,
        metaTitle, metaDescription, status: newStatus || status, author,
      };
      if (post?.id) {
        await put(`/api/posts/${post.id}`, payload);
      } else {
        await post("/api/posts", payload);
      }
      setMsg("Tersimpan!");
      setTimeout(() => onBack(), 800);
    } catch (err) {
      setMsg("Gagal: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addImageToEditor = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const { url } = await upload(file);
        if (editor) { editor.chain().focus().setImage({ src: url }).run(); }
      } catch (err) { alert("Gagal upload: " + err.message); }
    };
    input.click();
  };

  const wordCount = editor?.storage.characterCount?.characters() || 0;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#6e6e73] hover:text-[#1d1d1f] font-medium transition-colors">
          <span className="text-lg">&larr;</span> Kembali
        </button>
        <div className="flex items-center gap-2">
          {msg && <span className={`text-xs font-medium ${msg.startsWith("Gagal") ? "text-red-500" : "text-green-600"}`}>{msg}</span>}
          <button onClick={() => save("draft")} disabled={saving}
            className="px-4 py-2 rounded-full border border-[#e5e5e5] text-sm font-semibold hover:bg-[#f5f5f7] disabled:opacity-50 transition-colors">
            {saving ? "Menyimpan..." : "Simpan Draft"}
          </button>
          <button onClick={() => save("published")} disabled={saving}
            className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 shadow-sm transition-colors">
            {saving ? "Menyimpan..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        {/* Main editor area */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-[#e5e5e5] p-5">
            <input
              type="text" value={title} onChange={(e) => autoSlug(e.target.value)}
              placeholder="Judul artikel..."
              className="w-full text-2xl font-bold text-[#1d1d1f] placeholder-gray-300 outline-none mb-2"
            />
            <input
              type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              placeholder="url-slug-otomatis"
              className="w-full text-xs text-[#6e6e73] placeholder-gray-300 outline-none font-mono bg-[#f5f5f7] rounded-lg px-3 py-1.5"
            />
          </div>

          {/* Toolbar */}
          {editor && (
            <div className="bg-white rounded-3xl border border-[#e5e5e5] px-3 py-2 flex flex-wrap items-center gap-0.5">
              <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
                <TbBold className="text-base" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
                <TbItalic className="text-base" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
                <TbStrikethrough className="text-base" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Code">
                <TbCode className="text-base" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
                <TbH1 className="text-base" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
                <TbH2 className="text-base" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
                <TbH3 className="text-base" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
                <TbList className="text-base" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List">
                <TbListNumbers className="text-base" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
                <TbBlockquote className="text-base" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <ToolbarBtn onClick={() => {
                const url = prompt("Masukkan URL:");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }} active={editor.isActive("link")} title="Link">
                <TbLink className="text-base" />
              </ToolbarBtn>
              <ToolbarBtn onClick={addImageToEditor} title="Sisipkan Gambar">
                <TbPhoto className="text-base" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                <TbArrowBackUp className="text-base" />
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                <TbArrowForwardUp className="text-base" />
              </ToolbarBtn>
              <div className="ml-auto text-[11px] text-[#6e6e73] font-medium pr-1">
                {wordCount} karakter
              </div>
            </div>
          )}

          {/* Editor content */}
          <div className="bg-white rounded-3xl border border-[#e5e5e5] overflow-hidden">
            <EditorContent editor={editor} className="prose prose-sm max-w-none p-5 min-h-[400px] focus:outline-none [&_.tiptap]:outline-none [&_.tiptap]:min-h-[380px] [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:text-gray-300 [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-bold [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6 [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-orange-300 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-gray-600 [&_.tiptap_img]:rounded-xl [&_.tiptap_img]:max-w-full [&_.tiptap_a]:text-orange-600 [&_.tiptap_a]:underline [&_.tiptap_code]:bg-[#f0f0f2] [&_.tiptap_code]:px-1.5 [&_.tiptap_code]:py-0.5 [&_.tiptap_code]:rounded [&_.tiptap_code]:text-sm" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status & Author */}
          <div className="bg-white rounded-3xl border border-[#e5e5e5] p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6e6e73]">Publikasi</h3>
            <div>
              <label className="block text-xs font-medium text-[#6e6e73] mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-[#e5e5e5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6e6e73] mb-1">Penulis</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nama penulis"
                className="w-full border border-[#e5e5e5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-3xl border border-[#e5e5e5] p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6e6e73]">Gambar Utama</h3>
            {featuredImage ? (
              <div className="relative">
                <img src={featuredImage} alt="" className="w-full h-36 object-cover rounded-xl" />
                <button onClick={() => setFeaturedImage("")}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-red-500 hover:bg-white shadow-sm">
                  <FiTrash2 className="text-xs" />
                </button>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-[#e5e5e5] rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:border-orange-300 transition-colors">
                <FiPlus className="text-2xl text-gray-300 mb-1" />
                <span className="text-xs text-[#6e6e73]">Upload gambar</span>
                <input type="file" accept="image/*" onChange={handleFeaturedImageUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-3xl border border-[#e5e5e5] p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6e6e73]">Ringkasan</h3>
            <textarea rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Deskripsi singkat artikel..."
              className="w-full border border-[#e5e5e5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>

          {/* Tags */}
          <div className="bg-white rounded-3xl border border-[#e5e5e5] p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6e6e73]">Tags</h3>
            <div className="flex gap-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Tambah tag..."
                className="flex-1 border border-[#e5e5e5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <button onClick={addTag} type="button"
                className="px-3 py-2 rounded-xl bg-[#f0f0f2] text-[#6e6e73] hover:bg-[#e5e5e5] text-sm font-medium transition-colors">
                <FiPlus />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg text-xs font-medium">
                    {t}
                    <button onClick={() => removeTag(t)} className="hover:text-orange-800">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-3xl border border-[#e5e5e5] overflow-hidden">
            <button onClick={() => setSeoOpen(!seoOpen)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f5f5f7] transition-colors">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6e6e73]">SEO & Meta</h3>
              <FiChevronDown className={`text-[#6e6e73] transition-transform ${seoOpen ? "rotate-180" : ""}`} />
            </button>
            {seoOpen && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                <div className="pt-3">
                  <label className="block text-xs font-medium text-[#6e6e73] mb-1">
                    Meta Title <span className={`float-right ${metaTitle.length > 60 ? "text-red-500" : "text-[#6e6e73]"}`}>{metaTitle.length}/60</span>
                  </label>
                  <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Judul untuk SEO..."
                    className="w-full border border-[#e5e5e5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6e6e73] mb-1">
                    Meta Description <span className={`float-right ${metaDescription.length > 160 ? "text-red-500" : "text-[#6e6e73]"}`}>{metaDescription.length}/160</span>
                  </label>
                  <textarea rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Deskripsi untuk mesin pencari..."
                    className="w-full border border-[#e5e5e5] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
                </div>
                {/* SERP Preview */}
                <div className="bg-[#f5f5f7] rounded-xl p-3">
                  <p className="text-[10px] text-[#6e6e73] uppercase font-semibold mb-2">Preview Google</p>
                  <p className="text-blue-700 text-sm font-medium leading-tight truncate">{metaTitle || title || "Judul Artikel"}</p>
                  <p className="text-green-700 text-[11px] mt-0.5 truncate">sidomulyoproject.com/blog/{slug || "slug"}</p>
                  <p className="text-[#6e6e73] text-xs mt-1 line-clamp-2">{metaDescription || excerpt || "Deskripsi artikel akan muncul di sini..."}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolbarBtn({ onClick, active, disabled, children, title }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className={`p-1.5 rounded-lg transition-colors ${active ? "bg-orange-100 text-orange-600" : "text-[#6e6e73] hover:bg-[#f0f0f2] hover:text-[#1d1d1f]"} ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}>
      {children}
    </button>
  );
}

/* ─── Generic CrudTable ───────────────────────────────────────────────── */

function CrudTable({ rows, fields, endpoint, onChanged }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");

  const searchKey = fields[0]?.key || "title";
  const filtered = search
    ? rows.filter((r) => String(r[searchKey] || "").toLowerCase().includes(search.toLowerCase()))
    : rows;

  const blank = () => Object.fromEntries(fields.map((f) => [f.key, ""]));
  const openNew = () => { setEditing("new"); setForm(blank()); setMsg(""); };
  const openEdit = (row) => { setEditing(row.id); setForm({ ...row }); setMsg(""); };
  const close = () => { setEditing(null); setForm({}); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing === "new") { await post(`/api/${endpoint}`, form); }
      else { await put(`/api/${endpoint}/${editing}`, form); }
      setMsg("Tersimpan"); close(); onChanged();
    } catch (err) { setMsg("Gagal: " + err.message); }
  };

  const remove = async (id) => {
    if (!confirm("Hapus item ini?")) return;
    await del(`/api/${endpoint}/${id}`); onChanged();
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e73] dark:text-slate-500 text-sm" />
          <input type="text" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
        </div>
        <button onClick={openNew} className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 shadow-sm transition-colors">
          <FiPlus className="text-base" /> Tambah
        </button>
      </div>
      {msg && <p className="text-sm text-orange-600 dark:text-orange-400 mb-3">{msg}</p>}
      {editing ? (
        <form onSubmit={save} className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-6 space-y-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {fields.map((f) =>
              f.type === "image" ? (
                <ImageField key={f.key} label={f.label} value={form[f.key] ?? ""} onChange={(url) => setForm({ ...form, [f.key]: url })} />
              ) : (
                <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
                  <label className="block text-xs font-medium text-[#6e6e73] dark:text-slate-400 mb-1">{f.label}</label>
                  <input type={f.type || "text"}
                    className="w-full border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder={f.placeholder || ""} value={form[f.key] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              )
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 shadow-sm transition-colors">Simpan</button>
            <button type="button" onClick={close} className="px-6 py-2 rounded-full border border-[#e5e5e5] dark:border-slate-600 text-sm font-medium hover:bg-[#f5f5f7] dark:hover:bg-slate-700 transition-colors">Batal</button>
          </div>
        </form>
      ) : null}
      <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f5f5f7] dark:bg-slate-800 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">#</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Nama</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-gray-100 dark:border-slate-700/50 hover:bg-[#f5f5f7] dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-3 text-[#6e6e73] dark:text-slate-400 text-xs">{r.id}</td>
                <td className="px-4 py-3 font-medium text-[#1d1d1f] dark:text-white">{r.title || r.name}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => openEdit(r)} className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-xs font-semibold">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-xs font-semibold">Hapus</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-10 text-center text-[#6e6e73] dark:text-slate-500 text-sm">Tidak ada data yang cocok</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ─── ImageField ──────────────────────────────────────────────────────── */

function ImageField({ label, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr("");
    try { const { url } = await upload(file); onChange(url); }
    catch (e2) { setErr(e2.message); }
    finally { setBusy(false); e.target.value = ""; }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-[#6e6e73] dark:text-slate-400 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-14 w-14 object-cover rounded-xl border border-[#e5e5e5] dark:border-slate-600 bg-[#f5f5f7] dark:bg-slate-700" />
        ) : (
          <div className="h-14 w-14 rounded-xl border-2 border-dashed border-[#e5e5e5] dark:border-slate-600 grid place-items-center text-[10px] text-[#6e6e73] dark:text-slate-500">kosong</div>
        )}
        <div className="flex-1">
          <input type="file" accept="image/*" onChange={pick} disabled={busy}
            className="block w-full text-sm text-[#6e6e73] dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-600 file:text-sm file:font-semibold hover:file:bg-orange-100 disabled:opacity-50" />
          <input type="text"
            className="mt-2 w-full border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-1.5 text-xs text-[#6e6e73] dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="/uploads/... atau URL" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
        </div>
      </div>
      {busy && <p className="text-xs text-orange-500 mt-1">Mengunggah...</p>}
      {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
    </div>
  );
}

/* ─── AccountForm ─────────────────────────────────────────────────────── */

function AccountForm() {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setMsg(""); setErr(false);
    if (next !== confirm) { setErr(true); setMsg("Konfirmasi password tidak sama"); return; }
    setBusy(true);
    try {
      await post("/api/auth/change-password", { currentPassword: cur, newPassword: next });
      setMsg("Password berhasil diganti"); setCur(""); setNext(""); setConfirm("");
    } catch (e2) { setErr(true); setMsg(e2.message); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-6 space-y-4 mt-5">
      {msg && <p className={`text-sm ${err ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>{msg}</p>}
      <div className="grid md:grid-cols-3 gap-4">
        <F label="Password Lama" v={cur} onChange={setCur} type="password" />
        <F label="Password Baru" v={next} onChange={setNext} type="password" />
        <F label="Ulangi Password Baru" v={confirm} onChange={setConfirm} type="password" />
      </div>
      <button type="submit" disabled={busy}
        className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 shadow-sm transition-colors">
        {busy ? "Menyimpan..." : "Ganti Password"}
      </button>
    </form>
  );
}

/* ─── SiteForm ────────────────────────────────────────────────────────── */

function SiteForm({ site, onChanged }) {
  const [form, setForm] = useState({
    name: site.name || "", shortName: site.shortName || "", tagline: site.tagline || "",
    description: site.description || "",
    addressStreet: site.address?.street || "", addressCity: site.address?.city || "",
    addressRegion: site.address?.region || "", addressPostalCode: site.address?.postalCode || "",
    phone: site.phone || "", phoneDisplay: site.phoneDisplay || "", email: site.email || "",
    operationalHours: site.operationalHours || "", mapsUrl: site.mapsUrl || "",
    logo: site.logo || "", heroImage: site.heroImage || "",
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
    try { await put("/api/site-config", payload); setMsg("Tersimpan"); onChanged(); }
    catch (err) { setMsg("Gagal: " + err.message); }
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-6 space-y-4">
        {msg && <p className="text-sm text-orange-500">{msg}</p>}
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

      <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6e6e73] dark:text-slate-400">Social media links</p>
          <button type="button" onClick={() => setSocial([...social, { label: "", href: "", logo: "" }])}
            className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-orange-600 shadow-sm transition-colors">
            <FiPlus /> Tambah
          </button>
        </div>
        {social.length === 0 && <p className="text-sm text-[#6e6e73] dark:text-slate-400">Belum ada social media.</p>}
        {social.map((s, i) => (
          <div key={i} className="p-3 bg-[#f5f5f7] dark:bg-slate-700/30 rounded-xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-1 grid md:grid-cols-2 gap-3">
                <input className="border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Label (Instagram, TikTok, dll)" value={s.label}
                  onChange={(e) => { const n = [...social]; n[i] = { ...n[i], label: e.target.value }; setSocial(n); }} />
                <input className="border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="URL (https://...)" value={s.href}
                  onChange={(e) => { const n = [...social]; n[i] = { ...n[i], href: e.target.value }; setSocial(n); }} />
              </div>
              <button type="button" onClick={() => setSocial(social.filter((_, j) => j !== i))}
                className="text-red-400 hover:text-red-600 text-sm font-semibold shrink-0 mt-2">Hapus</button>
            </div>
            <ImageField label="Ikon / Foto" value={s.logo || ""}
              onChange={(v) => { const n = [...social]; n[i] = { ...n[i], logo: v }; setSocial(n); }} />
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6e6e73] dark:text-slate-400">Navigasi footer</p>
          <button type="button" onClick={() => setFooterLinks([...footerLinks, { name: "", path: "/" }])}
            className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-orange-600 shadow-sm transition-colors">
            <FiPlus /> Tambah
          </button>
        </div>
        {footerLinks.length === 0 && <p className="text-sm text-[#6e6e73] dark:text-slate-400">Belum ada link footer.</p>}
        {footerLinks.map((l, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-[#f5f5f7] dark:bg-slate-700/30 rounded-xl">
            <input className="flex-1 border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Nama (Home, Services, dll)" value={l.name}
              onChange={(e) => { const n = [...footerLinks]; n[i] = { ...n[i], name: e.target.value }; setFooterLinks(n); }} />
            <input className="flex-1 border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Path (/services, /portfolio, dll)" value={l.path}
              onChange={(e) => { const n = [...footerLinks]; n[i] = { ...n[i], path: e.target.value }; setFooterLinks(n); }} />
            <button type="button" onClick={() => setFooterLinks(footerLinks.filter((_, j) => j !== i))}
              className="text-red-400 hover:text-red-600 text-sm font-semibold shrink-0">Hapus</button>
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-[#6e6e73] dark:text-slate-400 mb-1">Copyright Text</label>
          <input className="w-full border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} />
        </div>
      </div>

      <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 shadow-sm transition-colors">
        Simpan Semua
      </button>
    </form>
  );
}

/* ─── Small helpers ───────────────────────────────────────────────────── */

function F({ label, v, onChange, full, type = "text" }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-xs font-medium text-[#6e6e73] dark:text-slate-400 mb-1">{label}</label>
      <input type={type}
        className="w-full border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        value={v} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Fa({ label, v, onChange }) {
  return (
    <div className="md:col-span-2">
      <label className="block text-xs font-medium text-[#6e6e73] dark:text-slate-400 mb-1">{label}</label>
      <textarea rows={3}
        className="w-full border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
        value={v} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* ─── RedeemRulesTable ────────────────────────────────────────────────── */

function RedeemRulesTable({ rules, products, onChanged }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ product_id: "", discount_percent: 10, is_active: true });
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");

  const filtered = search
    ? rules.filter((r) => String(r.product_title || "").toLowerCase().includes(search.toLowerCase()))
    : rules;

  const openNew = () => { setEditing("new"); setForm({ product_id: "", discount_percent: 10, is_active: true }); setMsg(""); };
  const openEdit = (r) => { setEditing(r.id); setForm({ product_id: r.product_id, discount_percent: r.discount_percent, is_active: !!r.is_active }); setMsg(""); };
  const close = () => { setEditing(null); setMsg(""); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing === "new") { await post("/api/admin/redeem-rules", form); }
      else { await put(`/api/admin/redeem-rules/${editing}`, form); }
      setMsg("Tersimpan"); close(); onChanged();
    } catch (err) { setMsg("Gagal: " + err.message); }
  };

  const remove = async (id) => {
    if (!confirm("Hapus aturan ini?")) return;
    await del(`/api/admin/redeem-rules/${id}`); onChanged();
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e73] dark:text-slate-500 text-sm" />
          <input type="text" placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
        </div>
        <button onClick={openNew} className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 shadow-sm transition-colors">
          <FiPlus /> Tambah
        </button>
      </div>
      {msg && <p className="text-sm text-orange-500 mb-3">{msg}</p>}
      {editing && (
        <form onSubmit={save} className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-6 space-y-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6e6e73] dark:text-slate-400 mb-1">Produk</label>
              <select className="w-full border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} required>
                <option value="">Pilih Produk</option>
                {products.map((p) => (<option key={p.id} value={p.id}>{p.title}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6e6e73] dark:text-slate-400 mb-1">Diskon (%)</label>
              <input type="number" min="1" max="100"
                className="w-full border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: parseInt(e.target.value) || 0 })} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6e6e73] dark:text-slate-400 mb-1">Status</label>
              <select className="w-full border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.is_active ? "1" : "0"} onChange={(e) => setForm({ ...form, is_active: e.target.value === "1" })}>
                <option value="1">Aktif</option>
                <option value="0">Nonaktif</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 shadow-sm transition-colors">Simpan</button>
            <button type="button" onClick={close} className="px-6 py-2 rounded-full border border-[#e5e5e5] dark:border-slate-600 text-sm font-medium hover:bg-[#f5f5f7] dark:hover:bg-slate-700 transition-colors">Batal</button>
          </div>
        </form>
      )}
      <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f5f5f7] dark:bg-slate-800 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">#</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Produk</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Diskon</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} className="border-t border-gray-100 dark:border-slate-700/50 hover:bg-[#f5f5f7] dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-4 py-3 text-[#6e6e73] dark:text-slate-400 text-xs">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {r.product_image && <img src={r.product_image} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                    <div>
                      <p className="font-medium text-[#1d1d1f] dark:text-white">{r.product_title}</p>
                      <p className="text-xs text-[#6e6e73] dark:text-slate-400">{r.product_category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold">
                    <FiPercent className="text-[10px]" /> {r.discount_percent}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  {r.is_active ? (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">Aktif</span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-[#f0f0f2] dark:bg-slate-700 text-[#6e6e73] dark:text-slate-400 text-xs font-medium">Nonaktif</span>
                  )}
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => openEdit(r)} className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-xs font-semibold">Edit</button>
                  <button onClick={() => remove(r.id)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-xs font-semibold">Hapus</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-[#6e6e73] dark:text-slate-500 text-sm">Tidak ada data yang cocok</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ─── MarketplaceCodesTable ───────────────────────────────────────────── */

function MarketplaceCodesTable({ codes }) {
  const [search, setSearch] = useState("");
  const filtered = codes.filter((c) => c.phone.includes(search) || c.code.toLowerCase().includes(search.toLowerCase()));
  const total = codes.length;
  const used = codes.filter((c) => c.redeemed).length;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-[#6e6e73] dark:text-slate-400">{total} kode total · {used} sudah ditukar</p>
        </div>
      </div>
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e73] dark:text-slate-500 text-sm" />
          <input type="text" placeholder="Cari nomor atau kode..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 pl-9 pr-4 py-2.5 rounded-xl border border-[#e5e5e5] dark:border-slate-600 bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
        </div>
      </div>
      <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f5f7] dark:bg-slate-800 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">#</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">No. Handphone</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Kode Redeem</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className="border-t border-gray-100 dark:border-slate-700/50 hover:bg-[#f5f5f7] dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-[#6e6e73] dark:text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-[#1d1d1f] dark:text-white">{c.phone}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-orange-600 dark:text-orange-400">{c.code}</span>
                  </td>
                  <td className="px-4 py-3">
                    {c.redeemed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">Ditukar</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium">Belum Ditukar</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#6e6e73] dark:text-slate-400 text-xs">
                    {new Date(c.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-[#6e6e73] dark:text-slate-500 text-sm">{codes.length === 0 ? "Belum ada kode" : "Tidak ditemukan"}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─── Analytics Dashboard ────────────────────────────────────────────── */

const PIE_COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#84cc16"];

// eslint-disable-next-line no-unused-vars
function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
          <Icon className="text-orange-500 dark:text-orange-400 text-lg" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6e6e73] dark:text-slate-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[#1d1d1f] dark:text-white">{value}</p>
      {sub && <p className="text-xs text-[#6e6e73] dark:text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function AnalyticsDashboard() {
  const [range, setRange] = useState("30d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventsTotal, setEventsTotal] = useState(0);
  const [eventsPage, setEventsPage] = useState(0);
  const [showLog, setShowLog] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [live, setLive] = useState(false);
  const [connected, setConnected] = useState(false);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      const d = await res.json();
      if (res.ok && d && d.summary) {
        setData(d);
        setLastUpdate(new Date());
      } else {
        setData(null);
      }
    } catch { setData(null); }
    setLoading(false);
  }, [range]);

  const loadEvents = useCallback(async (page = 0) => {
    try {
      const res = await fetch(`/api/admin/analytics/events?limit=20&offset=${page * 20}`);
      const d = await res.json();
      setEvents(d.data || []);
      setEventsTotal(d.total || 0);
      setEventsPage(page);
    } catch { setEvents([]); }
  }, []);

  // Initial load + realtime stream via SSE (no client-side polling/auto-refresh).
  useEffect(() => {
    setLoading(true);
    loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    if (showLog) loadEvents(0);
  }, [showLog, loadEvents]);

  useEffect(() => {
    if (typeof EventSource === "undefined") return;
    const es = new EventSource(`/api/admin/analytics/stream?range=${range}`);
    setLive(true);

    es.addEventListener("open", () => setConnected(true));
    es.addEventListener("snapshot", (e) => {
      try {
        const snap = JSON.parse(e.data);
        setData(snap);
        setLastUpdate(new Date());
      } catch { /* ignore malformed frame */ }
    });
    es.addEventListener("events", (e) => {
      try {
        const incoming = JSON.parse(e.data);
        if (!showLog) return;
        setEvents((prev) => {
          const merged = [...incoming, ...prev].slice(0, 20);
          return merged;
        });
        setEventsTotal((t) => t + incoming.length);
      } catch { /* ignore malformed frame */ }
    });
    es.addEventListener("error", () => setConnected(false));

    return () => {
      es.close();
      setLive(false);
      setConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const fmt = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return String(n);
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-[#6e6e73] dark:text-slate-400">Pantau kunjungan, lokasi, dan perilaku pengunjung.</p>
            {live && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full">
                <span className={`h-1.5 w-1.5 rounded-full bg-green-500 ${connected ? "animate-pulse" : ""}`} />
                {connected ? "LIVE" : "Menyambung…"}
              </span>
            )}
            {lastUpdate && (
              <span className="text-[10px] text-[#6e6e73] dark:text-slate-500 hidden sm:inline">
                Update: {lastUpdate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { loadAnalytics(); if (showLog) loadEvents(eventsPage); }}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#f0f0f2] dark:bg-slate-700 text-[#6e6e73] dark:text-slate-400 hover:bg-[#e5e5e5] dark:hover:bg-slate-600 transition-colors">
            Refresh
          </button>
          <div className="flex bg-[#f0f0f2] dark:bg-slate-700 rounded-full p-0.5">
            {[["7d", "7 Hari"], ["30d", "30 Hari"], ["90d", "90 Hari"], ["1y", "1 Tahun"]].map(([k, l]) => (
              <button key={k} onClick={() => setRange(k)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${range === k ? "bg-white dark:bg-slate-600 text-[#1d1d1f] dark:text-white shadow-sm" : "text-[#6e6e73] dark:text-slate-400 hover:text-[#1d1d1f] dark:hover:text-white"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-12 text-center">
          <p className="text-sm text-[#6e6e73] dark:text-slate-400">Memuat data analytics...</p>
        </div>
      ) : data && data.summary ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <StatCard icon={FiBarChart2} label="Total Kunjungan" value={fmt(data.summary.totalVisits)} sub={`${data.summary.avgPerDay}/hari rata-rata`} />
            <StatCard icon={FiUsers} label="Unique Visitors" value={fmt(data.summary.uniqueVisitors)} sub={`${data.summary.todayVisits} hari ini`} />
            <StatCard icon={FiMonitor} label="Total Klik CTA" value={fmt(data.summary.totalClicks)} sub={`${data.summary.todayClicks} hari ini`} />
            <StatCard icon={FiMapPin} label="Kota Teratas" value={data.topCities[0]?.city || "-"} sub={data.topCities[0] ? `${data.topCities[0].count} pengunjung` : "Belum ada data"} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            <div className="lg:col-span-2 bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-5">
              <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-white mb-4">Kunjungan Harian</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.dailyChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-slate-700" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6e6e73" }} tickFormatter={(v) => new Date(v).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} />
                  <YAxis tick={{ fontSize: 11, fill: "#6e6e73" }} />
                  <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} />
                  <Line type="monotone" dataKey="visits" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-5">
              <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-white mb-4">Device</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.deviceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 11 }}>
                    {data.deviceBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {data.browserBreakdown.map((b) => (
                  <div key={b.name} className="flex items-center justify-between text-xs">
                    <span className="text-[#6e6e73] dark:text-slate-400">{b.name}</span>
                    <span className="font-semibold text-[#1d1d1f] dark:text-white">{fmt(b.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-5">
              <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-white mb-4">Halaman Terpopuler</h3>
              <div className="space-y-2">
                {data.topPages.length === 0 && <p className="text-xs text-[#6e6e73] dark:text-slate-400">Belum ada data</p>}
                {data.topPages.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#e5e5e5] dark:border-slate-700 last:border-0">
                    <span className="text-sm text-[#1d1d1f] dark:text-white truncate mr-3">{p.page === "/" ? "Homepage" : p.page}</span>
                    <span className="text-xs font-semibold text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full shrink-0">{fmt(p.visits)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-5">
              <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-white mb-4">Lokasi Pengunjung</h3>
              <div className="space-y-2">
                {data.topCities.length === 0 && <p className="text-xs text-[#6e6e73] dark:text-slate-400">Belum ada data</p>}
                {data.topCities.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#e5e5e5] dark:border-slate-700 last:border-0">
                    <div>
                      <span className="text-sm text-[#1d1d1f] dark:text-white">{c.city}</span>
                      <span className="text-xs text-[#6e6e73] dark:text-slate-400 ml-1">{c.region}, {c.country}</span>
                    </div>
                    <span className="text-xs font-semibold text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full shrink-0">{fmt(c.count)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-5">
              <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-white mb-4">Klik Tombol CTA Teratas</h3>
              <div className="space-y-2">
                {data.topClicks.length === 0 && <p className="text-xs text-[#6e6e73] dark:text-slate-400">Belum ada data klik</p>}
                {data.topClicks.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#e5e5e5] dark:border-slate-700 last:border-0">
                    <div className="min-w-0 mr-3">
                      <span className="text-sm text-[#1d1d1f] dark:text-white truncate block">{c.text || c.target}</span>
                      <span className="text-[10px] text-[#6e6e73] dark:text-slate-500">{c.target}</span>
                    </div>
                    <span className="text-xs font-semibold text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full shrink-0">{fmt(c.clicks)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-5">
              <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-white mb-4">Sistem Operasi</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.osBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-slate-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6e6e73" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6e6e73" }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-white">Log Aktivitas</h3>
              <button onClick={() => setShowLog(!showLog)} className="text-xs font-semibold text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
                {showLog ? "Sembunyikan" : "Tampilkan Log"}
              </button>
            </div>
            {showLog && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f5f5f7] dark:bg-slate-800 text-left">
                      <tr>
                        <th className="px-3 py-2 text-[10px] font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Waktu</th>
                        <th className="px-3 py-2 text-[10px] font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Aksi</th>
                        <th className="px-3 py-2 text-[10px] font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Halaman</th>
                        <th className="px-3 py-2 text-[10px] font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Target</th>
                        <th className="px-3 py-2 text-[10px] font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Lokasi</th>
                        <th className="px-3 py-2 text-[10px] font-semibold text-[#6e6e73] dark:text-slate-400 uppercase">Device</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((e) => (
                        <tr key={e.id} className="border-t border-[#e5e5e5] dark:border-slate-700 hover:bg-[#f5f5f7] dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-3 py-2 text-xs text-[#6e6e73] dark:text-slate-400 whitespace-nowrap">
                            {new Date(e.created_at).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="px-3 py-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${e.event_type === "pageview" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"}`}>
                              {e.event_type}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-[#1d1d1f] dark:text-white truncate max-w-[150px]">{e.page_url}</td>
                          <td className="px-3 py-2 text-xs text-[#6e6e73] dark:text-slate-400 truncate max-w-[120px]">{e.element_text || e.element_target || "-"}</td>
                          <td className="px-3 py-2 text-xs text-[#6e6e73] dark:text-slate-400">{e.city || "-"}, {e.country || "-"}</td>
                          <td className="px-3 py-2 text-xs text-[#6e6e73] dark:text-slate-400">{e.browser} / {e.os}</td>
                        </tr>
                      ))}
                      {events.length === 0 && (
                        <tr><td colSpan={6} className="px-3 py-8 text-center text-xs text-[#6e6e73] dark:text-slate-400">Belum ada aktivitas</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {eventsTotal > 20 && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#e5e5e5] dark:border-slate-700">
                    <span className="text-xs text-[#6e6e73] dark:text-slate-400">{eventsTotal} total events</span>
                    <div className="flex gap-2">
                      <button onClick={() => loadEvents(eventsPage - 1)} disabled={eventsPage === 0}
                        className="px-3 py-1 rounded-full text-xs font-semibold border border-[#e5e5e5] dark:border-slate-600 hover:bg-[#f5f5f7] dark:hover:bg-slate-700 disabled:opacity-40 transition-colors">Prev</button>
                      <button onClick={() => loadEvents(eventsPage + 1)} disabled={(eventsPage + 1) * 20 >= eventsTotal}
                        className="px-3 py-1 rounded-full text-xs font-semibold border border-[#e5e5e5] dark:border-slate-600 hover:bg-[#f5f5f7] dark:hover:bg-slate-700 disabled:opacity-40 transition-colors">Next</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-[#1a1a2e] rounded-3xl border border-[#e5e5e5] dark:border-slate-700 p-12 text-center">
          <FiBarChart2 className="mx-auto text-4xl text-[#e5e5e5] dark:text-slate-600 mb-3" />
          <p className="text-sm text-[#6e6e73] dark:text-slate-400 font-medium">Gagal memuat data analytics</p>
        </div>
      )}
    </section>
  );
}
