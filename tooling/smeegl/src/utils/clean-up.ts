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

import { rm } from 'node:fs/promises';
import { Result, Unit } from 'true-myth';
import type { CleanResult, ConstantsResult } from './types.js';

export async function cleanUp(
  constResult: ConstantsResult,
): Promise<CleanResult> {
  try {
    let tempDir: string | null;

    if (constResult.isErr) {
      tempDir = constResult.error.tmp;
    } else {
      const { tmp } = constResult.unwrapOr({ tmp: '' });
      tempDir = tmp;
    }

    // If there is no `tmp` directory, then it failed before
    // creating it so no further clean up is needed.
    if (!tempDir) {
      return Result.ok(Unit);
    }

    await rm(tempDir, { recursive: true });

    return Result.ok(Unit);
  } catch (err) {
    console.log(err);
    return Result.err((err as Error).message.trim());
  }
}
