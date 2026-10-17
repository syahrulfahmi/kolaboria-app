# Workspace Overview frontend

Overview reads `GET /v1/workspaces/{projectSlug}/overview` through the API service and a route-scoped composable. It does not read or write localStorage for live project data and does not replace API failures with prototype data.

The cache is scoped by account and project slug, retains at most 20 recently used projects, and treats entries as fresh for 15 seconds. A Workspace mutation marks the existing account/project invalidation revision after the server confirms success. The overview request then refreshes once; failed refreshes preserve the last successful snapshot with a visible stale-data message. Focus refreshes are coalesced and rate-limited. Account changes clear that account's cache and revision entries.

The UI renders a maximum of five assigned active tasks, two recent discussions, and three activity events. Date-only deadlines are formatted from local calendar components to avoid timezone shifts; event timestamps use `id-ID` and the browser's timezone. Progress excludes closed and deleted tasks and shows an em dash when no task belongs in the denominator.

Task links preserve the project slug and open the live Task Board with `filter=mine`, `filter=review`, or `task_id=<uuid>`. The create action uses `action=create`. The Task Board applies the initial filter before its first request; an initial task ID takes precedence over create. The Board removes modal intent parameters after handling them and preserves unrelated query parameters. Discussion, Activity, and Info links use their live routes.
