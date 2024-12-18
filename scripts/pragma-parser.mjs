/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const rCleaner = /,\s*/;
const rPragma = /\/\/\s*@export-(ignore|only)(?:\s*\[([^\]]+)\])?/;
const rPrivate = /\/\/\s*__private-exports/i;

/**
 * Look for pragmas in the file that would change which exports are considered for the public API:
 *
 * - `__private-exports`
 * - `export-ignore`
 * - `export-ignore [x, y, z]`
 * - `export-only [a, b, c]`
 *
 * @returns string[] // [ignore|only, ...members]
 */
export function pragmaParser(src) {
  if (src.match(rPrivate)?.[0]) {
    return ['ignore', '*'];
  }

  const found = src.match(rPragma);

  if (!found) {
    return [];
  }

  const pragmas = found
    .slice(1)
    .reduce((a, b = '*') => [
      a,
      ...(b ? b.replace(rCleaner, ',').split(',') : b),
    ]);

  if (pragmas[0] === 'only' && pragmas[1] === '*') {
    return [];
  }

  return pragmas;
}
