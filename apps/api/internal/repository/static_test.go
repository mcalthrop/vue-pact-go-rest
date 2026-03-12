package repository_test

import (
	"testing"

	"github.com/mcalthrop/vue-pact-go-rest/api/internal/repository"
)

func TestListRecipes(t *testing.T) {
	repo := repository.NewStaticRecipeRepository()

	summaries, err := repo.ListRecipes()
	if err != nil {
		t.Fatalf("ListRecipes() returned unexpected error: %v", err)
	}
	if len(summaries) == 0 {
		t.Fatal("ListRecipes() returned no recipes")
	}
	for _, s := range summaries {
		if s.Id == "" {
			t.Error("recipe summary has empty ID")
		}
		if s.Name == "" {
			t.Error("recipe summary has empty Name")
		}
		if s.Summary == "" {
			t.Error("recipe summary has empty Summary")
		}
		if s.PhotoUrl == "" {
			t.Error("recipe summary has empty PhotoUrl")
		}
	}
}

func TestGetRecipe_Found(t *testing.T) {
	repo := repository.NewStaticRecipeRepository()

	summaries, _ := repo.ListRecipes()
	firstID := summaries[0].Id

	recipe, err := repo.GetRecipe(firstID)
	if err != nil {
		t.Fatalf("GetRecipe(%q) returned unexpected error: %v", firstID, err)
	}
	if recipe.Id != firstID {
		t.Errorf("GetRecipe(%q) returned recipe with ID %q", firstID, recipe.Id)
	}
	if recipe.Description == "" {
		t.Error("recipe has empty Description")
	}
	if len(recipe.Ingredients) == 0 {
		t.Error("recipe has no Ingredients")
	}
	if len(recipe.Instructions) == 0 {
		t.Error("recipe has no Instructions")
	}
}

func TestGetRecipe_NotFound(t *testing.T) {
	repo := repository.NewStaticRecipeRepository()

	recipe, err := repo.GetRecipe("does-not-exist")
	if err == nil {
		t.Fatal("GetRecipe() expected an error for unknown ID, got nil")
	}
	if recipe != nil {
		t.Error("GetRecipe() expected nil recipe for unknown ID")
	}
}

func TestGetRecipe_AllSeedRecipes(t *testing.T) {
	repo := repository.NewStaticRecipeRepository()

	summaries, _ := repo.ListRecipes()
	for _, s := range summaries {
		recipe, err := repo.GetRecipe(s.Id)
		if err != nil {
			t.Errorf("GetRecipe(%q) returned unexpected error: %v", s.Id, err)
			continue
		}
		if recipe.Id != s.Id {
			t.Errorf("GetRecipe(%q) returned recipe with wrong ID %q", s.Id, recipe.Id)
		}
	}
}
