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
    UNIQUE KEY idx_visitor_id (visitor_id),
    INDEX idx_last_seen (last_seen),
    INDEX idx_city (city)
  )`,
  `INSERT IGNORE INTO site_config (id) VALUES (1)`,
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
