-- Migration 004: Landing page leads + campaign-engine generalization columns
-- Applied idempotently at runtime via initSchema() (ensureColumn / CREATE TABLE IF NOT EXISTS).
-- This file is a human-readable mirror of what src/lib/schema.js already applies at boot.

CREATE TABLE IF NOT EXISTS landing_page_leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  landing_page_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(30) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  city VARCHAR(100) DEFAULT NULL,
  message TEXT,
  answers_json LONGTEXT,
  status ENUM('new','contacted','qualified','sample_approved','sample_sent','sample_received','follow_up','quotation','order','not_interested') NOT NULL DEFAULT 'new',
  source VARCHAR(100) DEFAULT NULL,
  utm_source VARCHAR(100) DEFAULT NULL,
  utm_medium VARCHAR(100) DEFAULT NULL,
  utm_campaign VARCHAR(100) DEFAULT NULL,
  utm_content VARCHAR(100) DEFAULT NULL,
  utm_term VARCHAR(100) DEFAULT NULL,
  referrer VARCHAR(500) DEFAULT NULL,
  admin_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_city (city),
  INDEX idx_created (created_at),
  INDEX idx_landing_page (landing_page_id)
);

-- New columns on landing_pages (added via ensureColumn, listed here for reference):
--   hero_layout          VARCHAR(20) DEFAULT 'parallax'   -- 'parallax' (default, unchanged) | 'product'
--   hero_eyebrow          VARCHAR(160) DEFAULT NULL
--   secondary_cta_text    VARCHAR(100) DEFAULT NULL
--   secondary_cta_target  VARCHAR(500) DEFAULT NULL        -- typically a wa.me link
--   form_fields_json      TEXT                             -- [{ key, label, type, options?, required?, placeholder? }]
--   noindex               TINYINT(1) DEFAULT 0
--   published_at          DATETIME DEFAULT NULL            -- scheduled publish; NULL = publish immediately
