# Bread Recipes API

Go REST API serving bread recipe data, driven by the OpenAPI spec at [`openapi/openapi.yaml`](../../openapi/openapi.yaml).

## Prerequisites

- [Go](https://go.dev/) >= 1.25
- [golangci-lint](https://golangci-lint.run/) v2 — for linting (`brew install golangci-lint`)
- [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen) v2 — for regenerating Go types from the OpenAPI spec (no separate install needed; `make generate` uses `go tool` with the version pinned in `go.mod`)
- `libpact_ffi` — native library required for Pact provider verification (one-time install; see [Pact provider verification](#pact-provider-verification) below)

## Directory structure

```txt
apps/api/
├── cmd/
│   └── server/       # Entry point (main package)
├── internal/
│   ├── handler/      # HTTP request handlers
│   ├── model/        # Data structures mirroring the OpenAPI schema
│   └── repository/   # Data access layer (interface + static implementation)
├── Makefile
└── go.mod
```

## Setup

```bash
go mod download
```

## Common commands

All commands are run from `apps/api/`.

| Command | Description |
| --- | --- |
| `make generate` | Regenerate Go types from the OpenAPI spec (uses `go tool`; version pinned in `go.mod`) |
| `make build` | Compile the binary to `bin/api` |
| `make run` | Run the server locally (port 8080) |
| `make test` | Run all unit tests |
| `make coverage` | Run tests with coverage; fails if < 100% |
| `make lint` | Run golangci-lint |
| `make clean` | Remove build artefacts |

## Running the server

```bash
make run
# Server starts at http://localhost:8080
# Recipes endpoint: http://localhost:8080/recipes
```

## Running in production

Run both the API and frontend together from the repo root:

```bash
pnpm prod
# API at http://localhost:8080, frontend at http://localhost:4173
```

To run the API alone from this workspace (requires a prior `make build` or `pnpm build`):

```bash
./bin/api
```

## Running tests

```bash
make test
```

To check coverage:

```bash
make coverage
```

## Linting

Install golangci-lint (see [installation guide](https://golangci-lint.run/usage/install/)), then:

```bash
make lint
```

## Pact provider verification

The provider verification test requires the native `libpact_ffi` library. Install it once from `apps/api/`:

```bash
PACT_LIB_DIR="${HOME}/pact-lib"
go run github.com/pact-foundation/pact-go/v2 install --libDir "${PACT_LIB_DIR}"
sudo cp "${PACT_LIB_DIR}"/libpact_ffi* /usr/local/lib/
```

Then run verification (requires the Pact Broker to be running — see repo root README):

```bash
make pact:provider-verify
```
