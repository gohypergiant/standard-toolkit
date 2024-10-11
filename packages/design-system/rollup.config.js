import path from 'node:path';
import json from '@rollup/plugin-json';
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';
import { dts } from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { default as depsExternal } from 'rollup-plugin-node-externals';
// import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import ts from 'typescript';

const CSS_IMPORT_REGEX = /^import '.+\.css';$/gm;

function loadCompilerOptions(tsconfig) {
  if (!tsconfig) {
    return {};
  }

  const configFile = ts.readConfigFile(tsconfig, ts.sys.readFile);

  const { options } = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    './',
  );

  return options;
}

const emittedCSSFiles = new Set();

function removeCssImports() {
  return {
    name: 'remove-css-imports',
    renderChunk(code, chunkInfo) {
      const output = code.replaceAll(CSS_IMPORT_REGEX, '');

      return {
        code: output,
        map: chunkInfo.map ?? null,
      };
    },
  };
}

// Bundle all of the .css files into a single "styles.css" file
function bundleCss() {
  return {
    name: 'bundle-css-emits',
    buildStart: () => {
      emittedCSSFiles.clear();
    },
    // Ran against every file
    renderChunk(code, chunkInfo) {
      const allImports = [
        ...code.matchAll(/import (?:.* from )?['"]([^;'"]*)['"];?/g),
      ];

      const dirname = path.dirname(chunkInfo.fileName);

      const output = allImports.reduce(
        (resultingCode, [importLine, moduleId]) => {
          if (emittedCSSFiles.has(path.posix.join(dirname, moduleId))) {
            return resultingCode.replace(importLine, '');
          }

          return resultingCode;
        },
        code,
      );

      return {
        code: output,
        map: chunkInfo.map ?? null,
      };
    },
    generateBundle(_, bundle) {
      const bundleCode = Array.from(emittedCSSFiles.values())
        .map((file) => {
          const { name, fileName, source } = bundle[file];

          return `/* ${name} -> ${fileName} */\n${source}`;
        })
        .join('\n\n');

      this.emitFile({
        type: 'asset',
        name: 'styles.css',
        source: bundleCode,
      });
    },
  };
}

// Bundle all of the .vanilla files into a single "vanilla" file
function bundleVanilla() {
  return {
    name: 'bundle-vanilla-emits',
    generateBundle(_, bundle) {
      const ext = bundle['index.d.ts'] ? 'd.ts' : 'js';

      this.emitFile({
        type: 'asset',
        fileName: `vanilla.${ext}`,
        source: bundle[`index.${ext}`].code
          .replace(/\/\/# sourceMappingURL.+/gi, '')
          .split('\n')
          .filter(
            (line) =>
              line.endsWith(`.vanilla.js';`) ||
              line.endsWith(`/types.js';`) ||
              line.endsWith(`'./utils/css.js';`) ||
              line.includes(`from './types/`),
          )
          .join('\n'),
      });
    },
  };
}

const compilerOptions = loadCompilerOptions('tsconfig.dist.json');

const commonPlugins = [
  // typescriptPaths(),
  vanillaExtractPlugin(),
  depsExternal(),
  esbuild(),
  json(),
];

export default [
  // Main processing and bundling
  {
    input: 'src/index.ts',
    plugins: [
      ...commonPlugins,
      removeCssImports(),
      bundleCss(),
      bundleVanilla(),
    ],
    output: [
      {
        banner: `'use client';`,
        dir: 'dist',
        exports: 'named',
        format: 'esm',
        preserveModules: true,
        sourcemap: true,
        // Change .css.js files to .vanilla.js so that they don't get re-processed by consumer's setup
        entryFileNames({ name }) {
          return `${name.replace(/\.css$/, '.vanilla')}.js`;
        },
        // Build out the assets folder with all of the css files.
        assetFileNames({ name }) {
          name = name
            .replace(/^src\//, 'assets/')
            .replace('.css.ts.vanilla', '');

          if (name.match(/\.css$/)) {
            emittedCSSFiles.add(name);
          }

          return name;
        },
      },
    ],
  },
  // Go through and create type definition files
  {
    input: 'src/index.ts',
    plugins: [
      ...commonPlugins,
      dts({
        compilerOptions: {
          ...compilerOptions,
          baseUrl: path.resolve(compilerOptions.baseUrl || '.'),
          declaration: true,
          emitDeclarationOnly: true,
          noEmit: false,
          noEmitOnError: true,
          target: ts.ScriptTarget.ESNext,
        },
      }),
      bundleVanilla(),
    ],
    output: [
      {
        dir: 'dist',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        // Change .css.js files to vanilla.js so that they don't get re-processed by consumer's setup
        entryFileNames({ name }) {
          return `${name.replace(/\.css$/, '.vanilla')}.d.ts`;
        },
      },
    ],
  },
];
