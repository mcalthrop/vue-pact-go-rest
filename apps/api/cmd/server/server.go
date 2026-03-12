package main

import (
	"net/http"

	"github.com/mcalthrop/vue-pact-go-rest/api/internal/gen"
	"github.com/mcalthrop/vue-pact-go-rest/api/internal/handler"
	"github.com/mcalthrop/vue-pact-go-rest/api/internal/repository"
)

// newServer wires up the repository, handler, and middleware and returns
// a ready-to-use http.Handler.
func newServer() http.Handler {
	repo := repository.NewStaticRecipeRepository()
	h := handler.NewRecipeHandler(repo)
	strict := gen.NewStrictHandler(h, nil)

	// Build the OpenAPI handler without per-operation middleware.
	openapiHandler := gen.HandlerWithOptions(strict, gen.StdHTTPServerOptions{})

	// Wrap the entire handler with CORS and logging so they apply to all
	// requests, including OPTIONS preflight and unmatched routes.
	wrapped := openapiHandler
	wrapped = handler.CORSMiddleware(wrapped)
	wrapped = handler.LoggingMiddleware(wrapped)
	return wrapped
}
