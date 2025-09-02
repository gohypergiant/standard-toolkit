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

import { compose, not } from '@accelint/core';
import { doesEndWith } from '../does-end-with';

/**
 * Creates a predicate function that determines if a string does not end with a specific suffix.
 *
 * @param suffix - The substring to use as the suffix
 * @param input - The string to test
 *
 * @remarks
 * - Pure function with no side effects
 * - Case-sensitive comparison
 *
 * @example
 * ```typescript
 * const isJsFile = doesNotEndWith('.js');
 * isJsFile('app.js');   // false
 * isJsFile('style.css'); // true
 * ```
 */
export const doesNotEndWith = (suffix: string) =>
  compose(not, doesEndWith(suffix));
