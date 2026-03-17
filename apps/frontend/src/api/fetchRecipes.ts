import type { components } from '@/types/api.gen';
import { getBaseUrl } from './getBaseUrl';

export type RecipeSummary = components['schemas']['RecipeSummary'];

export const fetchRecipes = async (): Promise<RecipeSummary[]> => {
  const res = await fetch(`${getBaseUrl()}/recipes`);
  if (!res.ok) {
    throw new Error(`fetchRecipes failed: ${res.status}`);
  }

  const data = (await res.json()) as components['schemas']['RecipeList'];

  return data.recipes;
};
