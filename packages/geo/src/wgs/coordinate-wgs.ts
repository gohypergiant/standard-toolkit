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

import type { CoordinateMGRS } from '../mgrs/coordinate-mgrs.js';
import type { CoordinateUTM } from '../utm/coordinate-utm.js';
import type { Dd, Ddm, Dms } from './get-tokens.js';
import type { OptionsWGS } from './options-wgs.js';
import type { TokensWGS } from './tokens-wgs.js';

export interface CoordinateWGS extends TokensWGS {
  /**
   * Returns the coordinate tokens in the specified format.
   *
   * @param options - Optional formatting options
   * @param options.format - Output format: 'dd' (decimal degrees, default), 'ddm' (degrees decimal minutes), or 'dms' (degrees minutes seconds)
   * @returns Coordinate tokens in the requested format
   *
   * @example
   * ```ts
   * const coord = createCoordinate('wgs', '40.7128, -74.0060');
   * coord.tokens(); // { lat: { degrees: 40.7128 }, lon: { degrees: -74.0060 } }
   * coord.tokens({ format: 'ddm' }); // { lat: { degrees: 40, minutes: 42.768 }, lon: { degrees: -74, minutes: 0.36 } }
   * coord.tokens({ format: 'dms' }); // { lat: { degrees: 40, minutes: 42, seconds: 46.08 }, lon: { degrees: -74, minutes: 0, seconds: 21.6 } }
   * ```
   */
  tokens(options: OptionsWGS & { format: 'dd' }): Dd;
  tokens(options: OptionsWGS & { format: 'ddm' }): Ddm;
  tokens(options: OptionsWGS & { format: 'dms' }): Dms;
  tokens(options?: OptionsWGS): Dd;

  toString: (order?: OptionsWGS) => string;

  toMGRS: () => CoordinateMGRS;
  toUTM: () => CoordinateUTM;
}
