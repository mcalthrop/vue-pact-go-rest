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

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-900);
  padding: var(--space-md) var(--space-xl);
}

nav a {
  color: var(--color-50);
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  letter-spacing: 0.02em;
}

nav a:hover {
  color: var(--color-100);
}
</style>
