package main

import (
	"io/fs"
	"log"
	"net/http"
	"strings"

	"vue-pact-go-rest/api/internal/gen"
	"vue-pact-go-rest/api/internal/handler"
	"vue-pact-go-rest/api/internal/repository"
	apistatic "vue-pact-go-rest/api/internal/static"
)

// newServer wires up the repository, handler, and middleware and returns
// a ready-to-use http.Handler.
func newServer() http.Handler {
	repo := repository.NewStaticRecipeRepository()
	h := handler.NewRecipeHandler(repo)
	strict := gen.NewStrictHandler(h, nil)

	// Build the OpenAPI handler without per-operation middleware.
	openapiHandler := gen.HandlerWithOptions(strict, gen.StdHTTPServerOptions{})

	imgFS, err := fs.Sub(apistatic.Images, "images")
	if err != nil {
		log.Fatalf("static images: %v", err)
	}
	fileServer := http.StripPrefix("/images/", http.FileServer(http.FS(imgFS)))

	mux := http.NewServeMux()
	mux.Handle("/images/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/") {
			http.NotFound(w, r)
			return
		}
		fileServer.ServeHTTP(w, r)
	}))
	mux.Handle("/", openapiHandler)

	// Wrap the entire handler with CORS and logging so they apply to all
	// requests, including OPTIONS preflight and unmatched routes.
	wrapped := http.Handler(mux)
	wrapped = handler.CORSMiddleware(wrapped)
	wrapped = handler.LoggingMiddleware(wrapped)
	return wrapped
}
