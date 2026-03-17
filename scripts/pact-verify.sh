#!/usr/bin/env bash

set -xeuo pipefail

cd "$(dirname "$0")/.."

docker compose up --detach

for i in $(seq 1 30); do
  if wget --quiet --output-document=/dev/null http://localhost:9292/diagnostic/status/heartbeat; then
    break
  fi
  if [ "$i" -eq 30 ]; then
    exit 1
  fi
  sleep 5
done

pnpm pact:consumer-test
pnpm pact:consumer-publish
pnpm pact:provider-verify

docker compose down
