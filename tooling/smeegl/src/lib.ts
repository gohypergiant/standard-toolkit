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
import path from 'node:path';
import { buildReactFiles } from './build-react-files.js';
import { buildSpritesheet } from './build-spritesheet.js';
import { findSprites } from './utils/find-sprites.js';
import { makeTempDirectory } from './utils/make-temp-directory.js';
import { validateInput } from './validate-input.js';
import type { CrcType, TargetType } from './utils/types.js';

// NOTE: It is more ideal to use Task instead in the util functions.
// But it seems under construction at the moment? Or something isn't exposed properly.

export async function smeegl(
  rootPath: string,
  glob: string, // Can be blank. If so, inputDir must be set to a valid directory
  out: string,
  spreet?: string,
  crcMode: CrcType | null = null,
  inOpt = '',
  outOpt = '',
  target: TargetType = 'SPRITESHEET',
) {
  const cwd = process.cwd();
  const cmd = spreet ?? 'spreet';

  const outputArgResolved =
    typeof out === 'string' && out !== ''
      ? path.resolve(out)
      : path.join(cwd, 'atlas');

  const inputPath =
    typeof inOpt === 'string' && inOpt !== '' ? path.relative(cwd, inOpt) : '';

  const outputPath = outOpt ?? outputArgResolved;

  validateInput(glob, inputPath);

  const tmpDir = await makeTempDirectory();
  const findSpriteResult = await findSprites(glob, inputPath, rootPath, tmpDir);

  if (target === 'SPRITESHEET') {
    await buildSpritesheet(findSpriteResult, crcMode, cmd, outputPath);
  } else {
    buildReactFiles(findSpriteResult, inputPath, outputPath);
  }
}
