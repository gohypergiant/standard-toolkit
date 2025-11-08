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
import { createUTM } from '../utm/create-utm.js';
import { toStringFromUTM as toStringUTM } from '../utm/to-string-from-utm.js';
import { createWGS } from '../wgs/create-wgs.js';
import { toStringFromWGS as toStringWGS } from '../wgs/to-string-from-wgs.js';
import { parseMGRS } from './parse-mgrs.js';
import { toStringFromMGRS } from './to-string-from-mgrs.js';
import { toUTMFromMGRS } from './to-utm-from-mgrs.js';
import { toWGSFromMGRS } from './to-wgs-from-mgrs.js';
import type { Options } from '../internal/options.js';
import type { OptionsWGS } from '../wgs/options-wgs.js';
import type { CoordinateMGRS } from './coordinate-mgrs.js';

export function createMGRS(input: string, options?: Options) {
  const value = parseMGRS(input) as CoordinateMGRS;

  if (options?.skipValidation) {
    return value;
  }

  if (value instanceof ParseError) {
    throw value;
  }

  Object.defineProperties(value, {
    tokens: { value: () => value },
    toString: { value: () => toStringFromMGRS(value) },
    toUTM: { value: () => createUTM(toStringUTM(toUTMFromMGRS(value))) },
    toWGS: {
      value: (options?: OptionsWGS) =>
        createWGS(toStringWGS(toWGSFromMGRS(value), options)),
    },
  });

  return value;
}
