// ============================================================
// Vitest Config - UC-02 Unit Tests
// ============================================================

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    root: __dirname,
    include: ['scripts/**/*.test.ts'],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      // @/ trỏ về thư mục gốc app-project (3 cấp trên)
      '@': path.resolve(__dirname, '../../..'),
    },
  },
});
