-- Migration: 20260502120000_add_project_slug.sql

-- 1. Add column
ALTER TABLE projects ADD COLUMN slug TEXT UNIQUE;

-- 2. Create function to generate slug
CREATE OR REPLACE FUNCTION generate_project_slug(title TEXT, id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  id_suffix TEXT;
BEGIN
  -- Convert to lowercase, replace spaces and non-alphanumeric with hyphens
  base_slug := lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
  -- Trim trailing and leading hyphens
  base_slug := trim(both '-' from base_slug);
  
  -- Take first 4 chars of UUID
  id_suffix := substr(id::text, 1, 4);
  
  RETURN base_slug || '-' || id_suffix;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger function
CREATE OR REPLACE FUNCTION set_project_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update slug if title changed or it's a new row
  IF TG_OP = 'INSERT' OR NEW.title <> OLD.title OR NEW.slug IS NULL THEN
    NEW.slug := generate_project_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Attach trigger
CREATE TRIGGER tr_set_project_slug
BEFORE INSERT OR UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_project_slug();

-- 5. Backfill existing data
UPDATE projects SET slug = generate_project_slug(title, id) WHERE slug IS NULL;

-- 6. Make column NOT NULL after backfill
ALTER TABLE projects ALTER COLUMN slug SET NOT NULL;

-- 7. Add index
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
