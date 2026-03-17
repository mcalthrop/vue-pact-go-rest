import { vi, describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, defineComponent, h, type VNode } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import { setupServer } from 'msw/node';
import HomeView from './HomeView.vue';
import type { SSRContext } from '@/composables/useSSRContext';

vi.mock('@/api/fetchRecipes');

// Allow individual tests to suppress onServerPrefetch to render the initial loading state.
let suppressPrefetch = false;

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>();

  return {
    ...actual,
    onServerPrefetch: (cb: () => Promise<void>): void => {
      if (!suppressPrefetch) {
        actual.onServerPrefetch(cb);
      }
    },
  };
});

import * as fetchRecipesModule from '@/api/fetchRecipes';

const mockRecipes = [
  {
    id: 'sourdough-boule',
    name: 'Classic Sourdough Boule',
    summary: 'A tangy loaf',
    photo_url: '/images/sourdough-boule.jpg',
  },
];

const mswServer = setupServer();
beforeAll(() => mswServer.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  mswServer.resetHandlers();
  vi.clearAllMocks();
  suppressPrefetch = false;
});
afterAll(() => mswServer.close());

const renderHomeView = (ssrCtx?: SSRContext): Promise<string> => {
  const app = createSSRApp(
    defineComponent({
      setup() {
        return (): VNode => h(HomeView);
      },
    }),
  );
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: HomeView }],
  });
  app.use(router);
  if (ssrCtx) {
    app.provide('ssrContext', ssrCtx);
  }

  return renderToString(app);
};

describe('HomeView SSR', () => {
  it('prefetches recipes and stores them in ssrContext', async () => {
    vi.mocked(fetchRecipesModule.fetchRecipes).mockResolvedValue(mockRecipes);
    const ssrCtx: SSRContext = { apiBaseUrl: 'http://localhost:8080' };

    const html = await renderHomeView(ssrCtx);

    expect(ssrCtx.recipes).toEqual(mockRecipes);
    expect(html).toContain('Classic Sourdough Boule');
  });

  it('stores error in component state when fetch fails', async () => {
    vi.mocked(fetchRecipesModule.fetchRecipes).mockRejectedValue(new Error('Network error'));
    const ssrCtx: SSRContext = { apiBaseUrl: 'http://localhost:8080' };

    const html = await renderHomeView(ssrCtx);

    expect(ssrCtx.recipes).toBeUndefined();
    expect(ssrCtx.error).toBe('Network error');
    expect(html).toContain('Network error');
  });

  it('stores fallback error message on non-Error throw', async () => {
    vi.mocked(fetchRecipesModule.fetchRecipes).mockRejectedValue('unexpected');
    const ssrCtx: SSRContext = { apiBaseUrl: 'http://localhost:8080' };

    const html = await renderHomeView(ssrCtx);

    expect(ssrCtx.error).toBe('Failed to load recipes');
    expect(html).toContain('Failed to load recipes');
  });

  it('renders without ssrContext provided', async () => {
    vi.mocked(fetchRecipesModule.fetchRecipes).mockResolvedValue(mockRecipes);

    const html = await renderHomeView();

    expect(html).toContain('Classic Sourdough Boule');
  });

  it('renders loading state when prefetch is suppressed', async () => {
    suppressPrefetch = true;
    const ssrCtx: SSRContext = { apiBaseUrl: 'http://localhost:8080' };

    const html = await renderHomeView(ssrCtx);

    expect(html).toContain('Loading...');
  });
});
