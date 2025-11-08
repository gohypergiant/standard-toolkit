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
 * UTM scale factor at the central meridian.
 * @see NGA.SIG.0012_2.0.0_UTMUPS (2014) - Section 2.2
 */
export const UTM_K0 = 0.9996;

/**
 * UTM false easting (meters). Applied to all zones.
 * @see NGA.SIG.0012_2.0.0_UTMUPS (2014) - Section 2.2
 */
export const UTM_FALSE_EASTING = 500000.0;

/**
 * UTM false northing (meters). Applied only to Southern hemisphere.
 * @see NGA.SIG.0012_2.0.0_UTMUPS (2014) - Section 2.2
 */
export const UTM_FALSE_NORTHING = 10000000.0;

const f = 1 / 298.257223563;
const e2 = f * (2 - f);

/**
 * WGS84 ellipsoid parameters.
 *
 * @property a - Semi-major axis (equatorial radius) in meters
 * @property f - Flattening factor
 * @property e2 - First eccentricity squared
 * @property ePrime2 - Second eccentricity squared
 *
 * @see NIMA TR8350.2 (2000) - Department of Defense World Geodetic System 1984
 * @see NGA.SIG.0012_2.0.0_UTMUPS (2014) - Table 2.1
 * @see {@link file://./../../../agents.md} for AI generation prompts
 */
export const WGS84 = {
  a: 6378137.0,
  f,
  e2,
  ePrime2: e2 / (1 - e2),
};
