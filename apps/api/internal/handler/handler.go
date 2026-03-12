package handler

import (
	"context"
	"errors"

	"github.com/mcalthrop/vue-pact-go-rest/api/internal/gen"
	"github.com/mcalthrop/vue-pact-go-rest/api/internal/repository"
)

var _ gen.StrictServerInterface = (*RecipeHandler)(nil)

// RecipeHandler implements gen.StrictServerInterface using a RecipeRepository.
type RecipeHandler struct {
	repo repository.RecipeRepository
}

// NewRecipeHandler creates a RecipeHandler backed by the given repository.
func NewRecipeHandler(repo repository.RecipeRepository) *RecipeHandler {
	return &RecipeHandler{repo: repo}
}

// ListRecipes handles GET /recipes.
func (h *RecipeHandler) ListRecipes(_ context.Context, _ gen.ListRecipesRequestObject) (gen.ListRecipesResponseObject, error) {
	summaries, err := h.repo.ListRecipes()
	if err != nil {
		return gen.ListRecipes500JSONResponse{Code: 500, Message: err.Error()}, nil
	}
	return gen.ListRecipes200JSONResponse{Recipes: summaries}, nil
}

// GetRecipe handles GET /recipes/{id}.
func (h *RecipeHandler) GetRecipe(_ context.Context, request gen.GetRecipeRequestObject) (gen.GetRecipeResponseObject, error) {
	recipe, err := h.repo.GetRecipe(request.Id)
	if err != nil {
		if errors.Is(err, repository.ErrRecipeNotFound) {
			return gen.GetRecipe404JSONResponse{Code: 404, Message: err.Error()}, nil
		}
		return gen.GetRecipe500JSONResponse{Code: 500, Message: err.Error()}, nil
	}
	return gen.GetRecipe200JSONResponse(*recipe), nil
}
