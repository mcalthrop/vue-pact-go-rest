# vue-pact-go-rest

> This repo is an exercise in vibe coding. See [VIBE.md](./VIBE.md) for more information.

A monorepo containing a VueJS front end and Go REST API, contract-tested with Pact, driven by an OpenAPI spec.

## Tech stack

| Layer            | Technology                  |
| ---------------- | --------------------------- |
| Front end        | Vue 3 + TypeScript + Vite   |
| Back end         | Go REST API                 |
| API spec         | OpenAPI 3.x                 |
| Contract testing | Pact (self-hosted broker)   |
| Monorepo         | Turborepo + pnpm workspaces |
| CI/CD            | GitHub Actions              |

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) — Node version manager
- [pnpm](https://pnpm.io/) >= 10.18.1
- [Go](https://go.dev/) >= 1.25
- [Docker](https://www.docker.com/) — runs the self-hosted Pact Broker (see [Pact contract testing](#pact-contract-testing))

## Node version

This project requires the node version specified in `.nvmrc`. Install and activate it with [nvm](https://github.com/nvm-sh/nvm):

```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Install and use the required Node version
nvm install
```

## Workspaces

| Path            | Description                                            |
| --------------- | ------------------------------------------------------ |
| `apps/frontend` | Vue 3 front end                                        |
| `apps/api`      | Go REST API (also serves recipe images at `/images/*`) |
| `openapi/`      | OpenAPI specification                                  |

## Setup

```bash
# Install Node version
nvm install

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

# Run tests with coverage (must be 100%)
pnpm coverage

# Lint all workspaces
pnpm lint

# Format all workspaces (writes changes)
pnpm format

# Check formatting without writing changes
pnpm format:check

# Start dev servers
pnpm dev

# Build and start production servers (API on :8080, frontend on :4173)
pnpm prod
```

## Code generation

TypeScript (frontend) and Go (API) types are generated from the OpenAPI spec. Run after any spec change:

```bash
pnpm generate:types
```

To validate the OpenAPI spec:

```bash
pnpm openapi:validate
```

## Pact contract testing

The self-hosted Pact Broker runs via Docker Compose (PostgreSQL + Pact Broker) and must be running before consumer publish or provider verify commands are executed.

| Setting  | Value                   |
| -------- | ----------------------- |
| URL      | `http://localhost:9292` |
| Username | `pact`                  |
| Password | `pact`                  |

> These credentials are development-only defaults. Do not reuse them in shared or production environments.

To run the full consumer-publish + provider-verify cycle in one command:

```bash
pnpm pact:verify
```

Each separate step:

```bash
# Start the broker (waits until healthy)
docker compose up --detach --wait

# Generate and publish consumer pacts
pnpm pact:consumer-test
pnpm pact:consumer-publish

# Verify the provider against published pacts
pnpm pact:provider-verify

# Stop the broker (data preserved in postgres_data volume)
docker compose down

# Stop and wipe all data
docker compose down --volumes
```
