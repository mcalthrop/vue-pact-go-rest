package repository

import (
	"errors"

	"vue-pact-go-rest/api/internal/gen"
)

// ErrRecipeNotFound is returned by GetRecipe when no recipe matches the given id.
// Callers can use errors.Is(err, ErrRecipeNotFound) to distinguish a missing
// recipe (→ 404) from any other error.
var ErrRecipeNotFound = errors.New("recipe not found")

// RecipeRepository is the abstraction layer for recipe data access.
// Implementations may use static data, a database, a CMS, or any other source.
type RecipeRepository interface {
	ListRecipes() ([]gen.RecipeSummary, error)
	GetRecipe(id string) (*gen.Recipe, error)
}
