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

import * as fs from 'node:fs';
import crc32 from 'crc32-universal';
import { Result } from 'true-myth';
import { duplicateFile } from './duplicate-file.js';
import type { CrcMode, GatherSpritesResult, SpriteInfo } from './types.js';

export async function copySprites(
  tmpDir: string,
  sourceFileNames: string[],
  commonBasePath: string,
  crcMode: CrcMode | null,
): Promise<GatherSpritesResult> {
  try {
    const sprites = (
      await Promise.all<SpriteInfo>(
        sourceFileNames.map(async (sourceFileName) => {
          const result: SpriteInfo = {
            name: '',
            indexName: '',
            fileName: '',
            filePath: '',
          };

          if (!fs.existsSync(sourceFileName)) {
            console.error(
              `❌ Error: Source svg file does not exist: ${sourceFileName}. Continuing on.`,
            );
            return result;
          }

          const srcStats = fs.statSync(sourceFileName);

          if (!srcStats.isFile() || srcStats.size === 0) {
            console.error(
              `❌ Error: Source svg file is invalid: ${sourceFileName}. Please check the file and adjust. Continuing on.`,
            );
            return result;
          }

          const fnWithExportedDirectoryStructure = sourceFileName
            .toLowerCase() // normalize to lowercase
            .replace(commonBasePath, '') // remove common base path
            .replaceAll(/^\//g, ''); // remove leading slashes

          result.fileName = fnWithExportedDirectoryStructure
            .replaceAll(/\//g, '-') // replace directory separators with hyphens
            .replaceAll(/ /g, '-') // replace spaces with hyphens
            .replaceAll(/\(\)/g, ''); // remove parentheses

          result.name = result.fileName.replaceAll(/\.svg$/g, ''); // remove .svg extension

          result.indexName =
            crcMode === 'HEX'
              ? `${crc32(Buffer.from(result.fileName)).toString(16).padStart(8, '0')}`
              : crcMode === 'DEC'
                ? `${crc32(Buffer.from(result.fileName)).toString(10)}`
                : result.name;

          result.filePath = await duplicateFile(
            sourceFileName,
            tmpDir,
            `${result.indexName}.svg`,
          );

          return result;
        }),
      )
    ).filter((it) => it.fileName !== '');

    return Result.ok({ tmp: tmpDir, sprites });
  } catch (err) {
    return Result.err({ msg: (err as Error).message.trim(), tmp: tmpDir });
  }
}
