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

import ora, { type Ora } from 'ora';
import { cleanUpTempDirectory } from './utils/clean-up-temp-directory.js';
import { copySpritesToTempDirectory } from './utils/copy-sprites-to-temp-directory.js';
import { generateConstantsFile } from './utils/generate-constants-file.js';
import { generateSprites } from './utils/generate-sprites.js';
import type {
  CrcType,
  FindSpritesResult,
  GenerateConstantsResult,
} from './utils/types.js';

export async function clean(
  prevResults: GenerateConstantsResult,
  spinner: Ora,
): Promise<void> {
  spinner.text = 'Cleaning up';
  spinner.start();

  const result = await cleanUpTempDirectory(prevResults);

  result.match({
    Ok: () => spinner.succeed(),
    Err: (e) => spinner.fail(e),
  });
}

export async function buildSpritesheet(
  findSpriteResult: FindSpritesResult,
  crcMode: CrcType | null,
  cmd: string,
  out: string,
): Promise<void> {
  const spinner = ora('Preparing sprites for the spritesheet');
  spinner.start();

  const {
    tmp: tmpDir,
    sprites,
    commonBasePath,
  } = findSpriteResult.unwrapOr({ tmp: '', sprites: [], commonBasePath: '' });

  if (!tmpDir) {
    spinner.fail('Temp directory is falsy');
    return;
  }

  const copyResult = await copySpritesToTempDirectory(
    tmpDir,
    sprites,
    commonBasePath,
    crcMode,
    spinner,
  );

  copyResult.match({
    Ok: () => spinner.succeed('Spritesheet preparation complete'),
    Err: ({ msg }) => spinner.fail(msg),
  });

  if (copyResult.isErr) {
    return await clean(copyResult, spinner);
  }

  spinner.text = 'Generating spritesheet';
  spinner.start();

  const generatedResults = await generateSprites(copyResult, cmd, out);
  generatedResults.match({
    Ok: ({ png }) =>
      spinner.succeed(`Generated spritesheet ${ansis.italic.cyan(png)}`),
    Err: ({ msg }) => spinner.fail(msg),
  });

  if (generatedResults.isErr) {
    return await clean(generatedResults, spinner);
  }

  spinner.text = 'Generating constant mapping';
  spinner.start();

  const generateConstantsResults =
    await generateConstantsFile(generatedResults);

  generateConstantsResults.match({
    Ok: () => spinner.succeed(),
    Err: ({ msg }) => spinner.fail(msg),
  });

  await clean(generateConstantsResults, spinner);
}
