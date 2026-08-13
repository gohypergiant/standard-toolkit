/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
import {
  cssRgbaStringToRgba255Tuple,
  hexToRgba255Tuple,
} from '@accelint/converters';
import { isCssRgbaString, isHexColor } from '@accelint/predicates';
import { chalk, spinner } from 'zx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'tokens');
const INPUT_DIR = path.join(__dirname, '..', 'src', 'tokens');

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
function convert(raw) {
  if (isHexColor(raw)) {
    return hexToRgba255Tuple(raw);
  }

  if (isCssRgbaString(raw)) {
    return cssRgbaStringToRgba255Tuple(raw);
  }

  return raw;
}
//#endregion

//#region Token utils
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

function getTokenFallback(tokenRef, primitives) {
  return primitives[tokenRef.replace(/^--/, '')];
}
//#endregion

//#region Generation utils
function generatePrimitives(primitives) {
  const lines = Object.entries(primitives)
    .map(([key, value]) => `  --${key.replace(/-base$/, '')}: ${value};`)
    .join('\n');

  return `@theme static {
${lines}
}`;
}

function parseBoxShadow(shadowValue) {
  // Box-shadow requires special handling because light-dark() only accepts <color> values,
  // not complete shadow declarations (offset + blur + spread + color).
  // Spec: https://drafts.csswg.org/css-color-5/#light-dark
  //
  // Parse box-shadow: "0 1px 4px 0 rgba(0 0 0 / 0.16)"
  // Returns: { offsets: "0 1px 4px 0", color: "rgba(0 0 0 / 0.16)" }
  // Match: offset-x offset-y blur spread color
  const regex =
    /^(?<offsets>(?:[\d.]+(?:px|rem|em)?\s+){3,4})\s*(?<color>rgba?\([^)]+\))$/;
  const match = shadowValue.trim().match(regex);

  if (match?.groups) {
    return {
      offsets: match.groups.offsets.trim(),
      color: match.groups.color.trim(),
    };
  }

  return null;
}

function isShadowToken(varName) {
  return varName.includes('shadow');
}

function generateShadowToken(varName, lightFallback, darkFallback) {
  const lightShadow = parseBoxShadow(lightFallback);
  const darkShadow = parseBoxShadow(darkFallback);

  if (lightShadow && darkShadow && lightShadow.offsets === darkShadow.offsets) {
    // Both shadows have the same offsets, use light-dark for color only
    return `-${varName}: ${lightShadow.offsets} light-dark(${lightShadow.color}, ${darkShadow.color});`;
  }

  // Fallback: invalid shadow format, return null to use default handling
  return null;
}

function generateLightDarkToken(
  varName,
  lightValue,
  lightFallback,
  darkValue,
  darkFallback,
) {
  return `-${varName}: light-dark(var(${lightValue}, ${lightFallback}), var(${darkValue}, ${darkFallback}));`;
}

function processTokenValue(
  tokenKey,
  lightValue,
  darkValue,
  primitives,
  prefix,
) {
  const lightFallback = getTokenFallback(lightValue, primitives);
  const darkFallback = getTokenFallback(darkValue, primitives);
  const varName = tokenKey === 'base' ? prefix : `${prefix}-${tokenKey}`;

  // Special handling for box-shadow tokens
  if (isShadowToken(varName)) {
    const shadowToken = generateShadowToken(
      varName,
      lightFallback,
      darkFallback,
    );
    if (shadowToken) {
      return shadowToken;
    }
  }

  // Default handling for all other tokens
  return generateLightDarkToken(
    varName,
    lightValue,
    lightFallback,
    darkValue,
    darkFallback,
  );
}

function generateLightDarkSemantics(
  lightObj,
  darkObj,
  primitives,
  prefix = '',
) {
  let lines = [];

  for (const [tokenKey, lightValue] of Object.entries(lightObj)) {
    const darkValue = darkObj[tokenKey];

    if (typeof lightValue === 'string' && lightValue.startsWith('--')) {
      lines.push(
        processTokenValue(tokenKey, lightValue, darkValue, primitives, prefix),
      );
    } else if (typeof lightValue === 'object' && lightValue !== null) {
      lines = lines.concat(
        generateLightDarkSemantics(
          lightValue,
          darkValue,
          primitives,
          `${prefix}-${tokenKey}`,
        ),
      );
    }
  }

  return lines;
}

function generateThemes(primitiveConfig, semanticConfig) {
  console.log('🔄 Generating themes.css...');

  const primitives = flattenTokens(primitiveConfig); // needed for fallbacks

  const lightDarkTokens = generateLightDarkSemantics(
    semanticConfig.light || {},
    semanticConfig.dark || {},
    primitives,
  );

  const themeBlock = `@theme static {
${lightDarkTokens.map((line) => `  ${line}`).join('\n')}
}`;

  return [
    `/*
  This file is generated by the generate-tokens.mjs script.
  Do not edit this file manually.
 */`,
    `@import './tokens.css';`,
    themeBlock,
  ].join('\n\n');
}

function generateTS(tokens, lookup) {
  function traverse(value) {
    if (typeof value === 'string') {
      if (value.endsWith('px')) {
        // Emit pixel values as numbers
        return Number.parseFloat(value.replace('px', ''));
      }

      if (value.startsWith('#') || value.startsWith('rgb')) {
        return convert(value);
      }

      const raw = lookup[value.replace('--', '')];

      return value.startsWith('--') ? convert(raw) : value;
    }

    if (value !== null && typeof value === 'object') {
      return Object.entries(value).reduce((acc, [key, value]) => {
        acc[key] = traverse(value);

        return acc;
      }, {});
    }

    return value;
  }

  return traverse(tokens);
}
//#endregion

//#region Main
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
    const { font, icon, ...rest } = primitiveConfig;
    const otherTokens = generateTS(rest, primitiveMap);

    await writeFile(
      'index.ts',
      `import type { ThemeTokens } from './types';

export const designTokens = ${JSON.stringify({ ...colorTokens, ...otherTokens }, null, 2)} satisfies ThemeTokens;`,
    );

    // Generate semantic tokens and theme
    const themeTokens = generateThemes(primitiveConfig, semanticConfig);

    await writeFile('themes.css', [themeTokens].join('\n'));

    console.log('✅ Design tokens generated successfully!');
  } catch (error) {
    console.error('❌ Error generating design tokens:', error);

    process.exit(1);
  }
}

await spinner(chalk.green('Generating design tokens...'), async () => {
  await main();
});
//#endregion
