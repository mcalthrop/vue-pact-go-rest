BINARY_NAME := api
BUILD_DIR   := bin
CMD_DIR     := ./cmd/server

.PHONY: all build test lint coverage run clean

all: build

build:
	go build -o $(BUILD_DIR)/$(BINARY_NAME) $(CMD_DIR)

run:
	go run $(CMD_DIR)

test:
	go test ./...

coverage:
	go test -coverprofile=coverage.out ./...
	go tool cover -func=coverage.out
	@go tool cover -func=coverage.out | grep "^total:" | awk '{if ($$3 != "100.0%") {print "Coverage is " $$3 " — must be 100%"; exit 1}}'

lint:
	golangci-lint run ./...

clean:
	rm -rf $(BUILD_DIR) coverage.out
