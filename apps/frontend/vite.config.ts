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
        'src/entry-client.ts',
        'src/entry-server.ts',
        'src/mocks/**',
        'src/types/api.gen.ts',
        'src/pact/**',
        'server.ts',
      ],
    },
    projects: [
      {
        // Unit tests: jsdom environment, excludes pact test files.
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          exclude: [...configDefaults.exclude, 'e2e/**', 'src/pact/**', 'src/**/*.ssr.spec.ts'],
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
      {
        // SSR tests: node environment for server-side rendering paths.
        extends: true,
        test: {
          name: 'ssr',
          include: ['src/**/*.ssr.spec.ts'],
          environment: 'node',
        },
      },
    ],
  },
});
