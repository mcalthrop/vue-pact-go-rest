import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import RecipeCard from './RecipeCard.vue';
import { getBaseUrl } from '@/api/getBaseUrl';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div/>' } },
    { path: '/recipes/:id', component: { template: '<div/>' } },
  ],
});

const mockRecipe = {
  id: 'sourdough-boule',
  name: 'Classic Sourdough Boule',
  summary: 'A tangy, chewy sourdough loaf',
  photo_url: '/images/sourdough-boule.jpg',
};

describe('RecipeCard', () => {
  it('renders recipe name, summary and photo', async () => {
    router.push('/');
    await router.isReady();

    const wrapper = mount(RecipeCard, {
      props: { recipe: mockRecipe },
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('Classic Sourdough Boule');
    expect(wrapper.text()).toContain('A tangy, chewy sourdough loaf');
    expect(wrapper.find('img').attributes('src')).toBe(
      new URL(mockRecipe.photo_url, getBaseUrl()).href,
    );
  });

  it('links to the recipe detail page', async () => {
    router.push('/');
    await router.isReady();

    const wrapper = mount(RecipeCard, {
      props: { recipe: mockRecipe },
      global: { plugins: [router] },
    });

    expect(wrapper.find('a').attributes('href')).toBe('/recipes/sourdough-boule');
  });
});
