import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      // resolves the bare next/server specifier that next-auth imports
      {
        find: /^next\/server$/,
        replacement: fileURLToPath(new URL('./node_modules/next/server.js', import.meta.url)),
      },
    ],
  },
  test: {
    globals: true,
    // inlines next-auth so the next/server alias applies
    server: { deps: { inline: ['next-auth', '@auth/core'] } },
    // Integration tests run against a remote Neon branch; CI runners need the headroom
    testTimeout: 30_000,
    hookTimeout: 30_000,
    // runs test files sequentially, several suites share the dev database
    fileParallelism: false,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    // junit feeds Codecov test analytics; written into the gitignored coverage dir
    reporters: ['default', 'junit'],
    outputFile: { junit: 'coverage/junit.xml' },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      // Page shells and the OG card are covered by the build-time HTML diff, not unit tests
      exclude: [
        'src/app/**/page.tsx',
        'src/app/layout.tsx',
        'src/app/opengraph-image.tsx',
        'src/data/**',
      ],
      thresholds: { lines: 90, functions: 90, statements: 90, branches: 85 },
    },
  },
});
