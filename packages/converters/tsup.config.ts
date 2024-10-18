import { defineConfig } from 'tsup';

export default defineConfig({
  // entry: ['src/**/*.{ts,tsx}', '!src/**/*.{d,stories,test}.{ts,tsx}'],
  // bundle: false,
  entry: ['src/index.ts'],
  dts: true,
  format: 'esm',
  sourcemap: true,
  splitting: true,
  treeshake: true,
  clean: true,
});
