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

import { exec } from 'node:child_process';
import util from 'node:util';
import { Result } from 'true-myth';
import type { GatherSpritesResult, GenerateSpritesResult } from './types.js';

const execProm = util.promisify(exec);

export async function generateSprites(
  gatherResult: GatherSpritesResult,
  cmd: string,
  output: string,
): Promise<GenerateSpritesResult> {
  if (gatherResult.isErr) {
    return Result.err(gatherResult.error);
  }

  try {
    const { tmp } = gatherResult.unwrapOr({ tmp: '' });

    await execProm(
      `${cmd} --minify-index-file --retina --recursive --unique ${tmp} ${output}`,
    );

    const json = `${output}.json`;
    const png = `${output}.png`;

    const { sprites } = gatherResult.unwrapOr({ tmp: '', sprites: [] });

    return Result.ok({ tmp, json, png, sprites });
  } catch (err) {
    const { tmp } = gatherResult.unwrapOr({ tmp: '' });

    return Result.err({ msg: (err as Error).message.trim(), tmp });
  }
}
