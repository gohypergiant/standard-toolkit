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

/**
 * Expands a decimal degree coordinate into degrees and minutes (DDM) or degrees, minutes, and seconds (DMS) format.
 *
 * @param num - The decimal degree value (latitude or longitude) to expand
 * @param dms - When `true`, expands to DMS format [degrees, minutes, seconds]; when `false` (default), expands to DDM format [degrees, minutes]
 * @returns An array containing the expanded coordinate components
 *
 * @example
 * ```ts
 * expand(40.7489) // [40, 44.934] - DDM format
 * expand(40.7489, true) // [40, 44, 56.04] - DMS format
 * expand(-73.9680) // [-73, 58.08] - DDM format with negative degrees
 * ```
 */
export function expand(num: number, dms = false): number[] {
  const whole = Math.trunc(num);
  const decimal = Math.abs((num - whole) * 60);

  return dms
    ? [whole, ...expand(decimal)]
    : [whole, Number.parseFloat(decimal.toFixed(4))];
}
