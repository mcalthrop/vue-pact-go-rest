package repository_test

import (
	"errors"
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
			t.Error("recipe summary has empty Id")
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

	summaries, err := repo.ListRecipes()
	if err != nil {
		t.Fatalf("ListRecipes() returned unexpected error: %v", err)
	}
	if len(summaries) == 0 {
		t.Fatal("ListRecipes() returned no recipes; cannot test GetRecipe")
	}
	firstID := summaries[0].Id

	recipe, err := repo.GetRecipe(firstID)
	if err != nil {
		t.Fatalf("GetRecipe(%q) returned unexpected error: %v", firstID, err)
	}
	if recipe == nil {
		t.Fatalf("GetRecipe(%q) returned nil recipe", firstID)
	}
	if recipe.Id != firstID {
		t.Errorf("GetRecipe(%q) returned recipe with Id %q", firstID, recipe.Id)
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
	if !errors.Is(err, repository.ErrRecipeNotFound) {
		t.Errorf("GetRecipe() expected ErrRecipeNotFound, got %v", err)
	}
	if recipe != nil {
		t.Error("GetRecipe() expected nil recipe for unknown ID")
	}
}

func TestGetRecipe_AllSeedRecipes(t *testing.T) {
	repo := repository.NewStaticRecipeRepository()

	summaries, err := repo.ListRecipes()
	if err != nil {
		t.Fatalf("ListRecipes() returned unexpected error: %v", err)
	}
	for _, s := range summaries {
		recipe, err := repo.GetRecipe(s.Id)
		if err != nil {
			t.Errorf("GetRecipe(%q) returned unexpected error: %v", s.Id, err)
			continue
		}
		if recipe == nil {
			t.Errorf("GetRecipe(%q) returned nil recipe", s.Id)
			continue
		}
		if recipe.Id != s.Id {
			t.Errorf("GetRecipe(%q) returned recipe with wrong Id %q", s.Id, recipe.Id)
		}
	}
}

func TestGetRecipe_ReturnsCopy(t *testing.T) {
	repo := repository.NewStaticRecipeRepository()

	r1, _ := repo.GetRecipe("sourdough-boule")
	r2, _ := repo.GetRecipe("sourdough-boule")
	if r1 == r2 {
		t.Error("GetRecipe() returned the same pointer on two calls; expected independent copies")
	}
}
