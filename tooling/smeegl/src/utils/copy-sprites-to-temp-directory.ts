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
import * as path from 'node:path';
import crc32 from 'crc32-universal';
import { Result } from 'true-myth';
import { logMsg, logWarning } from '../log-messages.js';
import { duplicateFile } from './duplicate-file.js';
import type { Ora } from 'ora';
import type { CopySpritesResult, CrcType, SpriteInfo } from './types.js';

export async function copySpritesToTempDirectory(
  tmpDir: string,
  sprites: SpriteInfo[],
  commonBasePath: string,
  crcMode: CrcType | null,
  spinner?: Ora,
): Promise<CopySpritesResult> {
  try {
    const updatedSprites = (
      await Promise.all<SpriteInfo>(
        sprites.map(async (sprite) => {
          const result: SpriteInfo = { ...sprite };
          const { filePath } = sprite;
          if (!fs.existsSync(filePath)) {
            logWarning(
              `Source svg file does not exist: ${filePath}. Continuing on.`,
              spinner,
            );

            return result;
          }

          const srcStats = fs.statSync(filePath);

          if (!srcStats.isFile() || srcStats.size === 0) {
            logWarning(
              `Source svg file is invalid: ${filePath}. Please check the file and adjust. Continuing on.`,
              spinner,
            );

            return result;
          }

          result.fileName = filePath
            .toLowerCase() // normalize to lowercase
            .replace(commonBasePath, '') // remove common base path
            .replaceAll(/^\//g, '') // remove leading slashes
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

          result.fileName = `${result.indexName}.svg`;

          result.filePath = await duplicateFile(
            filePath,
            tmpDir,
            result.fileName,
          );

          logMsg(
            `Copied ${path.relative(process.cwd(), filePath)} -> ${result.filePath}`,
            spinner,
          );

          return result;
        }),
      )
    ).filter((it) => Boolean(it.indexName));

    return Result.ok({ tmp: tmpDir, sprites: updatedSprites });
  } catch (err) {
    return Result.err({ msg: (err as Error).message.trim(), tmp: tmpDir });
  }
}
