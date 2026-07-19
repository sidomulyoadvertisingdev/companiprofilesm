# Blueprint: Welcome Notification via PWA + GPS Geofence

> Status: **RENCANA (belum diimplementasikan)** — disimpan sebagai blueprint untuk dikerjakan nanti.

## Context

User ingin: saat ada handphone/orang yang lewat di depan toko, secara otomatis
mereka mendapat notifikasi di HP-nya berupa pemberitahuan "Selamat datang di
Sidomulyo Advertising & Printing".

**Keputusan yang sudah dikunci (dari user):**
- Model: **PWA + izin notif + izin lokasi** (visitor menginstal PWA & memberi izin).
- Deteksi: **GPS Geofence** (radius koordinat toko dari `site_config.geo_lat/geo_lng`).
- Trigger: notif "Selamat datang di Sidomulyo Advertising & Printing" saat masuk radius toko.

**Batasan teknis (harus disampaikan ke user saat implementasi):**
- Notif push ke HP orang lewat **hanya bisa kalau** dia sudah menginstal PWA & izin
  notif+lokasi. Orang asing tanpa install = tidak dapat notif (mustahil secara teknis).
- **Android**: PWA + Web Push + Geolocation foreground/background bisa trigger saat lewat.
- **iOS**: PWA tidak bisa background geofence; notif muncul saat PWA **terbuka** di dekat
  toko (foreground). Di luar itu tidak bisa tanpa native app.
- Implementasi target: **foreground + periodic geofence check** (saat PWA dibuka/aktif di
  dekat toko). Background di Android via `Periodic Background Sync` bersifat best-effort,
  bukan jaminan.

**Kondisi saat ini (hasil eksplorasi):**
- Belum ada PWA / service worker / manifest / web-push sama sekali.
- `public/` ada, `tracker.js` sudah di-load global di `MainLayout` & `LandingLayout`.
- `site_config` sudah punya `geo_lat` / `geo_lng` (lokasi toko) — cocok untuk center geofence.
- Adapter `@astrojs/node` (standalone) — cocok untuk web-push server & simpan VAPID keys.
- Cookie visitor `sb_vid` (dari `tracker.js`) bisa dipakai untuk mengikat push subscription.

---

## Files to Create/Modify

### New Files
| File | Purpose |
|------|---------|
| `public/manifest.webmanifest` | Web App Manifest (PWA: name, icons, display standalone). |
| `public/sw.js` | Service Worker: tangani `push` event → notif welcome; `notificationclick` → buka `/`. |
| `src/lib/geofence.js` | Client: baca lokasi toko, `watchPosition`/periodic check, hitung jarak Haversine, trigger welcome + subscribe push. |
| `src/lib/webpush.js` | Server: `setVapidDetails`, `sendWelcome(visitorId)` via `web-push`. |
| `src/pages/api/push/vapid.js` | `GET` public: kembalikan `VAPID_PUBLIC_KEY`. |
| `src/pages/api/push/subscribe.js` | `POST`: simpan `PushSubscription` + `visitorId` (cookie `sb_vid`). Tidak wajib admin. |
| `src/pages/api/push/send.js` | `POST`: kirim push welcome ke subscription (admin/internal/geofence trigger). |
| `migrations/004_push_subscriptions.sql` | Tabel `push_subscriptions`. |

### Modified Files
| File | Purpose |
|------|---------|
| `package.json` | Tambah dependency `web-push`. |
| `src/lib/schema.js` | Tabel `push_subscriptions`; `ensureColumn geofence_radius` di `site_config`. |
| `src/layouts/MainLayout.astro` | Link manifest; load `sw.js` register + `geofence.js`. |
| `src/layouts/LandingLayout.astro` | Sama (agar landing page juga punya geofence). |
| `src/lib/tracker.js` | Register service worker / muat geofence init. |
| `src/lib/content.js` / `queries.js` | Baca `geo_lat/geo_lng/geofence_radius` dari `site_config` untuk client. |

---

## Implementation Plan (A → E)

### A. PWA Infrastructure
1. `public/manifest.webmanifest`:
   ```json
   {
     "name": "Sidomulyo Advertising & Printing",
     "short_name": "Sidomulyo",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#0A4DA6",
     "theme_color": "#0A4DA6",
     "icons": [{ "src": "/sm-logo.png", "sizes": "512x512", "type": "image/png" }]
   }
   ```
2. Link `<link rel="manifest" href="/manifest.webmanifest" />` di `<head>` `MainLayout` & `LandingLayout`.
3. `public/sw.js`:
   - `push` event → `self.registration.showNotification("Sidomulyo Advertising & Printing", { body: "Selamat datang! ..." })`.
   - `notificationclick` → `clients.openWindow("/")`.
4. Register SW dari `tracker.js`/`geofence.js`: `navigator.serviceWorker.register('/sw.js')`.

### B. Web Push (VAPID) Server
5. `npm i web-push`.
6. Generate VAPID keys → simpan di env (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`); public key dikirim ke client.
7. Tabel `push_subscriptions` (di `schema.js` + `migrations/004_push_subscriptions.sql`):
   ```sql
   CREATE TABLE IF NOT EXISTS push_subscriptions (
     id INT AUTO_INCREMENT PRIMARY KEY,
     visitor_id VARCHAR(64) NOT NULL DEFAULT '',
     endpoint TEXT NOT NULL,
     p256dh VARCHAR(255) NOT NULL,
     auth VARCHAR(255) NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     UNIQUE KEY idx_endpoint (endpoint(191))
   );
   ```
8. `src/lib/webpush.js`: wrap `web-push` (`setVapidDetails`, `sendWelcome`).
9. API: `vapid.js` (GET public key), `subscribe.js` (POST simpan sub + visitorId cookie), `send.js` (POST kirim push).

### C. Geofence Detection (Client)
10. `src/lib/geofence.js`:
    - Fetch lokasi toko (`geo_lat/geo_lng/geofence_radius`) dari `/api/site-config`.
    - `watchPosition` / `getCurrentPosition` tiap 30–60 detik saat PWA aktif.
    - Hitung jarak Haversine; jika `< RADIUS` DAN belum dipicu sesi ini → trigger welcome.
    - Tampilkan in-app welcome (toast) + request Notification permission → subscribe push → panggil `/api/push/send`.
    - Guard: hanya jalan di PWA (`matchMedia('(display-mode: standalone)')`) atau saat izin notif ada (agar tidak mengganggu web biasa).
    - Spam guard: `localStorage` flag + cooldown.
11. Load `geofence.js` di `MainLayout` & `LandingLayout` (seperti `tracker.js`).

### D. Welcome Notification Content
- Title: "Sidomulyo Advertising & Printing"
- Body: "Selamat datang! 🎉 Ada kebutuhan cetak atau advertising? Tim Hani siap bantu. Klik untuk chat."
- `notificationclick` → buka `/` atau `/lp/[promo]`.

### E. Admin / Settings (Opsional, Sederhana)
- `site_config`: tambah `geofence_radius` via `ensureColumn`.
- Field di admin "Profil Usaha" untuk set radius + tombol "Test Kirim Notif".

---

## Welcome Notification Flow (Ringkas)
```
Visitor buka PWA di dekat toko
  → geofence.js cek GPS tiap 30-60s
  → jarak < radius & belum trigger
  → minta izin notif (jika belum) + subscribe push (simpan ke DB)
  → tampilkan in-app welcome + kirim push "Selamat datang"
  → (Android) notif muncul di system tray meski PWA minimize
  → (iOS) notif hanya saat PWA foreground
```

## Risks / Notes
- Web-push butuh **HTTPS** (production `sidomulyoproject.com` sudah HTTPS — ok).
- VAPID private key jangan di-commit; simpan di env.
- iOS: hanya foreground. Android: bisa background (terbatas via Periodic Background Sync).
- Orang tanpa install PWA = tidak dapat notif (by design, sesuai pilihan user).
- Spam guard wajib (localStorage flag + cooldown) agar tidak notif tiap 30 detik.
