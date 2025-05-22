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
import { copyFile, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { globby } from 'globby';
import { Result } from 'true-myth';

// TODO: Future feature
// export type SmeeglConfig = {
//   folder: string[];
// };

const IGNORE_LIST = [
  // NOTE: For now, ignore. Will need later?
  '**/node_modules/**',
  '**/__{fixtures,mocks,tests}__/**',
];

function tempDir() {
  return mkdtemp(path.join(os.tmpdir(), 'smeegl-'));
}

async function duplicateFile(src: string, destDir: string) {
  const resolved = path.resolve(src);
  const base = path.basename(resolved);
  const destFile = path.join(destDir, base);

  await copyFile(resolved, destFile);

  return destFile;
}

export type GlobResult = Result<string[], string>;
export type GlobResultPromise = Promise<GlobResult>;

export async function findSprites(
  glob: string,
  rootPath: string,
): GlobResultPromise {
  try {
    const result = await globby(glob, { ignore: IGNORE_LIST, cwd: rootPath });

    return result.length ? Result.ok(result) : Result.err('No sprites found');
  } catch (err) {
    return Result.err((err as Error).message);
  }
}

export type GatherResult = Result<{ tmp: string; sprites: string[] }, string>;
export type GatherResultPromise = Promise<GatherResult>;

export async function gatherSprites(sprites: GlobResult): GatherResultPromise {
  if (sprites.isErr) {
    return Result.err(sprites.error);
  }

  try {
    const tmp = await tempDir();
    const list: string[] = sprites.unwrapOr([]);
    const result = await Promise.all(
      list.map((src) => duplicateFile(src, tmp)),
    );

    return Result.ok({ tmp, sprites: result });
  } catch (err) {
    return Result.err((err as Error).message);
  }
}

export type GenerateResult = Result<
  { tmp: string; sprites: string[]; output: string; json: string; png: string },
  string
>;
export type GenerateResultPromise = Promise<GenerateResult>;

export async function generateSprites(
  input: GatherResult,
  cmd: string,
  output: string,
): GenerateResultPromise {
  if (input.isErr) {
    return Result.err(input.error);
  }

  try {
    const { tmp, sprites } = input.unwrapOr({
      tmp: '',
      sprites: [] as string[],
    });

    await new Promise((resolve, reject) => {
      const { tmp } = input.unwrapOr({ tmp: null });

      exec(
        `${cmd} --minify-index-file --retina --recursive --unique ${tmp} ${output}`,
        (error) => {
          if (error) {
            reject(error.message);
          }

          return resolve(output);
        },
      );
    });

    const json = `${output}.json`;
    const png = `${output}.png`;

    return Result.ok({ tmp, sprites, output, json, png });
  } catch (err) {
    return Result.err((err as Error).message);
  }
}

export async function cleanUp(dir: GenerateResult): GenerateResultPromise {
  if (dir.isErr) {
    return Result.err(dir.error);
  }

  try {
    const { tmp } = dir.unwrapOr({ tmp: '' });

    if (!tmp) {
      return dir;
    }

    await rm(tmp, { recursive: true });

    return dir;
  } catch (err) {
    return Result.err((err as Error).message);
  }
}

export async function smeegl(
  rootPath: string,
  glob: string,
  out: string,
  spreet?: string,
) {
  if (!glob) {
    throw new Error('No glob pattern prvided');
  }

  // asyncCompose
  const sprites = await findSprites(glob, rootPath);
  const gathered = await gatherSprites(sprites);
  const atlas = await generateSprites(gathered, spreet ?? 'spreet', out);
  const cleaned = await cleanUp(atlas);
}
