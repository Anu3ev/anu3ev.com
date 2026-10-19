import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    maxWorkers: 1,
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['shared/*.ts', 'scripts/lib/content.ts', 'scripts/lib/routes.ts', 'app/utils/*.ts'],
      reporter: ['text', 'lcov', 'json', 'json-summary'],
      thresholds: { lines: 85, functions: 90, branches: 80 }
    }
  }
})
