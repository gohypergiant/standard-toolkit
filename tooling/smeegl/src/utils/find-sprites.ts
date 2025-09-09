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

import path from 'node:path';
import { globby } from 'globby';
import { Result } from 'true-myth';
import { findCommonBasePath } from './find-common-base-path.js';
import { readSvgFilesFromInputDirectory } from './read-svg-files-from-input-directory.js';
import type fs from 'node:fs';
import type { FindSpritesResult, SpriteInfo } from './types.js';

const IGNORE_LIST = [
  // NOTE: For now, ignore. Will need later?
  '**/node_modules/**',
  '**/__{fixtures,mocks,tests}__/**',
];

const _fileListFromGlobby = async (glob: string, rootPath: string) => {
  const fileList = await globby(glob, {
    ignore: IGNORE_LIST,
    cwd: rootPath,
  });

  const _toSpriteInfo = (filePath: string) => {
    const parentPathArr = filePath.split(path.sep);
    parentPathArr.pop();
    const parentPath = parentPathArr.join(path.sep);
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);

    const result: SpriteInfo = { name, parentPath, fileName, filePath };
    return result;
  };

  return fileList.map(_toSpriteInfo);
};

const _fileListFromPath = (inputPath: string) => {
  const files = readSvgFilesFromInputDirectory(inputPath);

  const _toSpriteInfo = (it: fs.Dirent) => {
    const { name: fileName, parentPath } = it;

    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);
    const filePath = path.join(parentPath, fileName);

    const result: SpriteInfo = { name, parentPath, fileName, filePath };
    return result;
  };

  return files.map(_toSpriteInfo);
};

/**
 * Find all of the svg files in the glob pattern, returning the paths as strings
 *
 * @param glob possibly falsy
 * @param inputPath possibly falsy
 * @param rootPath
 * @returns
 */
export async function findSprites(
  glob: string,
  inputPath: string,
  rootPath: string,
  tmpDir: string,
): Promise<FindSpritesResult> {
  try {
    const sprites = glob
      ? await _fileListFromGlobby(glob, rootPath)
      : _fileListFromPath(inputPath);

    const spritesPaths = sprites.map((it) => it.filePath);
    const commonBasePath = findCommonBasePath(spritesPaths);

    return sprites.length
      ? Result.ok({ tmp: tmpDir, sprites, commonBasePath })
      : Result.err({
          msg: `No sprites found; glob: ${glob} rootPath: ${rootPath} `,
          tmp: null,
        });
  } catch (err) {
    return Result.err({ msg: (err as Error).message.trim(), tmp: null });
  }
}
