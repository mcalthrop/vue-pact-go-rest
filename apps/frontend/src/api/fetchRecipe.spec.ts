import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { fetchRecipe } from './fetchRecipe';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockRecipe = {
  id: 'sourdough-boule',
  name: 'Classic Sourdough Boule',
  summary: 'A tangy, chewy sourdough loaf with a crisp crust',
  photo_url: 'https://example.com/photos/sourdough-boule.jpg',
  description: 'A traditional sourdough boule.',
  ingredients: [{ quantity: 500, unit: 'g', name: 'strong white bread flour' }],
  instructions: [{ step: 1, description: 'Mix the flour and water.' }],
};

describe('fetchRecipe', () => {
  it('returns a recipe on success', async () => {
    server.use(
      http.get('http://localhost:8080/recipes/:id', () =>
        HttpResponse.json(mockRecipe),
      ),
    );

    const result = await fetchRecipe('sourdough-boule');

    expect(result).toEqual(mockRecipe);
  });

  it('throws on non-ok response', async () => {
    server.use(
      http.get('http://localhost:8080/recipes/:id', () =>
        new HttpResponse(null, { status: 404 }),
      ),
    );

    await expect(fetchRecipe('unknown')).rejects.toThrow('fetchRecipe failed: 404');
  });
});
