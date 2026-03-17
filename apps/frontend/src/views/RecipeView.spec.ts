import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import RecipeView from './RecipeView.vue';
import * as fetchRecipeModule from '@/api/fetchRecipe';

type WindowWithState = Window & { __INITIAL_STATE__?: Record<string, unknown> };
type Wrapper = ReturnType<typeof mount<typeof RecipeView>>;

vi.mock('@/api/fetchRecipe');

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div/>' } },
    { path: '/recipes/:id', component: RecipeView },
  ],
});

const mockRecipe = {
  id: 'sourdough-boule',
  name: 'Classic Sourdough Boule',
  summary: 'A tangy, chewy sourdough loaf',
  photo_url: 'https://example.com/photo.jpg',
  description: 'A traditional sourdough boule with complex flavour.',
  ingredients: [{ quantity: 500, unit: 'g', name: 'strong white bread flour' }],
  instructions: [{ step: 1, description: 'Mix the flour and water.' }],
};

describe('RecipeView', () => {
  let wrapper: Wrapper;

  beforeEach(async () => {
    delete (window as WindowWithState).__INITIAL_STATE__;
    router.push('/recipes/sourdough-boule');
    await router.isReady();
  });

  afterEach(() => {
    wrapper?.unmount();
    delete (window as WindowWithState).__INITIAL_STATE__;
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockResolvedValue(mockRecipe);

    wrapper = mount(RecipeView, { global: { plugins: [router] } });

    expect(wrapper.text()).toContain('Loading...');
  });

  it('renders recipe details on success', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockResolvedValue(mockRecipe);

    wrapper = mount(RecipeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('Classic Sourdough Boule');
    expect(wrapper.text()).toContain('A traditional sourdough boule with complex flavour.');
    expect(wrapper.text()).toContain('500 g strong white bread flour');
    expect(wrapper.text()).toContain('Mix the flour and water.');
  });

  it('shows error message on Error throw', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockRejectedValue(new Error('Recipe not found'));

    wrapper = mount(RecipeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('Recipe not found');
  });

  it('shows fallback error message on non-Error throw', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockRejectedValue('unexpected');

    wrapper = mount(RecipeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('Failed to load recipe');
  });

  it('does not refetch when route id becomes undefined', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockResolvedValue(mockRecipe);

    wrapper = mount(RecipeView, { global: { plugins: [router] } });
    await flushPromises();

    const callsBefore = vi.mocked(fetchRecipeModule.fetchRecipe).mock.calls.length;
    await router.push('/');
    await flushPromises();

    expect(vi.mocked(fetchRecipeModule.fetchRecipe)).toHaveBeenCalledTimes(callsBefore);
  });

  it('hydrates from SSR context without fetching', async () => {
    (window as WindowWithState).__INITIAL_STATE__ = { recipe: mockRecipe };

    wrapper = mount(RecipeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(fetchRecipeModule.fetchRecipe).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Classic Sourdough Boule');
    expect(wrapper.text()).not.toContain('Loading...');
  });

  it('refetches when route id changes', async () => {
    const secondRecipe = { ...mockRecipe, id: 'rye-bread', name: 'Rye Bread' };
    vi.mocked(fetchRecipeModule.fetchRecipe)
      .mockResolvedValueOnce(mockRecipe)
      .mockResolvedValueOnce(secondRecipe);

    wrapper = mount(RecipeView, { global: { plugins: [router] } });
    await flushPromises();

    await router.push('/recipes/rye-bread');
    await flushPromises();

    expect(vi.mocked(fetchRecipeModule.fetchRecipe)).toHaveBeenCalledWith('rye-bread');
  });
});
