#!/usr/bin/env bash

set -xeuo pipefail

cd "$(dirname "$0")/.."

docker compose up --detach --wait

pnpm pact:consumer-test
pnpm pact:consumer-publish
pnpm pact:provider-verify

docker compose down
