<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { BASE_URL } from '@/api/baseUrl';
import type { RecipeSummary } from '@/api/fetchRecipes';

defineProps<{ recipe: RecipeSummary }>();

const resolveImageUrl = (photoUrl: string): string => {
  return new URL(photoUrl, BASE_URL).href;
};
</script>

<template>
  <RouterLink :to="`/recipes/${encodeURIComponent(recipe.id)}`" class="recipe-card">
    <img :src="resolveImageUrl(recipe.photo_url)" :alt="recipe.name" />
    <h2>{{ recipe.name }}</h2>
    <p>{{ recipe.summary }}</p>
  </RouterLink>
</template>

<style scoped>
.recipe-card {
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  color: var(--color-text);
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}

.recipe-card:hover {
  color: var(--color-text);
  box-shadow: 0 4px 16px rgba(45, 31, 20, 0.12);
  transform: translateY(-2px);
}

.recipe-card img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.recipe-card h2 {
  font-size: var(--font-size-lg);
  margin: var(--space-md) var(--space-md) var(--space-xs);
}

.recipe-card p {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin: 0 var(--space-md) var(--space-md);
}
</style>
