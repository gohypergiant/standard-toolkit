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

import { describe, expect, it } from 'vitest';
import { validatePrecisionUTM } from './precision.js';
import type { LexerTokens } from './lexer-tokens.js';

describe('validatePrecisionUTM', () => {
  it('should guard against invalid `zoneLetter` values even though prior validators should catch these', () => {
    const zoneLetter = '!';

    expect(() =>
      validatePrecisionUTM({
        easting: '500000',
        northing: '4649776',
        zoneLetter,
      } as LexerTokens),
    ).toThrowError(
      new Error(
        [
          '\n\n',
          Array(88).fill('-').join(''),
          `Missing northing limits for zone letter "${zoneLetter}"`,
          'This should not be possible, if the previous validators have passed.',
          Array(88).fill('-').join(''),
          '\n\n',
        ].join('\n'),
      ),
    );
  });
});
