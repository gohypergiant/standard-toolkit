import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: 'esm',
  target: 'es2023',
  sourcemap: true,
  splitting: true,
  treeshake: true,
  clean: true,
});
