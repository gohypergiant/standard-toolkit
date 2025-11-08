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

import type { TokensUTM } from './tokens-utm.js';

/**
 * Converts a UTM coordinate object to its string representation.
 * Format: (ZoneNumber)(ZoneLetter) [(Easting) (Northing)]
 * Example: "18T 523068 4506559"
 * Easting and northing are rounded to nearest meter.
 */
export const toStringFromUTM = (coord: TokensUTM): string =>
  `${coord.zoneNumber}${coord.zoneLetter} ${Math.round(coord.easting)} ${Math.round(coord.northing)}`;
