package handler_test

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/mcalthrop/vue-pact-go-rest/api/internal/gen"
	"github.com/mcalthrop/vue-pact-go-rest/api/internal/handler"
	"github.com/mcalthrop/vue-pact-go-rest/api/internal/repository"
)

// mockRepository is a test double for repository.RecipeRepository.
type mockRepository struct {
	listRecipesFunc func() ([]gen.RecipeSummary, error)
	getRecipeFunc   func(id string) (*gen.Recipe, error)
}

func (m *mockRepository) ListRecipes() ([]gen.RecipeSummary, error) {
	return m.listRecipesFunc()
}

func (m *mockRepository) GetRecipe(id string) (*gen.Recipe, error) {
	return m.getRecipeFunc(id)
}

// --- Handler tests ---

func TestListRecipes_Success(t *testing.T) {
	summaries := []gen.RecipeSummary{
		{Id: "foo", Name: "Foo", Summary: "A foo recipe", PhotoUrl: "https://example.com/foo.jpg"},
	}
	repo := &mockRepository{
		listRecipesFunc: func() ([]gen.RecipeSummary, error) { return summaries, nil },
	}
	h := handler.NewRecipeHandler(repo)

	resp, err := h.ListRecipes(context.Background(), gen.ListRecipesRequestObject{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	got, ok := resp.(gen.ListRecipes200JSONResponse)
	if !ok {
		t.Fatalf("expected ListRecipes200JSONResponse, got %T", resp)
	}
	if len(got.Recipes) != 1 {
		t.Errorf("expected 1 recipe, got %d", len(got.Recipes))
	}
	if got.Recipes[0].Id != "foo" {
		t.Errorf("expected recipe Id %q, got %q", "foo", got.Recipes[0].Id)
	}
}

func TestListRecipes_RepoError(t *testing.T) {
	repo := &mockRepository{
		listRecipesFunc: func() ([]gen.RecipeSummary, error) {
			return nil, errors.New("db error")
		},
	}
	h := handler.NewRecipeHandler(repo)

	resp, err := h.ListRecipes(context.Background(), gen.ListRecipesRequestObject{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	got, ok := resp.(gen.ListRecipes500JSONResponse)
	if !ok {
		t.Fatalf("expected ListRecipes500JSONResponse, got %T", resp)
	}
	if got.Code != 500 {
		t.Errorf("expected code 500, got %d", got.Code)
	}
	if got.Message != "internal server error" {
		t.Errorf("expected generic error message, got %q", got.Message)
	}
}

func TestGetRecipe_Success(t *testing.T) {
	recipe := &gen.Recipe{Id: "foo", Name: "Foo", Summary: "s", PhotoUrl: "p", Description: "d"}
	repo := &mockRepository{
		getRecipeFunc: func(id string) (*gen.Recipe, error) { return recipe, nil },
	}
	h := handler.NewRecipeHandler(repo)

	resp, err := h.GetRecipe(context.Background(), gen.GetRecipeRequestObject{Id: "foo"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	got, ok := resp.(gen.GetRecipe200JSONResponse)
	if !ok {
		t.Fatalf("expected GetRecipe200JSONResponse, got %T", resp)
	}
	if got.Id != "foo" {
		t.Errorf("expected Id %q, got %q", "foo", got.Id)
	}
}

func TestGetRecipe_NotFound(t *testing.T) {
	repo := &mockRepository{
		getRecipeFunc: func(id string) (*gen.Recipe, error) {
			return nil, fmt.Errorf("%w: %s", repository.ErrRecipeNotFound, id)
		},
	}
	h := handler.NewRecipeHandler(repo)

	resp, err := h.GetRecipe(context.Background(), gen.GetRecipeRequestObject{Id: "missing"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	got, ok := resp.(gen.GetRecipe404JSONResponse)
	if !ok {
		t.Fatalf("expected GetRecipe404JSONResponse, got %T", resp)
	}
	if got.Code != 404 {
		t.Errorf("expected code 404, got %d", got.Code)
	}
	if got.Message != "recipe not found" {
		t.Errorf("expected stable 404 message, got %q", got.Message)
	}
}

func TestGetRecipe_RepoError(t *testing.T) {
	repo := &mockRepository{
		getRecipeFunc: func(id string) (*gen.Recipe, error) {
			return nil, errors.New("db error")
		},
	}
	h := handler.NewRecipeHandler(repo)

	resp, err := h.GetRecipe(context.Background(), gen.GetRecipeRequestObject{Id: "foo"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	got, ok := resp.(gen.GetRecipe500JSONResponse)
	if !ok {
		t.Fatalf("expected GetRecipe500JSONResponse, got %T", resp)
	}
	if got.Code != 500 {
		t.Errorf("expected code 500, got %d", got.Code)
	}
	if got.Message != "internal server error" {
		t.Errorf("expected generic error message, got %q", got.Message)
	}
}

// --- Middleware tests ---

func TestCORSMiddleware_SetsHeaders(t *testing.T) {
	inner := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	mw := handler.CORSMiddleware(inner)

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/recipes", nil)
	mw.ServeHTTP(w, r)

	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "*" {
		t.Errorf("expected Access-Control-Allow-Origin *, got %q", got)
	}
	if got := w.Header().Get("Access-Control-Allow-Methods"); got != "GET, OPTIONS" {
		t.Errorf("unexpected Access-Control-Allow-Methods: %q", got)
	}
	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}

func TestCORSMiddleware_Options(t *testing.T) {
	inner := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.Error("inner handler should not be called for OPTIONS preflight")
	})
	mw := handler.CORSMiddleware(inner)

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodOptions, "/recipes", nil)
	mw.ServeHTTP(w, r)

	if w.Code != http.StatusNoContent {
		t.Errorf("expected 204, got %d", w.Code)
	}
}

func TestLoggingMiddleware(t *testing.T) {
	called := false
	inner := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		called = true
		w.WriteHeader(http.StatusOK)
	})
	// Discard log output during test.
	log.SetOutput(io.Discard)
	defer log.SetOutput(os.Stderr)

	mw := handler.LoggingMiddleware(inner)

	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/recipes", nil)
	mw.ServeHTTP(w, r)

	if !called {
		t.Error("inner handler was not called by LoggingMiddleware")
	}
}
