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

import { MGRS } from '@ngageoint/mgrs-js';
import { type ParseResults, parse } from '../latlon/internal/parse';
import { violation } from '../latlon/internal/violation';

type Match = [string, string, string, string, string];

const PATTERN_PARTS =
  /^((?:..?)?)(\w?)\s*((?:\w{2})?)\s*(?:(\d+(?:\.\d*)?)?)\s*(?:(\d+(?:\.\d*)?)?)$/i;

const error = (message: string) =>
  [
    [],
    [`${violation(message)}; expected format DDZ AA DDD DDD.`],
  ] as ParseResults;

function detailedErrors(input: string) {
  if (!input) {
    return error('No input provided');
  }

  const [utm, bnd, hkm, east, north] = (
    input.trim().replace(/\s+/g, ' ').match(PATTERN_PARTS) ?? []
  ).slice(1) as Match;

  if (!utm || +utm > 60 || +utm < 1) {
    return error(
      `Invalid UTM zone number (${utm}) found in grid zone designation`,
    );
  }

  if (!/[C-HJ-NP-X]/i.test(bnd)) {
    return error(
      `Invalid Latitude band letter (${bnd}) found in grid zone designation`,
    );
  }

  if (!/^[A-HJ-NP-Z]*$/i.test(hkm)) {
    return error(`Invalid 100K m square identification (${hkm}) found`);
  }

  if (!(east && north && +east > 0 && +north > 0)) {
    return error(`Invalid numerical location (${[east, north].join()}) found`);
  }

  return error('Uncaught error condition.');
}

// biome-ignore lint/style/useNamingConvention: <explanation>
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function parseMGRS(_format: any, input: string) {
  try {
    const point = MGRS.parse(input).toPoint();

    return parse(`${point.getLatitude()} / ${point.getLongitude()}`, 'LATLON');
  } catch (_e) {
    return detailedErrors(input);
  }
}
