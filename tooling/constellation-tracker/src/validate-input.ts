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

export function validateInput(nodeModulesPath: string, packagePath: string) {
  if (!fs.existsSync(packagePath)) {
    console.error(
      ansis.red('Error: The specified package.json does not exist'),
    );
    process.exit(1);
  }

  if (!fs.existsSync(nodeModulesPath)) {
    console.warn(
      ansis.yellow(
        'Warning: The specified node_modules directory does not exist, assuming no dependencies',
      ),
    );

    return false;
  }

  return true;
}
