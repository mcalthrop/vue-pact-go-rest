import { createApp as createVueApp, createSSRApp } from 'vue';
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import App from './App.vue';
import HomeView from './views/HomeView.vue';
import RecipeView from './views/RecipeView.vue';

export const createApp = (isSSR = false) => {
  const app = isSSR ? createSSRApp(App) : createVueApp(App);
  const router = createRouter({
    history: isSSR ? createMemoryHistory() : createWebHistory(import.meta.env.BASE_URL),
    routes: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/recipes/:id', name: 'recipe', component: RecipeView },
    ],
  });
  app.use(router);

  return { app, router };
};
