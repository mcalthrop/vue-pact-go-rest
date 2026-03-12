BINARY_NAME := api
BUILD_DIR   := bin
CMD_DIR     := ./cmd/server

.PHONY: all build generate test lint coverage run clean pact\:verify

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
	@grep -v -E "internal/gen/|cmd/server/main\.go" coverage.out > coverage.filtered.out
	@go tool cover -func=coverage.filtered.out
	@TOTAL=$$(go tool cover -func=coverage.filtered.out | grep "^total:" | awk '{print $$3}'); \
	echo "Coverage (excluding generated code): $$TOTAL"; \
	if [ "$$TOTAL" != "100.0%" ]; then echo "Coverage must be 100%"; exit 1; fi

lint:
	golangci-lint run ./...

pact\:verify:
	go test -tags pact -v -run TestPactProviderVerification $(CMD_DIR)

clean:
	rm -rf $(BUILD_DIR) coverage.out coverage.filtered.out
