import { fileURLToPath, URL } from 'node:url';

import { defineConfig, configDefaults } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    root: fileURLToPath(new URL('./', import.meta.url)),
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
      exclude: [
        ...(configDefaults.coverage.exclude ?? []),
        'src/main.ts',
        'src/mocks/**',
        'src/router/index.ts',
        'src/types/api.gen.ts',
        'src/pact/**',
      ],
    },
    projects: [
      {
        // Unit tests: jsdom environment, excludes pact test files.
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          exclude: [...configDefaults.exclude, 'e2e/**', 'src/pact/**'],
          env: { VITE_API_BASE_URL: 'http://localhost:8080' },
        },
      },
      {
        // Pact consumer tests: node environment, forks pool (required by Pact Rust engine).
        extends: true,
        test: {
          name: 'pact',
          include: ['src/pact/**/*.pact.spec.ts'],
          pool: 'forks',
          environment: 'node',
        },
      },
    ],
  },
});
