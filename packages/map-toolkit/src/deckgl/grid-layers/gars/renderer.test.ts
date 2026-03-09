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

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Bounds } from '@ngageoint/grid-js';
import type { RenderContext } from '../core/types';
import { createGARSRenderer } from './renderer';
import { Grids } from '@ngageoint/gars-js';

vi.mock('@ngageoint/gars-js', () => ({
  GridType: {
    THIRTY_MINUTE: 'THIRTY_MINUTE',
    FIFTEEN_MINUTE: 'FIFTEEN_MINUTE',
    FIVE_MINUTE: 'FIVE_MINUTE',
  },
  Grids: { create: vi.fn() },
}));

const mockBounds = {} as Bounds;

const makeContext = (gridType: string): RenderContext => ({
  bounds: mockBounds,
  zoom: 7,
  gridType,
});

describe('createGARSRenderer', () => {
  const mockGetLines = vi.fn();
  const mockGetLabels = vi.fn();
  const mockGetGrid = vi.fn();

  beforeEach(() => {
    mockGetLines.mockReturnValue([]);
    mockGetLabels.mockReturnValue([]);
    mockGetGrid.mockReturnValue({
      getLines: mockGetLines,
      getLabels: mockGetLabels,
    });
    // biome-ignore lint/suspicious/noExplicitAny: Mock return type doesn't match full Grids shape
    vi.mocked(Grids.create).mockReturnValue({ getGrid: mockGetGrid } as any);
  });

  it('should return empty result for unknown grid type', () => {
    const renderer = createGARSRenderer();
    const result = renderer.render(makeContext('UNKNOWN_TYPE'));
    expect(result).toEqual({ lines: [], labels: [] });
  });

  it('should return empty result when grid is null', () => {
    mockGetGrid.mockReturnValue(null);
    const renderer = createGARSRenderer();
    const result = renderer.render(makeContext('THIRTY_MINUTE'));
    expect(result).toEqual({ lines: [], labels: [] });
  });

  it('should return empty result when library throws', () => {
    mockGetGrid.mockImplementation(() => {
      throw new Error('library error');
    });
    const renderer = createGARSRenderer();
    const result = renderer.render(makeContext('THIRTY_MINUTE'));
    expect(result).toEqual({ lines: [], labels: [] });
  });

  it('should map THIRTY_MINUTE lines to path format', () => {
    const mockLine = {
      getPoint1: () => ({ getLongitude: () => 10, getLatitude: () => 20 }),
      getPoint2: () => ({ getLongitude: () => 11, getLatitude: () => 21 }),
    };
    mockGetLines.mockReturnValue([mockLine]);
    const renderer = createGARSRenderer();
    const result = renderer.render(makeContext('THIRTY_MINUTE'));
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].path).toEqual([
      [10, 20],
      [11, 21],
    ]);
    expect(result.lines[0].cellId).toBeTypeOf('string');
  });

  it('should map labels to position format', () => {
    const mockLabel = {
      getCenter: () => ({ getLongitude: () => 0.5, getLatitude: () => 0.5 }),
      getName: () => '123A',
    };
    mockGetLabels.mockReturnValue([mockLabel]);
    const renderer = createGARSRenderer();
    const result = renderer.render(makeContext('THIRTY_MINUTE'));
    expect(result.labels).toHaveLength(1);
    expect(result.labels[0]).toEqual({
      text: '123A',
      position: [0.5, 0.5],
      cellId: '123A',
    });
  });

  it('should skip labels with null center', () => {
    const mockLabel = { getCenter: () => null, getName: () => 'X' };
    mockGetLabels.mockReturnValue([mockLabel]);
    const renderer = createGARSRenderer();
    const result = renderer.render(makeContext('THIRTY_MINUTE'));
    expect(result.labels).toHaveLength(0);
  });

  it('should return lines when labels is null', () => {
    const mockLine = {
      getPoint1: () => ({ getLongitude: () => 0, getLatitude: () => 0 }),
      getPoint2: () => ({ getLongitude: () => 1, getLatitude: () => 1 }),
    };
    mockGetLines.mockReturnValue([mockLine]);
    mockGetLabels.mockReturnValue(null);
    const renderer = createGARSRenderer();
    const result = renderer.render(makeContext('THIRTY_MINUTE'));
    expect(result.lines).toHaveLength(1);
    expect(result.labels).toHaveLength(0);
  });
});
