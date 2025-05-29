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

import { isGreaterEqual } from '@/is-greater-equal';
import { isLesserEqual } from '@/is-lesser-equal';
import { andFn } from '@accelint/core';

/**
 * Determine if the given value is between the the values in the tuple.
 *
 * @param a - The tuple to check against.
 * @param c - The number to check.
 *
 * @remarks
 * pure function
 *
 * @example
 * isBetween([42, 101])(89); // true
 * isBetween([42, 126])(7); // false
 */
export const isBetween = (a: [number, number]) => {
  const sorted = [...a].sort() as [number, number];

  return andFn(isGreaterEqual(sorted[0]))(isLesserEqual(sorted[1]));
};
