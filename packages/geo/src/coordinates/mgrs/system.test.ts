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
    input                   | tokens                                          | errors
    ${'30U WB 85358 69660'} | ${['51.1719929', 'N', '/', '1.779008', 'W']}    | ${[]}
    ${'4Q FJ 12345 67890'}  | ${['21.4097968', 'N', '/', '157.9160812', 'W']} | ${[]}
    ${'46T BQ 63553 87329'} | ${['44.9999953', 'N', '/', '89.9999879', 'E']}  | ${[]}
    ${'31N AA 66021 00000'} | ${['0', 'N', '/', '0.000004', 'W']}             | ${[]}
    ${'33T WN 08400 78900'} | ${['47.6634389', 'N', '/', '15.1118816', 'E']}  | ${[]}
    ${'15S WC 80800 17500'} | ${['38.1017007', 'N', '/', '92.0784341', 'W']}  | ${[]}
    ${'10S EG 57219 43918'} | ${['37.4403321', 'N', '/', '122.3531715', 'W']} | ${[]}
  `('should parse $input', ({ input, ...expected }) => {
    const [coord, errors] = parseMGRS('MGRS', input);

    expect(errors).toStrictEqual(expected.errors);
    expect(coord).toStrictEqual(expected.tokens.map(String));
  });
});
