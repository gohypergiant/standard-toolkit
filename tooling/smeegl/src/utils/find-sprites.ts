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

import { globby } from 'globby';
import { Result } from 'true-myth';
import type { GlobResult } from './types.js';

const IGNORE_LIST = [
  // NOTE: For now, ignore. Will need later?
  '**/node_modules/**',
  '**/__{fixtures,mocks,tests}__/**',
];

export async function findSprites(
  glob: string,
  rootPath: string,
): Promise<GlobResult> {
  try {
    const result = await globby(glob, {
      ignore: IGNORE_LIST,
      cwd: rootPath,
    });

    return result.length
      ? Result.ok(result)
      : Result.err({
          msg: `No sprites found; glob: ${glob} rootPath: ${rootPath} `,
          tmp: null,
        });
  } catch (err) {
    return Result.err({ msg: (err as Error).message.trim(), tmp: null });
  }
}
