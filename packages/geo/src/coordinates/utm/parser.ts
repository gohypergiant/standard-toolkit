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

import { UTM } from '@ngageoint/mgrs-js';
import { type ParseResults, parse } from '../latlon/internal/parse';
import { violation } from '../latlon/internal/violation';

type Match = [string, string, string, string];

const PATTERN_PARTS =
  /^((?:..)?)\s*(\w?)\s*(?:(\d+(?:\.\d*)?)?)\s*(?:(\d+(?:\.\d*)?)?)$/i;

const error = (message: string) =>
  [
    [],
    [`${violation(message)}; expected format ZZ N|S DDD DDD.`],
  ] as ParseResults;

function detailedErrors(input: string) {
  const [zone, band, east, north] = (
    input.trim().replace(/\s+/g, ' ').match(PATTERN_PARTS) ?? []
  ).slice(1) as Match;

  if (!zone || +zone > 60 || +zone < 1) {
    return error(`Invalid Zone number (${zone}) found`);
  }

  if (!/[NS]/i.test(band)) {
    return error(`Invalid Latitude band letter (${band}) found`);
  }

  if (!(east || +east >= 0)) {
    return error(`Invalid Easting number (${east ?? ''}) found`);
  }

  if (!(north || +north >= 0)) {
    return error(`Invalid Northing number (${north ?? ''}) found`);
  }

  return error('Uncaught error condition.');
}

// biome-ignore lint/style/useNamingConvention: <explanation>
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function parseUTM(_format: any, input: string) {
  try {
    const point = UTM.parse(input).toPoint();

    return parse(`${point.getLatitude()} / ${point.getLongitude()}`, 'LATLON');
  } catch (_) {
    return detailedErrors(input);
  }
}
