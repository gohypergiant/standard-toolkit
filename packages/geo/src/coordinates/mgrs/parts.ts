/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { LatLon } from 'geodesy/mgrs';
import { type GridPartsResult, isGridProjectable } from '../utm/parts';

/**
 * Structured MGRS grid parts for a signed `[lat, lon]` coordinate.
 *
 * `zone`/`band`/`e100k`/`n100k` identify the grid square; `easting`/`northing`
 * are the geodesy within-square metre values (`0`–`99999`) prior to truncation.
 */
export type MgrsParts = {
  zone: number;
  band: string;
  e100k: string;
  n100k: string;
  easting: number;
  northing: number;
};

/**
 * Converts a signed `[lat, lon]` coordinate into MGRS grid parts.
 *
 * Reads the geodesy `Mgrs` object fields directly instead of parsing a
 * formatted string. The UTM/MGRS grid is defined for `-80 ≤ lat ≤ 84`
 * inclusive; latitudes outside that band, a longitude of exactly `+180°` (the
 * antimeridian zone singularity), or non-finite input, produce
 * `{ ok: false, reason: 'out-of-range' }`.
 *
 * @param coordinate - Signed `[latitude, longitude]` tuple.
 * @returns A discriminated result with `{ zone, band, e100k, n100k, easting, northing }` on success.
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * toMgrsParts([38.8977, -77.0365]);
 * // { ok: true, value: { zone: 18, band: 'S', e100k: 'U', n100k: 'J', easting: 23394.29…, northing: 7395.63… } }
 * ```
 *
 * @example
 * ```typescript
 * toMgrsParts([-81, 0]);
 * // { ok: false, reason: 'out-of-range' }
 * ```
 */
export const toMgrsParts = ([lat, lon]: [
  number,
  number,
]): GridPartsResult<MgrsParts> => {
  if (!isGridProjectable([lat, lon])) {
    return { ok: false, reason: 'out-of-range' };
  }

  const mgrs = new LatLon(lat, lon).toUtm().toMgrs();

  return {
    ok: true,
    value: {
      zone: mgrs.zone,
      band: mgrs.band,
      e100k: mgrs.e100k,
      n100k: mgrs.n100k,
      easting: mgrs.easting,
      northing: mgrs.northing,
    },
  };
};

/**
 * Renders MGRS grid parts as their canonical coordinate string.
 *
 * Mirrors geodesy's `Mgrs.toString(10)`: floors the within-square metres,
 * left-pads the zone to two digits and easting/northing to five, and joins the
 * zone+band, the `e100k`/`n100k` grid-square pair, and the padded metres with
 * single spaces.
 *
 * @param parts - The MGRS grid parts to render.
 * @returns The canonical MGRS string, e.g. `"18S UJ 23394 07396"`.
 *
 * @remarks pure function
 *
 * @example
 * ```typescript
 * formatMgrsParts({ zone: 18, band: 'S', e100k: 'U', n100k: 'J', easting: 23394, northing: 7396 });
 * // '18S UJ 23394 07396'
 * ```
 */
export const formatMgrsParts = ({
  zone,
  band,
  e100k,
  n100k,
  easting,
  northing,
}: MgrsParts): string => {
  const zonePadded = zone.toString().padStart(2, '0');
  const eastingPadded = Math.floor(easting).toString().padStart(5, '0');
  const northingPadded = Math.floor(northing).toString().padStart(5, '0');

  return `${zonePadded}${band} ${e100k}${n100k} ${eastingPadded} ${northingPadded}`;
};
