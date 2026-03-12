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

The self-hosted Pact Broker runs via Docker Compose:

```bash
docker compose up -d
```

See [Phase 5 setup instructions](docs/pact-broker.md) _(coming soon)_ for configuration details.
