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

import ansis from 'ansis';

import ora from 'ora';
import { Result } from 'true-myth';
import { cleanUpTempDirectory } from './utils/clean-up-temp-directory.js';
import { copySpritesToTempDirectory } from './utils/copy-sprites-to-temp-directory.js';
import { generateConstantsFile } from './utils/generate-constants-file.js';
import { generateSprites } from './utils/generate-sprites.js';
import type {
  CopySpritesResult,
  CrcType,
  FindSpritesResult,
  GenerateConstantsResult,
  GenerateSpritesResult,
} from './utils/types.js';

export async function copyToTemp(
  prevResults: FindSpritesResult,
  crcMode: CrcType | null,
) {
  if (prevResults.isErr) {
    return Result.err(prevResults.error);
  }

  const spinner = ora('Preparing sprites for the spritesheet');
  spinner.start();

  const {
    tmp: tmpDir,
    sprites,
    commonBasePath,
  } = prevResults.unwrapOr({ tmp: '', sprites: [], commonBasePath: '' });

  if (!tmpDir) {
    return Result.err({
      msg: 'Temp directory is falsy',
      tmp: null,
    });
  }

  const result = await copySpritesToTempDirectory(
    tmpDir,
    sprites,
    commonBasePath,
    crcMode,
    spinner,
  );

  result.match({
    Ok: () => spinner.succeed('Spritesheet preparation complete'),
    Err: ({ msg }) => spinner.fail(msg),
  });

  return result;
}

export async function generate(
  prevResults: CopySpritesResult,
  cmd: string,
  output: string,
) {
  if (prevResults.isErr) {
    return Result.err(prevResults.error);
  }

  const spinner = ora('Generating spritesheet');
  spinner.start();

  const result = await generateSprites(prevResults, cmd, output);

  result.match({
    Ok: ({ png }) =>
      spinner.succeed(`Generated spritesheet ${ansis.italic.cyan(png)}`),
    Err: ({ msg }) => spinner.fail(msg),
  });

  return result;
}

export async function constants(prevResults: GenerateSpritesResult) {
  if (prevResults.isErr) {
    return Result.err(prevResults.error);
  }

  const spinner = ora('Generating constant mapping');
  spinner.start();

  const result = await generateConstantsFile(prevResults);

  result.match({
    Ok: () => spinner.succeed(),
    Err: ({ msg }) => spinner.fail(msg),
  });

  return result;
}

export async function clean(prevResults: GenerateConstantsResult) {
  const spinner = ora('Cleaning up');
  spinner.start();

  const result = await cleanUpTempDirectory(prevResults);

  result.match({
    Ok: () => spinner.succeed(),
    Err: (e) => spinner.fail(e),
  });

  return result;
}

export async function buildSpritesheet(
  findSpriteResult: FindSpritesResult,
  crcMode: CrcType | null,
  cmd: string,
  out: string,
) {
  const gatheredResult = await copyToTemp(findSpriteResult, crcMode);
  const generatedResults = await generate(gatheredResult, cmd, out);
  const constantsResults = await constants(generatedResults);

  await clean(constantsResults);
  console.log('Spritesheet Build complete.');
}
