import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { defineConfig } from 'tsup';

export default defineConfig({
  esbuildPlugins: [
    esbuildPluginFilePathExtensions({
      esmExtension: 'js',
    }),
  ],
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.{d,stories,test,bench}.{ts,tsx}'],
  bundle: true,
  clean: true,
  dts: true,
  format: 'esm',
  sourcemap: true,
  splitting: true,
  treeshake: true,
});
