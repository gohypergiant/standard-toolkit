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

import type { Options } from '../internal/options.js';

/**
 * Options for formatting and parsing WGS84 coordinates.
 */
export interface OptionsWGS extends Options {
  /**
   * When `true`, uses compass directions (N/S/E/W) instead of negative values in string output.
   * @default false
   */
  compass?: boolean;

  /**
   * The coordinate format for string output.
   * - `'dd'` - Decimal degrees
   * - `'ddm'` - Degrees decimal minutes
   * - `'dms'` - Degrees minutes seconds
   * @default 'dd'
   */
  format?: 'dd' | 'ddm' | 'dms';

  /**
   * The coordinate order for parsing and string output.
   * - `'latlon'` - Latitude, longitude
   * - `'lonlat'` - Longitude, latitude
   * @default 'latlon'
   */
  order?: 'latlon' | 'lonlat';
}
