package repository

import (
	"fmt"

	"github.com/mcalthrop/vue-pact-go-rest/api/internal/gen"
)

var _ RecipeRepository = (*StaticRecipeRepository)(nil)

// StaticRecipeRepository implements RecipeRepository using hard-coded seed data.
type StaticRecipeRepository struct {
	recipes []gen.Recipe
}

// NewStaticRecipeRepository returns a StaticRecipeRepository pre-loaded with seed data.
func NewStaticRecipeRepository() *StaticRecipeRepository {
	return &StaticRecipeRepository{recipes: seedRecipes()}
}

// ListRecipes returns a summary of all recipes.
func (r *StaticRecipeRepository) ListRecipes() ([]gen.RecipeSummary, error) {
	summaries := make([]gen.RecipeSummary, len(r.recipes))
	for i, recipe := range r.recipes {
		summaries[i] = gen.RecipeSummary{
			Id:       recipe.Id,
			Name:     recipe.Name,
			Summary:  recipe.Summary,
			PhotoUrl: recipe.PhotoUrl,
		}
	}
	return summaries, nil
}

// GetRecipe returns the full recipe for the given id, or an error if not found.
// Returns ErrRecipeNotFound (wrapped) when no recipe matches, so callers can use errors.Is.
func (r *StaticRecipeRepository) GetRecipe(id string) (*gen.Recipe, error) {
	for _, recipe := range r.recipes {
		if recipe.Id == id {
			recipeCopy := recipe
			return &recipeCopy, nil
		}
	}
	return nil, fmt.Errorf("%w: %s", ErrRecipeNotFound, id)
}

func seedRecipes() []gen.Recipe {
	return []gen.Recipe{
		{
			Id:       "sourdough-boule",
			Name:     "Classic Sourdough Boule",
			Summary:  "A tangy, chewy sourdough loaf with a crisp, caramelised crust",
			PhotoUrl: "https://images.unsplash.com/photo-1585478259715-87b8e1e2d04b?w=800",
			Description: "A traditional sourdough boule developed over a long cold fermentation. The crust is deeply caramelised and the crumb is open and chewy with a complex, tangy flavour.",
			Ingredients: []gen.Ingredient{
				{Quantity: 450, Unit: "g", Name: "strong white bread flour"},
				{Quantity: 50, Unit: "g", Name: "wholemeal flour"},
				{Quantity: 375, Unit: "ml", Name: "water"},
				{Quantity: 100, Unit: "g", Name: "active sourdough starter"},
				{Quantity: 10, Unit: "g", Name: "fine sea salt"},
			},
			Instructions: []gen.Instruction{
				{Step: 1, Description: "Mix flours and 350 ml of the water. Cover and leave to autolyse for 30 minutes."},
				{Step: 2, Description: "Add the starter and remaining water. Mix until fully incorporated. Rest 30 minutes."},
				{Step: 3, Description: "Add the salt and dimple it in. Perform 4 sets of stretch-and-folds over 2 hours, every 30 minutes."},
				{Step: 4, Description: "Shape into a boule and place in a floured banneton. Cover and refrigerate overnight (8–16 hours)."},
				{Step: 5, Description: "Preheat oven to 250°C with a Dutch oven inside for 1 hour. Score the dough and bake covered for 20 minutes, then uncovered for 20–25 minutes until deep brown."},
			},
		},
		{
			Id:       "focaccia",
			Name:     "Focaccia",
			Summary:  "Pillowy Italian flatbread with olive oil, sea salt, and fresh rosemary",
			PhotoUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
			Description: "A light, airy Italian flatbread generously drizzled with extra-virgin olive oil and topped with flaky sea salt and rosemary. Perfect as a side or torn and dipped in oil.",
			Ingredients: []gen.Ingredient{
				{Quantity: 500, Unit: "g", Name: "strong white bread flour"},
				{Quantity: 400, Unit: "ml", Name: "warm water"},
				{Quantity: 7, Unit: "g", Name: "instant yeast"},
				{Quantity: 10, Unit: "g", Name: "fine sea salt"},
				{Quantity: 60, Unit: "ml", Name: "extra-virgin olive oil"},
				{Quantity: 2, Unit: "tsp", Name: "flaky sea salt"},
				{Quantity: 4, Unit: "sprigs", Name: "fresh rosemary"},
			},
			Instructions: []gen.Instruction{
				{Step: 1, Description: "Combine flour, yeast, and fine salt. Add water and 2 tbsp of the oil. Mix to a shaggy dough."},
				{Step: 2, Description: "Knead for 10 minutes until smooth and elastic. Place in an oiled bowl, cover, and prove for 1 hour until doubled."},
				{Step: 3, Description: "Drizzle 2 tbsp oil into a 30×20 cm tin. Transfer dough and gently stretch to fill the tin. Cover and rest 30 minutes."},
				{Step: 4, Description: "Dimple the surface deeply with your fingers. Drizzle with remaining oil, scatter with rosemary and flaky salt."},
				{Step: 5, Description: "Bake at 220°C for 20–25 minutes until golden. Cool on a wire rack for 10 minutes before slicing."},
			},
		},
		{
			Id:       "brioche",
			Name:     "Brioche",
			Summary:  "Rich, buttery French bread with a golden crust and tender, pillowy crumb",
			PhotoUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
			Description: "An enriched French bread made with plenty of butter and eggs. The dough is silky, the crust is a deep burnished gold, and the crumb is impossibly soft. Wonderful toasted with salted butter.",
			Ingredients: []gen.Ingredient{
				{Quantity: 400, Unit: "g", Name: "strong white bread flour"},
				{Quantity: 7, Unit: "g", Name: "instant yeast"},
				{Quantity: 8, Unit: "g", Name: "fine sea salt"},
				{Quantity: 50, Unit: "g", Name: "caster sugar"},
				{Quantity: 4, Unit: "pcs", Name: "large eggs"},
				{Quantity: 60, Unit: "ml", Name: "whole milk (warm)"},
				{Quantity: 200, Unit: "g", Name: "unsalted butter (softened, cubed)"},
			},
			Instructions: []gen.Instruction{
				{Step: 1, Description: "Mix flour, yeast, salt, and sugar. Add eggs and warm milk. Knead for 5 minutes."},
				{Step: 2, Description: "Add butter a few cubes at a time, kneading between additions, until fully incorporated and the dough is glossy (about 15 minutes)."},
				{Step: 3, Description: "Cover and refrigerate overnight. The dough will rise slowly and become easier to handle."},
				{Step: 4, Description: "Divide into 8 equal pieces, roll into balls, and arrange in a greased loaf tin. Cover and prove for 2 hours at room temperature."},
				{Step: 5, Description: "Brush with egg wash. Bake at 180°C for 25–30 minutes until deep golden. Cool in the tin for 10 minutes before turning out."},
			},
		},
		{
			Id:       "rye-bread",
			Name:     "Dark Rye Bread",
			Summary:  "Dense, moist Scandinavian-style rye loaf with a deep, earthy flavour",
			PhotoUrl: "https://images.unsplash.com/photo-1568471173242-461f0a730452?w=800",
			Description: "A dense, moist loaf made with a high proportion of rye flour and fermented with a rye sourdough starter. The flavour is earthy, slightly sour, and deeply satisfying. Excellent with butter and smoked salmon.",
			Ingredients: []gen.Ingredient{
				{Quantity: 300, Unit: "g", Name: "dark rye flour"},
				{Quantity: 100, Unit: "g", Name: "strong white bread flour"},
				{Quantity: 150, Unit: "g", Name: "active rye sourdough starter"},
				{Quantity: 300, Unit: "ml", Name: "water"},
				{Quantity: 10, Unit: "g", Name: "fine sea salt"},
				{Quantity: 50, Unit: "g", Name: "rye berries (soaked overnight)"},
				{Quantity: 30, Unit: "g", Name: "pumpkin seeds"},
			},
			Instructions: []gen.Instruction{
				{Step: 1, Description: "Combine all ingredients and mix thoroughly — rye dough is too sticky to knead. Cover and ferment at room temperature for 12–16 hours."},
				{Step: 2, Description: "The dough should be bubbly and have risen by about 50%. Stir briefly then pour into a well-greased 900 g loaf tin. Smooth the top with wet hands."},
				{Step: 3, Description: "Cover loosely and prove for 2–3 hours until the dough crowns just above the tin edge."},
				{Step: 4, Description: "Bake at 200°C for 50–60 minutes. The loaf is done when it sounds hollow when tapped and reads 95°C internally."},
				{Step: 5, Description: "Allow to cool completely — ideally overnight — before slicing. Rye bread slices best when fully cooled."},
			},
		},
	}
}
