BINARY_NAME := api
BUILD_DIR   := bin
CMD_DIR     := ./cmd/server

.PHONY: all build generate test lint coverage run clean

all: build

generate:
	oapi-codegen --config oapi-codegen.yaml ../../openapi/openapi.yaml

build:
	go build -o $(BUILD_DIR)/$(BINARY_NAME) $(CMD_DIR)

run:
	go run $(CMD_DIR)

test:
	go test ./...

coverage:
	go test -coverprofile=coverage.out ./...
	@grep -v "internal/gen/" coverage.out > coverage.filtered.out
	@go tool cover -func=coverage.filtered.out
	@TOTAL=$$(go tool cover -func=coverage.filtered.out | grep "^total:" | awk '{print $$3}'); \
	echo "Coverage (excluding generated code): $$TOTAL"; \
	if [ "$$TOTAL" != "100.0%" ]; then echo "Coverage must be 100%"; exit 1; fi

lint:
	golangci-lint run ./...

clean:
	rm -rf $(BUILD_DIR) coverage.out coverage.filtered.out
