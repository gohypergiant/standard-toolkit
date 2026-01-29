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

// __private-exports

/**
 * Gets the ordinal direction (N/S/E/W) for a coordinate value.
 *
 * @param num - The coordinate value (positive or negative).
 * @param isLatitude - Whether this is a latitude coordinate (true) or longitude (false).
 * @returns Ordinal direction character: 'N', 'S', 'E', or 'W'.
 *
 * @example
 * ```typescript
 * getOrdinal(37.7749, true);
 * // 'N'
 * ```
 *
 * @example
 * ```typescript
 * getOrdinal(-122.4194, false);
 * // 'W'
 * ```
 *
 * @example
 * ```typescript
 * getOrdinal(-45, true);
 * // 'S'
 * ```
 */
export const getOrdinal = (num: number, isLatitude: boolean): string => {
  if (isLatitude) {
    return num >= 0 ? 'N' : 'S';
  }
  return num >= 0 ? 'E' : 'W';
};
