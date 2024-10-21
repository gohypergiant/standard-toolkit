import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { default as autoprefixer } from 'autoprefixer';
import { default as postcss } from 'postcss';
import { defineConfig } from 'tsup';

async function processCss(css: string) {
  return await postcss([autoprefixer]).process(css, {
    from: undefined /* suppress source map warning */,
  }).css;
}

export default defineConfig({
  esbuildPlugins: [
    vanillaExtractPlugin({
      processCss,
    }),
  ],
  entry: ['src/*.ts'],
  dts: true,
  format: 'esm',
  sourcemap: true,
  splitting: true,
  treeshake: true,
});
