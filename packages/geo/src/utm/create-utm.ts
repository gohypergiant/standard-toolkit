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

import { ParseError } from '../internal/parse-error.js';
import { createMGRS } from '../mgrs/create-mgrs.js';
import { toStringFromMGRS as toStringMGRS } from '../mgrs/to-string-from-mgrs.js';
import { createWGS } from '../wgs/create-wgs.js';
import { toStringFromWGS as toStringWGS } from '../wgs/to-string-from-wgs.js';
import { parseUTM } from './parse-utm.js';
import { toMGRSFromUTM } from './to-mgrs-from-utm.js';
import { toStringFromUTM } from './to-string-from-utm.js';
import { toWGSFromUTM } from './to-wgs-from-utm.js';
import type { OptionsWGS } from '../wgs/options-wgs.js';
import type { CoordinateUTM } from './coordinate-utm.js';

export function createUTM(input: string, options?: OptionsWGS) {
  const value = parseUTM(input) as CoordinateUTM;

  if (options?.skipValidation) {
    return value;
  }

  if (value instanceof ParseError) {
    throw value;
  }

  Object.defineProperties(value, {
    tokens: { value: () => value },
    toString: { value: () => toStringFromUTM(value) },
    toMGRS: { value: () => createMGRS(toStringMGRS(toMGRSFromUTM(value))) },
    toWGS: {
      value: (options?: OptionsWGS) =>
        createWGS(toStringWGS(toWGSFromUTM(value), options)),
    },
  });

  return value;
}
