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

export async function gatherSprites(
  globResult: GlobResult,
): Promise<GatherResult> {
  if (globResult.isErr) {
    return Result.err(globResult.error);
  }

  try {
    const tmp = await tempDir();
    const list: string[] = globResult.unwrapOr([]);
    const sprites = await Promise.all(
      list.map((src) => duplicateFile(src, tmp)),
    );

    return Result.ok({ tmp, sprites });
  } catch (err) {
    return Result.err((err as Error).message);
  }
}
