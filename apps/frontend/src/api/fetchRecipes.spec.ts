import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { fetchRecipes } from './fetchRecipes';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockSummary = {
  id: 'sourdough-boule',
  name: 'Classic Sourdough Boule',
  summary: 'A tangy, chewy sourdough loaf with a crisp crust',
  photo_url: 'https://example.com/photos/sourdough-boule.jpg',
};

describe('fetchRecipes', () => {
  it('returns recipe list on success', async () => {
    server.use(
      http.get('http://localhost:8080/recipes', () =>
        HttpResponse.json({ recipes: [mockSummary] }),
      ),
    );

    const result = await fetchRecipes();

    expect(result).toEqual([mockSummary]);
  });

  it('throws on non-ok response', async () => {
    server.use(
      http.get('http://localhost:8080/recipes', () =>
        new HttpResponse(null, { status: 500 }),
      ),
    );

    await expect(fetchRecipes()).rejects.toThrow('fetchRecipes failed: 500');
  });
});
