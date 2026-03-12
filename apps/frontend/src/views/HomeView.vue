<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RecipeCard from '../components/RecipeCard.vue';
import { fetchRecipes } from '../api/fetchRecipes';
import type { RecipeSummary } from '../api/fetchRecipes';

const recipes = ref<RecipeSummary[]>([]);
const error = ref<string | null>(null);
const loading = ref(true);

onMounted(async () => {
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
