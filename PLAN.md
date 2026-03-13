# Plan

This plan breaks the project into phases with tasks and subtasks. Each subtask is sized for a single, focused PR.

Status legend: `[ ]` = not started, `[x]` = completed, `[-]` = in progress

## Conventions

- **npm/pnpm package versions**: always pin to exact latest versions (no `^` or `~`); update to latest before adding any new dependency

---

## Phase 1: Monorepo Setup

### Task 1.1: Initialise Turborepo monorepo

- [x] 1.1.1 Create root `package.json` with pnpm workspaces (`apps/frontend`, `apps/api`) and Turborepo dev dependency (pinned exact version)
- [x] 1.1.2 Create `turbo.json` with pipeline definitions for `build`, `test`, `lint`, `format`
- [x] 1.1.3 Add `.nvmrc` and `engines` field in root `package.json` specifying required Node version
- [x] 1.1.4 Add root `README.md` describing the monorepo structure and how to run each workspace
- [x] 1.1.5 Add `.gitignore` appropriate for Node, Go, and IDE artefacts

---

## Phase 2: OpenAPI Specification

### Task 2.1: Create and validate the OpenAPI spec

- [x] 2.1.1 Create `openapi/openapi.yaml` defining schemas: `Recipe` (id, name, summary, description, photo_url, ingredients, instructions) and `RecipeList`
- [x] 2.1.2 Define endpoints: `GET /recipes` (list) and `GET /recipes/{id}` (detail) with request/response schemas and error responses
- [x] 2.1.3 Add a script (or CI step) to validate the OpenAPI spec with a linter (e.g. `spectral`)

---

## Phase 3: Go REST API

### Task 3.1: Set up Go project structure

- [x] 3.1.1 Initialise Go module under `apps/api`; set up directory layout (`cmd/server`, `internal/handler`, `internal/repository`, `internal/model`)
- [x] 3.1.2 Add `Makefile` with targets: `build`, `test`, `lint`, `coverage`, `run`
- [x] 3.1.3 Add `apps/api/README.md` with setup, run, and test instructions

### Task 3.2: Implement data models and static repository

- [x] 3.2.1 Define Go structs in `internal/model` that mirror the OpenAPI `Recipe` schema
- [x] 3.2.2 Define `RecipeRepository` interface in `internal/repository` (abstraction layer)
- [x] 3.2.3 Implement `StaticRecipeRepository` with at least 4 seed bread recipes including photo URLs
- [x] 3.2.4 Write unit tests for `StaticRecipeRepository` (100% coverage)

### Task 3.3: Implement HTTP handlers

- [x] 3.3.1 Implement `GET /recipes` handler returning all recipes as JSON
- [x] 3.3.2 Implement `GET /recipes/{id}` handler returning a single recipe or 404
- [x] 3.3.3 Write unit tests for both handlers using mocked repository (100% coverage)
- [x] 3.3.4 Add middleware: CORS headers, JSON content-type, basic request logging

### Task 3.4: Wire up HTTP server

- [x] 3.4.1 Implement `cmd/server/main.go` wiring router, repository, and handlers
- [x] 3.4.2 Add integration smoke test confirming server starts and responds to both endpoints

### Task 3.5: Linting and formatting

- [x] 3.5.1 Add `golangci-lint` config (`.golangci.yml`) with `gofmt`, `goimports`, `govet`, `errcheck` enabled
- [x] 3.5.2 Verify all code passes linting and formatting checks; add `lint` Makefile target

---

## Phase 4: Vue Front End

### Task 4.1: Set up Vue project

- [x] 4.1.1 Scaffold Vue 3 + TypeScript project with Vite under `apps/frontend` using pnpm; pin all dependencies to exact versions (no `^` or `~`)
- [x] 4.1.2 Add `.nvmrc` and `engines` field in `apps/frontend/package.json`
- [x] 4.1.3 Add `apps/frontend/README.md` with setup, dev server, test, and build instructions

### Task 4.2: Generate TypeScript types from OpenAPI spec

- [x] 4.2.1 Add `openapi-typescript` (exact version) as a dev dependency; add a `generate:types` script to regenerate types from `openapi/openapi.yaml`
- [x] 4.2.2 Commit generated `src/types/api.gen.ts` and document regeneration process in README

### Task 4.3: Implement API client

- [x] 4.3.1 Implement typed API functions in `src/api/` using the generated types: `baseUrl.ts`, `fetchRecipes.ts`, `fetchRecipe.ts` (one function per file)
- [x] 4.3.2 Write unit tests for the API client with mocked `fetch` (100% coverage)

### Task 4.4: Implement routing and pages

- [x] 4.4.1 Set up Vue Router with two routes: `/` (Home) and `/recipes/:id` (Recipe detail)
- [x] 4.4.2 Implement `HomeView.vue`: fetches and displays a grid/list of recipes with photo, name, and summary; each card links to the recipe detail page
- [x] 4.4.3 Implement `RecipeView.vue`: fetches and displays full recipe details including larger photo, ingredients list, and instructions
- [x] 4.4.4 Implement a `RecipeCard.vue` component used by `HomeView`
- [x] 4.4.5 Write unit tests for all components and views (100% coverage)

### Task 4.5: Styling

- [x] 4.5.1 Define a clean, minimalist, responsive CSS design system (CSS variables for colour palette, typography, spacing) appropriate for a bread/baking site
- [x] 4.5.2 Apply styles to `HomeView`, `RecipeView`, and `RecipeCard`; ensure responsiveness on mobile, tablet, and desktop breakpoints

### Task 4.6: Linting, formatting, and Husky hooks

- [x] 4.6.1 Configure ESLint with `@typescript-eslint` and Vue recommended rules; configure Prettier; add `eslint.config.ts` and `.prettierrc`
- [x] 4.6.2 Add Husky: `pre-commit` hook runs `lint-staged`; `pre-push` hook runs full test suite and checks generated TS types are in sync with the OpenAPI spec
- [x] 4.6.3 Add `lint-staged` to run oxlint, ESLint, and Prettier on staged files during pre-commit

### Task 4.7: Test coverage

- [x] 4.7.1 Configure Vitest with `@vitest/coverage-v8`; add `coverage` script enforcing 100% threshold in `vite.config.ts`

### Task 4.8: MSW API mocking

- [x] 4.8.1 Replace `vi.stubGlobal('fetch', ...)` in API unit tests with MSW (`msw/node` `setupServer`); add `src/mocks/handlers.ts` and `src/mocks/server.ts`

### Task 4.9: knip

- [x] 4.9.1 Add `knip` to detect unused exports, dependencies, and files; add `knip` script to `package.json`; configure to exclude generated and test-infrastructure files

### Task 4.10: TypeScript `@` alias and import lint rule

- [x] 4.10.1 Enforce `@/` alias for all cross-directory imports; add `import/no-relative-parent-imports` oxlint rule to prevent `../` imports; convert all existing `../` imports to `@/`

---

## Phase 5: Pact Contract Testing

### Task 5.1: Self-hosted Pact Broker

- [x] 5.1.1 Add `docker-compose.yml` at repo root to spin up Pact Broker (PostgreSQL + Pact Broker image) with documented environment variables
- [x] 5.1.2 Add Broker setup instructions to root `README.md`

### Task 5.2: Pact consumer tests (Vue front end)

- [x] 5.2.1 Add `@pact-foundation/pact` (exact version) to `apps/frontend` dev dependencies
- [x] 5.2.2 Write Pact consumer tests for `fetchRecipes()` and `fetchRecipe(id)` defining expected interactions
- [x] 5.2.3 Add `pact:publish` script to publish generated pacts to the Pact Broker

### Task 5.3: Pact provider verification (Go API)

- [x] 5.3.1 Add `pact-go` dependency to `apps/api`; write provider verification test that fetches pacts from the Broker and verifies against the running API
- [x] 5.3.2 Add `pact:verify` Makefile target

---

## Phase 6: GitHub Actions CI/CD

### Task 6.1: Front end CI workflow

- [x] 6.1.1 Create `.github/workflows/frontend.yml`: enforce Node version, install deps, lint, format check, test with coverage (fail if < 100%), build
- [x] 6.1.2 Add Pact consumer publish step to the front end workflow (on push to main)

### Task 6.2: Back end CI workflow

- [x] 6.2.1 Create `.github/workflows/api.yml`: set up Go, run `golangci-lint`, run tests with coverage (fail if < 100%), build binary
- [x] 6.2.2 Add generated-types drift check: run `make generate` then `git diff --exit-code apps/api/internal/gen/` to fail the build if generated code is out of sync with the OpenAPI spec
- [x] 6.2.3 Add Pact provider verification step to the API workflow (on push to main, after consumer publishes)

### Task 6.3: Deployment workflow

- [x] 6.3.1 Create `.github/workflows/deploy.yml` triggered after both CI workflows pass on `main`; deploy front end (e.g. to Vercel/Netlify) and API (e.g. to Fly.io/Render) — stubs with TODO placeholders until target platform is chosen

### Task 6.4: Pact testing on PRs

- [x] 6.4.1 Run Pact consumer tests on every PR (not just main); publish pacts to broker tagged with the PR branch name and commit SHA
- [x] 6.4.2 Run Pact provider verification on every PR: start the API locally in the CI runner (no deployment needed) and verify against the published pacts for the PR branch; publish verification results with branch and SHA
- [x] 6.4.3 Update `pipeline.yml` so the `pact` job runs on PRs as well as `main`; adjust `wc-pact.yml` to pass branch and SHA to `PACT_PROVIDER_BRANCH` and `PACT_PROVIDER_VERSION`

---

## Phase 7: Ephemeral Environments

### Task 7.1: Platform setup

- [ ] 7.1.1 Choose and configure hosting platforms: Railway for the Go API, Vercel for the Vue frontend; add required secrets (`RAILWAY_TOKEN`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) to GitHub repository settings
- [ ] 7.1.2 Make the API's base URL configurable at runtime via an environment variable (e.g. `PORT`); make the frontend's API base URL configurable at build time via `VITE_API_BASE_URL`

### Task 7.2: Ephemeral deployment workflow

- [ ] 7.2.1 Add `wc-deploy-ephemeral.yml`: deploy the API to Railway as a PR-scoped environment; capture the preview URL as a job output
- [ ] 7.2.2 Deploy the frontend to Vercel with `VITE_API_BASE_URL` set to the Railway preview URL from 7.2.1; post both preview URLs as a PR comment
- [ ] 7.2.3 Add a `pull_request` (type: `closed`) workflow step to tear down the Railway ephemeral environment when a PR is merged or closed

### Task 7.3: Pact provider verification against deployed API

- [ ] 7.3.1 Update the Go provider verification test to accept `PACT_PROVIDER_BASE_URL` from the environment (falling back to `http://localhost:PORT` for local runs); remove any logic that starts a local server inside the test
- [ ] 7.3.2 In the ephemeral deployment workflow, after the API is deployed, run `pact:provider-verify` with `PACT_PROVIDER_BASE_URL` set to the Railway preview URL; publish results with the PR branch and SHA
