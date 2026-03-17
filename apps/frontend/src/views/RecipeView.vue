<script setup lang="ts">
import { ref, onMounted, onServerPrefetch, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getBaseUrl } from '@/api/baseUrl';
import { fetchRecipe } from '@/api/fetchRecipe';
import type { Recipe } from '@/api/fetchRecipe';
import { useSSRContext } from '@/composables/useSSRContext';

function resolveImageUrl(photoUrl: string): string {
  return new URL(photoUrl, getBaseUrl()).href;
}

const ssrCtx = useSSRContext();
const route = useRoute();
const recipe = ref<Recipe | null>((ssrCtx?.recipe as Recipe | null | undefined) ?? null);
const error = ref<string | null>(null);
const loading = ref(ssrCtx?.recipe == null);

onServerPrefetch(async () => {
  try {
    recipe.value = await fetchRecipe(route.params.id as string);
    if (ssrCtx) ssrCtx.recipe = recipe.value;
  } catch (e) {
    if (ssrCtx) ssrCtx.statusCode = 404;
    error.value = e instanceof Error ? e.message : 'Failed to load recipe';
  } finally {
    loading.value = false;
  }
});

async function loadRecipe(id: string) {
  loading.value = true;
  error.value = null;
  recipe.value = null;
  try {
    recipe.value = await fetchRecipe(id);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load recipe';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (ssrCtx?.recipe != null) return;
  loadRecipe(route.params.id as string);
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadRecipe(newId as string);
    }
  },
);
</script>

<template>
  <main>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <template v-else-if="recipe">
      <img :src="resolveImageUrl(recipe.photo_url)" :alt="recipe.name" class="recipe-photo" />
      <h1>{{ recipe.name }}</h1>
      <p class="summary">{{ recipe.summary }}</p>
      <p class="description">{{ recipe.description }}</p>
      <h2>Ingredients</h2>
      <ul class="ingredients">
        <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
          {{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.name }}
        </li>
      </ul>
      <h2>Instructions</h2>
      <ol class="instructions">
        <li v-for="instruction in recipe.instructions" :key="instruction.step">
          {{ instruction.description }}
        </li>
      </ol>
    </template>
  </main>
</template>

<style scoped>
main {
  max-width: 780px;
  margin: 0 auto;
  padding: var(--space-xl);
}

.recipe-photo {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);
}

h1 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--space-sm);
}

.summary {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

.description {
  margin-bottom: var(--space-xl);
  line-height: 1.8;
}

h2 {
  font-size: var(--font-size-xl);
  margin: var(--space-xl) 0 var(--space-md);
  padding-bottom: var(--space-xs);
  border-bottom: 2px solid var(--color-border);
}

.ingredients {
  margin-bottom: var(--space-xl);
}

.ingredients li,
.instructions li {
  padding: var(--space-xs) 0;
}

.error {
  color: var(--color-error);
}
</style>
