#! /usr/bin/env node
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
import ansis from 'ansis';
import { Command } from 'commander';
import ora from 'ora';
import { Result } from 'true-myth';
import { cleanUpTempDirectory } from './utils/clean-up-temp-directory.js';
import { findSprites } from './utils/find-sprites.js';
import { gatherSprites } from './utils/gather-sprites.js';
import { generateConstantsFile } from './utils/generate-constants-file.js';
import { generateSprites } from './utils/generate-sprites.js';
import type {
  CrcMode,
  GatherSpritesResult,
  GenerateConstantsResult,
  GenerateSpritesResult,
  GlobResult,
} from './utils/types.js';

const program = new Command();

type CmdOptions = {
  spreet?: string;
  crc?: CrcMode;
};

async function find(glob: string, rootPath: string) {
  const spinner = ora('Finding sprites');
  spinner.start();

  const result = await findSprites(glob, rootPath);

  result.match({
    Ok: (r) => spinner.succeed(`Found ${ansis.bold.cyan(r.length)} sprites`),
    Err: ({ msg }) => spinner.fail(msg),
  });

  return result;
}

async function gather(sprites: GlobResult, crcMode: CrcMode | null) {
  if (sprites.isErr) {
    return Result.err(sprites.error);
  }

  const spinner = ora('Gathering sprites');
  spinner.start();

  const result = await gatherSprites(sprites, crcMode);

  result.match({
    Ok: () => spinner.succeed(),
    Err: ({ msg }) => spinner.fail(msg),
  });

  return result;
}

async function generate(
  input: GatherSpritesResult,
  cmd: string,
  output: string,
) {
  if (input.isErr) {
    return Result.err(input.error);
  }

  const spinner = ora('Generating spritesheet');
  spinner.start();

  const result = await generateSprites(input, cmd, output);

  result.match({
    Ok: ({ png }) =>
      spinner.succeed(`Generated spritesheet ${ansis.italic.cyan(png)}`),
    Err: ({ msg }) => spinner.fail(msg),
  });

  return result;
}

async function constants(input: GenerateSpritesResult) {
  if (input.isErr) {
    return Result.err(input.error);
  }

  const spinner = ora('Generating constant mapping');
  spinner.start();

  const result = await generateConstantsFile(input);

  result.match({
    Ok: () => spinner.succeed(),
    Err: ({ msg }) => spinner.fail(msg),
  });

  return result;
}

async function clean(dir: GenerateConstantsResult) {
  const spinner = ora('Cleaning up');
  spinner.start();

  const result = await cleanUpTempDirectory(dir);

  result.match({
    Ok: () => spinner.succeed(),
    Err: (e) => spinner.fail(e),
  });

  return result;
}

program
  .name('smeegl')
  .description('CLI tool to create spritesheets from an SVG glob pattern')
  .argument('<GLOB>', 'SVG glob pattern')
  .argument('[OUTPUT]', 'The atlas output path, CWD if none given')
  .option(
    '--spreet <path>',
    'Path to pre-built spreet binary, unneeded if installed',
  )
  .option(
    '--crc <MODE>',
    'Sprite names will be converted to crc32, either DEC or HEX',
  )
  .action(
    async (glob: string, out: string | undefined, options: CmdOptions) => {
      const newOut = out
        ? path.resolve(out)
        : path.join(process.cwd(), 'atlas');
      const cmd = options.spreet ?? 'spreet';
      const crcMode = options.crc ?? null;

      if (!glob) {
        console.error(ansis.red('Error: No glob pattern provided'));
        process.exit(1);
      }

      if (!glob.endsWith('.svg')) {
        console.warn(
          ansis.yellow(
            'Warning: The glob pattern should end with .svg for best results',
          ),
        );
      }

      if (glob.startsWith('~/')) {
        console.error(
          ansis.red(
            'Error: Please expand the glob pattern to an absolute path before running this command.',
          ),
        );
        process.exit(1);
      }

      console.log(`Using ${ansis.bold.cyan(cmd)} to generate spritesheet`);
      console.log(`Pulling from ${ansis.italic.cyan(glob)}`);
      console.log(`Saving to ${ansis.italic.cyan(`${newOut}.*`)}`);

      // TODO: Need to add async compose to core
      const sprites = await find(glob as string, process.cwd());
      const gathered = await gather(sprites, crcMode);
      const atlas = await generate(gathered, cmd, newOut);
      const genConst = await constants(atlas);

      await clean(genConst);
    },
  );

program.parse();
