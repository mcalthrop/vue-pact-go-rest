<script setup lang="ts">
import { ref, onMounted, onServerPrefetch } from 'vue';
import RecipeCard from '@/components/RecipeCard.vue';
import { fetchRecipes } from '@/api/fetchRecipes';
import type { RecipeSummary } from '@/api/fetchRecipes';
import { useSSRContext } from '@/composables/useSSRContext';

const ssrCtx = useSSRContext();
const recipes = ref<RecipeSummary[]>((ssrCtx?.recipes as RecipeSummary[] | undefined) ?? []);
const error = ref<string | null>(null);
const loading = ref(ssrCtx?.recipes == null);

onServerPrefetch(async () => {
  try {
    recipes.value = await fetchRecipes();
    if (ssrCtx) {
      ssrCtx.recipes = recipes.value;
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load recipes';
  } finally {
    loading.value = false;
  }
});

onMounted(async () => {
  if (ssrCtx?.recipes != null) {
    return;
  }

  try {
    recipes.value = await fetchRecipes();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load recipes';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main>
    <h1>Bread Recipes</h1>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <div v-else class="recipes-grid">
      <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xl);
}

h1 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--space-xl);
}

.recipes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

@media (min-width: 640px) {
  .recipes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .recipes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.error {
  color: var(--color-error);
}
</style>
