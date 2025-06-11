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

import { cleanUp } from './utils/clean-up.js';
import { findSprites } from './utils/find-sprites.js';
import { gatherSprites } from './utils/gather-sprites.js';
import { generateConst } from './utils/generate-const.js';
import { generateSprites } from './utils/generate-sprites.js';

// NOTE: It is more ideal to use Task instead in the util functions.
// But it seems under construction at the moment? Or something isn't exposed properly.

export async function smeegl(
  rootPath: string,
  glob: string,
  out: string,
  spreet?: string,
) {
  if (!glob) {
    throw new Error('No glob pattern provided');
  }

  // TODO: Need to add async compose to core
  const sprites = await findSprites(glob, rootPath);
  const gathered = await gatherSprites(sprites);
  const atlas = await generateSprites(gathered, spreet ?? 'spreet', out);
  const genConst = await generateConst(atlas);

  await cleanUp(genConst);
}
