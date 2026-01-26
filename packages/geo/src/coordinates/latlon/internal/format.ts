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

import { getOrdinal } from './ordinal';

export interface FormatOptions {
  prefix: string;
  suffix: string;
  separator: string;
  withOrdinal?: boolean;
}

/**
 * Creates a coordinate formatter function from a coordinate conversion function.
 *
 * @param fn - Function that converts a single coordinate value to a formatted string.
 * @returns Formatter function that takes coordinate pair and optional config.
 *
 * @example
 * const formatDD = createFormatter((num) => `${num.toFixed(6)}°`);
 * formatDD([37.7749, -122.4194]);
 * // '37.774900° N, 122.419400° W'
 *
 * @example
 * const formatDMS = createFormatter(toDegreesMinutesSeconds);
 * formatDMS([37.7749, -122.4194], { separator: ' / ', withOrdinal: true });
 * // '37° 46' 29.64″ N / 122° 25' 9.84″ W'
 */
export const createFormatter =
  (fn: (coord: number, withOrdinal?: boolean) => string) =>
  (coordinates: [number, number], config?: FormatOptions): string => {
    const [latitude, longitude] = coordinates;
    const latOrdinal = `${config?.withOrdinal ? ` ${getOrdinal(latitude, true)}` : ''}`;
    const lonOrdinal = `${config?.withOrdinal ? ` ${getOrdinal(longitude, false)}` : ''}`;
    const lat = fn(latitude, config?.withOrdinal);
    const lon = fn(longitude, config?.withOrdinal);
    const prefix = config?.prefix ?? '';
    const suffix = config?.suffix ?? '';
    const separator = config?.separator ?? ', ';

    return `${prefix}${lat}${latOrdinal}${separator}${lon}${lonOrdinal}${suffix}`;
  };
