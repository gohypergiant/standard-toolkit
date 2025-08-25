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

export function readSvgFilesFromInputDirectory(
  dir: fs.PathLike,
): fs.Dirent<string>[] {
  // Read all svg files in the core directory and subdirectories
  if (!fs.existsSync(dir)) {
    console.error('Core SVG directory not found:', dir);
    return [];
  }

  // Read all SVG files in the core directory
  // This assumes that the core directory contains SVG files directly
  // If there are subdirectories, you may need to adjust this logic
  const files = fs
    .readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((it) => it.name.endsWith('.svg'));

  if (!files.length) {
    console.error('No SVG files found in core directory:', dir);
    return [];
  }

  return files;
}
