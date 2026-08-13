// __private-exports
/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
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
 * Formats an error message with a standard [ERROR] prefix.
 *
 * @param s - The error message string to format.
 * @returns Formatted error string with [ERROR] prefix.
 *
 * @example
 * ```typescript
 * violation('Invalid coordinate value.');
 * // '[ERROR] Invalid coordinate value.'
 * ```
 *
 * @example
 * ```typescript
 * violation('Degrees value (91) exceeds max value (90).');
 * // '[ERROR] Degrees value (91) exceeds max value (90).'
 * ```
 */
export const violation = (s: string) => `[ERROR] ${s}`;
