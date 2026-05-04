-- ============================================================
-- Project Hub Schema
-- Migration: 20260502_project_hub_schema.sql
-- ============================================================

-- Enums
CREATE TYPE project_status AS ENUM ('draft', 'open', 'in_progress', 'completed', 'archived');
CREATE TYPE project_type AS ENUM ('web_app', 'mobile_app', 'ui_ux', 'backend', 'data_analytics', 'devops', 'other');
CREATE TYPE project_visibility AS ENUM ('public', 'invite_only');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE project_member_role AS ENUM ('owner', 'contributor');
CREATE TYPE applicant_availability AS ENUM ('full_time', 'part_time', 'weekends_only', 'flexible');

-- ============================================================
-- TABLE: projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  summary       TEXT NOT NULL,
  description   TEXT,
  type          project_type NOT NULL DEFAULT 'other',
  visibility    project_visibility NOT NULL DEFAULT 'public',
  status        project_status NOT NULL DEFAULT 'draft',
  max_slots     SMALLINT NOT NULL DEFAULT 3 CHECK (max_slots > 0 AND max_slots <= 20),
  start_date    DATE,
  deadline      DATE,
  tech_stack    TEXT[] DEFAULT '{}',
  why_join      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at  TIMESTAMPTZ
);

-- ============================================================
-- TABLE: applications
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id              UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  applicant_id            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  motivation              TEXT NOT NULL,
  expected_contribution   TEXT,
  portfolio_links         TEXT[] DEFAULT '{}',
  availability            applicant_availability NOT NULL DEFAULT 'flexible',
  status                  application_status NOT NULL DEFAULT 'pending',
  reviewer_note           TEXT,
  applied_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, applicant_id)
);

-- ============================================================
-- TABLE: project_members
-- ============================================================
CREATE TABLE IF NOT EXISTS project_members (
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role        project_member_role NOT NULL DEFAULT 'contributor',
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, profile_id)
);

-- ============================================================
-- TABLE: skill_tags (master data skill untuk project)
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_tags (
  id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name  TEXT NOT NULL UNIQUE
);

-- ============================================================
-- TABLE: project_skills (pivot project ↔ skill_tags)
-- ============================================================
CREATE TABLE IF NOT EXISTS project_skills (
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_tag_id  UUID NOT NULL REFERENCES skill_tags(id) ON DELETE CASCADE,
  is_required   BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (project_id, skill_tag_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_creator ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_applications_project ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications(applicant_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Projects: siapapun bisa baca project public/open
CREATE POLICY "Public can view open projects"
  ON projects FOR SELECT
  USING (status IN ('open', 'in_progress', 'completed') AND visibility = 'public');

-- Projects: user login bisa baca draft miliknya sendiri
CREATE POLICY "Owners can view their drafts"
  ON projects FOR SELECT
  USING (auth.uid() = creator_id);

-- Projects: user login bisa buat project
CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Projects: hanya owner yang bisa update
CREATE POLICY "Owners can update their projects"
  ON projects FOR UPDATE
  USING (auth.uid() = creator_id);

-- Applications: hanya applicant atau owner project yang bisa baca
CREATE POLICY "Applicants can view own applications"
  ON applications FOR SELECT
  USING (auth.uid() = applicant_id);

CREATE POLICY "Project owners can view applications"
  ON applications FOR SELECT
  USING (
    auth.uid() IN (
      SELECT creator_id FROM projects WHERE id = project_id
    )
  );

-- Applications: user login bisa apply
CREATE POLICY "Authenticated users can apply"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

-- Applications: applicant bisa withdraw (update status)
CREATE POLICY "Applicants can withdraw"
  ON applications FOR UPDATE
  USING (auth.uid() = applicant_id AND status = 'pending');

-- Applications: project owner bisa update (accept/reject)
CREATE POLICY "Project owners can update application status"
  ON applications FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT creator_id FROM projects WHERE id = project_id
    )
  );

-- project_members: public bisa lihat
CREATE POLICY "Public can view project members"
  ON project_members FOR SELECT
  USING (true);

-- ============================================================
-- SEED: skill_tags dasar
-- ============================================================
INSERT INTO skill_tags (name) VALUES
  ('Vue.js'), ('React'), ('Next.js'), ('Nuxt.js'),
  ('TypeScript'), ('JavaScript'), ('Node.js'), ('Express'),
  ('Python'), ('FastAPI'), ('Django'), ('Go'),
  ('PostgreSQL'), ('Supabase'), ('Firebase'), ('MongoDB'),
  ('Tailwind CSS'), ('Figma'), ('UI/UX Design'),
  ('React Native'), ('Flutter'),
  ('Docker'), ('AWS'), ('DevOps'),
  ('TensorFlow'), ('Data Science'), ('Machine Learning'),
  ('Prisma'), ('GraphQL'), ('REST API')
ON CONFLICT (name) DO NOTHING;
