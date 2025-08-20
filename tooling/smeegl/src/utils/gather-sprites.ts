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

import { Result } from 'true-myth';
import { copySprites } from './copy-sprites.js';
import { findCommonBasePath } from './find-common-base-path.js';
import { makeTempDirectory } from './make-temp-directory.js';
import type { CrcMode, GatherSpritesResult, GlobResult } from './types.js';

export async function gatherSprites(
  globResult: GlobResult,
  crcMode: CrcMode | null,
): Promise<GatherSpritesResult> {
  if (globResult.isErr) {
    return Result.err(globResult.error);
  }

  try {
    const tmpDir = await makeTempDirectory();
    const list: string[] = globResult.unwrapOr([]);
    const commonBasePath = findCommonBasePath(list);

    // Needed a different scope for before/after tmp dir was created
    return copySprites(tmpDir, list, commonBasePath, crcMode);
  } catch (err) {
    return Result.err({ msg: (err as Error).message.trim(), tmp: null });
  }
}
