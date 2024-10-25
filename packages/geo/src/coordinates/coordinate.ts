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
  type Errors,
  type Format,
  FORMATS_DEFAULT,
  SYMBOLS,
} from './latlon/internal';
import type { CoordinateSystem } from './latlon/internal/coordinate-sytem';
import {
  createCache,
  type CoordinateCache,
} from './latlon/internal/create-cache';
import type { Tokens } from './latlon/internal/lexer';
import { systemMGRS } from './mgrs/system';
import { systemUTM } from './utm/system';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type MinLengthArray = [any, any];

type AnySystem = CoordinateSystem<MinLengthArray>;

/**
 * Output a string value of a coordinate using an available system. The
 * original value is preserved without conversion to an internal
 * representation - Decimal Degrees - to prevent the possibility of
 * rounding errors. All alternative values are computed from a common
 * internal value to reduce complexity.
 *
 * @pure
 *
 * @example
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
 */
type Formatter = (f?: Format) => string;

type Coordinate = {
  /** @see {@link Formatter} */
  dd: Formatter;
  /** @see {@link Formatter} */
  ddm: Formatter;
  /** @see {@link Formatter} */
  dms: Formatter;
  /** @see {@link Formatter} */
  mgrs: Formatter;
  /** @see {@link Formatter} */
  utm: Formatter;
  errors: string[];
  raw: CoordinateInternalValue;
  valid: boolean;
};

// biome-ignore lint/style/useNamingConvention: consistency
type CoordinateInternalValue = { LAT: number; LON: number };

type OutputCache = Record<keyof typeof coordinateSystems, CoordinateCache>;

export const coordinateSystems = Object.freeze({
  dd: systemDecimalDegrees,
  ddm: systemDegreesDecimalMinutes,
  dms: systemDegreesMinutesSeconds,
  mgrs: systemMGRS,
  utm: systemUTM,
} as const);

const DEFAULT_SYSTEM = coordinateSystems.dd;

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
    errors,
    raw,
    valid,
  } as Coordinate);

/**
 * Create a coordinate object enabling: lexing, parsing, validation, and
 * formatting in alternative systems and formats. The system and format will be
 * used for validation and eventually for output as defaults if no alternatives
 * are provided.
 *
 * @param initSystem dd, ddm, or dms
 *
 * @pure
 *
 * @example
 * const create = createCoordinate(coordinateSystems.dd, 'LATLON')
 * const create = createCoordinate(coordinateSystems.ddm, 'LONLAT')
 */
export function createCoordinate(
  initSystem: AnySystem = DEFAULT_SYSTEM,
  initFormat: Format = FORMATS_DEFAULT,
) {
  return (input: string) => {
    let tokens: Tokens;
    let errors: Errors;

    try {
      [tokens, errors] = initSystem.parse(initFormat, input);

      if (errors.length) {
        throw errors;
      }
    } catch (errors) {
      return freezeCoordinate(
        errors as Coordinate['errors'],
        () => '',
        {} as CoordinateInternalValue,
        false,
      );
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

    const raw = internalRepresentation(initFormat, initSystem, tokens);

    const to = (
      system: AnySystem = initSystem,
      format: Format = initFormat,
    ) => {
      const key = system.name as keyof typeof coordinateSystems;

      if (!cachedValues[key]?.[format]) {
        // cache "miss" - fill the missing value in the cache before returning it

        // update the cache to include the newly computed value
        cachedValues[key] = {
          ...cachedValues[key],
          // use the Format to build the object, correctly pairing the halves of
          // the coordinate value with their labels
          [format]: system.toFormat(
            format,
            ([format.slice(0, 3), format.slice(3)] as Axes[]).map(
              (key) => raw[key],
            ) as [number, number],
          ),
        };
      }

      return cachedValues[key][format];
    };

    return freezeCoordinate([] as Coordinate['errors'], to, raw, true);
  };
}

/**
 * Create the "internal" representation - Decimal Degrees - for consistency and
 * ease of computation; all systems expect to start from a common starting
 * point to reduce complexity.
 *
 * @pure
 */
function internalRepresentation(
  initFormat: Format,
  { toFloat }: AnySystem,
  tokens: Tokens,
) {
  return Object.fromEntries([
    [
      initFormat.slice(0, 3),
      toFloat(
        tokens.slice(0, tokens.indexOf(SYMBOLS.DIVIDER)) as MinLengthArray,
      ),
    ],
    [
      initFormat.slice(3),
      toFloat(
        tokens.slice(1 + tokens.indexOf(SYMBOLS.DIVIDER)) as MinLengthArray,
      ),
    ],
  ]) as CoordinateInternalValue;
}
