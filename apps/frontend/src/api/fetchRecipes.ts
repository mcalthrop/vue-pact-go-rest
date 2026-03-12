import type { components } from '../types/api.gen'
import { BASE_URL } from './baseUrl'

export type RecipeSummary = components['schemas']['RecipeSummary']

export async function fetchRecipes(): Promise<RecipeSummary[]> {
  const res = await fetch(`${BASE_URL}/recipes`)
  if (!res.ok) {
    throw new Error(`fetchRecipes failed: ${res.status}`)
  }
  const data = (await res.json()) as components['schemas']['RecipeList']
  return data.recipes
}
