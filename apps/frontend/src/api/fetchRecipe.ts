import type { components } from '../types/api.gen';
import { BASE_URL } from './baseUrl';

export type Recipe = components['schemas']['Recipe'];

export async function fetchRecipe(id: string): Promise<Recipe> {
  const res = await fetch(`${BASE_URL}/recipes/${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(`fetchRecipe failed: ${res.status}`);
  }
  return res.json() as Promise<Recipe>;
}
