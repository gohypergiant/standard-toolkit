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

export function validateInput(glob: string | null, inputPath: string | null) {
  if (glob && inputPath) {
    console.error(
      ansis.red(
        'Error: Both glob pattern and input directory provided; Please use only one',
      ),
    );
    process.exit(1);
  }

  if (glob) {
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
  } else if (inputPath) {
    if (!fs.existsSync(inputPath)) {
      console.error(
        ansis.red('Error: The specified input directory does not exist'),
      );
      process.exit(1);
    }
  } else {
    console.error(
      ansis.red('Error: No glob pattern or input directory provided'),
    );
    process.exit(1);
  }
}
