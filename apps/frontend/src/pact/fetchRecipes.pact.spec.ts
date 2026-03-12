import { describe, it, vi, expect } from 'vitest';
import { PactV3, MatchersV3, SpecificationVersion } from '@pact-foundation/pact';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fetchRecipes } from '../api/fetchRecipes';

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

describe('fetchRecipes — pact consumer', () => {
  it('returns a list of recipe summaries', async () => {
    await provider
      .given('recipes exist')
      .uponReceiving('a GET request for all recipes')
      .withRequest({ method: 'GET', path: '/recipes' })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          recipes: MatchersV3.eachLike({
            id: MatchersV3.string('sourdough-boule'),
            name: MatchersV3.string('Classic Sourdough Boule'),
            summary: MatchersV3.string('A tangy, chewy sourdough loaf with a crisp crust'),
            photo_url: MatchersV3.string('https://example.com/photos/sourdough-boule.jpg'),
          }),
        },
      })
      .executeTest(async (mockServer) => {
        (globalThis as { __pactMockUrl?: string }).__pactMockUrl = mockServer.url;
        const result = await fetchRecipes();
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('sourdough-boule');
      });
  });
});
