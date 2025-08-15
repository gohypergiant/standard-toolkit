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

function detectIsWindows(sample: string): boolean {
  const parsed = path.parse(sample);
  if (parsed.root === '') {
    return !sample.includes('/');
  }
  return parsed.root !== '/';
}

export function findCommonBasePath(array: string[]): string {
  if (array.length === 0) {
    return '';
  }

  const sample = array[0] ?? '';
  const isWindows = detectIsWindows(sample);

  const sep = isWindows ? path.win32.sep : path.posix.sep;

  const onlyUnique = (value: string, index: number, array: string[]) => {
    return array.indexOf(value) === index;
  };

  const allPaths = array
    .map((it) => {
      const obj = isWindows ? path.win32.parse(it) : path.posix.parse(it);

      if (obj.dir === '.') {
        return it;
      }

      return obj.dir;
    })
    .filter(onlyUnique)
    .map((it) => it.toLowerCase())
    .sort()
    .map((it) => it.split(sep));

  const minLen = Math.min(...allPaths.map((it) => it.length));
  const maxLen = Math.max(...allPaths.map((it) => it.length));

  if (minLen === 0 || maxLen === 0) {
    return '';
  }

  // If all paths are the same length, use all of them to find the common base path.
  // Otherwise, use the shortest length to find the common base path.
  const usablePaths = allPaths.filter((it) =>
    minLen !== maxLen ? it.length === minLen : true,
  );

  if (usablePaths.length === 0) {
    return '';
  }

  const samplePath = usablePaths[0];
  if (!samplePath) {
    return '';
  }

  const targetLength = samplePath.length;

  for (let i = 0; i < targetLength; i++) {
    const currentSegment = samplePath[i];
    const allMatch = usablePaths.every((it) => it[i] === currentSegment);

    if (!allMatch) {
      // If not all paths match at this segment, return the path up to the previous segment.
      const commonPath = samplePath.slice(0, i).join(sep);
      return commonPath;
    }
  }

  // If we reach here, all segments matched, so return the full path.
  const commonPath = samplePath.join(sep);
  return commonPath;
}
