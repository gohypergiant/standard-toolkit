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

import { readFile, writeFile } from 'node:fs/promises';
import { Result } from 'true-myth';
import type { ConstantsResult, GenerateResult } from './types.js';

export async function generateConst(
  genResult: GenerateResult,
): Promise<ConstantsResult> {
  if (genResult.isErr) {
    return Result.err(genResult.error);
  }

  try {
    const { json, tmp } = genResult.unwrapOr({ tmp: '', json: '' });
    const content = await readFile(json, 'utf-8');
    const atlasObj = JSON.parse(content);

    const constExports = Object.keys(atlasObj)
      .map((key) => {
        const exportVar = key.toUpperCase().replaceAll('-', '_');
        return `export const ${exportVar} = '${key}'`;
      })
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    const fileName = json.replace('.json', '.ts');
    const constContent = `/**
 * THIS IS A GENERATED FILE. DO NOT ALTER DIRECTLY.
 */

${constExports.join('\n')}`;

    await writeFile(fileName, constContent);

    return Result.ok({ tmp });
  } catch (err) {
    const { tmp } = genResult.unwrapOr({ tmp: '' });

    return Result.err({ msg: (err as Error).message.trim(), tmp });
  }
}
