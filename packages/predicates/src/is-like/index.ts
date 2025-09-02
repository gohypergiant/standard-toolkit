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

/**
 * Creates a predicate function that determines if a string matches a given pattern or regular expression.
 *
 * @param pattern - The string pattern or RegExp to use for testing
 * @param input - The string to test against the pattern
 *
 * @remarks
 * - Pure function with no side effects
 * - Accepts both string patterns and RegExp objects
 * - String patterns are automatically converted to RegExp using `new RegExp(pattern)`
 * - Uses RegExp.prototype.test() for pattern matching
 * - Useful for string validation and array filtering
 *
 * @example
 * ```typescript
 * const isJsFile = isLike(/\.(js|ts)$/);
 * isJsFile('app.js');   // true
 * isJsFile('style.css'); // false
 *
 * const hasNumbers = isLike('[0-9]');
 * hasNumbers('abc123'); // true
 * hasNumbers('abcdef'); // false
 *
 * const isEmail = isLike(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
 * isEmail('user@example.com'); // true
 * isEmail('invalid-email');    // false
 *
 * // Useful with arrays
 * const files = ['app.js', 'style.css', 'main.ts', 'README.md'];
 * const scriptFiles = files.filter(isLike(/\.(js|ts)$/)); // ['app.js', 'main.ts']
 * ```
 */
export const isLike =
  (pattern: string | RegExp) =>
  (input: string): boolean =>
    (pattern instanceof RegExp ? pattern : new RegExp(pattern)).test(input);
