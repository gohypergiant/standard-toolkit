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
import ansis from 'ansis';

export function validatePackage(packagePath: string) {
  const packageJsonContent = fs.readFileSync(packagePath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);

  if (!packageJson.repository?.url) {
    console.error(
      ansis.red(`Error: Your package.json must contain 'repository.url'`),
    );
    process.exit(1);
  }

  if (!packageJson.name) {
    console.error(ansis.red(`Error: Your package.json must contain 'name'`));
    process.exit(1);
  }

  if (!packageJson.title) {
    console.error(ansis.red(`Error: Your package.json must contain 'title'`));
    process.exit(1);
  }

  if (!packageJson.description) {
    console.error(
      ansis.red(`Error: Your package.json must contain 'description'`),
    );
    process.exit(1);
  }

  if (!packageJson.subPath) {
    console.error(ansis.red(`Error: Your package.json must contain 'subPath'`));
    process.exit(1);
  }

  if (!packageJson.owner) {
    console.error(ansis.red(`Error: Your package.json must contain 'owner'`));
    process.exit(1);
  }
}
