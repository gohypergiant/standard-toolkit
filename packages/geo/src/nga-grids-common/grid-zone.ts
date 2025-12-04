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

export type GridZoneLetter = keyof typeof GRID_ZONE_LIMITS;

/**
 * MGRS latitude band limits for UTM zones.
 *
 * Defines the valid latitude and northing ranges for each MGRS latitude band letter (C-X).
 * Most bands are 8° high; band X (northernmost) is 12° high to cover up to 84°N.
 *
 * The table below is parsed at build time to generate the GRID_ZONE_LIMITS object.
 * Source data derived from NGA.SIG.0012_2.0.0_UTMUPS (2014), Table 2-2.
 *
 * @see NGA.SIG.0012_2.0.0_UTMUPS (2014) - Table 2-2: UTM Latitude Bands
 * @see NGA.STND.0037_2.0.0_MGRS (2014) - Section 2.2: Grid Zone Designation
 */
// @esbuild-inline - inline the content at build time
export const GRID_ZONE_LIMITS = Object.fromEntries(
  `
    | Band  | Latitude Range (°) |       Northing        | Band Height |
    |       |   Min   |   Max    |    Min    |    Max    |             |
    | :---: | :-----: | :------: | --------------------: | ----------: |
    |   C   |   -80   |   -72    |  1100000  |  1900000  |      800000 |
    |   D   |   -72   |   -64    |  2000000  |  2800000  |      800000 |
    |   E   |   -64   |   -56    |  2800000  |  3600000  |      800000 |
    |   F   |   -56   |   -48    |  3700000  |  4500000  |      800000 |
    |   G   |   -48   |   -40    |  4600000  |  5400000  |      800000 |
    |   H   |   -40   |   -32    |  5500000  |  6300000  |      800000 |
    |   J   |   -32   |   -24    |  6400000  |  7200000  |      800000 |
    |   K   |   -24   |   -16    |  7300000  |  8100000  |      800000 |
    |   L   |   -16   |    -8    |  8200000  |  9000000  |      800000 |
    |   M   |    -8   |     0    |  9100000  |  9900000  |      800000 |
    |   N   |     0   |     8    |        0  |   800000  |      800000 |
    |   P   |     8   |    16    |   800000  |  1600000  |      800000 |
    |   Q   |    16   |    24    |  1700000  |  2500000  |      800000 |
    |   R   |    24   |    32    |  2600000  |  3400000  |      800000 |
    |   S   |    32   |    40    |  3500000  |  4300000  |      800000 |
    |   T   |    40   |    48    |  4400000  |  5200000  |      800000 |
    |   U   |    48   |    56    |  5300000  |  6100000  |      800000 |
    |   V   |    56   |    64    |  6200000  |  7000000  |      800000 |
    |   W   |    64   |    72    |  7000000  |  7800000  |      800000 |
    |   X   |    72   |    84    |  7900000  |  9100000  |     1200000 |
      `
    .trim()
    .split('\n')
    .slice(3)
    .map((line) => {
      const [band, minLat, maxLat, minNorth, maxNorth] = line
        .split('|')
        .map((cell) => cell.trim())
        .filter(Boolean);

      return [
        band,
        {
          latitude: {
            // NOTE: duplicated code because it is all removed by esbuild-inline
            max: Number.parseFloat(`${maxLat}`),
            // NOTE: duplicated code because it is all removed by esbuild-inline
            min: Number.parseFloat(`${minLat}`),
          },
          northing: {
            // NOTE: duplicated code because it is all removed by esbuild-inline
            max: Number.parseFloat(`${maxNorth}`),
            // NOTE: duplicated code because it is all removed by esbuild-inline
            min: Number.parseFloat(`${minNorth}`),
          },
        },
      ];
    }),
); // @esbuild-inline-end

export const GRID_ZONE_LETTER = 'CDEFGHJKLMNPQRSTUVWX';
