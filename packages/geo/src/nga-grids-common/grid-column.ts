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

/**
 * MGRS 100km grid square column letters (excludes I and O).
 *
 * Column letters cycle every 3 UTM zones with 8 letters per cycle.
 * The pattern repeats: zones 1-3 use positions 0-7, zones 4-6 use positions 8-15, etc.
 *
 * @see NGA.SIG.0012_2.0.0_UTMUPS (2014) - Table 3-1, Section 3.3
 * @see NGA.STND.0037_2.0.0_MGRS (2014) - Military Grid Reference System
 */
export const GRID_COLUMN_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
export const GRID_COLUMN_SET_SIZE = 8;
export const GRID_COLUMN_CYCLE = 3;
export const GRID_SQUARE_SIZE_METERS = 100000;
