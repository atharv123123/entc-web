-- Create news table (displayed in the scrolling notice bar)
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS news_created_at_idx ON news(created_at);

-- RLS policies for news table
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news" ON news
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage news" ON news
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );