#!/usr/bin/env node

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
import { readFileSync } from 'fs';

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

    // Generate JavaScript constants
    const jsContent = generateJavaScript(tokens);
    await fs.promises.writeFile(
      path.join(outputDir, 'tokens.js'),
      jsContent,
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
    console.log('   - tokens.js (JavaScript constants)');
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

  // Add copyright header
  cssLines.push('/*');
  cssLines.push(
    ' * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.',
  );
  cssLines.push(
    ' * This file is licensed to you under the Apache License, Version 2.0 (the "License");',
  );
  cssLines.push(
    ' * you may not use this file except in compliance with the License. You may obtain a copy',
  );
  cssLines.push(
    ' * of the License at https://www.apache.org/licenses/LICENSE-2.0',
  );
  cssLines.push(' *');
  cssLines.push(
    ' * Unless required by applicable law or agreed to in writing, software distributed under',
  );
  cssLines.push(
    ' * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS',
  );
  cssLines.push(
    ' * OF ANY KIND, either express or implied. See the License for the specific language',
  );
  cssLines.push(' * governing permissions and limitations under the License.');
  cssLines.push(' */');
  cssLines.push('');
  cssLines.push('/* Auto-generated from tokens.json - DO NOT EDIT */');
  cssLines.push('');

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

function generateJavaScript(tokens) {
  const flattened = flattenTokens(tokens);
  const jsLines = [];

  // Add copyright header
  jsLines.push('/*');
  jsLines.push(
    ' * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.',
  );
  jsLines.push(
    ' * This file is licensed to you under the Apache License, Version 2.0 (the "License");',
  );
  jsLines.push(
    ' * you may not use this file except in compliance with the License. You may obtain a copy',
  );
  jsLines.push(
    ' * of the License at https://www.apache.org/licenses/LICENSE-2.0',
  );
  jsLines.push(' *');
  jsLines.push(
    ' * Unless required by applicable law or agreed to in writing, software distributed under',
  );
  jsLines.push(
    ' * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS',
  );
  jsLines.push(
    ' * OF ANY KIND, either express or implied. See the License for the specific language',
  );
  jsLines.push(' * governing permissions and limitations under the License.');
  jsLines.push(' */');
  jsLines.push('');
  jsLines.push('/* Auto-generated from tokens.json - DO NOT EDIT */');
  jsLines.push('');

  // Generate JavaScript constants
  for (const [key, value] of Object.entries(flattened)) {
    const camelCaseKey = toCamelCase(key);
    jsLines.push(`export const ${camelCaseKey} = '${value}';`);
  }

  return jsLines.join('\n');
}

function generateTypeScript(tokens) {
  const flattened = flattenTokens(tokens);
  const tsLines = [];

  // Add copyright header
  tsLines.push('/*');
  tsLines.push(
    ' * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.',
  );
  tsLines.push(
    ' * This file is licensed to you under the Apache License, Version 2.0 (the "License");',
  );
  tsLines.push(
    ' * you may not use this file except in compliance with the License. You may obtain a copy',
  );
  tsLines.push(
    ' * of the License at https://www.apache.org/licenses/LICENSE-2.0',
  );
  tsLines.push(' *');
  tsLines.push(
    ' * Unless required by applicable law or agreed to in writing, software distributed under',
  );
  tsLines.push(
    ' * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS',
  );
  tsLines.push(
    ' * OF ANY KIND, either express or implied. See the License for the specific language',
  );
  tsLines.push(' * governing permissions and limitations under the License.');
  tsLines.push(' */');
  tsLines.push('');
  tsLines.push('/* Auto-generated from tokens.json - DO NOT EDIT */');
  tsLines.push('');

  // Generate TypeScript types
  const tokenKeys = Object.keys(flattened).map((key) => toCamelCase(key));
  tsLines.push('export type DesignToken =');
  tsLines.push(`  | ${tokenKeys.map((key) => `'${key}'`).join('\n  | ')};`);
  tsLines.push('');

  // Generate TypeScript constants (no type annotation)
  for (const [key, value] of Object.entries(flattened)) {
    const camelCaseKey = toCamelCase(key);
    tsLines.push(`export const ${camelCaseKey} = '${value}';`);
  }

  return tsLines.join('\n');
}

// Run the generator if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTokens();
}

export { generateTokens };
