# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Copy `apps/client/.env.example` to `apps/client/.env` and set `NUXT_PUBLIC_API_BASE_URL` for the target backend:

| Environment | `NUXT_PUBLIC_API_BASE_URL` |
| --- | --- |
| Local (default) | `http://localhost:8081/` |
| Deployed development | `https://api.dev.kolaboria.com/` |

The value is the server URL only; a trailing slash is optional. Version prefixes belong to individual paths in `apps/client/app/constants/api-endpoints.ts` (for example, `/v1/auth/login`). `useApi` and `useApiFetch` share the same server configuration, including token refresh, and preserve the version supplied by each endpoint. Set the same environment variable on the deployment when running the built server. Remove `/v1` from existing `.env` and deployment overrides to avoid repeating the prefix.

See [API base URL migration](docs/api-base-url.md) for deployment and verification notes.

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
