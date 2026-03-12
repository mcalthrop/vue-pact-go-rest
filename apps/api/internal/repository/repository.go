package repository

import "github.com/mcalthrop/vue-pact-go-rest/api/internal/gen"

// RecipeRepository is the abstraction layer for recipe data access.
// Implementations may use static data, a database, a CMS, or any other source.
type RecipeRepository interface {
	ListRecipes() ([]gen.RecipeSummary, error)
	GetRecipe(id string) (*gen.Recipe, error)
}
