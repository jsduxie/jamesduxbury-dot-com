CREATE TABLE IF NOT EXISTS projects (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text NOT NULL,
  status text NOT NULL CHECK (status IN ('live', 'dev', 'exam', 'shipped')),
  under_exam boolean NOT NULL DEFAULT false,
  year_start integer NOT NULL,
  year_end integer NOT NULL,
  tech_stack text[] NOT NULL DEFAULT '{}',
  highlights text[] NOT NULL DEFAULT '{}',
  -- ProjectMetric[] from src/data/projects.ts
  metrics jsonb,
  image_path text,
  github_link text,
  live_link text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experience (
  id serial PRIMARY KEY,
  title text NOT NULL,
  organisation text NOT NULL,
  meta text,
  period text NOT NULL,
  year_start integer NOT NULL,
  -- NULL = ongoing ("present" in the UI)
  year_end integer,
  bullets text[],
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (title, organisation)
);

CREATE TABLE IF NOT EXISTS education (
  id serial PRIMARY KEY,
  qualification text NOT NULL,
  institution text NOT NULL,
  period text NOT NULL,
  year_end integer NOT NULL,
  bullets text[],
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (qualification, institution)
);

CREATE TABLE IF NOT EXISTS certifications (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  year text NOT NULL,
  img_path text,
  certification_link text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skill_groups (
  id serial PRIMARY KEY,
  heading text NOT NULL UNIQUE,
  skills text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS about_paragraphs (
  id serial PRIMARY KEY,
  -- AboutParagraph from src/data/about.ts
  runs jsonb NOT NULL,
  sort_order integer NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- one optional case study per project; prose columns hold paragraph runs
CREATE TABLE IF NOT EXISTS case_studies (
  id serial PRIMARY KEY,
  project_slug text NOT NULL UNIQUE REFERENCES projects(slug) ON UPDATE CASCADE,
  problem jsonb NOT NULL,
  approach jsonb NOT NULL,
  outcome jsonb,
  image_path text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- single settings row; sort_order only satisfies the generic admin list ordering
CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  profile_image text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- /architecture page content; body holds paragraph runs
CREATE TABLE IF NOT EXISTS architecture_sections (
  id serial PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('intro', 'stack', 'decision', 'build')),
  title text,
  body jsonb NOT NULL,
  sort_order integer NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Deliberately no cookies, IPs, or fingerprinting
CREATE TABLE IF NOT EXISTS page_views (
  id bigserial PRIMARY KEY,
  session_id text NOT NULL,
  path text NOT NULL,
  referrer text,
  country text,
  duration_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views (created_at);
CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views (path);
CREATE INDEX IF NOT EXISTS page_views_session_id_idx ON page_views (session_id);
