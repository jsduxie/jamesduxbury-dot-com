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
