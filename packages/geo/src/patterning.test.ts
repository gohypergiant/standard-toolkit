// __private-exports
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

import { expect, it, describe } from 'vitest';

import * as Patterning from './patterning';

describe('Patterning', () => {
  it.each`
    method                 | expected
    ${Patterning.capture}  | ${['(abc)', '(abc)']}
    ${Patterning.group}    | ${['(?:abc)', '(?:abc)']}
    ${Patterning.merge}    | ${['abc', 'abc']}
    ${Patterning.optional} | ${['(?:abc)?', '(?:abc)?']}
  `('$method.name', ({ expected, method }) => {
    expect(method(/a/, /b/, /c/).source).toBe(expected[0]);
    expect(method(/abc/).source).toBe(expected[1]);
  });

  describe('fromTemplate', () => {
    it('should build a regex from parts', () => {
      const parts = {
        alpha: /alpha/,
        beta: /beta/,

        ' ': / /,
      };

      expect(Patterning.fromTemplate(parts, 'beta alpha').toString()).toBe(
        /^beta alpha$/.toString(),
      );

      expect(
        Patterning.fromTemplate(parts, 'alpha beta missing').toString(),
      ).toBe(/^alpha beta _MISS_missing_MISS_$/.toString());
    });
  });
});
