<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchRecipe } from '../api/fetchRecipe';
import type { Recipe } from '../api/fetchRecipe';

const route = useRoute();
const recipe = ref<Recipe | null>(null);
const error = ref<string | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    recipe.value = await fetchRecipe(route.params.id as string);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load recipe';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <template v-else-if="recipe">
      <img :src="recipe.photo_url" :alt="recipe.name" class="recipe-photo" />
      <h1>{{ recipe.name }}</h1>
      <p class="summary">{{ recipe.summary }}</p>
      <p class="description">{{ recipe.description }}</p>
      <h2>Ingredients</h2>
      <ul class="ingredients">
        <li v-for="ingredient in recipe.ingredients" :key="ingredient.name">
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
