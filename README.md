# vue-pact-go-rest

A monorepo containing a VueJS front end and Go REST API, contract-tested with Pact, driven by an OpenAPI spec.

## Tech stack

| Layer | Technology |
|---|---|
| Front end | Vue 3 + TypeScript + Vite |
| Back end | Go REST API |
| API spec | OpenAPI 3.x |
| Contract testing | Pact (self-hosted broker) |
| Monorepo | Turborepo + pnpm workspaces |
| CI/CD | GitHub Actions |

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) — Node version manager
- [pnpm](https://pnpm.io/) >= 10.18.1
- [Go](https://go.dev/) >= 1.25
- [Docker](https://www.docker.com/) — for the self-hosted Pact Broker

## Node version

This project requires Node **24.14.0**. Use nvm to switch:

```bash
nvm use
```

## Workspaces

| Path | Description |
|---|---|
| `apps/frontend` | Vue 3 front end |
| `apps/api` | Go REST API |
| `openapi/` | OpenAPI specification |

## Setup

```bash
# Install Node version
nvm use

# Install all workspace dependencies
pnpm install
```

## Common commands

All commands can be run from the repo root via Turborepo, or from within each workspace directly.

```bash
# Build all workspaces
pnpm build

# Run all tests
pnpm test

# Lint all workspaces
pnpm lint

# Format all workspaces
pnpm format

# Start dev servers
pnpm dev
```

## Pact Broker

The self-hosted Pact Broker runs via Docker Compose (PostgreSQL + Pact Broker):

```bash
# Start broker in the background
docker compose up -d

# Check it is healthy
docker compose ps
```

The broker is available at `http://localhost:9292`.

| Setting | Value |
| --- | --- |
| URL | `http://localhost:9292` |
| Username | `pact` |
| Password | `pact` |

Note: These credentials are development-only defaults for local Docker Compose usage. Do not reuse them in shared, staging, or production environments; configure real credentials via environment variables (for example via a `.env` file used by `docker compose`).
Public read access is enabled so provider verification can fetch pacts without credentials. Write operations (publish) require the username/password above.

```bash
# Stop and remove containers (data is preserved in the postgres_data volume)
docker compose down

# Stop and wipe all data
docker compose down -v
```
