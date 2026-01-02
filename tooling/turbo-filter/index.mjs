#!/usr/bin/env zx

/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import fs from 'node:fs';
import prompts from 'prompts';
import yaml from 'yaml';
import { argv, $ as exec, glob } from 'zx';

const task = argv._[0];

if (!task) {
  console.error('Usage: turbo-filter <task>');
  process.exit(1);
}

const workpaceYaml = fs.readFileSync('pnpm-workspace.yaml', 'utf-8');
const workspace = yaml.parse(workpaceYaml);

const packageJsonBlobs = workspace.packages.map((p) => `${p}/package.json`); // e.g. 'apps/*/package.json'
const packageJsonPaths = await glob(packageJsonBlobs, {
  ignoreFiles: '**/node_modules/**',
});

const packagesWithCurrentTask = packageJsonPaths
  .map((pkgPath) => {
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    return {
      name: pkgJson.name,
      hasTask: pkgJson.scripts?.[task],
    };
  })
  .filter((p) => p.hasTask);

if (packagesWithCurrentTask.length === 0) {
  console.log(`No packages have a "${task}" script.`);
  process.exit(0);
}

const { selectedPackages } = await prompts({
  type: 'multiselect',
  name: 'selectedPackages',
  message: `Select packages to run "${task}"`,
  choices: packagesWithCurrentTask.map((p) => ({
    title: p.name,
    value: p.name,
  })),
  instructions: false,
});

if (!selectedPackages?.length) {
  console.log('No packages selected.');
  process.exit(0);
}

const filters = selectedPackages.map((p) => `--filter=${p}`);

await exec({ stdio: 'inherit' })`turbo run ${task} ${filters}`.nothrow();
