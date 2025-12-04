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
import { createUTM } from '../utm/create-utm.js';
import { toStringFromUTM as toStringUTM } from '../utm/to-string-from-utm.js';
import { getTokens } from './get-tokens.js';
import { parseWGS } from './parse-wgs.js';
import { toMGRSFromWGS } from './to-mgrs-from-wgs.js';
import { toStringFromWGS } from './to-string-from-wgs.js';
import { toUTMFromWGS } from './to-utm-from-wgs.js';
import type { CoordinateWGS } from './coordinate-wgs.js';
import type { OptionsWGS } from './options-wgs.js';

export function createWGS(input: string, options?: OptionsWGS) {
  const value = parseWGS(input, options) as CoordinateWGS;

  if (options?.skipValidation) {
    return value;
  }

  if (value instanceof ParseError) {
    throw value;
  }

  Object.defineProperties(value, {
    tokens: {
      value: (tokensOptions: OptionsWGS = {}) =>
        getTokens(value, { ...options, ...tokensOptions }),
    },
    toString: {
      value: (toStringOptions: OptionsWGS = {}) =>
        toStringFromWGS(value, { ...options, ...toStringOptions }),
    },
    toMGRS: { value: () => createMGRS(toStringMGRS(toMGRSFromWGS(value))) },
    toUTM: { value: () => createUTM(toStringUTM(toUTMFromWGS(value))) },
  });

  return value;
}
