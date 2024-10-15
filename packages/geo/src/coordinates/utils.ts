// __private-exports

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

type Nullish<T> = T | undefined | null | '';

const supportedDirections = ['N', 'S', 'E', 'W'];

export function normalizeDirection(
  dir: Nullish<string>,
): 'N' | 'S' | 'E' | 'W' | '' {
  if (!dir) {
    return '';
  }

  const val = dir.toUpperCase();

  // Sanity check that the we have a correct direction value
  if (!supportedDirections.includes(val)) {
    return '';
  }

  return val as 'N' | 'S' | 'E' | 'W';
}

export function negate(val: number) {
  return val * -1;
}

export function isPositiveDirection(
  dir: Nullish<'N' | 'S' | 'E' | 'W'>,
  sign: Nullish<'+' | '-'>,
) {
  if (sign === '-') {
    return false;
  }

  if (dir === 'S' || dir === 'W') {
    return false;
  }

  // A positive direction can be assumed from here
  return true;
}
