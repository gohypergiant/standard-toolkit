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

import { fs, path, argv, glob } from 'zx';
import { COMMENT_STYLES, getFormattedHeader } from './license.js';

const filesToParse = argv.files?.split(' ');
const files = await glob(
  filesToParse && filesToParse.length > 0
    ? filesToParse
    : [`**/*{${Object.keys(COMMENT_STYLES).join(',')}}`],
  {
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/README.md',
      '**/LICENSE.md',
      '**/CHANGELOG.md',
      '**/.changeset/**/*.md',
      '**/.github/**/*.md',
      '**/*.md',
      '**/*.mdx',
    ],
  },
);

for (const file of files) {
  const fileExtension = path.extname(file);
  const isFileExtensionSupported = fileExtension in COMMENT_STYLES; // check extension for the case where specific files are passed to the script

  let contents = fs.readFileSync(file, 'utf8');
  if (isFileExtensionSupported && !/Copyright \d+ Hypergiant/.test(contents)) {
    const header = getFormattedHeader(fileExtension);
    const interpreterDirective = contents.match(/^#!.*$/m)?.[0];

    if (interpreterDirective) {
      contents = contents.replace(interpreterDirective, '').trimStart();
      contents = `${interpreterDirective}\n\n${header}\n${contents}`;
    } else {
      contents = `${header}\n${contents}`;
    }

    fs.writeFileSync(file, contents);
  }
}
