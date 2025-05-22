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
import {
  type GatherResult,
  type GenerateResult,
  type GlobResult,
  cleanUp,
  findSprites,
  gatherSprites,
  generateSprites,
} from './lib.js';

const program = new Command();

type CmdOptions = {
  spreet?: string;
};

async function find(glob: string, rootPath: string) {
  const spinner = ora('Finding sprites');
  spinner.start();

  const result = await findSprites(glob, rootPath);

  result.match({
    Ok: (r) => spinner.succeed(`Found ${ansis.bold.cyan(r.length)} sprites`),
    Err: (e) => spinner.fail(e),
  });

  return result;
}

async function gather(sprites: GlobResult) {
  if (sprites.isErr) {
    return Result.err(sprites.error);
  }

  const spinner = ora('Gathering sprites');
  spinner.start();

  const result = await gatherSprites(sprites);

  result.match({
    Ok: () => spinner.succeed(),
    Err: (e) => spinner.fail(e),
  });

  return result;
}

async function generate(input: GatherResult, cmd: string, output: string) {
  if (input.isErr) {
    return Result.err(input.error);
  }

  const spinner = ora('Generating spritesheet');
  spinner.start();

  const result = await generateSprites(input, cmd, output);

  result.match({
    Ok: ({ png }) => spinner.succeed(`Generated spritesheet ${png}`),
    Err: (e) => spinner.fail(e),
  });

  return result;
}

async function clean(dir: GenerateResult) {
  const spinner = ora('Cleaning up');
  spinner.start();

  const result = await cleanUp(dir);

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
    'Bath to pre-built spreet binary, unneeded if installed',
  )
  // TODO: Future addition
  // .option('--config', 'path to a smeegl config file')
  .action(
    async (glob: string, out: string | undefined, options: CmdOptions) => {
      const newOut = out ?? path.join(process.cwd(), 'atlas');
      const spreetPath = options.spreet ?? 'spreet';

      // asyncCompose
      const sprites = await find(glob as string, process.cwd());
      const gathered = await gather(sprites);
      const atlas = await generate(gathered, spreetPath, newOut);
      const cleaned = await clean(atlas);
    },
  );

program.parse();
