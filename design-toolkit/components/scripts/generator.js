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

import fs from 'fs';
import path from 'path';

// Read tokens from JSON file
const tokens = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'src/tokens/tokens.json'), 'utf-8'),
);

class DesignTokenGenerator {
  constructor(tokens) {
    this.tokens = tokens;
  }

  /**
   * Flattens nested token objects into CSS variable format
   */
  flattenTokens(obj, prefix = '') {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}-${key}` : key;

      if (typeof value === 'object' && value !== null) {
        Object.assign(result, this.flattenTokens(value, newKey));
      } else {
        result[newKey] = value;
      }
    }

    return result;
  }

  /**
   * Converts kebab-case to camelCase for JavaScript
   */
  toCamelCase(str) {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Converts kebab-case to PascalCase for TypeScript types
   */
  toPascalCase(str) {
    const camelCase = this.toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }

  /**
   * Generates CSS variables from tokens
   */
  generateCSS() {
    const flattened = this.flattenTokens(this.tokens);
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
    cssLines.push(
      ' * governing permissions and limitations under the License.',
    );
    cssLines.push(' */');
    cssLines.push('');
    cssLines.push('/* Auto-generated from tokens.json - DO NOT EDIT */');
    cssLines.push('');

    // Generate CSS variables
    for (const [key, value] of Object.entries(flattened)) {
      cssLines.push(`  --${key}: ${value};`);
    }

    return `:root {\n${cssLines.join('\n')}\n}`;
  }

  /**
   * Generates JavaScript constants from tokens
   */
  generateJavaScript() {
    const flattened = this.flattenTokens(this.tokens);
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
      const camelCaseKey = this.toCamelCase(key);
      jsLines.push(`export const ${camelCaseKey} = '${value}';`);
    }

    return jsLines.join('\n');
  }

  /**
   * Generates TypeScript types and constants from tokens
   */
  generateTypeScript() {
    const flattened = this.flattenTokens(this.tokens);
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
    const tokenKeys = Object.keys(flattened).map((key) =>
      this.toCamelCase(key),
    );
    tsLines.push('export type DesignToken =');
    tsLines.push(`  | ${tokenKeys.map((key) => `'${key}'`).join('\n  | ')};`);
    tsLines.push('');

    // Generate TypeScript constants
    for (const [key, value] of Object.entries(flattened)) {
      const camelCaseKey = this.toCamelCase(key);
      tsLines.push(`export const ${camelCaseKey}: DesignToken = '${value}';`);
    }

    return tsLines.join('\n');
  }

  /**
   * Writes generated files to disk
   */
  async writeFiles(outputDir) {
    const cssContent = this.generateCSS();
    const jsContent = this.generateJavaScript();
    const tsContent = this.generateTypeScript();

    // Ensure output directory exists
    await fs.promises.mkdir(outputDir, { recursive: true });

    // Write CSS file
    await fs.promises.writeFile(
      path.join(outputDir, 'tokens.css'),
      cssContent,
      'utf-8',
    );

    // Write JavaScript file
    await fs.promises.writeFile(
      path.join(outputDir, 'tokens.js'),
      jsContent,
      'utf-8',
    );

    // Write TypeScript file
    await fs.promises.writeFile(
      path.join(outputDir, 'tokens.ts'),
      tsContent,
      'utf-8',
    );
  }
}

// Export the generator instance
export const tokenGenerator = new DesignTokenGenerator(tokens);

// Export the tokens for direct use
export { tokens };
