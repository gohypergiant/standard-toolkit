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
 * MGRS 100km grid square row letters (20 letters, excludes I and O).
 *
 * Row letters cycle every 2,000,000 meters (2000 km).
 * - Northern hemisphere: odd zones start at A, even zones start at F
 * - Southern hemisphere: offset by 5 letters from northern pattern
 *
 * @see NGA.SIG.0012_2.0.0_UTMUPS (2014) - Table 3-2, Section 3.3
 * @see NGA.STND.0037_2.0.0_MGRS (2014) - Military Grid Reference System
 */
export const GRID_ROW_LETTERS = 'ABCDEFGHJKLMNPQRSTUV';
export const GRID_ROW_CYCLE_METERS = 2000000;
