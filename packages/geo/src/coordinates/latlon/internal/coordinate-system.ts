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

import type { Compass, Format } from '.';
import type { ParseResults } from './parse';

// NOTE: isolated CoordinateSystem type so that it could be a private-export

/**
 * Coordinate system interface for parsing, converting, and formatting geographic coordinates.
 *
 * Defines the contract for coordinate notation systems (Decimal Degrees, Degrees Decimal Minutes,
 * Degrees Minutes Seconds) to parse, convert to float, and format coordinate values.
 *
 * @property name - Human-readable name of the coordinate system.
 * @property parse - Parses a coordinate string into validated tokens or error messages.
 * @property toFloat - Converts parsed coordinate components (degrees, minutes, seconds, bearing) to a float.
 * @property toFormat - Formats numeric coordinate pair back to string representation.
 *
 * @example
 * const system: CoordinateSystem = {
 *   name: 'Decimal Degrees',
 *   parse: (format, input) => parseDecimalDegrees(input, format),
 *   toFloat: ([deg, bear]) => Number.parseFloat(deg) * (bear === 'S' || bear === 'W' ? -1 : 1),
 *   toFormat: (format, [lat, lon]) => `${Math.abs(lat)}° ${lat >= 0 ? 'N' : 'S'} / ${Math.abs(lon)}° ${lon >= 0 ? 'E' : 'W'}`
 * };
 */
export type CoordinateSystem = {
  name: string;
  parse: (format: Format, input: string) => ParseResults;
  toFloat: (a: [string, ...string[], Compass]) => number;
  toFormat: (f: Format, a: [number, number]) => string;
};
