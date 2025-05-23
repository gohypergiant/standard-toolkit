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
import { duplicateFile, tempDir } from './file-sys.js';
import type { GatherResult, GlobResult } from './types.js';

async function copySprites(tmp: string, sprites: string[]) {
  try {
    const movedSprites = await Promise.all(
      sprites.map((src) => duplicateFile(src, tmp)),
    );

    return Result.ok({ tmp, sprites: movedSprites });
  } catch (err) {
    return Result.err({ msg: (err as Error).message.trim(), tmp });
  }
}

export async function gatherSprites(
  globResult: GlobResult,
): Promise<GatherResult> {
  if (globResult.isErr) {
    return Result.err(globResult.error);
  }

  try {
    const tmp = await tempDir();
    const list: string[] = globResult.unwrapOr([]);

    // Needed a different scope for before/after tmp dir was created
    return copySprites(tmp, list);
  } catch (err) {
    return Result.err({ msg: (err as Error).message.trim(), tmp: null });
  }
}
