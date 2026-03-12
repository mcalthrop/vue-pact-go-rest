<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Bread Recipes</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>
