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

export const UTM_K0 = 0.9996;
export const UTM_FALSE_EASTING = 500000.0;
export const UTM_FALSE_NORTHING = 10000000.0;

const f = 1 / 298.257223563;
const e2 = f * (2 - f);

export const WGS84 = {
  a: 6378137.0,
  f,
  e2,
  ePrime2: e2 / (1 - e2),
};
