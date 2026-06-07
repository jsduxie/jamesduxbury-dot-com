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
