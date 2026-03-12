import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import RecipeView from './RecipeView.vue';
import * as fetchRecipeModule from '../api/fetchRecipe';

vi.mock('../api/fetchRecipe');

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
  beforeEach(async () => {
    router.push('/recipes/sourdough-boule');
    await router.isReady();
  });

  it('shows loading state initially', () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockResolvedValue(mockRecipe);

    const wrapper = mount(RecipeView, { global: { plugins: [router] } });

    expect(wrapper.text()).toContain('Loading...');
  });

  it('renders recipe details on success', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockResolvedValue(mockRecipe);

    const wrapper = mount(RecipeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('Classic Sourdough Boule');
    expect(wrapper.text()).toContain('A traditional sourdough boule with complex flavour.');
    expect(wrapper.text()).toContain('500 g strong white bread flour');
    expect(wrapper.text()).toContain('Mix the flour and water.');
  });

  it('shows error message on Error throw', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockRejectedValue(new Error('Recipe not found'));

    const wrapper = mount(RecipeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('Recipe not found');
  });

  it('shows fallback error message on non-Error throw', async () => {
    vi.mocked(fetchRecipeModule.fetchRecipe).mockRejectedValue('unexpected');

    const wrapper = mount(RecipeView, { global: { plugins: [router] } });
    await flushPromises();

    expect(wrapper.text()).toContain('Failed to load recipe');
  });
});
