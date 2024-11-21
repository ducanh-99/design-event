import path from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    alias: {
      src: path.resolve(__dirname, './src'),
    },
    root: '.',
    exclude: ['node_modules/*', 'dist/*'],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
  plugins: [swc.vite()],
});
