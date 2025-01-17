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
import { type BoundingBoxTuple, type XyzTuple, xyzToBbox } from './';

const one: BoundingBoxTuple = [
  -80.15625, 39.909736234537185, -78.75, 40.97989806962013,
];

const two: BoundingBoxTuple = [
  -80.15625, 38.82259097617712, -78.75, 39.909736234537185,
];

const three: BoundingBoxTuple = [
  -80.15625, 37.71859032558813, -78.75, 38.82259097617712,
];

const four: BoundingBoxTuple = [
  -80.15625, 36.5978891330702, -78.75, 37.71859032558813,
];

const five: BoundingBoxTuple = [
  -78.75, 39.909736234537185, -77.34375, 40.97989806962013,
];

const six: BoundingBoxTuple = [
  -78.75, 38.82259097617712, -77.34375, 39.909736234537185,
];

const tilePairs: [XyzTuple, BoundingBoxTuple][] = [
  [[71, 96, 8], one],
  [[71, 97, 8], two],
  [[71, 98, 8], three],
  [[71, 99, 8], four],
  [[72, 96, 8], five],
  [[72, 97, 8], six],
];

describe('tile-to-bbox', () => {
  it.each(tilePairs)('should correctly convert %s', (input, expected) => {
    const bbox = xyzToBbox(input);

    expect(bbox).toStrictEqual(expected);
  });
});
