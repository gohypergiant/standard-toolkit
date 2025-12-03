// __private-exports
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

import stringHash from 'string-hash';

/**
 * Generates scoped CSS module class names with deterministic hashing.
 *
 * This function creates stable, short class names for CSS modules while preserving
 * Tailwind's named group classes (e.g., `group/button`) which must remain global
 * and unhashed for parent-child state styling to work.
 *
 * @param className - The original CSS class name from the module
 * @param fileName - The source file path (used for generating unique hash)
 * @returns Scoped class name in format `_className_hash` or original if group class
 *
 * @example
 * // Regular class gets hashed
 * generateScopedClassName('button', '/path/to/button.module.css')
 * // Returns: '_button_abc12'
 *
 * @example
 * // Named group classes preserved for Tailwind state selectors
 * generateScopedClassName('group\\/button', '/path/to/file.css')
 * // Returns: 'group/button' (unchanged)
 *
 * @remarks
 * Hash Format: 5-character base-36 string (0-9, a-z)
 * - Hash is deterministic per file path, ensuring consistency across builds
 *
 * Named Groups: Classes starting with `group\/` are preserved as-is because:
 * - Tailwind uses them for parent-child state styling (e.g., `group-hover/button`)
 * - They must remain global and consistent across all components
 * - Example: `<Button className="group/button">` + `<Icon className="group-hover/button:rotate">`
 */
export function generateScopedClassName(className: string, fileName: string) {
  return className.startsWith('group\\/')
    ? className
    : `_${className}_${stringHash(fileName).toString(36).substring(0, 5)}`;
}
