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

import { describe, expect, it } from 'vitest';
import { parseMGRS } from './parser';

describe('MGRS', () => {
  it.each`
    input                   | tokens                                                        | errors
    ${'30U WB 85358 69660'} | ${['51.17199279600467', 'N', '/', '1.7790080009934', 'W']}    | ${[]}
    ${'46T BQ 63553 87329'} | ${['44.99999513853258', 'N', '/', '89.99998789721894', 'E']}  | ${[]}
    ${'31N AA 66021 00000'} | ${['0', 'N', '/', '0.00000397635915', 'W']}                   | ${[]}
    ${'33T WN 08400 78900'} | ${['47.66343871798816', 'N', '/', '15.11188157723953', 'E']}  | ${[]}
    ${'15S WC 80800 17500'} | ${['38.10170059704453', 'N', '/', '92.07843406063685', 'W']}  | ${[]}
    ${'10S EG 57219 43918'} | ${['37.44033194759393', 'N', '/', '122.35317152361218', 'W']} | ${[]}
    ${'4Q FJ 12345 67890'}  | ${[]}                                                         | ${['Invalid Latitude band letter () found in grid zone designation; expected format DDZ AA DDD DDD.']}
  `('should parse $input', ({ input, ...expected }) => {
    const [coord, errors] = parseMGRS('MGRS', input);

    expect(errors).toStrictEqual(
      expected.errors.map((t: string) => `[ERROR] ${t}`),
    );
    expect(coord).toStrictEqual(expected.tokens.map(String));
  });
});
