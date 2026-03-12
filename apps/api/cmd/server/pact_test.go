//go:build pact

package main

import (
	"fmt"
	"net/http/httptest"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"testing"

	"github.com/pact-foundation/pact-go/v2/models"
	"github.com/pact-foundation/pact-go/v2/provider"
)

func TestPactProviderVerification(t *testing.T) {
	srv := httptest.NewServer(newServer())
	defer srv.Close()

	publishResults, _ := strconv.ParseBool(os.Getenv("PACT_PUBLISH_RESULTS"))

	version, err := providerVersion()
	if err != nil && publishResults {
		t.Fatalf("cannot publish verification results: %v", err)
	}

	verifier := provider.NewVerifier()

	err = verifier.VerifyProvider(t, provider.VerifyRequest{
		Provider:        "go-api",
		ProviderBaseURL: srv.URL,

		BrokerURL:      envOrDefault("PACT_BROKER_URL", "http://localhost:9292"),
		BrokerUsername: envOrDefault("PACT_BROKER_USERNAME", "pact"),
		BrokerPassword: envOrDefault("PACT_BROKER_PASSWORD", "pact"),

		ConsumerVersionSelectors: []provider.Selector{
			&provider.ConsumerVersionSelector{MainBranch: true},
		},
		FailIfNoPactsFound: true,

		StateHandlers: models.StateHandlers{
			"recipes exist":                        noopStateHandler,
			"recipe sourdough-boule exists":        noopStateHandler,
			"recipe unknown-recipe does not exist": noopStateHandler,
		},

		PublishVerificationResults: publishResults,
		ProviderVersion:            version,
	})
	if err != nil {
		t.Fatal(err)
	}
}

func noopStateHandler(_ bool, _ models.ProviderState) (models.ProviderStateResponse, error) {
	return models.ProviderStateResponse{}, nil
}

func envOrDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

// providerVersion returns the current git commit SHA, or falls back to the
// PACT_PROVIDER_VERSION environment variable. Returns an error if neither is
// available (e.g. running from a source archive without a .git directory).
func providerVersion() (string, error) {
	if v := os.Getenv("PACT_PROVIDER_VERSION"); v != "" {
		return v, nil
	}
	out, err := exec.Command("git", "rev-parse", "HEAD").Output()
	if err != nil {
		return "", fmt.Errorf("could not determine provider version: set PACT_PROVIDER_VERSION or ensure git is available")
	}
	return strings.TrimSpace(string(out)), nil
}
