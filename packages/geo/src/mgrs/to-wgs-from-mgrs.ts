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

import { toWGSFromUTM as fromUTMtoWGS } from '../utm/to-wgs-from-utm.js';
import { toUTMFromMGRS } from './to-utm-from-mgrs.js';
import type { Precision } from '../nga-grids-common/convert/precision.js';
import type { TokensWGS } from '../wgs/tokens-wgs.js';
import type { TokensMGRS } from './tokens-mgrs.js';

/**
 * Converts MGRS coordinates to WGS84 by composing MGRS→UTM→WGS conversions.
 *
 * @see {@link file://./../../agents.md} for AI generation prompts used to create this function
 */
export const toWGSFromMGRS = (
  coord: TokensMGRS,
  precisionOverride?: Precision,
): TokensWGS => fromUTMtoWGS(toUTMFromMGRS(coord, precisionOverride));
