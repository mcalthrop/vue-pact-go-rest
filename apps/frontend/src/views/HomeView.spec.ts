import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import HomeView from './HomeView.vue';
import * as fetchRecipesModule from '@/api/fetchRecipes';

type WindowWithState = Window & { __INITIAL_STATE__?: Record<string, unknown> };

vi.mock('@/api/fetchRecipes');

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/recipes/:id', component: { template: '<div/>' } },
  ],
});

const mockRecipes = [
  {
    id: 'sourdough-boule',
    name: 'Classic Sourdough Boule',
    summary: 'A tangy loaf',
    photo_url: 'https://example.com/photo.jpg',
  },
];

describe('HomeView', () => {
  beforeEach(async () => {
    delete (window as WindowWithState).__INITIAL_STATE__;
    router.push('/');
    await router.isReady();
  });

  afterEach(() => {
    delete (window as WindowWithState).__INITIAL_STATE__;
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    vi.mocked(fetchRecipesModule.fetchRecipes).mockResolvedValue(mockRecipes);

    const wrapper = mount(HomeView, { global: { plugins: [router] } });

    expect(wrapper.text()).toContain('Loading...');
  });

  it('renders recipe cards on success', async () => {
    vi.mocked(fetchRecipesModule.fetchRecipes).mockResolvedValue(mockRecipes);

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('Classic Sourdough Boule');
    expect(wrapper.text()).not.toContain('Loading...');
  });

  it('shows error message on Error throw', async () => {
    vi.mocked(fetchRecipesModule.fetchRecipes).mockRejectedValue(new Error('Network error'));

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('Network error');
  });

  it('shows fallback error message on non-Error throw', async () => {
    vi.mocked(fetchRecipesModule.fetchRecipes).mockRejectedValue('unexpected');

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('Failed to load recipes');
  });

  it('hydrates from SSR context without fetching', async () => {
    (window as WindowWithState).__INITIAL_STATE__ = { recipes: mockRecipes };

    const wrapper = mount(HomeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(fetchRecipesModule.fetchRecipes).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Classic Sourdough Boule');
    expect(wrapper.text()).not.toContain('Loading...');
  });
});
