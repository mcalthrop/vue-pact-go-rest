# Bread Recipes Frontend

Vue 3 + TypeScript frontend for the Bread Recipes app, consuming the API defined in [`openapi/openapi.yaml`](../../openapi/openapi.yaml).

## Prerequisites

- Node 24.14.0 (managed via [nvm](https://github.com/nvm-sh/nvm) — run `nvm install` from the repo root)
- pnpm >= 10.18.1

## Setup

```bash
pnpm install
```

## Common commands

All commands are run from `apps/frontend/`.

| Command               | Description                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `pnpm dev`            | Start the Vite dev server (hot-reload)                                                            |
| `pnpm build`          | Type-check and compile for production                                                             |
| `pnpm prod`           | Serve the production build (run `pnpm prod` from repo root to build and start both servers)       |
| `pnpm test`           | Run unit tests once (Vitest)                                                                      |
| `pnpm test:watch`     | Run unit tests in watch mode                                                                      |
| `pnpm type-check`     | Run `vue-tsc` type checking                                                                       |
| `pnpm lint`           | Run oxlint + ESLint with auto-fix                                                                 |
| `pnpm generate:types` | Regenerate TypeScript types from `../../openapi/openapi.yaml` (repo root: `openapi/openapi.yaml`) |

## Generated types

TypeScript types in `src/types/api.gen.ts` are generated from the OpenAPI spec at `../../openapi/openapi.yaml` (relative to `apps/frontend/`; `openapi/openapi.yaml` from the repo root). Regenerate after any spec change:

```bash
pnpm generate:types
```

Do not edit `src/types/api.gen.ts` directly.

## Running the dev server

```bash
pnpm dev
# App available at http://localhost:5173
```

## Running tests

```bash
pnpm test
```

## Building for production

```bash
pnpm build
# Output in dist/
```

## Running in production

Run both the API and frontend together from the repo root:

```bash
pnpm prod
# API at http://localhost:8080, frontend at http://localhost:4173
```
