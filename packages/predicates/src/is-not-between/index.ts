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
import { isBetween } from '../is-between';

/**
 * Determine if the given value is not between the the values in the tuple.
 *
 * @param a - The tuple to check against.
 * @param b - The number to check.
 *
 * @remarks
 * pure function
 *
 * @example
 * isBetween([42, 101])(89); // false
 * isBetween([42, 126])(7); // true
 */
export const isNotBetween = (a: [number, number]) => compose(not, isBetween(a));
