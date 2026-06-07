-- site-wide content moves out of code; defaults are the previously hardcoded literals
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS contact_email text NOT NULL DEFAULT 'jduxbury848@gmail.com',
  ADD COLUMN IF NOT EXISTS github_url text NOT NULL DEFAULT 'https://github.com/jsduxie',
  ADD COLUMN IF NOT EXISTS linkedin_url text NOT NULL DEFAULT 'https://linkedin.com/in/jamesduxbury03',
  ADD COLUMN IF NOT EXISTS site_version text NOT NULL DEFAULT 'v2.0',
  ADD COLUMN IF NOT EXISTS owner_name text NOT NULL DEFAULT 'James Duxbury',
  ADD COLUMN IF NOT EXISTS tagline text NOT NULL DEFAULT 'Software Engineer in AI and Cybersecurity',
  ADD COLUMN IF NOT EXISTS meta_description text NOT NULL DEFAULT 'Final-year MEng Computer Science student at Durham. AI / NLP research, application security, full-stack engineering. Accredited Affiliate Member of the Chartered Institute of Information Security (AfCIIS).',
  ADD COLUMN IF NOT EXISTS og_description text NOT NULL DEFAULT 'Portfolio of James Duxbury — MEng Computer Science, Durham. AI, NLP, application security, full-stack engineering.',
  ADD COLUMN IF NOT EXISTS og_footer text NOT NULL DEFAULT 'MEng Computer Science · Durham',
  ADD COLUMN IF NOT EXISTS entry_role text NOT NULL DEFAULT 'Software engineer · AI & application security',
  ADD COLUMN IF NOT EXISTS entry_credential text NOT NULL DEFAULT 'AfCIIS',
  ADD COLUMN IF NOT EXISTS entry_education text NOT NULL DEFAULT 'Durham University · Integrated MEng Computer Science',
  ADD COLUMN IF NOT EXISTS entry_status text NOT NULL DEFAULT 'FINAL YEAR',
  ADD COLUMN IF NOT EXISTS entry_years text NOT NULL DEFAULT '2022 — 2026',
  ADD COLUMN IF NOT EXISTS cv text;
