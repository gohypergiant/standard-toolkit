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
import { doesStartWith } from '../does-start-with';

/**
 * Creates a predicate function that determines if a string does not start with a specific prefix.
 *
 * @param prefix - The substring to use as the prefix
 * @param input - The string to test
 *
 * @remarks
 * - Pure function with no side effects
 * - Case-sensitive comparison
 * - Composed using `not` and `doesStartWith` for functional composition
 *
 * @example
 * ```typescript
 * const doesNotStartWithHttp = doesNotStartWith('http');
 * doesNotStartWithHttp('https://example.com'); // false
 * doesNotStartWithHttp('ftp://example.com');   // true
 * ```
 */
export const doesNotStartWith = (prefix: string) =>
  compose(not, doesStartWith(prefix));
