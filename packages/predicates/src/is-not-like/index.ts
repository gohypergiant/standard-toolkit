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
import { isLike } from '../is-like';

/**
 * Creates a predicate function that determines if a string does not match
 * a given pattern or regular expression.
 *
 * @param pattern - The string pattern or RegExp to use for testing
 * @param input - The string to test against the pattern
 * @returns A function that takes a string and returns true if it does not match the pattern
 *
 * @remarks
 * - Pure function with no side effects
 * - Negation of `isLike` using functional composition
 * - Accepts both string patterns and RegExp objects
 * - String patterns are automatically converted to RegExp using `new RegExp(pattern)`
 *
 * @example
 * ```typescript
 * const isNotJsFile = isNotLike(/\.(js|ts)$/);
 * isNotJsFile('style.css'); // true
 * isNotJsFile('app.js');    // false
 *
 * const hasNoNumbers = isNotLike('[0-9]');
 * hasNoNumbers('abcdef'); // true
 * hasNoNumbers('abc123'); // false
 *
 * const isNotEmail = isNotLike(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
 * isNotEmail('invalid-email');    // true
 * isNotEmail('user@example.com'); // false
 *
 * // Useful with arrays
 * const files = ['app.js', 'style.css', 'main.ts', 'README.md'];
 * const nonScriptFiles = files.filter(isNotLike(/\.(js|ts)$/)); // ['style.css', 'README.md']
 * ```
 */
export const isNotLike = (pattern: string | RegExp) =>
  compose(not, isLike(pattern));
