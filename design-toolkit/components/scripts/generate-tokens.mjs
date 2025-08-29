/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import fs, { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { argv, chalk, spinner } from 'zx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'tokens');
const INPUT_DIR = path.join(__dirname, '..', 'src', 'tokens');

const APPLIED_PROPERTY_MAP = {
  bg: ['background-color'],
  fg: ['color', '--icon-color'],
  outline: ['outline-color'],
  shadow: ['box-shadow'],
};
const skipFallback = ['icon-size', 'shadow-elevation', 'font'];

//#region I/O utils
function parse(file) {
  const tokensPath = path.join(INPUT_DIR, file);
  const tokensContent = readFileSync(tokensPath, 'utf-8');
  return JSON.parse(tokensContent);
}

async function writeFile(filename, content) {
  await fs.promises.writeFile(
    path.join(OUTPUT_DIR, filename),
    content,
    'utf-8',
  );
}
//#endregion

//#region Conversion utils
function hexToRgbaTuple(hex) {
  let c = hex.replace('#', '');

  // Convert shorthand hex to full hex
  if (c.length === 3) {
    c = c
      .split('')
      .map((x) => x + x)
      .join('');
  }

  // Add alpha channel if not present
  if (c.length === 6) {
    c += 'ff';
  }

  // Ensure we have 8 characters (6 for hex + 2 for alpha)
  if (c.length !== 8) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  // Convert hex to RGBA tuple
  const num = Number.parseInt(c, 16);
  const r = (num >> 24) & 0xff;
  const g = (num >> 16) & 0xff;
  const b = (num >> 8) & 0xff;
  const a = Math.round(((num & 0xff) / 255) * 1000) / 1000;

  // Return the RGBA tuple
  return [r, g, b, a];
}

function rgbaStringToRgbaTuple(rgbaStr) {
  // Matches rgba(0, 0, 0, 0.08) or rgba(0,0,0,0.08)
  // Extract the RGBA values from the string
  const match = rgbaStr.match(
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([\d.]+)\s*\)$/i,
  );

  // Return null if the string does not match the pattern
  if (!match) {
    return null;
  }

  // Return the RGBA tuple
  const [, r, g, b, a] = match;
  return [
    Number.parseInt(r, 10),
    Number.parseInt(g, 10),
    Number.parseInt(b, 10),
    Number.parseFloat(a),
  ];
}

function isHexColor(value) {
  return (
    typeof value === 'string' &&
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)
  );
}

function isRgbaString(value) {
  // Check if the value is a string and matches the rgba string pattern
  return (
    typeof value === 'string' &&
    /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)$/i.test(
      value,
    )
  );
}

function convert(raw) {
  if (isHexColor(raw)) {
    return hexToRgbaTuple(raw);
  }
  if (isRgbaString(raw)) {
    return rgbaStringToRgbaTuple(raw);
  }
  return raw;
}
//#endregion

//#region Token utils
function getTokenNames(semantic) {
  function walk(obj, prefix) {
    let names = [];
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        names.push(key === 'base' ? prefix : `${prefix}-${key}`);
      } else {
        names = names.concat(walk(value, `${prefix}-${key}`));
      }
    }
    return names;
  }
  return walk(semantic, '-');
}

function flattenTokens(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenTokens(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

function walkTokens(obj, prefix) {
  let lines = [];
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'object' && v !== null) {
      lines = lines.concat(walkTokens(v, `${prefix}-${k}`));
    } else {
      skipFallback.includes(prefix)
        ? lines.push(`  --${prefix}-${k}: var(--${prefix}-${k});`)
        : lines.push(`  --${prefix}-${k}: var(--${prefix}-${k}, ${v});`);
    }
  }
  return lines;
}

function getTokenFallback(tokenRef, primitives) {
  // tokenRef is like --colors-neutral-10
  const key = tokenRef.replace(/^--/, '');
  return primitives[key];
}
//#endregion

//#region Generation utils
function generatePrimitives(primitives) {
  const lines = Object.entries(primitives)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `:root {
${lines}
}`;
}

function generateSemantics(obj, primitives, prefix = '') {
  let lines = [];
  for (const [tokenKey, tokenValue] of Object.entries(obj)) {
    if (typeof tokenValue === 'string' && tokenValue.startsWith('--')) {
      const fallback = getTokenFallback(tokenValue, primitives);
      // Special case: omit "base" from the variable name
      const varName = tokenKey === 'base' ? prefix : `${prefix}-${tokenKey}`;
      lines.push(`    -${varName}: var(${tokenValue}, ${fallback});`);
    } else if (typeof tokenValue === 'object' && tokenValue !== null) {
      lines = lines.concat(
        generateSemantics(tokenValue, primitives, `${prefix}-${tokenKey}`),
      );
    }
  }
  return lines;
}

function generateThemes(primitiveConfig, semanticConfig) {
  const generatedDoNotEditBlock = `/*
  This file is generated by the generate-tokens.mjs script.
  Do not edit this file manually.
 */`;
  const importBlock = `@import './tokens.css';`;
  console.log('🔄 Generating themes.css...');

  // 1. Tailwind reset block
  const tailwindBlock =
    '@theme {\n  /* Remove the default Tailwind styles. */\n  --color-* : initial;\n  --font-* : initial;\n  --radius-* : initial;\n  --shadow-* : initial;\n  --spacing-* : initial;\n  --text-* : initial;\n}';

  // 2. Semantic colors block (same as before)
  const primitives = flattenTokens(primitiveConfig); // needed for fallbacks
  const statics = generateSemantics(semanticConfig.static || {}, primitives);
  const dark = generateSemantics(semanticConfig.dark || {}, primitives);
  const light = generateSemantics(semanticConfig.light || {}, primitives);
  const semanticColorsBlock = `@layer theme {
  :root {
    /** Static tokens (same values regardless of theme) **/
    ${statics.join('\n')}

    /** Dark theme **/
    @variant dark {
      ${dark.join('\n')}
    }

    /** Light theme **/
    @variant light {
      ${light.join('\n')}
    }
  }
}`;

  // 3. Dynamic @theme blocks for each top-level key in tokens.json
  const dynamicThemeBlocks = Object.entries(primitiveConfig)
    .filter(([topKey]) => topKey !== 'primitive') // Exclude colors since they're handled by semantic block
    .map(([topKey, value]) => {
      const lines = walkTokens(value, topKey);
      return `@theme {\n  /** ${topKey.charAt(0).toUpperCase() + topKey.slice(1)} **/\n${lines.join('\n')}\n}`;
    });

  return [
    generatedDoNotEditBlock,
    importBlock,
    tailwindBlock,
    semanticColorsBlock,
    ...dynamicThemeBlocks,
  ].join('\n\n');
}

function generateTS(tokens, lookup) {
  function traverse(obj) {
    if (typeof obj === 'string') {
      if (obj.endsWith('px')) {
        // Emit pixel values as numbers
        return Number.parseFloat(obj.replace('px', ''));
      }
      const raw = lookup[obj.replace('--', '')];
      return obj.startsWith('--') ? convert(raw) : obj;
    }

    if (obj !== null && typeof obj === 'object') {
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        newObj[key] = traverse(value);
      }
      return newObj;
    }
    return obj;
  }
  return traverse(tokens);
}
//#endregion

//#region Main
function help() {
  return console.log('helpful information here!');
}

async function main() {
  try {
    console.log('🔄 Generating design tokens...');

    // Make sure output dir exists
    await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });

    const primitiveConfig = parse('primitive.json');
    const semanticConfig = parse('semantic.json');
    const primitiveMap = flattenTokens(primitiveConfig);

    // Generate primitive tokens
    await writeFile('tokens.css', generatePrimitives(primitiveMap));

    // Generate TypeScript constants and types
    const colorTokens = generateTS(semanticConfig, primitiveMap);
    // We don't want to generate colors, fonts or icon values
    const { primitive, font, icon, ...rest } = primitiveConfig;
    const otherTokens = generateTS(rest, primitiveMap);

    await writeFile(
      'tokens.ts',
      `import type { ThemeTokens } from './types';
export const designTokens = ${JSON.stringify({ ...colorTokens, ...otherTokens }, null, 2)} satisfies ThemeTokens;`,
    );

    const staticColorUtilities = getTokenNames(semanticConfig.static)
      .map((cssvar) => {
        const tokenName = cssvar.replace('--', '');
        return `@utility bg-${tokenName} {
  background-color: var(${cssvar});
}
@utility fg-${tokenName} {
  color: var(${cssvar});
  --icon-color: var(${cssvar});
}
@utility outline-${tokenName} {
  outline-color: var(${cssvar});
}`;
      })
      .join('\n\n');
    const semanticUtilities = getTokenNames(semanticConfig.dark)
      .map((cssvar) => {
        const tokenName = cssvar.replace('--', '');
        const type = tokenName.split('-').at(0);
        const appliedProperties = APPLIED_PROPERTY_MAP[type];
        const properties = appliedProperties
          .map((property) => `${property}: var(${cssvar});`)
          .join('\n');
        return `@utility ${tokenName} {\n ${properties} \n}`;
      })
      .join('\n\n');

    // Generate semantic tokens and theme
    const themeTokens = generateThemes(primitiveConfig, semanticConfig);
    await writeFile(
      'themes.css',
      [themeTokens, staticColorUtilities, semanticUtilities].join('\n'),
    );

    console.log('✅ Design tokens generated successfully!');
  } catch (error) {
    console.error('❌ Error generating design tokens:', error);
    process.exit(1);
  }
}

await spinner(chalk.green('Generating design tokens...'), async () => {
  if (argv.h || argv.help) {
    return help();
  }
  await main();
});
//#endregion
