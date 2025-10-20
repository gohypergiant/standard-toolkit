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
import { Command, Option } from 'commander';
import ora from 'ora';
import { collectDependencies } from './collect-dependencies.js';
import { getCatalogInfo } from './get-catalog-info.js';
import { logMsg } from './log-messages.js';
import { saveCatalogInfo } from './utils/save-catalog-info.js';
import { validateInput } from './validate-input.js';
import { validatePackage } from './validate-package.js';
import type { CmdOptions } from './utils/types.ts';

const program = new Command();

type ParseParametersProps = {
  // Options
  catalogInfo?: string; // The path to the catalog-info.yaml file.
  nodeModules?: string; // The path to the node_modules folder.
  packageJson?: string; // The path to the package.json file.
};

function _parseParameters({
  catalogInfo,
  nodeModules,
  packageJson,
}: ParseParametersProps) {
  const cwd = process.cwd();
  const catalogInfoPath = catalogInfo
    ? path.resolve(catalogInfo)
    : path.relative(cwd, path.join(cwd, 'catalog-info.yaml'));
  const nodeModulesPath = nodeModules
    ? path.resolve(nodeModules)
    : path.relative(cwd, path.join(cwd, 'node_modules'));
  const packagePath = packageJson
    ? path.resolve(packageJson)
    : path.relative(cwd, path.join(cwd, 'package.json'));

  return { catalogInfoPath, nodeModulesPath, packagePath };
}

const DESCRIPTION_REGEX = /\n\s*Dependencies:[\s\S]*/;

export function handleAction(options: CmdOptions) {
  const {
    catalogInfo,
    nodeModules,
    package: packageJson,
    regenerate,
  } = options;

  const { catalogInfoPath, nodeModulesPath, packagePath } = _parseParameters({
    catalogInfo,
    nodeModules,
    packageJson,
  });

  const hasDependencies = validateInput(nodeModulesPath, packagePath);
  validatePackage(packagePath);

  const catalogInfoData = getCatalogInfo(
    catalogInfoPath,
    packagePath,
    Boolean(regenerate),
  );

  const dependencySpinner = ora('Gathering dependencies...');
  dependencySpinner.start();
  if (hasDependencies) {
    const dependencies = collectDependencies(
      packagePath,
      nodeModulesPath,
      dependencySpinner,
    );

    if (dependencies.length === 0) {
      dependencySpinner.succeed('No dependencies detected');
    } else {
      logMsg(
        `Gathered ${dependencies.length} dependenc${dependencies.length === 1 ? 'y' : 'ies'}, updating the catalog-info...`,
        dependencySpinner,
      );

      // Remove the `Dependencies:` text from the end of the Description and re-add it.
      catalogInfoData.metadata.description = `${catalogInfoData.metadata.description.replace(DESCRIPTION_REGEX, '')}

Dependencies:
${dependencies.map(([dependency, version]) => `${dependency}@${version}`).join(', ')}`;

      catalogInfoData.spec.dependsOn = dependencies.map(
        ([dependency]) => `component:${dependency}`,
      );
      dependencySpinner.succeed(
        'Dependencies successfully added to the catalog-info.',
      );
    }
  } else {
    dependencySpinner.succeed('No dependencies detected');
  }

  const finalSpinner = ora('Saving final catalog-info.yaml');
  finalSpinner.start();
  saveCatalogInfo(catalogInfoData, catalogInfoPath);

  finalSpinner.succeed(`Saved to ${catalogInfoPath}`);
}

const USAGE = `

  Example 1: Not passing any argument for node_modules

    > backstage-tracker

  Example 2: Passing a custom node_modules path

    > backstage-tracker --node-modules "/Users/me/my-project/node_modules"
`;

program
  .name('backstage-tracker')
  .description('CLI tool for tracking project dependencies in Backstage.')
  .addOption(
    new Option(
      '--node-modules <path>',
      'The input path for which node_modules folder to use, defaults to the node_modules adjacent to the package.json.',
    ),
  )
  .addOption(
    new Option(
      '--catalog-info <path>',
      'The input path for the catalog-info.yaml file, defaults to the CWD.',
    ),
  )
  .addOption(
    new Option(
      '--regenerate',
      'Whether or not to re-generate the entire catalog-info.yaml file.',
    ),
  )
  .usage(USAGE)
  .action(async (options: CmdOptions) => {
    await handleAction(options);
  });

program.parse();
