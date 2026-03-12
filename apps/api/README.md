# Bread Recipes API

Go REST API serving bread recipe data, driven by the OpenAPI spec at [`openapi/openapi.yaml`](../../openapi/openapi.yaml).

## Prerequisites

- [Go](https://go.dev/) >= 1.25
- [golangci-lint](https://golangci-lint.run/) — for linting

## Directory structure

```
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
|---|---|
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
