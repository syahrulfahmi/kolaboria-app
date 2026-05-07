-- ============================================================
-- Workspace MVP Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_by  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'todo'
              CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  position    NUMERIC NOT NULL DEFAULT 0,
  due_date    DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  actor_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action      TEXT NOT NULL CHECK (
    action IN ('task.created', 'task.moved', 'task.updated', 'task.deleted', 'task.assigned', 'comment.added')
  ),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('task', 'comment')),
  entity_id   UUID NOT NULL,
  metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(project_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(project_id, status, position);
CREATE INDEX IF NOT EXISTS idx_task_comments_task ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project ON activity_logs(project_id, created_at DESC);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION handle_task_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_task_updated ON tasks;
CREATE TRIGGER on_task_updated
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION handle_task_updated_at();

CREATE OR REPLACE FUNCTION is_project_member(p_project_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = p_project_id AND profile_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM projects
    WHERE id = p_project_id AND creator_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE POLICY "Members can view tasks"
  ON tasks FOR SELECT
  USING (is_project_member(project_id));

CREATE POLICY "Members can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (is_project_member(project_id) AND auth.uid() = created_by);

CREATE POLICY "Members can update tasks"
  ON tasks FOR UPDATE
  USING (is_project_member(project_id))
  WITH CHECK (is_project_member(project_id));

CREATE POLICY "Owners can delete tasks"
  ON tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = tasks.project_id AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Members can view comments"
  ON task_comments FOR SELECT
  USING (
    is_project_member((SELECT project_id FROM tasks WHERE id = task_comments.task_id))
  );

CREATE POLICY "Members can add comments"
  ON task_comments FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND is_project_member((SELECT project_id FROM tasks WHERE id = task_comments.task_id))
  );

CREATE POLICY "Authors can delete own comments"
  ON task_comments FOR DELETE
  USING (auth.uid() = author_id);

CREATE POLICY "Members can view activity"
  ON activity_logs FOR SELECT
  USING (is_project_member(project_id));

CREATE POLICY "Members can log activity"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.uid() = actor_id AND is_project_member(project_id));

INSERT INTO project_members (project_id, profile_id, role, joined_at)
SELECT p.id, p.creator_id, 'owner', COALESCE(p.created_at, now())
FROM projects p
WHERE NOT EXISTS (
  SELECT 1 FROM project_members pm
  WHERE pm.project_id = p.id AND pm.profile_id = p.creator_id
)
ON CONFLICT DO NOTHING;
