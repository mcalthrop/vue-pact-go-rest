import type { components } from '../types/api.gen'

export type RecipeSummary = components['schemas']['RecipeSummary']
export type Recipe = components['schemas']['Recipe']

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export async function fetchRecipes(): Promise<RecipeSummary[]> {
  const res = await fetch(`${BASE_URL}/recipes`)
  if (!res.ok) {
    throw new Error(`fetchRecipes failed: ${res.status}`)
  }
  const data = (await res.json()) as components['schemas']['RecipeList']
  return data.recipes
}

export async function fetchRecipe(id: string): Promise<Recipe> {
  const res = await fetch(`${BASE_URL}/recipes/${encodeURIComponent(id)}`)
  if (!res.ok) {
    throw new Error(`fetchRecipe failed: ${res.status}`)
  }
  return res.json() as Promise<Recipe>
}
