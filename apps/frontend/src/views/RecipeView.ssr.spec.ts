import { vi, describe, it, expect, afterEach } from 'vitest';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import RecipeView from './RecipeView.vue';
import type { SSRContext } from '@/composables/useSSRContext';

vi.mock('@/api/fetchRecipe');

import * as fetchRecipeModule from '@/api/fetchRecipe';

const mockRecipe = {
  id: 'sourdough-boule',
  name: 'Classic Sourdough Boule',
  summary: 'A tangy, chewy sourdough loaf',
  photo_url: 'https://example.com/photo.jpg',
  description: 'A traditional sourdough.',
  ingredients: [{ quantity: 500, unit: 'g', name: 'bread flour' }],
  instructions: [{ step: 1, description: 'Mix flour and water.' }],
};

afterEach(() => vi.clearAllMocks());

const renderRecipeView = (ssrCtx?: SSRContext, recipeId = 'sourdough-boule') => {
  const app = createSSRApp(
    defineComponent({
      setup() {
        return () => h(RecipeView);
      },
    }),
  );
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/recipes/:id', component: RecipeView }],
  });
  app.use(router);
  if (ssrCtx) {
    app.provide('ssrContext', ssrCtx);
  }

  router.push(`/recipes/${recipeId}`);

  return router.isReady().then(() => renderToString(app));
};

describe('RecipeView SSR', () => {
  it('prefetches recipe and stores it in ssrContext', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockResolvedValue(mockRecipe);
    const ssrCtx: SSRContext = { apiBaseUrl: 'http://localhost:8080' };

    const html = await renderRecipeView(ssrCtx);

    expect(ssrCtx.recipe).toEqual(mockRecipe);
    expect(ssrCtx.statusCode).toBeUndefined();
    expect(html).toContain('Classic Sourdough Boule');
  });

  it('sets statusCode 404 and error message when fetch fails', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockRejectedValue(
      new Error('fetchRecipe failed: 404'),
    );
    const ssrCtx: SSRContext = { apiBaseUrl: 'http://localhost:8080' };

    const html = await renderRecipeView(ssrCtx);

    expect(ssrCtx.recipe).toBeUndefined();
    expect(ssrCtx.statusCode).toBe(404);
    expect(html).toContain('fetchRecipe failed: 404');
  });

  it('sets statusCode 404 on non-Error throw', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockRejectedValue('unexpected');
    const ssrCtx: SSRContext = { apiBaseUrl: 'http://localhost:8080' };

    const html = await renderRecipeView(ssrCtx);

    expect(ssrCtx.statusCode).toBe(404);
    expect(html).toContain('Failed to load recipe');
  });

  it('renders without ssrContext provided on success', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockResolvedValue(mockRecipe);

    const html = await renderRecipeView();

    expect(html).toContain('Classic Sourdough Boule');
  });

  it('renders without ssrContext provided on error', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockRejectedValue(new Error('not found'));

    const html = await renderRecipeView();

    expect(html).toContain('not found');
  });
});
