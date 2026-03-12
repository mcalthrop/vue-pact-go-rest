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
  background: var(--color-bark);
  padding: var(--space-md) var(--space-xl);
}

nav a {
  color: var(--color-cream);
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  letter-spacing: 0.02em;
}

nav a:hover {
  color: var(--color-wheat);
}
</style>
