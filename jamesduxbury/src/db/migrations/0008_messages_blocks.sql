-- Contact messages move from plain text to a block document; existing text becomes one paragraph.
ALTER TABLE messages ALTER COLUMN message TYPE jsonb
  USING jsonb_build_array(jsonb_build_object('kind', 'p', 'runs', jsonb_build_array(message)));
