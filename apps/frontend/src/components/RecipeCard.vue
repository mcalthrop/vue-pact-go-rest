<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { RecipeSummary } from '../api/fetchRecipes';

defineProps<{ recipe: RecipeSummary }>();
</script>

<template>
  <RouterLink :to="`/recipes/${encodeURIComponent(recipe.id)}`" class="recipe-card">
    <img :src="recipe.photo_url" :alt="recipe.name" />
    <h2>{{ recipe.name }}</h2>
    <p>{{ recipe.summary }}</p>
  </RouterLink>
</template>
