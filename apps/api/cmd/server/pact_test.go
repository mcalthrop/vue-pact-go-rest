//go:build pact

package main

import (
	"net/http/httptest"
	"os"
	"os/exec"
	"strings"
	"testing"

	"github.com/pact-foundation/pact-go/v2/models"
	"github.com/pact-foundation/pact-go/v2/provider"
)

func TestPactProviderVerification(t *testing.T) {
	srv := httptest.NewServer(newServer())
	defer srv.Close()

	verifier := provider.NewVerifier()

	err := verifier.VerifyProvider(t, provider.VerifyRequest{
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
			"recipes exist": noopStateHandler,
			"recipe sourdough-boule exists":      noopStateHandler,
			"recipe unknown-recipe does not exist": noopStateHandler,
		},

		PublishVerificationResults: os.Getenv("PACT_PUBLISH_RESULTS") == "true",
		ProviderVersion:            providerVersion(),
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

func providerVersion() string {
	if v := os.Getenv("PACT_PROVIDER_VERSION"); v != "" {
		return v
	}
	out, err := exec.Command("git", "rev-parse", "HEAD").Output()
	if err != nil {
		return "unknown"
	}
	return strings.TrimSpace(string(out))
}
