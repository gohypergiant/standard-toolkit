/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { convertLength } from '@turf/turf';
import { describe, expect, it } from 'vitest';
import { mockShapes } from '../../__fixtures__/mock-shapes';
import { formatDistance } from '../../shared/constants';
import { getRadiusLabelText } from './radius-label';
import type { CircleShape, Shape } from '../../shared/types';

/** Circle fixture: radius 250 km */
const circleFixture = mockShapes[0] as CircleShape;

/** Non-circle fixture (Point) */
const pointFixture = mockShapes[2] as Shape;

describe('getRadiusLabelText', () => {
  it('returns empty string for non-circle shapes', () => {
    expect(getRadiusLabelText(pointFixture)).toBe('');
  });

  it('returns formatted radius with default unit (NM)', () => {
    const result = getRadiusLabelText(circleFixture);

    const expectedValue = convertLength(250, 'kilometers', 'nauticalmiles');
    expect(result).toBe(`r: ${formatDistance(expectedValue)} NM`);
  });

  it('returns formatted radius with specified unit symbol', () => {
    const result = getRadiusLabelText(circleFixture, 'km');

    expect(result).toBe('r: 250.00 km');
  });

  it('converts between different units', () => {
    const result = getRadiusLabelText(circleFixture, 'mi');

    const expectedValue = convertLength(250, 'kilometers', 'miles');
    expect(result).toBe(`r: ${formatDistance(expectedValue)} mi`);
  });
});
