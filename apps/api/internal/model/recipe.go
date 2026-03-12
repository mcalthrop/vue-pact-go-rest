package model

// Ingredient is a single item in a recipe's ingredient list.
type Ingredient struct {
	Quantity float64 `json:"quantity"`
	Unit     string  `json:"unit"`
	Name     string  `json:"name"`
}

// Instruction is a single step in a recipe's preparation instructions.
type Instruction struct {
	Step        int    `json:"step"`
	Description string `json:"description"`
}

// RecipeSummary contains the minimal information shown on the home page.
type RecipeSummary struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Summary  string `json:"summary"`
	PhotoURL string `json:"photo_url"`
}

// Recipe contains the full details of a bread recipe.
type Recipe struct {
	RecipeSummary
	Description  string        `json:"description"`
	Ingredients  []Ingredient  `json:"ingredients"`
	Instructions []Instruction `json:"instructions"`
}
