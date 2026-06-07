-- Move prose columns from AboutParagraph[] (arrays of run arrays) to Block[].
-- Each paragraph becomes a {kind:'p',runs} block; the guard only touches un-migrated rows.

UPDATE case_studies SET problem = (
  SELECT jsonb_agg(jsonb_build_object('kind', 'p', 'runs', p))
  FROM jsonb_array_elements(problem) p
) WHERE jsonb_typeof(problem -> 0) = 'array';

UPDATE case_studies SET approach = (
  SELECT jsonb_agg(jsonb_build_object('kind', 'p', 'runs', p))
  FROM jsonb_array_elements(approach) p
) WHERE jsonb_typeof(approach -> 0) = 'array';

UPDATE case_studies SET outcome = (
  SELECT jsonb_agg(jsonb_build_object('kind', 'p', 'runs', p))
  FROM jsonb_array_elements(outcome) p
) WHERE outcome IS NOT NULL AND jsonb_typeof(outcome -> 0) = 'array';

UPDATE architecture_sections SET body = (
  SELECT jsonb_agg(jsonb_build_object('kind', 'p', 'runs', p))
  FROM jsonb_array_elements(body) p
) WHERE jsonb_typeof(body -> 0) = 'array';

-- Collapse the per-paragraph about rows into one block document.
CREATE TABLE IF NOT EXISTS about (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  blocks jsonb NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO about (id, blocks)
  SELECT 1, COALESCE(
    jsonb_agg(jsonb_build_object('kind', 'p', 'runs', runs) ORDER BY sort_order),
    '[]'::jsonb
  )
  FROM about_paragraphs
  ON CONFLICT (id) DO NOTHING;

DROP TABLE IF EXISTS about_paragraphs;
