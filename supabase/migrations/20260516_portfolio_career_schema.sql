CREATE TABLE portfolio_projects (
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  pinned_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, project_id)
);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view portfolios" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Users manage own portfolio" ON portfolio_projects FOR ALL USING (auth.uid() = user_id);

CREATE TABLE career_histories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  company     TEXT NOT NULL,
  start_year  SMALLINT NOT NULL,
  end_year    SMALLINT,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE career_histories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view career histories" ON career_histories FOR SELECT USING (true);
CREATE POLICY "Users manage own career" ON career_histories FOR ALL USING (auth.uid() = user_id);
