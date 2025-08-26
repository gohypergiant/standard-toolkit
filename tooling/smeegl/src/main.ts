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
import { Argument, Command, Option } from 'commander';

import ora from 'ora';
import { buildReactFiles } from './build-react-files.js';
import { buildSpritesheet } from './build-spritesheet.js';
import { findSprites } from './utils/find-sprites.js';
import { makeTempDirectory } from './utils/make-temp-directory.js';
import type { CrcType, TargetType } from './utils/types.js';
import { validateInput } from './validate-input.js';

const program = new Command();

export type CmdOptions = {
  spreet: string;
  glob?: string;
  crc?: CrcType;
  in?: string;
  out?: string;
  target: TargetType;
};

export async function find(
  glob: string,
  inputPath: string,
  rootPath: string,
  tmpDir: string,
) {
  const spinner = ora('Finding sprites');
  spinner.start();

  const result = await findSprites(glob, inputPath, rootPath, tmpDir);

  result.match({
    Ok: (r) =>
      spinner.succeed(`Found ${ansis.bold.cyan(r.sprites.length)} sprites`),
    Err: ({ msg }) => spinner.fail(msg),
  });

  return result;
}

type ParseParametersProps = {
  // positional arguments
  globArg: string | undefined; // Glob pattern argument
  outputArg: string | undefined; // Output argument

  // Options
  globOpt: string | undefined; // Glob pattern option
  inOpt: string; // Input base folder option
  outOpt: string; // Output base folder option
};

function _parseParameters({
  globArg,
  outputArg,

  inOpt,
  outOpt,
  globOpt,
}: ParseParametersProps): {
  inputPath: string;
  outputPath: string;
  glob: string;
} {
  const cwd = process.cwd();

  const glob = globArg ?? globOpt ?? '';

  const inputPath =
    typeof inOpt === 'string' && inOpt !== '' ? path.relative(cwd, inOpt) : '';

  const outArgResolved =
    typeof outputArg === 'string' && outputArg !== ''
      ? path.resolve(outputArg)
      : '';

  const outDefault = path.relative(cwd, path.join(cwd, 'atlas'));

  const outputPath =
    [outOpt, outArgResolved, outDefault].filter((x) => x !== '').shift() || '';

  return { inputPath, outputPath, glob };
}

export async function handleAction(
  globArg: string,
  outputArg: string | undefined,
  options: CmdOptions,
) {
  const cwd = process.cwd();
  const crcMode = options.crc ?? null;
  const inOpt = options.in ?? '';
  const outOpt = options.out ?? '';
  const { spreet: cmd, glob: globOpt, target } = options;

  const { outputPath, inputPath, glob } = _parseParameters({
    globArg,
    inOpt,
    outOpt,
    outputArg,
    globOpt,
  });

  validateInput(glob, inputPath);

  console.log('');
  if (target === 'SPRITESHEET') {
    console.log(`- Using ${ansis.bold.cyan(cmd)} to generate spritesheet`);
  } else {
    console.log(`- Using ${ansis.bold.cyan(cmd)} to generate react files`);
  }

  if (glob) {
    console.log(`- Pulling from '${ansis.italic.cyan(glob)}'`);
  } else {
    console.log(
      `- Scanning for *.svg files in '${ansis.italic.cyan(inputPath)}'`,
    );
  }

  console.log(`- Saving to ${ansis.italic.cyan(`${outputPath}.*`)}\n`);

  const tmpDir = await makeTempDirectory();
  const findSpriteResult = await find(glob, inputPath, cwd, tmpDir);

  if (target === 'SPRITESHEET') {
    await buildSpritesheet(findSpriteResult, crcMode, cmd, outputPath);
  } else {
    buildReactFiles(findSpriteResult, inputPath, outputPath);
  }
}

const USAGE = `

  Example 1: Using a base folder. Note, the '~/' is a valid input.

    > smeegl --in ~/exported_icon_set_1 --out ~/react_svg_set_1 --target REACT
    > smeegl --in ~/exported_icon_set_2 --out ~/react_svg_set_2 --target SPRITESHEET

  Example 2: Using a glob pattern. Note, the '~/' is not a valid input for a glob pattern.

    > smeegl --glob "/Users/me/exported_icon_set_3/**/*.svg" --out ~/react_svg_set_3 --target REACT
    > smeegl --glob "/Users/me/exported_icon_set_4/**/*.svg" --out ~/react_svg_set_4 --target SPRITESHEET
`;

program
  .name('smeegl')
  .description(
    'CLI tool to create spritesheets and React Components from an SVG glob pattern or base folder of SVG files',
  )
  .addArgument(
    new Argument('<GLOB>', '[DEPRECATED] SVG glob pattern').argOptional(),
  )
  .addArgument(
    new Argument(
      '[OUTPUT]',
      '[DEPRECATED] The atlas output path, CWD if none given',
    ).argOptional(),
  )
  .addOption(
    new Option(
      '--spreet <path>',
      'Path to pre-built spreet binary, unneeded if installed',
    ).default('spreet'),
  )
  .addOption(
    new Option(
      '--crc <MODE>',
      'Sprite names will be converted to crc32, either DEC or HEX',
    ).choices(['DEC', 'HEX']),
  )
  .addOption(new Option('--glob <glob>', 'SVG glob pattern'))
  .addOption(new Option('--in <path>', 'The input path to scan for svg files'))
  .addOption(new Option('--out <path>', 'The output path, CWD if none given'))
  .addOption(
    new Option('--target <TYPE>', 'Spritesheet or React files')
      .choices(['SPRITESHEET', 'REACT'])
      .default('SPRITESHEET'),
  )

  .usage(USAGE)

  .action(
    async (
      globArg: string,
      outputArg: string | undefined,
      options: CmdOptions,
    ) => {
      await handleAction(globArg, outputArg, options);
    },
  );

program.parse();
