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
 * Converts a coordinate value to decimal degrees format.
 *
 * @param num - The coordinate value to format.
 * @param withOrdinal - Whether to use absolute value (when ordinal directions are shown separately).
 * @returns Formatted coordinate string with degree symbol and 6 decimal places.
 *
 * @example
 * toDecimalDegrees(45.123456);
 * // '45.123456°'
 *
 * @example
 * toDecimalDegrees(-122.4194, true);
 * // '122.419400°'
 */
const toDecimalDegrees = (num: number, withOrdinal?: boolean): string => {
  const value = withOrdinal ? Math.abs(num) : num;
  return `${value.toFixed(6)}°`;
};

/**
 * Formats latitude/longitude coordinates in decimal degrees notation.
 *
 * @param coordinates - Tuple of [latitude, longitude] values.
 * @param config - Optional formatting configuration.
 * @returns Formatted coordinate string in decimal degrees format.
 *
 * @example
 * formatDecimalDegrees([37.7749, -122.4194]);
 * // '37.774900° N, 122.419400° W'
 *
 * @example
 * formatDecimalDegrees([37.7749, -122.4194], { separator: ' / ' });
 * // '37.774900° N / 122.419400° W'
 */
export const formatDecimalDegrees = createFormatter(toDecimalDegrees);
