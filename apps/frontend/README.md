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

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server (hot-reload) |
| `pnpm build` | Type-check and compile for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm test` | Run unit tests once (Vitest) |
| `pnpm test:watch` | Run unit tests in watch mode |
| `pnpm type-check` | Run `vue-tsc` type checking |
| `pnpm lint` | Run oxlint + ESLint with auto-fix |

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
