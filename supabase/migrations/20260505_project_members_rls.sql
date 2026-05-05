CREATE POLICY "Project owners can insert members"
  ON project_members FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT creator_id FROM projects WHERE id = project_id
    )
  );