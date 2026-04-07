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
import { createMGRSRenderer } from './renderer';

// Mock the MGRS library
vi.mock('@ngageoint/mgrs-js', () => ({
  GridType: {
    GZD: 'GZD',
    HUNDRED_KILOMETER: 'HUNDRED_KILOMETER',
    TEN_KILOMETER: 'TEN_KILOMETER',
    KILOMETER: 'KILOMETER',
  },
  Grids: {
    create: vi.fn(),
  },
  GridZones: {
    getZones: vi.fn(),
  },
}));

const mockBounds = {} as Bounds;

const makeContext = (gridType: string): RenderContext => ({
  bounds: mockBounds,
  zoom: 7,
  gridType,
});

describe('createMGRSRenderer', () => {
  const mockGetLines = vi.fn();
  const mockGetLabels = vi.fn();
  const mockGetGrid = vi.fn();
  const mockSetLabelMinZoom = vi.fn();
  const mockSetLabelMaxZoom = vi.fn();
  const mockEnableLabeler = vi.fn();
  const mockGetZones = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();

    // Setup default mock returns
    mockGetLines.mockReturnValue([]);
    mockGetLabels.mockReturnValue([]);
    mockGetGrid.mockReturnValue({
      getLines: mockGetLines,
      getLabels: mockGetLabels,
    });

    const mockZone = {
      getBounds: () => ({
        getMinLongitude: () => -180,
        getMaxLongitude: () => 180,
      }),
    };
    mockGetZones.mockReturnValue([mockZone]);

    // Mock the Grids.create instance
    const { Grids, GridZones } = await import('@ngageoint/mgrs-js');
    vi.mocked(Grids.create).mockReturnValue({
      getGrid: mockGetGrid,
      setLabelMinZoom: mockSetLabelMinZoom,
      setLabelMaxZoom: mockSetLabelMaxZoom,
      enableLabeler: mockEnableLabeler,
      // biome-ignore lint/suspicious/noExplicitAny: Mock doesn't need full Grids type
    } as any);
    vi.mocked(GridZones.getZones).mockImplementation(mockGetZones);
  });

  it('should configure label zoom ranges and enable labelers on creation', async () => {
    const { GridType } = await import('@ngageoint/mgrs-js');
    createMGRSRenderer();

    // Verify label zoom configuration
    expect(mockSetLabelMinZoom).toHaveBeenCalledWith(GridType.GZD, 0);
    expect(mockSetLabelMinZoom).toHaveBeenCalledWith(
      GridType.HUNDRED_KILOMETER,
      0,
    );
    expect(mockSetLabelMinZoom).toHaveBeenCalledWith(GridType.TEN_KILOMETER, 8);
    expect(mockSetLabelMaxZoom).toHaveBeenCalledWith(
      GridType.TEN_KILOMETER,
      20,
    );
    expect(mockSetLabelMinZoom).toHaveBeenCalledWith(GridType.KILOMETER, 10);
    expect(mockSetLabelMaxZoom).toHaveBeenCalledWith(GridType.KILOMETER, 20);

    // Verify labelers are enabled
    expect(mockEnableLabeler).toHaveBeenCalledWith(GridType.TEN_KILOMETER);
    expect(mockEnableLabeler).toHaveBeenCalledWith(GridType.KILOMETER);
  });

  it('should return empty result for unknown grid type', () => {
    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('UNKNOWN_TYPE'));
    expect(result).toEqual({ lines: [], labels: [], polygons: [] });
  });

  it('should return empty result when grid is null', () => {
    mockGetGrid.mockReturnValue(null);
    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));
    expect(result).toEqual({ lines: [], labels: [], polygons: [] });
  });

  it('should return empty result when library throws', () => {
    mockGetGrid.mockImplementation(() => {
      throw new Error('library error');
    });
    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));
    expect(result).toEqual({ lines: [], labels: [], polygons: [] });
  });

  it('should map GZD lines to path format', () => {
    const mockLine = {
      getPoint1: () => ({ getLongitude: () => 10, getLatitude: () => 20 }),
      getPoint2: () => ({ getLongitude: () => 11, getLatitude: () => 21 }),
    };
    mockGetLines.mockReturnValue([mockLine]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));

    expect(result.lines).toHaveLength(1);
    expect(result.lines[0]?.path).toEqual([
      [10, 20],
      [11, 21],
    ]);
    expect(result.lines[0]?.cellId).toBeTypeOf('string');
  });

  it('should clip lines to zone boundaries', () => {
    const mockZone = {
      getBounds: () => ({
        getMinLongitude: () => 0,
        getMaxLongitude: () => 10,
      }),
    };
    mockGetZones.mockReturnValue([mockZone]);

    // Line that extends outside zone bounds
    const mockLine = {
      getPoint1: () => ({ getLongitude: () => -5, getLatitude: () => 20 }),
      getPoint2: () => ({ getLongitude: () => 5, getLatitude: () => 20 }),
    };
    mockGetLines.mockReturnValue([mockLine]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));

    expect(result.lines).toHaveLength(1);
    // First point should be clipped to minLon (0)
    expect(result.lines[0]?.path[0]?.[0]).toBe(0);
    expect(result.lines[0]?.path[0]?.[1]).toBe(20);
  });

  it('should skip lines completely outside zone bounds', () => {
    const mockZone = {
      getBounds: () => ({
        getMinLongitude: () => 0,
        getMaxLongitude: () => 10,
      }),
    };
    mockGetZones.mockReturnValue([mockZone]);

    // Line completely outside zone
    const mockLine = {
      getPoint1: () => ({ getLongitude: () => -20, getLatitude: () => 20 }),
      getPoint2: () => ({ getLongitude: () => -10, getLatitude: () => 20 }),
    };
    mockGetLines.mockReturnValue([mockLine]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));

    expect(result.lines).toHaveLength(0);
  });

  it('should map labels to position format', () => {
    const mockLabel = {
      getCenter: () => ({ getLongitude: () => 0.5, getLatitude: () => 0.5 }),
      getName: () => '18S',
      getBounds: () => ({
        getMinLongitude: () => 0,
        getMinLatitude: () => 0,
        getMaxLongitude: () => 1,
        getMaxLatitude: () => 1,
      }),
    };
    mockGetLabels.mockReturnValue([mockLabel]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));

    expect(result.labels).toHaveLength(1);
    expect(result.labels[0]).toEqual({
      text: '18S',
      position: [0.5, 0.5],
      cellId: '18S',
      bounds: {
        minLongitude: 0,
        minLatitude: 0,
        maxLongitude: 1,
        maxLatitude: 1,
        polygon: [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      },
    });

    // Should also create polygon data for cell-wide interaction
    expect(result.polygons).toHaveLength(1);
    expect(result.polygons[0]).toEqual({
      polygon: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
      cellId: '18S',
      bounds: {
        minLongitude: 0,
        minLatitude: 0,
        maxLongitude: 1,
        maxLatitude: 1,
        polygon: [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      },
    });
  });

  it('should skip labels with null center', () => {
    const mockLabel = {
      getCenter: () => null,
      getName: () => '18S',
      getBounds: () => ({
        getMinLongitude: () => 0,
        getMinLatitude: () => 0,
        getMaxLongitude: () => 1,
        getMaxLatitude: () => 1,
      }),
    };
    mockGetLabels.mockReturnValue([mockLabel]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));

    expect(result.labels).toHaveLength(0);
    expect(result.polygons).toHaveLength(0);
  });

  it('should skip labels with null name', () => {
    const mockLabel = {
      getCenter: () => ({ getLongitude: () => 0.5, getLatitude: () => 0.5 }),
      getName: () => null,
      getBounds: () => ({
        getMinLongitude: () => 0,
        getMinLatitude: () => 0,
        getMaxLongitude: () => 1,
        getMaxLatitude: () => 1,
      }),
    };
    mockGetLabels.mockReturnValue([mockLabel]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));

    expect(result.labels).toHaveLength(0);
    expect(result.polygons).toHaveLength(0);
  });

  it('should skip labels with null bounds', () => {
    const mockLabel = {
      getCenter: () => ({ getLongitude: () => 0.5, getLatitude: () => 0.5 }),
      getName: () => '18S',
      getBounds: () => null,
    };
    mockGetLabels.mockReturnValue([mockLabel]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));

    expect(result.labels).toHaveLength(0);
    expect(result.polygons).toHaveLength(0);
  });

  it('should return lines when labels is null', () => {
    const mockLine = {
      getPoint1: () => ({ getLongitude: () => 0, getLatitude: () => 0 }),
      getPoint2: () => ({ getLongitude: () => 1, getLatitude: () => 1 }),
    };
    mockGetLines.mockReturnValue([mockLine]);
    mockGetLabels.mockReturnValue(null);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));

    expect(result.lines).toHaveLength(1);
    expect(result.labels).toHaveLength(0);
    expect(result.polygons).toHaveLength(0);
  });

  it('should skip zone when lines is null', () => {
    mockGetLines.mockReturnValue(null);

    const mockLabel = {
      getCenter: () => ({ getLongitude: () => 0.5, getLatitude: () => 0.5 }),
      getName: () => '18S',
      getBounds: () => ({
        getMinLongitude: () => 0,
        getMinLatitude: () => 0,
        getMaxLongitude: () => 1,
        getMaxLatitude: () => 1,
      }),
    };
    mockGetLabels.mockReturnValue([mockLabel]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));

    // When lines is null, the zone is skipped entirely, including labels
    expect(result.lines).toHaveLength(0);
    expect(result.labels).toHaveLength(0);
    expect(result.polygons).toHaveLength(0);
  });

  it('should process multiple zones', () => {
    const mockZone1 = {
      getBounds: () => ({
        getMinLongitude: () => 0,
        getMaxLongitude: () => 10,
      }),
    };
    const mockZone2 = {
      getBounds: () => ({
        getMinLongitude: () => 10,
        getMaxLongitude: () => 20,
      }),
    };
    mockGetZones.mockReturnValue([mockZone1, mockZone2]);

    const mockLine1 = {
      getPoint1: () => ({ getLongitude: () => 5, getLatitude: () => 20 }),
      getPoint2: () => ({ getLongitude: () => 6, getLatitude: () => 21 }),
    };
    const mockLine2 = {
      getPoint1: () => ({ getLongitude: () => 15, getLatitude: () => 30 }),
      getPoint2: () => ({ getLongitude: () => 16, getLatitude: () => 31 }),
    };

    // Return different lines for each zone
    mockGetLines
      .mockReturnValueOnce([mockLine1])
      .mockReturnValueOnce([mockLine2]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GZD'));

    expect(result.lines).toHaveLength(2);
    expect(mockGetLines).toHaveBeenCalledTimes(2);
  });

  it('should map GRID_100KM to HUNDRED_KILOMETER', () => {
    const mockLine = {
      getPoint1: () => ({ getLongitude: () => 10, getLatitude: () => 20 }),
      getPoint2: () => ({ getLongitude: () => 11, getLatitude: () => 21 }),
    };
    mockGetLines.mockReturnValue([mockLine]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GRID_100KM'));

    expect(result.lines).toHaveLength(1);
  });

  it('should map GRID_10KM to TEN_KILOMETER', () => {
    const mockLine = {
      getPoint1: () => ({ getLongitude: () => 10, getLatitude: () => 20 }),
      getPoint2: () => ({ getLongitude: () => 11, getLatitude: () => 21 }),
    };
    mockGetLines.mockReturnValue([mockLine]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GRID_10KM'));

    expect(result.lines).toHaveLength(1);
  });

  it('should map GRID_1KM to KILOMETER', () => {
    const mockLine = {
      getPoint1: () => ({ getLongitude: () => 10, getLatitude: () => 20 }),
      getPoint2: () => ({ getLongitude: () => 11, getLatitude: () => 21 }),
    };
    mockGetLines.mockReturnValue([mockLine]);

    const renderer = createMGRSRenderer();
    const result = renderer.render(makeContext('GRID_1KM'));

    expect(result.lines).toHaveLength(1);
  });
});
