#!/usr/bin/env zx

/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { glob } from 'zx';

import { docblockIsComplete } from './docblock-is-complete.mjs';
import { getFileDetails } from './file-details.mjs';

const noDocblock = (
  await glob(['**/*.{js,ts,tsx,mjs}'], {
    ignore: [
      '**/.github/**',
      '**/apps/**',
      '**/__fixtures__/**',
      '**/__mock__/**',
      '**/coverage/**',
      '**/dist/**',
      '**/node_modules/**',
      'scripts/**',
      '**/tooling/**',
      '**/*.test*',
      '**/*.config*',
      '**/*.css*',
      '**/*.stories*',
    ],
  })
).filter((file) => {
  try {
    const [source, exports] = getFileDetails(file);

    // has exports and no docblock
    return exports.length && !docblockIsComplete(source);
  } catch (_) {
    // ignore non-parsing files
    return false;
  }
});

if (noDocblock.length) {
  console.error(
    `${noDocblock.length} files missing a docblock:`,
    JSON.stringify(noDocblock, null, 4),
  );

  // TODO: enable error-ing once all file are complying
  // process.exit(1);
}
