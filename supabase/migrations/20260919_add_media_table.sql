-- Create media_category enum
DO $$ BEGIN
  CREATE TYPE media_category AS ENUM ('achievements', 'events', 'sports', 'faculty');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category media_category NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS media_category_idx ON media(category);
CREATE INDEX IF NOT EXISTS media_sort_idx ON media(sort_order);
CREATE INDEX IF NOT EXISTS media_created_at_idx ON media(created_at);

-- RLS policies for media table
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "media_select_public" ON media
  FOR SELECT USING (true);

-- Admin insert
CREATE POLICY "media_insert_admin" ON media
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Admin update
CREATE POLICY "media_update_admin" ON media
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );

-- Admin delete
CREATE POLICY "media_delete_admin" ON media
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
  );
