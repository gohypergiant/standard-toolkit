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

import { DEFAULT_MGRS_PRECISION } from '../nga-grids-common/convert/precision.js';
import { toMGRSFromUTM as fromUTMtoMGRS } from '../utm/to-mgrs-from-utm.js';
import { toUTMFromWGS as fromMGRStoUTM } from './to-utm-from-wgs.js';
import type { TokensMGRS } from '../mgrs/tokens-mgrs.js';
import type { TokensWGS } from './tokens-wgs.js';

/**
 * Converts WGS84 coordinates to MGRS by composing WGS→UTM→MGRS conversions.
 */
export const toMGRSFromWGS = (
  coord: TokensWGS,
  precision: number = DEFAULT_MGRS_PRECISION,
): TokensMGRS => fromUTMtoMGRS(fromMGRStoUTM(coord), precision);
