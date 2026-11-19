import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/content/**/*.test.ts'],
    coverage: {
      include: ['src/**/*.ts'],
      // Astro-only glue: it imports astro:content, so CI's build exercises it instead of a unit test.
      exclude: ['src/content.config.ts'],
      thresholds: {
        // CI floor
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        // Core logic must be fully covered
        'src/lib/**': { lines: 100, functions: 100, branches: 100, statements: 100 },
      },
    },
  },
});
