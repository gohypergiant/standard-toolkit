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
 * Code transformations for @ngageoint packages to fix browser compatibility.
 *
 * The @ngageoint packages (mgrs-js, grid-js) depend on the legacy js_cols library,
 * which has critical compatibility issues with modern ESM strict mode in browsers.
 */

/**
 * Applies transformations to fix the js_cols library's compatibility issues.
 *
 * ## Issues Fixed:
 *
 * 1. **Implicit Global Variable**
 *    - Problem: `js_cols = {...}` creates implicit global (fails in strict mode)
 *    - Fix: Add `var` declaration: `var js_cols = {...}`
 *
 * 2. **Invalid Comma Operator**
 *    - Problem: `var js_cols = {...}, js_cols.UID_PROPERTY_ = ...`
 *    - Issue: Attempts to access `js_cols` while still being declared
 *    - Fix: Change comma to semicolon: `var js_cols = {...}; js_cols.UID_PROPERTY_ = ...`
 *
 * @param code - The source code to transform
 * @returns The transformed code with fixes applied
 */
export function applyTransform(code: string): string {
  return (
    code
      // Fix 1: Add var declaration to prevent implicit global
      .replace(/(\s*)js_cols\s*=\s*\{/g, '$1var js_cols = {')
      // Fix 2: Change comma to semicolon after object literal
      .replace(/(\}\s*\})\s*,\s*(js_cols\.)/g, '$1; $2')
  );
}

/**
 * Checks if the code contains the problematic js_cols pattern.
 *
 * @param code - The source code to check
 * @returns true if the code needs transformation
 */
export function needsTransform(code: string): boolean {
  return code.includes('js_cols = {');
}
