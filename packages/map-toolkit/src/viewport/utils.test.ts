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
import { getViewportScale } from './utils';

describe('getViewportScale', () => {
  it('converts the bounds to a string', () => {
    const result = getViewportScale({
      bounds: [-82, 22, -71, 52],
      unit: 'nmi',
    });
    expect(result).toBe('612 x 1,801 NMI');
  });
  it('can take a custom formatter', () => {
    const formatter = Intl.NumberFormat('de-DE');
    const result = getViewportScale({
      bounds: [-82, 22, -71, 52],
      unit: 'km',
      formatter,
    });
    expect(result).toBe('1.134 x 3.336 KM');
  });
  it('provides a fallback for undefined bounds', () => {
    const result = getViewportScale({
      bounds: undefined,
    });
    expect(result).toBe('-- x -- NMI');
  });
});
