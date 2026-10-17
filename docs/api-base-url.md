# API base URL

The backend registers versioned endpoints under `/v1`. The client keeps the server URL in Nuxt's `runtimeConfig.public.apiBaseUrl` and the version prefix in each endpoint path in `apps/client/app/constants/api-endpoints.ts`.

| Target | Client `NUXT_PUBLIC_API_BASE_URL` |
| --- | --- |
| Local | `http://localhost:8081/` |
| Development deployment | `https://api.dev.kolaboria.com/` |

Endpoint registry entries include their own version, such as `/v1/auth/login`, `/v1/profiles/me`, and `/v1/workspaces/{projectSlug}/discussions`. Requests, token refresh, and replay use the same server configuration. A trailing slash is optional.

For example, `http://localhost:8081/` plus `/v1/auth/login` produces `http://localhost:8081/v1/auth/login`. Do not include `/v1` in the environment variable. The transport does not prepend a version, so future endpoint versions can coexist in the registry without changing the server configuration. Only v1 endpoints are currently implemented.

## Deployment

1. Deploy the backend with its `/v1` router group. The previous prefix is no longer registered.
2. Set existing client `.env` files and the deployment environment's `NUXT_PUBLIC_API_BASE_URL` to the server URL only, removing any `/v1` suffix, then rebuild/restart the client as appropriate. Environment overrides take precedence over the default. An old base URL ending in `/v1` would repeat the version prefix.
3. If a reverse proxy filters paths, ensure it forwards `/v1/*` without rewriting the prefix. Coordinate the backend and client rollout because their API paths must match.
4. Check `GET /v1/auth/me` without a token: it should return `401`, demonstrating that the new route exists and still requires authentication. `/health` and `/swagger/index.html` remain at the server root.

The API's local `.env.example` sets `APP_PORT=8081`; the server/container fallback remains `8080`. Swagger paths already contain `/v1`, so Swagger's base path remains `/`.

## Server-only configuration verification

- 49/49 focused tests passed for versioned registry requests, all 13 service groups, HTTP auth refresh/replay, project editor/lifecycle, and workspace discussions/replies.
- Registry/service transport tests passed with local and development server URLs, each with and without a trailing slash. The transport preserves endpoint paths instead of assigning a version globally.
- The full client suite passed 240/248 tests. The eight failures are the same preexisting failures listed below; no new full-suite failures were introduced.
- `pnpm build` passed. HTTP checks of the built server confirmed server-only runtime configuration for both `http://localhost:8081/` and the development override `https://api.dev.kolaboria.com/`. Final code review found no actionable issues in the refactor.

## Earlier verification on 16 October 2026

The results below document the earlier migration, when the version prefix was still included in the base URL. The current contract is the server-only configuration described above.

- `kolaboria-api`: `go test ./... -count=1 -timeout=120s` passed. Database integration tests that require an explicit disposable database retain their existing skip behavior.
- Client auth suite: 20/20 passed, including HTTP requests, refresh, and replay with `/v1` with and without a trailing slash.
- `pnpm build` passed after updating the local `.env`. HTTP checks against the built server confirmed that the browser receives `http://localhost:8081/v1` by default and `https://api.dev.kolaboria.com/v1/` when overridden at runtime. Build warnings remain for existing sourcemap generation, Browserslist data, and Nitro dependencies.
- Full client suite: 234/242 passed. All eight failures below were reproduced against a separate clean archive of the pre-change `HEAD`, using the same installed dependencies:

| Test file | Existing failing test |
| --- | --- |
| `my-project-card-navigation.test.mjs` | my project card only presents applicant state and actions when a count is known |
| `navigation-loading.test.mjs` | my-projects displays its first batch before subsequent summary pages finish |
| `navigation-loading.test.mjs` | mobile project CTA remains hidden until the loaded hero has scrolled out of view |
| `navigation-loading.test.mjs` | applications page finishes setup and exposes loading while the API is unresolved |
| `navigation-loading.test.mjs` | applicants page waits for project identity and enforces ownership (owner) |
| `navigation-loading.test.mjs` | applicants page waits for project identity and enforces ownership (another-user) |
| `project-detail-highlights.test.mjs` | project detail hides application unavailability notice from the project lead |
| `search-field.test.mjs` | SearchField debounces eligible searches and clears active search immediately |

`graphify update .` was unavailable in both repositories because the executable is not installed.
