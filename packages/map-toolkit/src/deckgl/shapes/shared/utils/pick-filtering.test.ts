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

import { describe, expect, it } from 'vitest';
import { filterGeometryAwarePicks } from './pick-filtering';

type MockPick = {
  isGuide?: boolean;
  object?: {
    geometry?: {
      type?: string;
    };
  };
};

const guidePick: MockPick = { isGuide: true };
const geometryPick: MockPick = {
  object: { geometry: { type: 'Polygon' } },
};
const sublayerPick: MockPick = { object: {} };
const emptyPick: MockPick = {};

describe('filterGeometryAwarePicks', () => {
  it('should return empty array and didFilter false for empty input', () => {
    const result = filterGeometryAwarePicks<MockPick>([]);

    expect(result.filteredPicks).toEqual([]);
    expect(result.didFilter).toBe(false);
  });

  it('should keep all picks when all have valid geometry', () => {
    const picks = [geometryPick, geometryPick];

    const result = filterGeometryAwarePicks(picks);

    expect(result.filteredPicks).toHaveLength(2);
    expect(result.didFilter).toBe(false);
  });

  it('should keep all picks when all are guides', () => {
    const picks = [guidePick, guidePick];

    const result = filterGeometryAwarePicks(picks);

    expect(result.filteredPicks).toHaveLength(2);
    expect(result.didFilter).toBe(false);
  });

  it('should filter out picks without geometry or guide status', () => {
    const picks = [sublayerPick, emptyPick];

    const result = filterGeometryAwarePicks(picks);

    expect(result.filteredPicks).toHaveLength(0);
    expect(result.didFilter).toBe(true);
  });

  it('should keep guides and geometry picks while filtering sublayer picks', () => {
    const picks = [guidePick, geometryPick, sublayerPick, emptyPick];

    const result = filterGeometryAwarePicks(picks);

    expect(result.filteredPicks).toEqual([guidePick, geometryPick]);
    expect(result.didFilter).toBe(true);
  });

  it('should keep picks with guide status even without geometry', () => {
    const guideWithoutGeometry: MockPick = { isGuide: true, object: {} };

    const result = filterGeometryAwarePicks([guideWithoutGeometry]);

    expect(result.filteredPicks).toHaveLength(1);
    expect(result.didFilter).toBe(false);
  });

  it('should keep valid picks that appear after invalid ones', () => {
    const picks = [sublayerPick, geometryPick, emptyPick, guidePick];

    const result = filterGeometryAwarePicks(picks);

    expect(result.filteredPicks).toEqual([geometryPick, guidePick]);
    expect(result.didFilter).toBe(true);
  });

  it('should filter picks with object but undefined geometry type', () => {
    const undefinedTypePick: MockPick = {
      object: { geometry: { type: undefined } },
    };

    const result = filterGeometryAwarePicks([undefinedTypePick]);

    expect(result.filteredPicks).toHaveLength(0);
    expect(result.didFilter).toBe(true);
  });
});
