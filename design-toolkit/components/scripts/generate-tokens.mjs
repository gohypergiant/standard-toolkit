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

    // Generate files in the src/tokens directory
    const outputDir = path.join(__dirname, '..', 'src', 'tokens', 'generated');

    // Ensure output directory exists
    await fs.promises.mkdir(outputDir, { recursive: true });

    // Generate CSS variables
    const cssContent = generateCSS(tokens);
    await fs.promises.writeFile(
      path.join(outputDir, 'tokens.css'),
      cssContent,
      'utf-8',
    );

    // Generate TypeScript constants and types
    const tsContent = generateTypeScript(tokens);
    await fs.promises.writeFile(
      path.join(outputDir, 'tokens.ts'),
      tsContent,
      'utf-8',
    );

    console.log('✅ Design tokens generated successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log('📄 Generated files:');
    console.log('   - tokens.css (CSS variables)');
    console.log('   - tokens.ts (TypeScript constants and types)');
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

function generateTypeScript(tokens) {
  const flattened = flattenTokens(tokens);
  const resolved = resolveReferences(flattened);
  const tsLines = [];

  tsLines.push('');
  tsLines.push('export type RGBAColor = [number, number, number, number];');
  tsLines.push('');

  // Generate TypeScript constants (with RGBAColor type for colors)
  for (const [key, value] of Object.entries(resolved)) {
    const camelCaseKey = toCamelCase(key);
    if (isHexColor(value)) {
      const rgba = hexToRgbaTuple(value);
      tsLines.push(
        `export const ${camelCaseKey}: RGBAColor = [${rgba.join(', ')}];`,
      );
    } else if (isRgbaString(value)) {
      const rgba = rgbaStringToRgbaTuple(value);
      if (rgba) {
        tsLines.push(
          `export const ${camelCaseKey}: RGBAColor = [${rgba.join(', ')}];`,
        );
      } else {
        tsLines.push(`export const ${camelCaseKey} = '${value}';`);
      }
    } else if (typeof value === 'string' && value.endsWith('px')) {
      // Emit pixel values as numbers
      const num = Number.parseFloat(value.replace('px', ''));
      tsLines.push(`export const ${camelCaseKey} = ${num};`);
    } else {
      tsLines.push(`export const ${camelCaseKey} = '${value}';`);
    }
  }

  return tsLines.join('\n');
}

// Run the generator if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTokens();
}

export { generateTokens };
