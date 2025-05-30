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

import { copyFile, mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export function tempDir() {
  return mkdtemp(path.join(os.tmpdir(), 'smeegl-'));
}

export async function duplicateFile(src: string, destDir: string) {
  const resolved = path.resolve(src);
  const base = path.basename(resolved);
  const destFile = path.join(destDir, base);

  await copyFile(resolved, destFile);

  return destFile;
}
