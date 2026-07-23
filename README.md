# Sidomulyo Advertising & Printing
### Website Profil Perusahaan & CMS Terintegrasi (Astro SSR + React + MySQL)

Website resmi **Sidomulyo Advertising & Printing** (Salatiga) yang dirancang secara modern sebagai vitrin digital perusahaan sekaligus sistem management konten (CMS) mandiri untuk mengelola profil usaha, layanan, katalog produk, artikel blog, halaman arahan (*landing pages*), analitik statistik pengunjung, hingga sistem klaim reward *lucky spin* untuk pelanggan marketplace.

---

## 🚀 Fitur Utama Sistem

1. **Halaman Publik Modern & Interaktif**:
   * **Hero Area**: Dilengkapi animasi 3D Globe interaktif (Three.js/Aceternity) yang melambangkan jangkauan pelayanan skala nasional.
   * **Layanan & Portofolio**: Menampilkan kategori layanan cetak (neon box, MMT, huruf timbul, dsb.) dengan fitur penyaring (*filter*) dinamis.
   * **Katalog Produk**: Katalog terperinci beserta deskripsi produk untuk memudahkan pelanggan memilih jenis cetakan.
   * **Blog & Artikel**: Menyajikan artikel edukatif dan berita seputar dunia percetakan.
   * **Formulir Kontak**: Integrasi kirim pesan langsung dari website ke dashboard admin.

2. **CMS / Dashboard Admin Mandiri (`/admin`)**:
   * **Manajemen Konten Total**: Kelola data profil perusahaan (`site_config`), layanan, katalog produk, portofolio proyek, testimonial, dan mitra bisnis secara real-time.
   * **Penyunting Artikel Blog**: Tulis, draf, dan publikasikan artikel blog melalui editor wysiwyg terintegrasi.
   * **Pembuat Landing Page Dinamis**: Buat halaman promosi kustom (`/lp/[slug]`) langsung dari dashboard untuk kebutuhan kampanye iklan (Google Ads/Facebook Ads).

3. **Sistem Marketplace & Claim Reward (`/marketplace`)**:
   * **Autentikasi Pelanggan**: Registrasi, login, dan verifikasi email berbasis kode OTP 6 digit.
   * **Sistem Lucky Spin**: Pelanggan yang memiliki kode unik dari marketplace (Shopee, Tokopedia, TikTok Shop) dapat mengklaim poin/hadiah melalui roda keberuntungan interaktif.
   * **Manajemen Template Email**: Kustomisasi template HTML email untuk OTP verifikasi keamanan, pemberitahuan, maupun siaran promosi masal (*broadcast email*).

4. **Analitik internal (Self-Hosted Analytics)**:
   * Pelacakan pengunjung secara real-time yang aman dan menghormati privasi (tanpa cookies pihak ketiga).
   * Menganalisis statistik jumlah tayangan halaman (*pageviews*), tipe perangkat, browser, negara/kota asal, referer (Google, Medsos, dll), hingga pelacakan klik tautan.

5. **Fitur Keamanan Terintegrasi (Security Upgrades)**:
   * **Secure Cookies**: Sesi admin menggunakan cookie dengan flag `HttpOnly`, `SameSite`, dan secara dinamis menyertakan flag `Secure` di lingkungan produksi (HTTPS) untuk mencegah pencurian token sesi.
   * **Sanitisasi XSS (Cross-Site Scripting)**: Konten input HTML kaya (seperti artikel blog) dibersihkan secara otomatis di sisi backend menggunakan helper `cleanHtml` berbasis `sanitize-html` sebelum disimpan ke database, mencegah penyusupan skrip berbahaya.
   * **Pembatasan Request (Rate Limiting)**: Pengaman brute-force in-memory pada endpoint sensitif (seperti login admin, login marketplace, pengiriman kode OTP email, dan percobaan verifikasi OTP) untuk meredam serangan otomatis.
   * **HTTP Security Headers**: Middleware aplikasi menyuntikkan header keamanan secara global (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, dan `Referrer-Policy: strict-origin-when-cross-origin`) untuk meningkatkan proteksi browser pengunjung.

---

## 🛠️ Teknologi yang Digunakan

* **Framework Utama**: [Astro 5](https://astro.build/) (Server-Side Rendering / SSR dengan adapter Node.js standalone)
* **Frontend UI**: [React](https://react.dev/) (digunakan sebagai *Interactive Islands* pada area dinamis), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) untuk animasi halus.
* **Database**: **MySQL** (menggunakan library `mysql2/promise` untuk koneksi non-blocking).
* **Animasi 3D**: [Three.js](https://threejs.org/) & [Three-Globe](https://github.com/vasturiano/three-globe) untuk render globe interaktif pada halaman beranda.
* **Email & SMTP**: [Nodemailer](https://nodemailer.com/) untuk pengiriman OTP verifikasi akun dan email blast marketing dengan dukungan pelarasan URL gambar absolut.
* **Keamanan & Proteksi Bot**: Integrasi [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) pada halaman pendaftaran & login untuk mencegah serangan spam/bot.
* **Sanitisasi XSS**: Pustaka [sanitize-html](https://www.npmjs.com/package/sanitize-html) untuk membersihkan tag script/event handler inline pada input teks editor HTML.
* **Process Manager (Production)**: [PM2](https://pm2.keymetrics.io/) untuk menjaga aplikasi tetap aktif berjalan di server produksi.

---

## 🗄️ Skema Database (MySQL)

Sistem menggunakan database relasional MySQL dengan skema tabel terstruktur sebagai berikut:

* **`admins`**: Menyimpan akun administrator (nama, email, hash password, role).
* **`site_config`**: Menyimpan identitas perusahaan (nama toko, tagline, deskripsi, alamat, no WA, email kantor, jam operasional, link peta Google, koordinat GPS geofence, logo utama).
* **`services`**: Bidang layanan percetakan (judul, slug, deskripsi singkat/panjang, ikon, gambar utama, urutan tampil).
* **`products`**: Katalog cetakan (nama produk, kategori, harga, spesifikasi, gambar).
* **`portfolio`**: Proyek portofolio yang telah diselesaikan (klien, tahun pengerjaan, detail gambar).
* **`partners` & `testimonials`**: Daftar logo mitra kerja sama dan ulasan pelanggan.
* **`sessions` & `marketplace_sessions`**: Pengelola session token untuk admin dan pengguna marketplace.
* **`marketplace_users`**: Data pelanggan terdaftar (nama, email, no telepon, alamat, status verifikasi OTP, status banned).
* **`marketplace_codes` & `marketplace_redemptions`**: Pengelola kode klaim hadiah marketplace dan log penukaran hadiah *lucky spin*.
* **`redeem_rules`**: Aturan pembagian probabilitas hadiah pada roda keberuntungan (*lucky spin*).
* **`posts`**: Data postingan blog (judul, slug, konten HTML, banner, status draf/publish, jumlah views).
* **`analytics_events` & `analytics_visitors`**: Menyimpan data log kunjungan situs untuk keperluan grafik analitik dashboard.
* **`contact_messages`**: Log pesan masuk dari form halaman Kontak.
* **`email_templates` & `email_broadcast_logs`**: Menyimpan template HTML kustom untuk pengiriman email dan log histori siaran email.

---

## 💻 Panduan Instalasi Lokal

### Prasyarat
Pastikan Anda sudah menginstal:
* [Node.js](https://nodejs.org/) (versi 18 ke atas)
* [MySQL Server](https://www.mysql.com/) yang aktif berjalan

### Langkah-langkah
1. **Clone repositori** ke komputer Anda.
2. **Instal dependensi project**:
   ```bash
   npm install
   ```
3. **Konfigurasi Environment**:
   Salin file `.env.example` menjadi `.env` di direktori utama proyek:
   ```bash
   cp .env.example .env
   ```
   Buka file `.env` dan sesuaikan nilainya:
   * Isi konfigurasi koneksi MySQL (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
   * Isi akun SMTP Email (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) agar sistem pengiriman kode OTP verifikasi dapat berjalan.
   * Isi kunci Cloudflare Turnstile (`PUBLIC_TURNSTILE_SITE_KEY` dan `TURNSTILE_SECRET`).
   * Atur `SITE_URL` lokal (misalnya `http://localhost:4321`) atau biarkan kosong agar sistem mendeteksi port dinamis secara otomatis.

4. **Inisialisasi Database (Seeding)**:
   Jalankan perintah berikut untuk membuat skema tabel MySQL dan mengisi data profil awal serta akun admin default:
   ```bash
   npm run seed
   ```
   * *Akun Admin Default*: **admin@sidomulyo.com** | *Password*: **admin123**

5. **Jalankan Aplikasi Mode Development**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di alamat [http://localhost:4321](http://localhost:4321). Anda dapat masuk ke CMS Admin dengan membuka menu login admin di [http://localhost:4321/admin](http://localhost:4321/admin).

---

## 🌐 Panduan Deployment Produksi

Deployment pada server produksi (`https://sidomulyoproject.com`) dikelola menggunakan git dan process manager **PM2**:

1. Pastikan Anda telah mengonfigurasi variabel `SITE_URL=https://sidomulyoproject.com` di file `.env` server produksi Anda.
2. Jalankan skrip deploy otomatis yang sudah tersedia di root proyek:
   ```bash
   ./deploy.sh
   ```
   *Isi dari skrip `deploy.sh` secara otomatis akan:*
   * Melakukan reset perubahan konfigurasi lokal di server.
   * Menarik pembaruan kode terbaru dari repositori GitHub (`git pull origin main`).
   * Menginstal paket modul dependensi baru (`npm install`).
   * Melakukan kompilasi/build file web siap saji (`npm run build`).
   * Merestart aplikasi node menggunakan PM2 (`pm2 restart sidomulyo`).
