/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { systemDecimalDegrees } from './latlon/decimal-degrees/system';
import { systemDegreesDecimalMinutes } from './latlon/degrees-decimal-minutes/system';
import { systemDegreesMinutesSeconds } from './latlon/degrees-minutes-seconds/system';
import {
  type Axes,
  type CoordinateInput,
  type CoordinateInternalValue,
  type Errors,
  FORMATS_DEFAULT,
  type Format,
  isCoordinateObject,
  isCoordinateTuple,
  normalizeObjectToLatLon,
  SYMBOLS,
  tupleToLatLon,
  validateNumericCoordinate,
} from './latlon/internal';

export type {
  CoordinateInput,
  CoordinateObject,
  CoordinateTuple,
  LatLonTuple,
  LonLatTuple,
} from './latlon/internal';

import {
  type CoordinateCache,
  createCache,
} from './latlon/internal/create-cache';
import { systemMGRS } from './mgrs/system';
import { systemUTM } from './utm/system';
import type { CoordinateSystem } from './latlon/internal/coordinate-system';
import type { Tokens } from './latlon/internal/lexer';

type Coordinate = {
  /** {@interitDoc Formatter} */
  dd: Formatter;
  /** {@interitDoc Formatter} */
  ddm: Formatter;
  /** {@interitDoc Formatter} */
  dms: Formatter;
  /** {@interitDoc Formatter} */
  mgrs: Formatter;
  /** {@interitDoc Formatter} */
  utm: Formatter;
  errors: string[];
  raw: CoordinateInternalValue;
  valid: boolean;
};

/**
 * Output a string value of a coordinate using an available system. The
 * original value is preserved without conversion to an internal
 * representation - Decimal Degrees - to prevent the possibility of
 * rounding errors. All alternative values are computed from a common
 * internal value to reduce complexity.
 *
 * @link https://en.wikipedia.org/wiki/Coordinate_system
 *
 * @remarks
 * pure function
 *
 * @example
 * ```typescript
 * const create = createCoordinate(coordinateSystems.dd, 'LATLON')
 * const coord = create('89.765432109 / 123.456789012')
 *
 * // honors the instantiation format 'LATLON'
 * coord.dd() === '89.765432109 N / 123.456789012 E'
 * coord.ddm() === '89 45.92592654 N / 123 27.40734072 E'
 * coord.dms() === '89 45 55.5555924 N / 123 27 24.4404432 E'
 *
 * // change format to 'LONLAT'
 * coord.dms('LONLAT') === '123 27 24.4404432 E / 89 45 55.5555924 N'
 * ```
 */
type Formatter = (f?: Format) => string;

type ToFloatArg = Parameters<CoordinateSystem['toFloat']>[0];

type OutputCache = Record<keyof typeof coordinateSystems, CoordinateCache>;

/**
 * Available coordinate systems for parsing, converting, and formatting geographic coordinates.
 *
 * Provides five coordinate notation systems:
 * - dd: Decimal Degrees
 * - ddm: Degrees Decimal Minutes
 * - dms: Degrees Minutes Seconds
 * - mgrs: Military Grid Reference System
 * - utm: Universal Transverse Mercator
 *
 * @example
 * ```typescript
 * const create = createCoordinate(coordinateSystems.dd, 'LATLON');
 * const coord = create('40.7128 / -74.0060');
 * ```
 *
 * @example
 * ```typescript
 * const createMGRS = createCoordinate(coordinateSystems.mgrs);
 * const coord = createMGRS('18T WL 80000 00000');
 * ```
 */
export const coordinateSystems = Object.freeze({
  dd: systemDecimalDegrees,
  ddm: systemDegreesDecimalMinutes,
  dms: systemDegreesMinutesSeconds,
  mgrs: systemMGRS,
  utm: systemUTM,
} as const);

const freezeCoordinate = (
  errors: Coordinate['errors'],
  to: (s?: CoordinateSystem, f?: Format) => string,
  raw: CoordinateInternalValue,
  valid: Coordinate['valid'],
) =>
  Object.freeze({
    dd: (format?: Format) => to(systemDecimalDegrees, format),
    ddm: (format?: Format) => to(systemDegreesDecimalMinutes, format),
    dms: (format?: Format) => to(systemDegreesMinutesSeconds, format),
    mgrs: (format?: Format) => to(systemMGRS, format),
    utm: (format?: Format) => to(systemUTM, format),
    errors,
    raw,
    valid,
  } as Coordinate);

const errorCoordinate = (errors: string[]) =>
  freezeCoordinate(errors, () => '', {} as CoordinateInternalValue, false);

const createFormatter =
  (
    raw: CoordinateInternalValue,
    cachedValues: OutputCache,
    initSystem: CoordinateSystem,
    initFormat: Format,
  ) =>
  (system: CoordinateSystem = initSystem, format: Format = initFormat) => {
    const key = system.name as keyof typeof coordinateSystems;

    if (!cachedValues[key]?.[format]) {
      if (!cachedValues[key]) {
        cachedValues[key] = {} as CoordinateCache;
      }

      cachedValues[key][format] = system.toFormat(format, [
        raw[format.slice(0, 3) as Axes],
        raw[format.slice(3) as Axes],
      ] as [number, number]);
    }

    return cachedValues[key][format];
  };

/**
 * Create a coordinate object enabling: lexing, parsing, validation, and
 * formatting in alternative systems and formats. The system and format will be
 * used for validation and eventually for output as defaults if no alternatives
 * are provided.
 *
 * @param initSystem - Coordinate system to use for parsing (dd, ddm, dms, mgrs, or utm from coordinateSystems). Defaults to Decimal Degrees.
 * @param initFormat - Coordinate format ordering (LATLON or LONLAT). Defaults to LATLON.
 * @returns Function that accepts coordinate string and returns Coordinate object with formatters.
 *
 * @remarks
 * pure function
 *
 * @example
 * ```typescript
 * const create = createCoordinate(coordinateSystems.dd, 'LATLON')
 * const coord = create('40.7128 / -74.0060')
 * coord.dd() // '40.7128 N / 74.006 W'
 * coord.dms() // '40 42 46.08 N / 74 0 21.6 W'
 * ```
 *
 * @example
 * ```typescript
 * const create = createCoordinate(coordinateSystems.ddm, 'LONLAT')
 * const coord = create('-74 0.36 / 40 42.768')
 * coord.ddm('LATLON') // '40 42.768 N / 74 0.36 W'
 * ```
 */
export function createCoordinate(
  initSystem: CoordinateSystem = coordinateSystems.dd,
  initFormat: Format = FORMATS_DEFAULT,
) {
  function parseStringInput(input: string): Coordinate {
    let tokens: Tokens;
    let errors: Errors;

    try {
      [tokens, errors] = initSystem.parse(initFormat, input);

      if (errors.length) {
        throw errors;
      }
    } catch (errors) {
      return errorCoordinate(errors as Coordinate['errors']);
    }

    // start with the original value for the original system in the original format
    // other values will be computed as needed and cached per request
    const cachedValues = {
      [initSystem.name]: createCache(
        initFormat,
        // because mgrs doesn't have two formats: LATLON v LONLAT
        initSystem.name === systemMGRS.name ? input : tokens.join(' '),
      ),
    } as OutputCache;

    // Create the "internal" representation - Decimal Degrees - for
    // consistency and ease of computation; all systems expect to
    // start from a common starting point to reduce complexity.
    const dividerIndex = tokens.indexOf(SYMBOLS.DIVIDER);
    const raw = {
      [initFormat.slice(0, 3)]: initSystem.toFloat(
        tokens.slice(0, dividerIndex) as ToFloatArg,
      ),
      [initFormat.slice(3)]: initSystem.toFloat(
        tokens.slice(dividerIndex + 1) as ToFloatArg,
      ),
    } as CoordinateInternalValue;

    const to = createFormatter(raw, cachedValues, initSystem, initFormat);

    return freezeCoordinate([] as Coordinate['errors'], to, raw, true);
  }

  function parseNumericInput(lat: number, lon: number): Coordinate {
    const errors = validateNumericCoordinate(lat, lon);

    if (errors.length) {
      return errorCoordinate(errors);
    }

    const raw: CoordinateInternalValue = { LAT: lat, LON: lon };
    const cachedValues = {} as OutputCache;

    const to = createFormatter(raw, cachedValues, initSystem, initFormat);

    return freezeCoordinate([] as Coordinate['errors'], to, raw, true);
  }

  return (input: CoordinateInput): Coordinate => {
    if (typeof input === 'string') {
      return parseStringInput(input);
    }

    if (isCoordinateTuple(input)) {
      const { lat, lon } = tupleToLatLon(initFormat, input);
      return parseNumericInput(lat, lon);
    }

    if (isCoordinateObject(input)) {
      const result = normalizeObjectToLatLon(input);

      if (result === null) {
        return errorCoordinate([
          '[ERROR] Invalid coordinate object; object must contain valid latitude and longitude properties.',
        ]);
      }

      const { lat, lon } = result;
      return parseNumericInput(lat, lon);
    }

    return errorCoordinate([
      '[ERROR] Invalid coordinate input; expected a string, [lat, lon] tuple, or { lat, lon } object.',
    ]);
  };
}
