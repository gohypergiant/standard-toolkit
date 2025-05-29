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

import { isLike } from '@/is-like';
import { compose, not } from '@accelint/core';

/**
 * Determine if second string is not like the first string/RegExp.
 *
 * @param a - The string/RegExp to use for testing.
 * @param b - The string to test against.
 *
 * @remarks
 * pure function
 *
 * @example
 * isNotLike(/[jt]s/)('.js'); // false
 * isNotLike(/[jt]s/)('.md'); // true
 */
export const isNotLike = (a: string | RegExp) => compose(not, isLike(a));
