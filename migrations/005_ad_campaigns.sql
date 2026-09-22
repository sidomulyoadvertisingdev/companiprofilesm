-- Documentation-only mirror of the ad-campaigns feature schema.
-- The actual DDL is created idempotently at request time by
-- ensureAdCampaignSchema() in src/lib/ad-campaigns.js (CREATE TABLE IF NOT EXISTS),
-- following this project's convention that migration files are docs, not
-- something a migration runner executes.
--
-- This is a standalone module, deliberately NOT part of the shared
-- landing_pages system (see migrations/003_landing_pages.sql). It powers
-- one-off ad-campaign microsites (e.g. /promo/[slug]) with their own lead
-- capture and admin UI, isolated from the general CMS landing pages.

CREATE TABLE IF NOT EXISTS ad_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_image VARCHAR(500),
  canonical_url VARCHAR(500),
  noindex TINYINT(1) NOT NULL DEFAULT 0,
  published_at DATETIME DEFAULT NULL,
  accent_color VARCHAR(20) DEFAULT '#0A4DA6',
  hero_eyebrow VARCHAR(160),
  hero_headline TEXT,
  hero_subtext TEXT,
  hero_image VARCHAR(500),
  hero_badges_json TEXT,
  primary_cta_text VARCHAR(100),
  primary_cta_target VARCHAR(500),
  secondary_cta_text VARCHAR(100),
  secondary_cta_target VARCHAR(500),
  sections_json LONGTEXT,
  form_enabled TINYINT(1) NOT NULL DEFAULT 0,
  form_title VARCHAR(160),
  form_subtext TEXT,
  form_fields_json TEXT,
  cta_band_heading TEXT,
  cta_band_text TEXT,
  whatsapp_shortcut_text VARCHAR(160),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ad_campaign_leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad_campaign_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(30) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  message TEXT,
  answers_json LONGTEXT,
  status ENUM('new','contacted','qualified','sample_approved','sample_sent','sample_received','follow_up','quotation','order','not_interested') NOT NULL DEFAULT 'new',
  utm_source VARCHAR(100), utm_medium VARCHAR(100), utm_campaign VARCHAR(100), utm_content VARCHAR(100), utm_term VARCHAR(100),
  referrer VARCHAR(500),
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ad_campaign_id) REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  INDEX idx_status (status), INDEX idx_city (city), INDEX idx_created (created_at), INDEX idx_campaign (ad_campaign_id)
);
