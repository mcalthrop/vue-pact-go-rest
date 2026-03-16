package main

import (
	"encoding/json"
	"io"
	"io/fs"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"vue-pact-go-rest/api/internal/gen"
	apistatic "vue-pact-go-rest/api/internal/static"
)

func TestMain(m *testing.M) {
	// Suppress log output during tests.
	log.SetOutput(io.Discard)
	os.Exit(m.Run())
}

func newTestServer(t *testing.T) *httptest.Server {
	t.Helper()
	imgFS, err := fs.Sub(apistatic.Images, "images")
	if err != nil {
		t.Fatalf("fs.Sub: %v", err)
	}
	srv := httptest.NewServer(newServer(imgFS))
	t.Cleanup(srv.Close)
	return srv
}

func TestNewServer_ListRecipes(t *testing.T) {
	srv := newTestServer(t)

	resp, err := http.Get(srv.URL + "/recipes")
	if err != nil {
		t.Fatalf("GET /recipes: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}
	if ct := resp.Header.Get("Content-Type"); ct != "application/json" {
		t.Errorf("expected Content-Type application/json, got %q", ct)
	}

	var body gen.RecipeList
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if len(body.Recipes) == 0 {
		t.Error("expected at least one recipe in response")
	}
}

func TestNewServer_GetRecipe_Found(t *testing.T) {
	srv := newTestServer(t)

	resp, err := http.Get(srv.URL + "/recipes/sourdough-boule")
	if err != nil {
		t.Fatalf("GET /recipes/sourdough-boule: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	var body gen.Recipe
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if body.Id != "sourdough-boule" {
		t.Errorf("expected id sourdough-boule, got %q", body.Id)
	}
}

func TestNewServer_GetRecipe_NotFound(t *testing.T) {
	srv := newTestServer(t)

	resp, err := http.Get(srv.URL + "/recipes/does-not-exist")
	if err != nil {
		t.Fatalf("GET /recipes/does-not-exist: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404, got %d", resp.StatusCode)
	}

	var body gen.Error
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if body.Code != 404 {
		t.Errorf("expected error code 404, got %d", body.Code)
	}
}

func TestNewServer_CORSHeaders(t *testing.T) {
	srv := newTestServer(t)

	resp, err := http.Get(srv.URL + "/recipes")
	if err != nil {
		t.Fatalf("GET /recipes: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if got := resp.Header.Get("Access-Control-Allow-Origin"); got != "*" {
		t.Errorf("expected Access-Control-Allow-Origin *, got %q", got)
	}
}

func TestNewServer_Images_ServesFile(t *testing.T) {
	srv := newTestServer(t)

	resp, err := http.Get(srv.URL + "/images/sourdough-boule.jpg")
	if err != nil {
		t.Fatalf("GET /images/sourdough-boule.jpg: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}
	if ct := resp.Header.Get("Content-Type"); ct != "image/jpeg" {
		t.Errorf("expected Content-Type image/jpeg, got %q", ct)
	}
}

func TestNewServer_Images_NoDirectoryListing(t *testing.T) {
	srv := newTestServer(t)

	resp, err := http.Get(srv.URL + "/images/")
	if err != nil {
		t.Fatalf("GET /images/: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusNotFound {
		t.Fatalf("expected 404 for directory listing, got %d", resp.StatusCode)
	}
}

func TestNewServer_CORSPreflightOptions(t *testing.T) {
	srv := newTestServer(t)

	req, err := http.NewRequest(http.MethodOptions, srv.URL+"/recipes", nil)
	if err != nil {
		t.Fatalf("creating OPTIONS /recipes request: %v", err)
	}
	req.Header.Set("Origin", "http://example.com")
	req.Header.Set("Access-Control-Request-Method", "GET")
	req.Header.Set("Access-Control-Request-Headers", "Content-Type")

	resp, err := srv.Client().Do(req)
	if err != nil {
		t.Fatalf("OPTIONS /recipes: %v", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusNoContent {
		t.Fatalf("expected 204 for OPTIONS preflight, got %d", resp.StatusCode)
	}
	if got := resp.Header.Get("Access-Control-Allow-Origin"); got != "*" {
		t.Errorf("expected Access-Control-Allow-Origin *, got %q", got)
	}
	if got := resp.Header.Get("Access-Control-Allow-Methods"); got == "" {
		t.Error("expected Access-Control-Allow-Methods header to be set")
	}
	if got := resp.Header.Get("Access-Control-Allow-Headers"); got == "" {
		t.Error("expected Access-Control-Allow-Headers header to be set")
	}
}
