import { describe, it, vi, expect } from 'vitest';
import { PactV3, MatchersV3, SpecificationVersion } from '@pact-foundation/pact';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fetchRecipe } from '../api/fetchRecipe';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Point the API client at the Pact mock server during executeTest.
vi.mock('../api/baseUrl', () => ({
  get BASE_URL() {
    return (globalThis as { __pactMockUrl?: string }).__pactMockUrl ?? 'http://localhost:8080';
  },
}));

const provider = new PactV3({
  consumer: 'vue-frontend',
  provider: 'go-api',
  dir: path.resolve(__dirname, '../../pacts'),
  spec: SpecificationVersion.SPECIFICATION_VERSION_V3,
});

describe('fetchRecipe — pact consumer', () => {
  it('returns a recipe when it exists', async () => {
    await provider
      .given('recipe sourdough-boule exists')
      .uponReceiving('a GET request for recipe sourdough-boule')
      .withRequest({ method: 'GET', path: '/recipes/sourdough-boule' })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: MatchersV3.string('sourdough-boule'),
          name: MatchersV3.string('Classic Sourdough Boule'),
          summary: MatchersV3.string('A tangy, chewy sourdough loaf with a crisp crust'),
          photo_url: MatchersV3.string('https://example.com/photos/sourdough-boule.jpg'),
          description: MatchersV3.string('A traditional sourdough boule.'),
          ingredients: MatchersV3.eachLike({
            quantity: MatchersV3.number(500),
            unit: MatchersV3.string('g'),
            name: MatchersV3.string('strong white bread flour'),
          }),
          instructions: MatchersV3.eachLike({
            step: MatchersV3.integer(1),
            description: MatchersV3.string('Mix the flour and water.'),
          }),
        },
      })
      .executeTest(async (mockServer) => {
        const globalWithPact = globalThis as { __pactMockUrl?: string };
        globalWithPact.__pactMockUrl = mockServer.url;
        try {
          const result = await fetchRecipe('sourdough-boule');
          expect(result.id).toBe('sourdough-boule');
        } finally {
          delete globalWithPact.__pactMockUrl;
        }
      });
  });

  it('rejects with an error when the recipe is not found', async () => {
    await provider
      .given('recipe unknown-recipe does not exist')
      .uponReceiving('a GET request for a non-existent recipe')
      .withRequest({ method: 'GET', path: '/recipes/unknown-recipe' })
      .willRespondWith({
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: {
          code: MatchersV3.integer(404),
          message: MatchersV3.string('recipe not found'),
        },
      })
      .executeTest(async (mockServer) => {
        const globalWithPact = globalThis as { __pactMockUrl?: string };
        globalWithPact.__pactMockUrl = mockServer.url;
        try {
          await expect(fetchRecipe('unknown-recipe')).rejects.toThrow('fetchRecipe failed: 404');
        } finally {
          delete globalWithPact.__pactMockUrl;
        }
      });
  });
});
