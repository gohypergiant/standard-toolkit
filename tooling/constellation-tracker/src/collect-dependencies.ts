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

import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { logMsg } from './log-messages.js';
import type { Ora } from 'ora';
import type { CatalogInfo } from './utils/catalog-info-template.js';

export function collectDependencies(
  packagePath: string,
  nodeModulesPath: string,
  spinner: Ora,
) {
  try {
    const packageJsonContent = fs.readFileSync(packagePath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    const dependsOn: [string, string][] = [];

    // Extract dependencies from package.json
    const dependencies = Object.keys({
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
      ...(packageJson.peerDependencies || {}),
    });

    logMsg(`Loaded dependencies from ${packagePath}`, spinner);
    logMsg('Checking for catalog-info.yaml files...', spinner);

    dependencies.forEach((dependency) => {
      const catalogPath = path.resolve(
        nodeModulesPath,
        dependency,
        'catalog-info.yaml',
      );

      if (fs.existsSync(catalogPath)) {
        const catalogInfo: CatalogInfo = parse(
          fs.readFileSync(catalogPath, 'utf-8'),
        );

        dependsOn.push([
          catalogInfo.metadata.name,
          catalogInfo.metadata.annotations['package/version'],
        ]);
      }
    });

    return dependsOn;
  } catch (error) {
    spinner.fail(`Failed to load dependencies from ${packagePath}`);
    throw new Error(`Failed to parse package.json at ${packagePath}: ${error}`);
  }
}
