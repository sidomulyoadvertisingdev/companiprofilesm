# BLUEPRINT — Sidomulyo Advertising & Printing
### Portofolio Perusahaan + CMS Sendiri (Built-in Astro SSR + SQLite)

> Dokumen ini adalah **acuan perencanaan** untuk redesign total website profil
> perusahaan percetakan Sidomulyo Advertising & Printing, sekaligus rancangan
> CMS/internal-admin yang dibangun sendiri di dalam project yang sama.
>
> Status: **Fase 1 & Fase 2 SELESAI** — redesign + CMS sendiri (Astro SSR + SQLite) sudah berjalan.

---

## 1. Visi & Ruang Lingkup

Sidomulyo Advertising & Printing adalah perusahaan percetakan & advertising
berpusat di **Salatiga** (Jl. Kartini No.108, Sidorejo, Kota Salatiga, Jawa
Tengah 50711).

Tujuan website:
- Tampil **profesional & lengkap** sebagai vitrin perusahaan percetakan.
- Menampilkan layanan, produk/katalog, portofolio proyek, partner, dan testimoni.
- **Seluruh konten dikelola lewat CMS sendiri** (admin internal) — tidak ada
  teks/konten yang di-hardcode langsung di komponen UI.

Konten yang dikelola CMS (termasuk produk/katalog):
`site_config`, `services`, `products`, `portfolio`, `partners`,
`testimonials`, `admins`, `media`.

---

## 2. Arsitektur Sistem

| Layer        | Teknologi                                                              |
|--------------|------------------------------------------------------------------------|
| Frontend     | Astro 5 + React (island) + Tailwind + framer-motion + react-icons      |
| Animasi Hero | aceternity **Globe** (`three`) — menunjukkan jangkauan nasional        |
| CMS & API    | **Dalam Astro** via `output: 'server'` + adapter `@astrojs/node`       |
| API routes   | `src/pages/api/*` (auth + CRUD konten)                                 |
| Admin UI     | `src/pages/admin/*` (login, dashboard, form edit)                      |
| Storage      | **SQLite** (`better-sqlite3`) — swappable ke MySQL tanpa ubah skema    |
| Seed awal    | dari `src/data/*.js` (data statis Fase 1)                              |

### Alur Data (kunci integrasi Fase 1 ↔ Fase 2)
```
Komponen UI
   └─> src/lib/content.js   (abstraksi konten)
          ├─ Fase 1: import statis dari src/data/*.js
          └─ Fase 2: fetch('/api/...')  ──> src/pages/api/*  ──> SQLite
```
Penandatanganan fungsi di `content.js` **tetap sama** di kedua fase, sehingga
komponen UI tidak perlu diubah saat backend aktif.

---

## 3. Skema Database & Konten (Fase 2)

Semua tabel menggunakan `id` integer PK autoincrement + `created_at`,
`updated_at` (kecuali `admins`).

- **site_config** — `id`, `name`, `tagline`, `description`, `address`,
  `city`, `province`, `postal_code`, `phone` (WA 6288808888880), `email`
  (sosmedsidomulyo@gmail.com), `operational_hours`, `maps_url`, `logo`,
  `social_json` (json: fb/ig/tiktok/shopee/tokopedia).
- **services** — `id`, `slug`, `title`, `short_desc`, `long_desc`,
  `icon`, `image`, `features_json`, `order`.
- **products** — `id`, `slug`, `title`, `category`, `price_text`,
  `short_desc`, `long_desc`, `image`, `order` *(katalog produk terpisah dari services)*.

- **portfolio** — `id`, `title`, `category`, `client`, `year`, `image`,
  `description`, `order`.
- **partners** — `id`, `name`, `logo`, `website`, `order` (perusahaan bekerja sama).
- **testimonials** — `id`, `name`, `role`, `company`, `quote`, `avatar`, `order`.
- **admins** — `id`, `name`, `email`, `password_hash`, `role`.
- **media** — `id`, `filename`, `original_name`, `mime`, `size`, `path`.

Relasi: `portfolio.partner_id` → `partners.id` (nullable).

---

## 4. API & Admin Routes (Fase 2)

### Auth
- `POST /api/auth/login` — validasi admin, set session cookie.
- `POST /api/auth/logout`.
- Middleware: proteksi semua `/admin/*` + route `PUT/POST/DELETE /api/*`.

### CRUD Konten (GET publik; mutasi butuh auth)
- `GET/POST   /api/services`, `GET/PUT/DELETE /api/services/:id`
- `GET/POST   /api/products`, `GET/PUT/DELETE /api/products/:id`
- `GET/POST   /api/portfolio`, `GET/PUT/DELETE /api/portfolio/:id`
- `GET/POST   /api/partners`, `GET/PUT/DELETE /api/partners/:id`
- `GET/POST   /api/testimonials`, `GET/PUT/DELETE /api/testimonials/:id`
- `GET/PUT    /api/site-config`

### Admin Pages
- `/admin/login` — form login.
- `/admin` — dashboard (ringkasan jumlah konten).
- `/admin/services`, `/admin/products`, `/admin/portfolio`,
  `/admin/partners`, `/admin/testimonials`, `/admin/site-config`
  — masing-masing: list + form tambah/edit + hapus.

---

## 5. Roadmap Eksekusi

### Fase 1 — Redesign & Data Layer (SEKARANG)
1. Buat `src/data/`:
   - `site.js`, `services.js`, `products.js`, `portfolio.js`,
     `partners.js`, `testimonials.js`, `stats.js`, `nav.js`,
     `globe.json` (download dari aceternity).
2. Buat `src/lib/content.js` (abstraksi async) + `src/lib/api.js` (stub fetch).
3. Install `three` + setup shadcn minimal + `npx shadcn@latest add @aceternity/globe`.
   Buat `GlobeShowcase.jsx`, taruh di **Hero** (ganti `hero-product.webp`).
4. Redesign sections jadi **data-driven**:
   Hero (globe), Stats, Services, Portfolio (filter), Partners,
   Testimonials, Catalog, CTA, Footer, Navbar.
5. Redesign pages: `index`, `about`, `services`, `portfolio`, `contact`,
   `catalog` — pertahankan SEO + JSON-LD `LocalBusiness` (sumber `site.js`).
6. Buat stub `/admin/login` & `/admin` (read-only dari `content.js`).
7. Verify: `npm run lint` + `npm run build` + `npm run dev`.

### Fase 2 — CMS & Backend (SELESAI ✅)
1. ✅ `astro.config.mjs` → `output: 'server'` + adapter `@astrojs/node` (standalone).
2. ✅ SQLite (`better-sqlite3`) + `src/lib/db.js`, `src/lib/schema.js`, seed `scripts/seed.mjs` (`npm run seed`).
3. ✅ `src/pages/api/auth/login.js` (POST login + DELETE logout) + `src/lib/auth.js` (scrypt hash, session token, cookie `sidomulyo_admin`).
4. ✅ CRUD API: `services`, `products`, `portfolio`, `partners`, `testimonials`, `site-config` (GET publik; POST/PUT/DELETE butuh auth via middleware).
5. ✅ `src/middleware.js` proteksi `/admin/*` (redirect ke login) & mutasi API (401 bila tanpa sesi).
6. ✅ `src/lib/content.js` abstraksi: server baca DB (`queries.js`), client fetch `/api/*` (`api.js`) — dipilih via `import.meta.env.SSR` agar `better-sqlite3` tidak masuk bundle browser.
7. ✅ Admin UI `src/react-pages/AdminLogin.jsx` + `AdminDashboard.jsx` (tabs: layanan, produk, portofolio, mitra, testimoni, profil usaha) dengan form tambah/edit/hapus.
8. ✅ Verified end-to-end: login → CRUD → data muncul di frontend (SSR + client).

**Cara menjalankan:**
```bash
npm install
npm run seed      # buat & isi DB (admin@sidomulyo.com / admin123)
npm run dev       # http://localhost:4321  -> /admin untuk CMS
```
**Catatan:** DB file ada di `data/app.db` (sudah di .gitignore). Swappable ke MySQL dengan mengganti `src/lib/db.js` + query tanpa ubah `queries.js`/`content.js`.

---

## 6. Konvensi & Catatan
- **Tidak ada konten literal** di JSX — selalu lewat `content.js`.
- Aset gambar di `public/` (gunakan ulang: `portfolio-*.webp`,
  `catalog-*.webp`, `service-*.webp`, `clients-network.webp`, logo marketplace).
- Sumber kontak tetap: WA `6288808888880`, email `sosmedsidomulyo@gmail.com`,
  alamat Jl. Kartini No.108 Salatiga — semua di `site.js`.
- Globe menunjukkan "jangkauan nasional" sebagai aksen kredibilitas.

---
*Dokumen ini living doc — update saat ada keputusan arsitektur baru.*
