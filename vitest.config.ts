import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    coverage: { include: ['src/lib/**'], thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 } },
  },
});
