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

import { promises, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateVariants() {
  try {
    console.log('🔄 Generating variant selectors...');

    // Read the variants.json file
    const variantsPath = path.join(
      __dirname,
      '..',
      'src',
      'variants',
      'variants.json',
    );
    const variantsContent = readFileSync(variantsPath, 'utf-8');
    const variants = JSON.parse(variantsContent);

    // Generate files in the src/tokens directory
    const outputDir = path.join(__dirname, '..', 'src', 'variants');

    await promises.mkdir(outputDir, { recursive: true });

    // Generate CSS
    const cssContent = generateCSS(variants);

    await promises.writeFile(
      path.join(outputDir, 'variants.css'),
      cssContent,
      'utf-8',
    );

    console.log('✅ Variant selectors generated successfully!');
  } catch (error) {
    console.error('❌ Error generating design tokens:', error);
    process.exit(1);
  }
}

function generateCSS(tokens) {
  const cssLines = [];

  // Generate CSS variables
  for (const [key, value] of Object.entries(tokens)) {
    cssLines.push(`@custom-variant ${key} (&:where(${value}));`);
  }

  return cssLines.join('\n');
}

// Run the generator if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateVariants();
}

export { generateVariants };
