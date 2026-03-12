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
	return gen.HandlerWithOptions(strict, gen.StdHTTPServerOptions{
		Middlewares: []gen.MiddlewareFunc{
			handler.LoggingMiddleware,
			handler.CORSMiddleware,
		},
	})
}
