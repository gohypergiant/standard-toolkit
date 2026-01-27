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

import { FORMATS, type Format, SYMBOLS } from '.';

export type CoordinateCache = Record<Format, string>;

const DIVIDER = ` ${SYMBOLS.DIVIDER} `;

/**
 * Create, and initialize, a cache object for coordinate conversions so that
 * conversions are only ever done once and only "one-direction-ally". The
 * "one-direction" concept is to avoid the problem of encountering rounding
 * errors when converting between multiple formats.
 *
 * @param format - The coordinate format (LATLON or LONLAT) for the provided value.
 * @param value - The formatted coordinate string to cache.
 * @returns Cache object with both LATLON and LONLAT format strings.
 *
 * @example
 * ```typescript
 * createCache('LATLON', '37.7749 N / 122.4194 W');
 * // { LATLON: '37.7749 N / 122.4194 W', LONLAT: '122.4194 W / 37.7749 N' }
 * ```
 *
 * @example
 * ```typescript
 * createCache('LONLAT', '122° W / 37° N');
 * // { LONLAT: '122° W / 37° N', LATLON: '37° N / 122° W' }
 * ```
 */
export function createCache(format: Format, value: string) {
  const [alternate] = FORMATS.filter((o) => o !== format) as [Format];

  return {
    [format]: value,
    [alternate]: value.includes(SYMBOLS.DIVIDER)
      ? value.split(DIVIDER).reverse().join(DIVIDER).trim()
      : value,
  } as CoordinateCache;
}
