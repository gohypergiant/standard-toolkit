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

import { SEPARATOR } from './separator.js';

/**
 * Represents a raw coordinate parsed from tokens before refinement.
 */
export interface RawCoordinate {
  compass: undefined | string;
  degrees: undefined | number;
  minutes: undefined | number;
  seconds: undefined | number;
}

const rCOMPASS = /[NSEW]/i;

/**
 * Groups tokens into two RawCoordinate objects by splitting on the separator.
 * Tokens are accumulated into coordinate parts based on their symbols (°, ', ", compass).
 *
 * @param tokens - Array of parsed tokens from the coordinate string
 * @returns Array of two RawCoordinate objects (reversed, so index 0 is first coordinate)
 *
 * @example
 * ```ts
 * groupTokens(['40°', '42'', '46.08"', 'N', '|', '74°', '0'', '21.6"', 'W'])
 * // Returns: [
 * //   { compass: 'N', degrees: 40, minutes: 42, seconds: 46.08 },
 * //   { compass: 'W', degrees: 74, minutes: 0, seconds: 21.6 }
 * // ]
 * ```
 */
export function groupTokens(tokens: string[]): [RawCoordinate, RawCoordinate] {
  const grouped = tokens.reduce(group, [{} as RawCoordinate]).reverse();

  return [grouped[0], grouped[1]] as [RawCoordinate, RawCoordinate];
}

function group(acc: RawCoordinate[], token: string): RawCoordinate[] {
  if (token.includes(SEPARATOR)) {
    return [{} as RawCoordinate, ...acc];
  }

  const current = acc[0] as RawCoordinate;

  if (rCOMPASS.test(token)) {
    current.compass = token;

    return acc;
  }

  if (token.includes('°')) {
    current.degrees = Number.parseFloat(token);

    return acc;
  }

  if (token.includes("'")) {
    current.minutes = Number.parseFloat(token);

    return acc;
  }

  if (token.includes('"')) {
    current.seconds = Number.parseFloat(token);

    return acc;
  }

  if (!current.degrees) {
    current.degrees = Number.parseFloat(token);

    return acc;
  }

  if (!current.minutes) {
    current.minutes = Number.parseFloat(token);

    return acc;
  }

  /* v8 ignore else */
  if (!current.seconds) {
    current.seconds = Number.parseFloat(token);

    return acc;
  }

  // NOTE: should not be possible given valid input; purely to satisfy TypeScript
  /* v8 ignore next */
  return acc;
}
