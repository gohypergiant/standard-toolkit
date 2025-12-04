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

import type { RawCoordinate } from './group-tokens.js';

/**
 * A refined coordinate with axis assignment and validated numeric value.
 */
export type RefinedCoordinate =
  | { errors: string[] }
  | { axis?: 'lat' | 'lon'; value: number };

// NOTE: Latitude (N/S) ranges from −90° to +90°; S = negative
// NOTE: Longitude (E/W) ranges from −180° to +180°; W = negative
const COMPASS_SIGN = { E: 1, N: 1, S: -1, W: -1 } as const;
const COMPASS_AXIS = { E: 'lon', N: 'lat', S: 'lat', W: 'lon' } as const;

/**
 * Refines a raw coordinate into a typed value with optional axis assignment.
 * Converts degrees/minutes/seconds to decimal degrees and applies compass sign.
 * Validates that minutes and seconds are in valid ranges.
 *
 * @param partial - Raw coordinate with compass, degrees, minutes, seconds
 * @returns Either an error object or a refined coordinate with value and optional axis
 *
 * @example
 * ```ts
 * refineCoordinate({ compass: 'N', degrees: 40, minutes: 42, seconds: 46.08 })
 * // Returns: { axis: 'lat', value: 40.7128 }
 *
 * refineCoordinate({ compass: 'W', degrees: 74, minutes: 0, seconds: 21.6 })
 * // Returns: { axis: 'lon', value: -74.006 }
 * ```
 */
export function refineCoordinate(partial: RawCoordinate): RefinedCoordinate {
  const { compass = '', degrees = 0, minutes = 0, seconds = 0 } = partial;

  if (minutes >= 60) {
    return { errors: [`Minutes value too high: "${minutes}"`] };
  }

  if (minutes < 0) {
    return { errors: [`Minutes value too low: "${minutes}"`] };
  }

  if (seconds >= 60) {
    return { errors: [`Seconds value too high: "${seconds}"`] };
  }

  if (seconds < 0) {
    return { errors: [`Seconds value too low: "${seconds}"`] };
  }

  if (compass.toUpperCase() === 'N' && degrees < 0) {
    return {
      errors: [
        'Conflicting indicators "negative degrees" and compass direction "North"',
      ],
    };
  }

  if (compass.toUpperCase() === 'E' && degrees < 0) {
    return {
      errors: [
        'Conflicting indicators "negative degrees" and compass direction "East"',
      ],
    };
  }

  const axis = COMPASS_AXIS[compass as keyof typeof COMPASS_AXIS];
  const sign =
    COMPASS_SIGN[compass as keyof typeof COMPASS_SIGN] ??
    (degrees < 0 ? -1 : 1);
  const value = (Math.abs(degrees) + minutes / 60 + seconds / 3600) * sign;

  return axis ? { axis, value } : { value };
}
