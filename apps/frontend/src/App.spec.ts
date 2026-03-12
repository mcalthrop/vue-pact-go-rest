import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import App from './App.vue';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div/>' } }],
});

describe('App', () => {
  it('renders the site header with a home link', async () => {
    router.push('/');
    await router.isReady();

    const wrapper = mount(App, { global: { plugins: [router] } });

    expect(wrapper.find('header').exists()).toBe(true);
    expect(wrapper.text()).toContain('Bread Recipes');
  });
});
