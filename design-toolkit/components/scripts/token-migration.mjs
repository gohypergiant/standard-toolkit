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

import { fs, glob } from 'zx';

// derived from design-toolkit/components/src/foundation/token-data.ts
const fullColorTokenSet = new Set([
  'bg-surface-default',
  'bg-surface-raised',
  'bg-surface-overlay',
  'bg-surface-muted',
  'bg-interactive-bold',
  'bg-interactive-bold-hover',
  'bg-interactive-bold-pressed',
  'bg-interactive-muted',
  'bg-interactive-muted-hover',
  'bg-interactive-muted-pressed',
  'bg-interactive-disabled',
  'bg-accent-primary-bold',
  'bg-accent-primary-hover',
  'bg-accent-primary-pressed',
  'bg-accent-primary-muted',
  'bg-info-bold',
  'bg-info-hover',
  'bg-info-pressed',
  'bg-info-muted',
  'bg-advisory-bold',
  'bg-advisory-hover',
  'bg-advisory-pressed',
  'bg-advisory-muted',
  'bg-normal-bold',
  'bg-normal-hover',
  'bg-normal-pressed',
  'bg-normal-muted',
  'bg-serious-bold',
  'bg-serious-hover',
  'bg-serious-pressed',
  'bg-serious-muted',
  'bg-critical-bold',
  'bg-critical-hover',
  'bg-critical-pressed',
  'bg-critical-muted',
  'fg-primary-bold',
  'fg-primary-muted',
  'fg-inverse-bold',
  'fg-inverse-muted',
  'fg-disabled',
  'fg-accent-primary-bold',
  'fg-accent-primary-hover',
  'fg-accent-primary-pressed',
  'fg-info-bold',
  'fg-info-hover',
  'fg-primary-muted',
  'fg-advisory-bold',
  'fg-advisory-hover',
  'fg-advisory-pressed',
  'fg-normal-bold',
  'fg-normal-hover',
  'fg-normal-pressed',
  'fg-serious-bold',
  'fg-serious-hover',
  'fg-serious-pressed',
  'fg-critical-bold',
  'fg-critical-hover',
  'fg-critical-pressed',
  'fg-a11y-on-accent',
  'fg-a11y-on-utility',
  'outline-static',
  'outline-interactive',
  'outline-interactive-hover',
  'outline-interactive-pressed',
  'outline-interactive-disabled',
  'outline-accent-primary-bold',
  'outline-accent-primary-hover',
  'outline-accent-primary-pressed',
  'outline-info-bold',
  'outline-info-hover',
  'outline-info-pressed',
  'outline-advisory-bold',
  'outline-advisory-hover',
  'outline-advisory-pressed',
  'outline-normal-bold',
  'outline-normal-hover',
  'outline-normal-pressed',
  'outline-serious-bold',
  'outline-serious-hover',
  'outline-serious-pressed',
  'outline-critical-bold',
  'outline-critical-hover',
  'outline-critical-pressed',

  // built ins that can be ignored
  'bg-transparent',
  'outline-none',
  'outline-transparent',
  'bg-initial',
]);

// from https://www.figma.com/design/9kqcWHdToDaWhvZSpkCO7c/CORE-DS-Design-Initiatives?node-id=56130-400&t=tqBFJhWrvp5yIWt9-4
const replacementMap = new Map([
  // bgs
  ['bg-transparent-dark', 'bg-surface-muted'],
  ['bg-interactive-default', 'bg-interactive-muted'],
  ['bg-interactive-hover-light', 'bg-interactive-muted-hover'],
  ['bg-highlight-subtle', 'bg-accent-primary-muted'],
  ['bg-info-subtle', 'bg-info-muted'],
  ['bg-advisory-subtle', 'bg-advisory-muted'],
  ['bg-normal-subtle', 'bg-normal-muted'],
  ['bg-serious-subtle', 'bg-serious-muted'],
  ['bg-critical-subtle', 'bg-critical-muted'],
  // fgs
  ['fg-default-light', 'fg-primary-bold'],
  ['fg-default-dark', 'fg-primary-muted'],
  ['fg-inverse-light', 'fg-inverse-bold'],
  ['fg-inverse-dark', 'fg-inverse-muted'],
  ['fg-highlight', 'fg-accent-primary-bold'],
  ['fg-info', 'fg-info-bold'],
  ['fg-advisory', 'fg-advisory-bold'],
  ['fg-normal', 'fg-normal-bold'],
  ['fg-serious', 'fg-serious-bold'],
  ['fg-critical', 'fg-critical-bold'],
  // outline
  ['outline-static-light', 'outline-static'],
  ['outline-highlight', 'outline-accent-primary-bold'],
  ['outline-info', 'outline-info-bold'],
  ['outline-advisory', 'outline-advisory-bold'],
  ['outline-normal', 'outline-normal-bold'],
  ['outline-serious', 'outline-serious-bold'],
  ['outline-critical', 'outline-critical-bold'],
  // border
  ['border-static-light', 'outline-static'],
  ['border-highlight', 'outline-accent-primary-bold'],
  ['border-info', 'outline-info-bold'],
  ['border-advisory', 'outline-advisory-bold'],
  ['border-normal', 'outline-normal-bold'],
  ['border-serious', 'outline-serious-bold'],
  ['border-critical', 'outline-critical-bold'],
]);

const leGlob = 'src/**/*.{ts,tsx}';
console.log(`🔍 Finding and replacing in ${leGlob}`);

const files = await glob(leGlob, {
  // tailor this to your needs
  ignoreFiles: ['**/token-data.ts'],
});
console.log(`📁 Found ${files.length} files to process`);

const unknownTokens = new Set();
let totalReplacements = 0;
for (const file of files) {
  let content = await fs.readFile(file, 'utf8');

  // replace old tokens with new tokens
  let replacementsInFile = 0;
  for (const [oldToken, newToken] of replacementMap.entries()) {
    const regex = new RegExp(`${oldToken}(?!-)\\b`, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, newToken);
      replacementsInFile += matches.length;
    }
  }
  if (replacementsInFile > 0) {
    await fs.writeFile(file, content, 'utf8');
    console.log(`✅ ${file}: ${replacementsInFile} replacements`);
    totalReplacements += replacementsInFile;
  }

  // After replacing old tokens, detect unknown color classes
  const regex = /(fg-|bg-|outline-)([a-zA-Z\d-]+)/g;
  const matches = content.matchAll(regex);
  for (const [token] of matches) {
    if (!fullColorTokenSet.has(token)) {
      unknownTokens.add(token);
    }
  }
}
console.log(`\n🎉 Complete! Made ${totalReplacements} total replacements`);

if (unknownTokens.size) {
  console.log('🚨 Unknown tokens detected:');
  for (const unknownToken of unknownTokens.values()) {
    console.log(`  - ${unknownToken}`);
  }
  console.log('⚠️ These will need to be adjusted manually');
}
