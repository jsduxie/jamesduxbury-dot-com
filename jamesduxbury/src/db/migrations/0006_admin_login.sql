-- console allowlist moves out of code; the default is the previously hardcoded login
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS admin_login text NOT NULL DEFAULT 'jsduxie';
