-- Migration 003: Landing Pages + per-campaign analytics columns
-- Applied idempotently at runtime via initSchema() (ensureColumn).

CREATE TABLE IF NOT EXISTS landing_pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  hero_headline TEXT,
  hero_subtext TEXT,
  hero_image VARCHAR(500),
  cta_text VARCHAR(100),
  cta_target VARCHAR(500),
  accent_color VARCHAR(20) DEFAULT '#0A4DA6',
  sections_json TEXT,
  form_enabled TINYINT(1) DEFAULT 0,
  status ENUM('draft','published') DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- New columns on analytics_events (added via ensureColumn, listed here for reference):
--   campaign        VARCHAR(255) NOT NULL DEFAULT ''
--   utm_source      VARCHAR(100) NOT NULL DEFAULT ''
--   utm_medium      VARCHAR(100) NOT NULL DEFAULT ''
--   utm_campaign    VARCHAR(100) NOT NULL DEFAULT ''
--   scroll_depth    TINYINT DEFAULT NULL
--   duration_ms     INT DEFAULT NULL
--   form_submitted  TINYINT(1) DEFAULT 0
