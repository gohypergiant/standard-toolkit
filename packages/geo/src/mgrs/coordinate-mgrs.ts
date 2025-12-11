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

import type { CoordinateUTM } from '../utm/coordinate-utm.js';
import type { CoordinateWGS } from '../wgs/coordinate-wgs.js';
import type { TokensMGRS } from './tokens-mgrs.js';

export interface CoordinateMGRS extends TokensMGRS {
  /**
   * Returns the raw tokens object for this MGRS coordinate.
   *
   * @returns The tokens object containing zone number, zone letter, grid square, easting, northing, and precision
   */
  tokens: () => TokensMGRS;
  toString: () => string;

  toUTM: () => CoordinateUTM;
  toWGS: (order?: 'latlon' | 'lonlat') => CoordinateWGS;
}
