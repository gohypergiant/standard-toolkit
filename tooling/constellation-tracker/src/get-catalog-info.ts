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
import ora from 'ora';
import { parse } from 'yaml';
import { logMsg } from './log-messages.js';
import { generateCatalogInfo } from './utils/generate-catalog-info.js';
import { saveCatalogInfo } from './utils/save-catalog-info.js';
import type { CatalogInfo } from './utils/catalog-info-template.js';

export function getCatalogInfo(
  catalogInfoPath: string,
  packagePath: string,
  regenerate: boolean,
): CatalogInfo {
  const spinner = ora('Preparing the catalog-info.yaml file');
  spinner.start();

  if (fs.existsSync(catalogInfoPath) && !regenerate) {
    const catalogInfoContent = fs.readFileSync(catalogInfoPath, 'utf-8');
    const catalogInfo = parse(catalogInfoContent);

    spinner.succeed(`Successfully loaded ${catalogInfoPath}`);
    return catalogInfo;
  }

  if (fs.existsSync(catalogInfoPath) && regenerate) {
    logMsg(`Re-generating ${catalogInfoPath}`, spinner);
  } else {
    logMsg(`Could not locate ${catalogInfoPath}, creating it`, spinner);
  }

  logMsg(
    `Reading ${packagePath} and populating the catalog-info.yaml`,
    spinner,
  );

  const catalogInfo = generateCatalogInfo(packagePath);
  saveCatalogInfo(catalogInfo, catalogInfoPath);

  spinner.succeed(`Created ${catalogInfoPath}`);

  return catalogInfo;
}
