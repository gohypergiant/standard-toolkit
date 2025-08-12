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

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skipFallback = ['icon-size', 'shadow-elevation', 'font'];

// Import the token generator using dynamic import with tsx
import { readFileSync } from 'node:fs';

async function generateTokens() {
  try {
    console.log('🔄 Generating design tokens...');

    // Read the tokens.json file
    const tokensPath = path.join(
      __dirname,
      '..',
      'src',
      'tokens',
      'tokens.json',
    );
    const tokensContent = readFileSync(tokensPath, 'utf-8');
    const tokens = JSON.parse(tokensContent);

    // Read the semantic.json file
    const semanticPath = path.join(
      __dirname,
      '..',
      'src',
      'tokens',
      'semantic.json',
    );
    const semanticContent = readFileSync(semanticPath, 'utf-8');
    const semantic = JSON.parse(semanticContent);
    // Generate files in the src/tokens directory
    const outputDir = path.join(__dirname, '..', 'src', 'tokens');

    await fs.promises.mkdir(outputDir, { recursive: true });

    // Generate CSS variables
    const cssContent = generateCSS(tokens);

    await fs.promises.writeFile(
      path.join(outputDir, 'tokens.css'),
      cssContent,
      'utf-8',
    );

    // Generate TypeScript constants and types
    const tsContent = generateTypeScript(tokens, semantic);

    await fs.promises.writeFile(
      path.join(outputDir, 'index.ts'),
      tsContent,
      'utf-8',
    );

    // Generate theme blocks CSS
    const themesContent = generateThemesCSS(tokens, semantic);

    await fs.promises.writeFile(
      path.join(outputDir, 'themes.css'),
      themesContent,
      'utf-8',
    );

    console.log('✅ Design tokens generated successfully!');
  } catch (error) {
    console.error('❌ Error generating design tokens:', error);
    process.exit(1);
  }
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

function toCamelCase(str) {
  // Remove all non-alphanumeric characters and convert to camelCase
  return str
    .replace(/[-_]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/^(\d)/, '_$1'); // prefix leading digit with underscore
}

function generateCSS(tokens) {
  const flattened = flattenTokens(tokens);
  const cssLines = [];

  // Start :root block
  cssLines.push(':root {');

  // Generate CSS variables
  for (const [key, value] of Object.entries(flattened)) {
    cssLines.push(`  --${key}: ${value};`);
  }

  // Close :root block
  cssLines.push('}');

  return cssLines.join('\n');
}

function extractVarReference(value) {
  // Check if the value is a string
  if (typeof value !== 'string') {
    return null;
  }

  // Check if the value is a var(--...) reference
  const varMatch = value.match(/^var\(--([a-zA-Z0-9-_]+)\)$/);

  // Return the matched variable name or null if not found
  return varMatch ? varMatch[1] : null;
}

function resolveReferences(flattened) {
  // Recursively resolve var(--...) references to their concrete values
  const resolved = {};
  const resolving = {};
  function resolveValue(key) {
    if (resolved[key] !== undefined) {
      return resolved[key];
    }
    if (resolving[key]) {
      throw new Error(`Circular reference detected for token: ${key}`);
    }
    resolving[key] = true;
    const value = flattened[key];
    const refKey = extractVarReference(value);
    if (refKey) {
      if (refKey in flattened) {
        resolved[key] = resolveValue(refKey);
      } else {
        resolved[key] = value; // fallback to original if not found
      }
    } else {
      resolved[key] = value;
    }
    resolving[key] = false;
    return resolved[key];
  }
  for (const key of Object.keys(flattened)) {
    resolveValue(key);
  }
  return resolved;
}

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

function processSemanticColor(fallback, varName) {
  if (isHexColor(fallback)) {
    const rgba = hexToRgbaTuple(fallback);
    return `export const ${varName}: RGBAColor = [${rgba.join(', ')}];`;
  }
  if (isRgbaString(fallback)) {
    const rgba = rgbaStringToRgbaTuple(fallback);
    if (rgba) {
      return `export const ${varName}: RGBAColor = [${rgba.join(', ')}];`;
    }
  }
  return `export const ${varName} = '${fallback}';`;
}

function generateSemanticColorExports(semantic, resolved) {
  const lines = [];

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  function walkSemanticForTS(obj, prefix = 'color') {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && v.startsWith('--')) {
        const tokenKey = v.replace(/^--/, '');
        const fallback = resolved[tokenKey];
        if (fallback) {
          const camelCaseKey = toCamelCase(`${prefix}-${k}`);
          // Special case: omit "base" from the variable name
          const varName = k === 'base' ? toCamelCase(prefix) : camelCaseKey;
          lines.push(processSemanticColor(fallback, varName));
        }
      } else if (typeof v === 'object' && v !== null) {
        walkSemanticForTS(v, `${prefix}-${k}`);
      }
    }
  }

  walkSemanticForTS(semantic.colors || {});
  return lines;
}

function generateTypeScript(tokens, semantic) {
  const flattened = flattenTokens(tokens);
  const resolved = resolveReferences(flattened);
  const tsLines = [];

  tsLines.push('');
  tsLines.push('export type RGBAColor = [number, number, number, number];');
  tsLines.push('');

  // Generate semantic color exports
  const semanticColorLines = generateSemanticColorExports(semantic, resolved);
  tsLines.push('/** Semantic Colors **/');
  tsLines.push(...semanticColorLines);
  tsLines.push('/** Other Design Tokens **/');

  // Generate other token exports (non-colors)
  for (const [key, value] of Object.entries(resolved)) {
    // Skip color tokens since they're handled by semantic exports
    if (key.startsWith('colors-')) {
      continue;
    }

    const camelCaseKey = toCamelCase(key);
    if (typeof value === 'string' && value.endsWith('px')) {
      // Emit pixel values as numbers
      const num = Number.parseFloat(value.replace('px', ''));
      tsLines.push(`export const ${camelCaseKey} = ${num};`);
    } else {
      tsLines.push(`export const ${camelCaseKey} = '${value}';`);
    }
  }

  return tsLines.join('\n');
}

function generateThemesCSS(tokens, semantic) {
  const generatedDoNotEditBlock = `/*
  This file is generated by the generate-tokens.mjs script.
  Do not edit this file manually.
 */`;
  const importBlock = `@import './tokens.css';`;
  console.log('🔄 Generating themes.css...');

  const flattened = flattenTokens(tokens);
  // 1. Tailwind reset block
  const tailwindBlock =
    '@theme {\n  /* Remove the default Tailwind styles. */\n  --color-* : initial;\n  --font-* : initial;\n  --radius-* : initial;\n  --shadow-* : initial;\n  --spacing-* : initial;\n  --text-* : initial;\n}';

  // 2. Semantic colors block (same as before)
  function getTokenFallback(tokenRef) {
    // tokenRef is like --colors-neutral-10
    const key = tokenRef.replace(/^--/, '');
    return flattened[key];
  }
  function walkSemantic(obj, prefix = 'color') {
    let lines = [];
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && v.startsWith('--')) {
        const fallback = getTokenFallback(v);
        // Special case: omit "base" from the variable name
        const varName = k === 'base' ? prefix : `${prefix}-${k}`;
        lines.push(`  --${varName}: var(${v}, ${fallback});`);
      } else if (typeof v === 'object' && v !== null) {
        lines = lines.concat(walkSemantic(v, `${prefix}-${k}`));
      }
    }
    return lines;
  }
  const semanticColorLines = walkSemantic(semantic.colors || {});
  const semanticColorsBlock = `@theme {\n  /** Colors (semantic) **/\n${semanticColorLines.join('\n')}\n}`;

  // 3. Dynamic @theme blocks for each top-level key in tokens.json
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

  const dynamicThemeBlocks = Object.entries(tokens)
    .filter(([topKey]) => topKey !== 'colors') // Exclude colors since they're handled by semantic block
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

// Run the generator if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTokens();
}

export { generateTokens };
