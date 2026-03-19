BUILD_DIR             := ./bin
BINARY_NAME           := $(BUILD_DIR)/api
CMD_DIR               := ./cmd/server
COVERAGE_FILTERED_OUT := coverage.filtered.out
COVERAGE_OUT          := coverage.out

.PHONY: all build generate-types test lint format-check coverage dev prod clean pact-verify

all: build

generate-types:
	go tool oapi-codegen --config oapi-codegen.yaml ../../openapi/openapi.yaml

build:
	go build -o $(BINARY_NAME) $(CMD_DIR)

dev:
	go run $(CMD_DIR)

prod:
	$(BINARY_NAME)

test:
	go test ./...

coverage:
	go test -coverprofile=$(COVERAGE_OUT) ./...
	@grep -v -E "internal/gen/|cmd/server/main\.go" $(COVERAGE_OUT) > $(COVERAGE_FILTERED_OUT)
	@go tool cover -func=$(COVERAGE_FILTERED_OUT)
	@TOTAL=$$(go tool cover -func=$(COVERAGE_FILTERED_OUT) | grep "^total:" | awk '{print $$3}'); \
	echo "Coverage (excluding generated code): $$TOTAL"; \
	if [ "$$TOTAL" != "100.0%" ]; then echo "ERROR: coverage must be 100%"; exit 1; fi

lint:
	golangci-lint run ./...

format-check:
	@UNFORMATTED=$$(find . -name '*.go' -not -path './internal/gen/*' | xargs gofmt -l); \
	if [ -n "$$UNFORMATTED" ]; then \
		echo "The following files need formatting:"; \
		echo "$$UNFORMATTED"; \
		exit 1; \
	fi

pact-provider-verify:
	go test -count=1 -tags pact -v -run TestPactProviderVerification $(CMD_DIR)

clean:
	rm -rf $(BUILD_DIR) $(COVERAGE_OUT) $(COVERAGE_FILTERED_OUT)
