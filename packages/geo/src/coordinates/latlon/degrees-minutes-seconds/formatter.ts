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

import { createFormatter } from '../internal/format';

/**
 * Converts a coordinate value to degrees minutes seconds format.
 *
 * @param num - The coordinate value to format.
 * @returns Formatted coordinate string with degrees, minutes, and seconds (e.g., "45° 30' 15.23″").
 *
 * @example
 * ```typescript
 * toDegreesMinutesSeconds(45.5042);
 * // '45° 30' 15.12″'
 * ```
 *
 * @example
 * ```typescript
 * toDegreesMinutesSeconds(-122.4194);
 * // '122° 25' 9.84″'
 * ```
 */
const toDegreesMinutesSeconds = (num: number): string => {
  const degrees = Math.floor(Math.abs(num));
  const minutesFull = (Math.abs(num) - degrees) * 60;
  const minutes = Math.floor(minutesFull);
  const seconds = ((minutesFull - minutes) * 60).toFixed(2);

  return `${degrees}° ${minutes}' ${seconds}″`;
};

/**
 * Formats latitude/longitude coordinates in degrees minutes seconds notation.
 *
 * @param coordinates - Tuple of [latitude, longitude] values.
 * @param config - Optional formatting configuration.
 * @returns Formatted coordinate string in degrees minutes seconds format.
 *
 * @example
 * ```typescript
 * formatDegreesMinutesSeconds([37.7749, -122.4194]);
 * // '37° 46' 29.64″ N, 122° 25' 9.84″ W'
 * ```
 *
 * @example
 * ```typescript
 * formatDegreesMinutesSeconds([37.7749, -122.4194], { separator: ' / ' });
 * // '37° 46' 29.64″ N / 122° 25' 9.84″ W'
 * ```
 */
export const formatDegreesMinutesSeconds = createFormatter(
  toDegreesMinutesSeconds,
);
