import db from "./db.js";

const TABLES = [
  `CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS site_config (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    short_name VARCHAR(100),
    tagline TEXT,
    description TEXT,
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_region VARCHAR(100),
    address_postal_code VARCHAR(20),
    address_country VARCHAR(10),
    geo_lat DOUBLE,
    geo_lng DOUBLE,
    phone VARCHAR(50),
    phone_display VARCHAR(50),
    email VARCHAR(255),
    operational_hours TEXT,
    maps_url TEXT,
    maps_embed TEXT,
    logo VARCHAR(500),
    hero_image VARCHAR(500),
    social_json TEXT,
    service_area_json TEXT,
    footer_links_json TEXT,
    copyright_text VARCHAR(255) DEFAULT 'All rights reserved.',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    image VARCHAR(500),
    short_desc TEXT,
    long_desc TEXT,
    features_json TEXT,
    \`order\` INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price_text VARCHAR(100),
    image VARCHAR(500),
    short_desc TEXT,
    long_desc TEXT,
    \`order\` INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS portfolio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    client VARCHAR(255),
    year INT,
    image VARCHAR(500),
    description TEXT,
    \`order\` INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500),
    website VARCHAR(500),
    \`order\` INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    company VARCHAR(255),
    quote TEXT,
    avatar VARCHAR(500),
    \`order\` INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token VARCHAR(64) PRIMARY KEY,
    admin_id INT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS marketplace_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(50) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    redeemed TINYINT(1) DEFAULT 0,
    redeemed_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS redeem_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    discount_percent INT NOT NULL DEFAULT 10,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS marketplace_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    password_hash VARCHAR(255) NOT NULL,
    verified TINYINT(1) DEFAULT 0,
    banned TINYINT(1) DEFAULT 0,
    latitude DOUBLE DEFAULT NULL,
    longitude DOUBLE DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS marketplace_sessions (
    token VARCHAR(64) PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES marketplace_users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS marketplace_redemptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    code_id INT NOT NULL,
    rule_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES marketplace_users(id) ON DELETE CASCADE,
    FOREIGN KEY (code_id) REFERENCES marketplace_codes(id) ON DELETE CASCADE,
    FOREIGN KEY (rule_id) REFERENCES redeem_rules(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE,
    excerpt TEXT,
    content LONGTEXT,
    featured_image VARCHAR(500),
    tags_json TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    status ENUM('draft', 'published') DEFAULT 'draft',
    author VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS analytics_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id VARCHAR(64) NOT NULL DEFAULT '',
    event_type ENUM('pageview','click','scroll') NOT NULL DEFAULT 'pageview',
    page_url VARCHAR(500) NOT NULL DEFAULT '',
    element_target VARCHAR(200) NOT NULL DEFAULT '',
    element_text VARCHAR(200) NOT NULL DEFAULT '',
    latitude DOUBLE DEFAULT NULL,
    longitude DOUBLE DEFAULT NULL,
    location_source ENUM('ip','gps') DEFAULT NULL,
    city VARCHAR(100) NOT NULL DEFAULT '',
    region VARCHAR(100) NOT NULL DEFAULT '',
    country VARCHAR(50) NOT NULL DEFAULT '',
    device_type ENUM('desktop','mobile','tablet','unknown') NOT NULL DEFAULT 'unknown',
    browser VARCHAR(50) NOT NULL DEFAULT '',
    os VARCHAR(50) NOT NULL DEFAULT '',
    screen_width INT DEFAULT NULL,
    screen_height INT DEFAULT NULL,
    user_agent VARCHAR(500) NOT NULL DEFAULT '',
    ip_address VARCHAR(45) NOT NULL DEFAULT '',
    fingerprint VARCHAR(64) NOT NULL DEFAULT '',
    timezone VARCHAR(64) NOT NULL DEFAULT '',
    locale VARCHAR(16) NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_visitor (visitor_id),
    INDEX idx_event_type (event_type),
    INDEX idx_created (created_at),
    INDEX idx_page_url (page_url(191))
  )`,
  `CREATE TABLE IF NOT EXISTS analytics_visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id VARCHAR(64) NOT NULL DEFAULT '',
    first_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    total_visits INT NOT NULL DEFAULT 0,
    total_clicks INT NOT NULL DEFAULT 0,
    city VARCHAR(100) NOT NULL DEFAULT '',
    region VARCHAR(100) NOT NULL DEFAULT '',
    country VARCHAR(50) NOT NULL DEFAULT '',
    device_type ENUM('desktop','mobile','tablet','unknown') NOT NULL DEFAULT 'unknown',
    browser VARCHAR(50) NOT NULL DEFAULT '',
    os VARCHAR(50) NOT NULL DEFAULT '',
    latitude DOUBLE DEFAULT NULL,
    longitude DOUBLE DEFAULT NULL,
    location_source ENUM('ip','gps') DEFAULT NULL,
    ip_address VARCHAR(45) NOT NULL DEFAULT '',
    fingerprint VARCHAR(64) NOT NULL DEFAULT '',
    timezone VARCHAR(64) NOT NULL DEFAULT '',
    locale VARCHAR(16) NOT NULL DEFAULT '',
    UNIQUE KEY idx_visitor_id (visitor_id),
    INDEX idx_last_seen (last_seen),
    INDEX idx_city (city)
  )`,
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL DEFAULT '',
    phone VARCHAR(50) NOT NULL DEFAULT '',
    subject VARCHAR(255) NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_read (is_read),
    INDEX idx_created (created_at)
  )`,
  `CREATE TABLE IF NOT EXISTS landing_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    badge_text VARCHAR(120),
    hero_headline TEXT,
    hero_subtext TEXT,
    hero_image VARCHAR(500),
    cta_text VARCHAR(100),
    cta_target VARCHAR(500),
    accent_color VARCHAR(20) DEFAULT '#0A4DA6',
    sections_json TEXT,
    trust_badges_json TEXT,
    cta_band_heading TEXT,
    cta_band_text TEXT,
    form_title VARCHAR(160),
    form_subtext TEXT,
    form_enabled TINYINT(1) DEFAULT 0,
    status ENUM('draft','published') DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `INSERT IGNORE INTO site_config (id) VALUES (1)`,
  `CREATE TABLE IF NOT EXISTS marketplace_email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    code VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    used TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES marketplace_users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('verification','marketing','notification') NOT NULL DEFAULT 'verification',
    subject VARCHAR(255) NOT NULL,
    header_text VARCHAR(255) DEFAULT '',
    logo_url VARCHAR(500) DEFAULT '',
    description TEXT,
    body_html LONGTEXT,
    footer_text TEXT,
    accent_color VARCHAR(20) DEFAULT '#2563eb',
    button_text VARCHAR(100) DEFAULT '',
    button_url VARCHAR(500) DEFAULT '',
    banner_image VARCHAR(500) DEFAULT '',
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS email_broadcast_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT DEFAULT NULL,
    subject VARCHAR(255) NOT NULL,
    recipient_filter VARCHAR(50) DEFAULT 'all',
    recipient_count INT DEFAULT 0,
    sent_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
];

export async function initSchema() {
  for (const sql of TABLES) {
    await db.execute(sql);
  }

  // Idempotently add columns that were introduced after the initial schema,
  // since CREATE TABLE IF NOT EXISTS won't alter an already-existing table.
  await ensureColumn(
    "analytics_visitors",
    "location_source",
    "ENUM('ip','gps') DEFAULT NULL"
  );
  await ensureColumn(
    "analytics_visitors",
    "ip_address",
    "VARCHAR(45) NOT NULL DEFAULT ''"
  );
  await ensureColumn(
    "analytics_visitors",
    "fingerprint",
    "VARCHAR(64) NOT NULL DEFAULT ''"
  );
  await ensureColumn(
    "analytics_visitors",
    "timezone",
    "VARCHAR(64) NOT NULL DEFAULT ''"
  );
  await ensureColumn(
    "analytics_visitors",
    "locale",
    "VARCHAR(16) NOT NULL DEFAULT ''"
  );
  await ensureColumn(
    "analytics_events",
    "fingerprint",
    "VARCHAR(64) NOT NULL DEFAULT ''"
  );
  await ensureColumn(
    "analytics_events",
    "timezone",
    "VARCHAR(64) NOT NULL DEFAULT ''"
  );
  await ensureColumn(
    "analytics_events",
    "locale",
    "VARCHAR(16) NOT NULL DEFAULT ''"
  );
  await ensureColumn(
    "analytics_events",
    "campaign",
    "VARCHAR(255) NOT NULL DEFAULT ''"
  );
  await ensureColumn(
    "analytics_events",
    "utm_source",
    "VARCHAR(100) NOT NULL DEFAULT ''"
  );
  await ensureColumn(
    "analytics_events",
    "utm_medium",
    "VARCHAR(100) NOT NULL DEFAULT ''"
  );
  await ensureColumn(
    "analytics_events",
    "utm_campaign",
    "VARCHAR(100) NOT NULL DEFAULT ''"
  );
  await ensureColumn(
    "analytics_events",
    "scroll_depth",
    "TINYINT DEFAULT NULL"
  );
  await ensureColumn(
    "analytics_events",
    "duration_ms",
    "INT DEFAULT NULL"
  );
  await ensureColumn(
    "analytics_events",
    "form_submitted",
    "TINYINT(1) DEFAULT 0"
  );

  // Landing page dynamic fields (added after initial schema).
  await ensureColumn("landing_pages", "badge_text", "VARCHAR(120) DEFAULT NULL");
  await ensureColumn("landing_pages", "trust_badges_json", "TEXT");
  await ensureColumn("landing_pages", "cta_band_heading", "TEXT");
  await ensureColumn("landing_pages", "cta_band_text", "TEXT");
  await ensureColumn("landing_pages", "form_title", "VARCHAR(160) DEFAULT NULL");
  await ensureColumn("landing_pages", "form_subtext", "TEXT");

  // Landing page map / location.
  await ensureColumn("landing_pages", "map_enabled", "TINYINT(1) DEFAULT 0");
  await ensureColumn("landing_pages", "map_lat", "DOUBLE DEFAULT NULL");
  await ensureColumn("landing_pages", "map_lng", "DOUBLE DEFAULT NULL");
  await ensureColumn("landing_pages", "map_address", "VARCHAR(255) DEFAULT NULL");
  await ensureColumn("landing_pages", "testimonials_json", "TEXT");

  // Marketplace: add verified column to existing users table.
  await ensureColumn("marketplace_users", "verified", "TINYINT(1) DEFAULT 0");
  await ensureColumn("marketplace_users", "banned", "TINYINT(1) DEFAULT 0");
  await ensureColumn("marketplace_users", "latitude", "DOUBLE DEFAULT NULL");
  await ensureColumn("marketplace_users", "longitude", "DOUBLE DEFAULT NULL");

  // Email Templates: ensure banner_image column exists (added after initial schema).
  await ensureColumn("email_templates", "banner_image", "VARCHAR(500) DEFAULT ''");

  // Email Templates: seed default templates (only if table is empty).
  const [existing] = await db.execute("SELECT COUNT(*) AS cnt FROM email_templates");
  if (existing[0].cnt === 0) {
    await seedEmailTemplates();
  }
}

async function seedEmailTemplates() {
  const templates = [
    {
      name: "Verifikasi Akun Marketplace",
      type: "verification",
      subject: "Kode Verifikasi Marketplace - Sidomulyo Advertising",
      header_text: "Verifikasi Akun Anda",
      logo_url: "",
      description: "Gunakan kode verifikasi di bawah ini untuk menyelesaikan pendaftaran akun marketplace Anda.",
      body_html: `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
  <tr>
    <td style="background:linear-gradient(135deg,#1e293b,#0f172a);border:2px dashed #3b82f6;border-radius:14px;padding:24px 20px;text-align:center;">
      <p style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;font-weight:600;">Kode Verifikasi</p>
      <span style="font-size:40px;font-weight:800;letter-spacing:14px;color:#60a5fa;font-family:'Courier New',Courier,monospace;display:inline-block;">{{code}}</span>
    </td>
  </tr>
</table>
<p style="color:#64748b;font-size:12px;margin:20px 0 0;text-align:center;">Kode ini kedaluwarsa dalam <strong style="color:#94a3b8;">10 menit</strong>.</p>
`,
      footer_text: "Jika Anda tidak meminta verifikasi ini, abaikan email ini.",
      accent_color: "#2563eb",
      button_text: "Buka Marketplace",
      button_url: "/marketplace",
      banner_image: "",
      is_active: true,
    },
    {
      name: "Promo Spesial - Diskon Besar",
      type: "marketing",
      subject: "Promo Spesial! Diskon Besar untuk Kamu",
      header_text: "Promo Spesial!",
      logo_url: "",
      description: "Jangan lewatkan penawaran terbatas dari Sidomulyo Advertising.",
      body_html: `
<p style="color:#f1f5f9;font-size:16px;font-weight:700;margin:0 0 12px;text-align:center;">Hanya untuk kamu yang sudah terdaftar di marketplace kami!</p>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 20px;">
  <tr>
    <td style="background:#1e293b;border-radius:12px;padding:20px;text-align:center;border:1px solid rgba(255,255,255,0.08);">
      <p style="color:#60a5fa;font-size:48px;font-weight:800;margin:0;">50%</p>
      <p style="color:#94a3b8;font-size:14px;margin:4px 0 0;">DISKON untuk layanan tertentu</p>
    </td>
  </tr>
</table>
<p style="color:#cbd5e1;font-size:14px;margin:0 0 8px;">Syarat & Ketentuan:</p>
<ul style="color:#94a3b8;font-size:13px;margin:0;padding-left:20px;line-height:1.8;">
  <li>Berlaku hingga akhir bulan ini</li>
  <li>Hanya untuk pengguna marketplace terverifikasi</li>
  <li>Tidak dapat digabung dengan promo lain</li>
</ul>
`,
      footer_text: "Promo ini berlaku terbatas. KunjungiSidomulyo Advertising untuk informasi lebih lanjut.",
      accent_color: "#f59e0b",
      button_text: "Klaim Promo Sekarang",
      button_url: "/marketplace",
      banner_image: "",
      is_active: true,
    },
    {
      name: "Selamat Datang di Marketplace",
      type: "notification",
      subject: "Selamat Datang di Marketplace Sidomulyo!",
      header_text: "Selamat Datang!",
      logo_url: "",
      description: "Akun marketplace kamu sudah aktif.",
      body_html: `
<p style="color:#f1f5f9;font-size:16px;font-weight:700;margin:0 0 12px;text-align:center;">Kamu sudah resmi menjadi bagian dari marketplace kami!</p>
<p style="color:#cbd5e1;font-size:14px;margin:0 0 16px;line-height:1.7;">
  Dengan akun marketplace ini, kamu bisa:
</p>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 20px;">
  <tr>
    <td style="padding:8px 0;color:#94a3b8;font-size:13px;">
      <span style="color:#34d399;font-weight:700;">&#10003;</span> Klaim kode redeem diskon eksklusif
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0;color:#94a3b8;font-size:13px;">
      <span style="color:#34d399;font-weight:700;">&#10003;</span> Dapatkan promo khusus member
    </td>
  </tr>
  <tr>
    <td style="padding:8px 0;color:#94a3b8;font-size:13px;">
      <span style="color:#34d399;font-weight:700;">&#10003;</span> Akses layanan Sidomulyo Advertising & Printing
    </td>
  </tr>
</table>
<p style="color:#64748b;font-size:12px;margin:0;text-align:center;">Simpan email ini untuk referensi kamu.</p>
`,
      footer_text: "Terima kasih sudah bergabung dengan marketplace Sidomulyo Advertising.",
      accent_color: "#10b981",
      button_text: "Jelajahi Marketplace",
      button_url: "/marketplace",
      banner_image: "",
      is_active: true,
    },
    {
      name: "Pemberitahuan Penting",
      type: "notification",
      subject: "Pemberitahuan Penting dari Sidomulyo Advertising",
      header_text: "Pemberitahuan Penting",
      logo_url: "",
      description: "Informasi terbaru dari Sidomulyo Advertising untuk kamu.",
      body_html: `
<p style="color:#f1f5f9;font-size:16px;font-weight:700;margin:0 0 12px;text-align:center;">Ada info penting yang perlu kamu tahu!</p>
<p style="color:#cbd5e1;font-size:14px;margin:0 0 16px;line-height:1.7;">
  Tulis pesan pemberitahuan kamu di sini. Kamu bisa mengedit konten ini sesuai kebutuhan — misalnya info perubahan jam operasional, pemeliharaan sistem, atau pengumuman lainnya.
</p>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 20px;">
  <tr>
    <td style="background:#1e293b;border-radius:12px;padding:16px 20px;border-left:4px solid #f59e0b;">
      <p style="color:#fbbf24;font-size:12px;font-weight:700;margin:0 0 4px;">PENTING</p>
      <p style="color:#cbd5e1;font-size:13px;margin:0;line-height:1.6;">Ganti teks ini dengan informasi pemberitahuan kamu.</p>
    </td>
  </tr>
</table>
`,
      footer_text: "Untuk pertanyaan lebih lanjut, hubungi kami melalui WhatsApp atau kunjungi langsung Sidomulyo Advertising.",
      accent_color: "#ef4444",
      button_text: "",
      button_url: "",
      banner_image: "",
      is_active: true,
    },
  ];

  for (const t of templates) {
    await db.execute(
      `INSERT INTO email_templates (name, type, subject, header_text, logo_url, description, body_html, footer_text, accent_color, button_text, button_url, banner_image, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.name, t.type, t.subject, t.header_text, t.logo_url, t.description, t.body_html.trim(), t.footer_text, t.accent_color, t.button_text, t.button_url, t.banner_image, t.is_active ? 1 : 0]
    );
  }
}

async function ensureColumn(table, column, definition) {
  try {
    const [rows] = await db.execute(
      `SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
      [table, column]
    );
    if (rows.length === 0) {
      await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
  } catch (err) {
    console.error(`[schema] ensureColumn ${table}.${column} failed:`, err.message);
  }
}
