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
 * Determine if first string does not start with the second string.
 *
 * @param a - The first string to check against.
 * @param b - The second string to check with.
 *
 * @remarks
 * pure function
 *
 * @example
 * doesNotStartWith('b7a70c6346b5')('b7a7'); // false
 * doesNotStartWith('471aead1ae80')('b7a7'); // true
 */
export const doesNotStartWith = (a: string) => compose(not, doesStartWith(a));
