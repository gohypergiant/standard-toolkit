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
import { Broadcast } from '@accelint/bus';
import type {
  GridDefinition,
  GridRenderer,
  RenderContext,
  GridCellEvent,
  GridStyleConfig,
  RenderResult,
} from './types';
import { GridCellEvents } from './types';
import { BaseGridLayer } from './base-grid-layer';
import type { PickingInfo, UpdateParameters, Viewport } from '@deck.gl/core';
import type { PathLayer } from '@deck.gl/layers';

/**
 * Type-safe helper to set layer context and initialize state for testing
 * Avoids using `as any` while still allowing controlled internal access
 */
function setLayerContext(
  layer: BaseGridLayer,
  viewport?: Partial<Viewport>,
): void {
  Object.defineProperty(layer, 'context', {
    value: { viewport },
    writable: true,
    configurable: true,
  });

  // Initialize state if not already set (deck.gl layers need initialized state)
  Object.defineProperty(layer, 'state', {
    value: {},
    writable: true,
    configurable: true,
  });
}

describe('BaseGridLayer', () => {
  const testStyles = {
    labelColor: [0, 0, 0, 0] as const,
    labelSize: 0,
    fontFamily: '',
    fontWeight: '',
    textAnchor: 'start' as const,
    alignmentBaseline: 'top' as const,
    backgroundColor: [0, 0, 0, 0] as const,
    backgroundPadding: [2, 2] as [number, number],
    hoverColor: [0, 0, 0, 0] as const,
    selectedColor: [0, 0, 0, 0] as const,
  };

  // Mock renderer
  const mockRenderer: GridRenderer = {
    render: vi.fn(
      (_context: RenderContext): RenderResult => ({
        lines: [
          {
            path: [
              [0, 0],
              [1, 1],
            ],
            cellId: 'test-cell-1',
          },
        ],
        labels: [
          {
            text: 'TEST-1',
            position: [0.5, 0.5],
            cellId: 'test-cell-1',
          },
        ],
        polygons: [
          {
            polygon: [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
            cellId: 'test-cell-1',
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
          },
        ],
      }),
    ),
  };

  // Valid mock definition
  const mockDefinition: GridDefinition = {
    id: 'test-grid',
    name: 'Test Grid',
    zoomRanges: [
      {
        type: 'COARSE',
        key: 'coarse',
        minZoom: 0,
        maxZoom: 5,
      },
      {
        type: 'FINE',
        key: 'fine',
        minZoom: 5,
        maxZoom: 10,
        labelMinZoom: 7,
      },
    ],
    defaultStyles: {
      COARSE: {
        lineColor: [255, 0, 0, 255] as const,
        lineWidth: 2,
        ...testStyles,
      },
      FINE: {
        lineColor: [0, 255, 0, 255],
        lineWidth: 1,
        ...testStyles,
      },
    },
    renderer: mockRenderer,
  };

  // Mock viewport
  const mockViewport = {
    zoom: 3,
    width: 800,
    height: 600,
    unproject: vi.fn((coords: [number, number]) => {
      return [coords[0] / 100, coords[1] / 100];
    }),
  } as Partial<Viewport>;

  describe('Initialization', () => {
    it('should throw when definition is invalid', () => {
      const invalidDefinition = {
        ...mockDefinition,
        id: '',
      } as GridDefinition;

      expect(() => {
        new BaseGridLayer({
          id: 'test-layer',
          definition: invalidDefinition,
        });
      }).toThrow('Grid definition must have an id');
    });
  });

  describe('Rendering', () => {
    it('should render layers for visible zoom ranges', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
      });

      setLayerContext(layer, mockViewport);

      const renderedLayers = layer.renderLayers();

      // At zoom 3, only COARSE should be visible (0-5)
      // Should render both polygon layer (for interaction) and path layer (for lines)
      expect(renderedLayers.length).toBeGreaterThan(0);

      const coarseLayer = renderedLayers.find((l) => l.id.includes('coarse'));
      const fineLayer = renderedLayers.find((l) => l.id.includes('fine'));

      expect(coarseLayer).toBeDefined();
      expect(fineLayer).toBeUndefined();
    });

    it('should filter zoom ranges by current zoom level', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
      });

      // Zoom at 6 - only FINE should be visible (5-10)
      const viewport = { ...mockViewport, zoom: 6 };
      setLayerContext(layer, viewport);

      const renderedLayers = layer.renderLayers();

      const fineLayer = renderedLayers.find((l) => l.id.includes('fine'));
      const coarseLayer = renderedLayers.find((l) => l.id.includes('coarse'));

      expect(fineLayer).toBeDefined();
      expect(coarseLayer).toBeUndefined();
    });

    it('should merge style overrides with default styles', () => {
      const styleOverrides = {
        COARSE: {
          lineColor: [0, 0, 255, 255] as [number, number, number, number],
        },
      };

      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        styleOverrides,
      });

      setLayerContext(layer, mockViewport);

      const renderedLayers = layer.renderLayers();
      const pathLayer = renderedLayers.find((l) =>
        l.id.includes('lines-coarse'),
      ) as PathLayer;

      expect(pathLayer).toBeDefined();
      // Check that the override color is used
      expect(pathLayer.props.getColor).toEqual([0, 0, 255, 255]);
    });

    it('should render label layers when showLabels is true', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        showLabels: true,
      });

      setLayerContext(layer, mockViewport);

      const renderedLayers = layer.renderLayers();

      const lineLayer = renderedLayers.find((l) => l.id.includes('lines'));
      const labelLayer = renderedLayers.find((l) => l.id.includes('labels'));

      expect(lineLayer).toBeDefined();
      expect(labelLayer).toBeDefined();
    });

    it('should not render label layers when showLabels is false', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        showLabels: false,
      });

      setLayerContext(layer, mockViewport);

      const renderedLayers = layer.renderLayers();

      const lineLayer = renderedLayers.find((l) => l.id.includes('lines'));
      const labelLayer = renderedLayers.find((l) => l.id.includes('labels'));

      expect(lineLayer).toBeDefined();
      expect(labelLayer).toBeUndefined();
    });

    it('should not render labels below labelMinZoom threshold', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        showLabels: true,
      });

      // Zoom at 6 - FINE grid is visible but labelMinZoom is 7
      const viewport = { ...mockViewport, zoom: 6 };
      setLayerContext(layer, viewport);

      const renderedLayers = layer.renderLayers();

      const lineLayer = renderedLayers.find((l) => l.id.includes('lines-fine'));
      const labelLayer = renderedLayers.find((l) =>
        l.id.includes('labels-fine'),
      );

      expect(lineLayer).toBeDefined();
      expect(labelLayer).toBeUndefined();
    });

    it('should render labels at labelMinZoom threshold', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        showLabels: true,
      });

      // Zoom at 7 - FINE grid is visible and labelMinZoom is 7
      const viewport = { ...mockViewport, zoom: 7 };
      setLayerContext(layer, viewport);

      const renderedLayers = layer.renderLayers();

      const lineLayer = renderedLayers.find((l) => l.id.includes('lines-fine'));
      const labelLayer = renderedLayers.find((l) =>
        l.id.includes('labels-fine'),
      );

      expect(lineLayer).toBeDefined();
      expect(labelLayer).toBeDefined();
    });

    it('should return empty layers when viewport is not available', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
      });

      setLayerContext(layer, undefined);

      const renderedLayers = layer.renderLayers();

      expect(renderedLayers).toHaveLength(0);
    });

    it('should use custom zoom ranges when provided', () => {
      const customZoomRanges = [
        {
          type: 'COARSE',
          key: 'coarse',
          minZoom: 2,
          maxZoom: 8,
        },
      ];

      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        zoomRanges: customZoomRanges,
      });

      setLayerContext(layer, mockViewport);

      const renderedLayers = layer.renderLayers();

      // With custom ranges, COARSE should be visible at zoom 3
      const coarseLayer = renderedLayers.find((l) => l.id.includes('coarse'));
      expect(coarseLayer).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw when gridType has no default style during construction', () => {
      const invalidDefinition: GridDefinition = {
        ...mockDefinition,
        zoomRanges: [
          {
            type: 'FINE',
            key: 'fine',
            minZoom: 5,
            maxZoom: 10,
          },
        ],
        defaultStyles: {
          COARSE: mockDefinition.defaultStyles.COARSE,
          // FINE is missing but zoomRange references it
        } as Record<string, GridStyleConfig>,
      };

      // The validation happens during construction, not during render
      expect(() => {
        new BaseGridLayer({
          id: 'test-layer',
          definition: invalidDefinition,
        });
      }).toThrow("Missing default style for grid type 'FINE'");
    });
  });

  describe('Zoom Boundary Conditions', () => {
    // COARSE range: minZoom=0, maxZoom=5
    // FINE range: minZoom=5, maxZoom=10

    it.each([
      {
        zoom: 0,
        shouldShowCoarse: true,
        shouldShowFine: false,
        reason: 'zoom >= minZoom (0 >= 0)',
      },
      {
        zoom: 0.1,
        shouldShowCoarse: true,
        shouldShowFine: false,
        reason: 'COARSE: zoom > minZoom',
      },
      {
        zoom: 4.9,
        shouldShowCoarse: true,
        shouldShowFine: false,
        reason: 'COARSE: zoom < maxZoom',
      },
      {
        zoom: 5,
        shouldShowCoarse: true,
        shouldShowFine: true,
        reason:
          'boundary: zoom >= COARSE.minZoom AND zoom <= COARSE.maxZoom AND zoom >= FINE.minZoom',
      },
      {
        zoom: 5.1,
        shouldShowCoarse: false,
        shouldShowFine: true,
        reason: 'FINE: zoom > minZoom',
      },
      {
        zoom: 9.9,
        shouldShowCoarse: false,
        shouldShowFine: true,
        reason: 'FINE: zoom < maxZoom',
      },
      {
        zoom: 10,
        shouldShowCoarse: false,
        shouldShowFine: true,
        reason: 'zoom <= maxZoom (10 <= 10)',
      },
    ])('boundary test at zoom $zoom: $reason', ({
      zoom,
      shouldShowCoarse,
      shouldShowFine,
    }) => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
      });

      setLayerContext(layer, { ...mockViewport, zoom });

      const renderedLayers = layer.renderLayers();
      const hasCoarse = renderedLayers.some((l) => l.id.includes('coarse'));
      const hasFine = renderedLayers.some((l) => l.id.includes('fine'));

      expect(hasCoarse).toBe(shouldShowCoarse);
      expect(hasFine).toBe(shouldShowFine);
    });
  });

  describe('Update Logic', () => {
    it('should update when viewport changes', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
      });

      const params = {
        changeFlags: {
          viewportChanged: true,
          stateChanged: false,
          propsChanged: false,
        },
      } as UpdateParameters<BaseGridLayer>;

      expect(layer.shouldUpdateState(params)).toBe(true);
    });

    it('should update when state changes', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
      });

      const params = {
        changeFlags: {
          viewportChanged: false,
          stateChanged: true,
          propsChanged: false,
        },
      } as UpdateParameters<BaseGridLayer>;

      expect(layer.shouldUpdateState(params)).toBe(true);
    });

    it('should update when props change', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
      });

      const params = {
        changeFlags: {
          viewportChanged: false,
          stateChanged: false,
          propsChanged: 'showLabels',
        },
      } as UpdateParameters<BaseGridLayer>;

      expect(layer.shouldUpdateState(params)).toBe(true);
    });

    it('should not update when nothing changes', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
      });

      const params = {
        changeFlags: {
          viewportChanged: false,
          stateChanged: false,
          propsChanged: false,
        },
      } as UpdateParameters<BaseGridLayer>;

      expect(layer.shouldUpdateState(params)).toBe(false);
    });
  });

  describe('Event Handling', () => {
    let eventBus: ReturnType<typeof Broadcast.getInstance<GridCellEvent>>;
    let emitSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      eventBus = Broadcast.getInstance<GridCellEvent>();
      emitSpy = vi.spyOn(eventBus, 'emit');
    });

    it('should emit click event with correct data when cell is clicked', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        enableInteractivity: true,
        mapId: 'test-map',
      });

      setLayerContext(layer, mockViewport);

      const pickingInfo = {
        picked: true,
        object: {
          cellId: 'TEST-123',
          bounds: {
            minLongitude: -123,
            minLatitude: 37,
            maxLongitude: -122,
            maxLatitude: 38,
            polygon: [
              [-123, 37],
              [-122, 37],
              [-122, 38],
              [-123, 38],
              [-123, 37],
            ],
          },
        },
        coordinate: [-122.4194, 37.7749],
      } as PickingInfo;

      layer.getPickingInfo({ info: pickingInfo, mode: 'query' });

      expect(emitSpy).toHaveBeenCalledWith(GridCellEvents.click, {
        cellId: 'TEST-123',
        gridType: 'test-grid',
        coords: [-122.4194, 37.7749],
        mapId: 'test-map',
        bounds: pickingInfo.object.bounds,
      });
    });

    it('should emit hover event only when cell changes (deduplication)', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        enableInteractivity: true,
      });

      setLayerContext(layer, mockViewport);

      const pickingInfo1 = {
        picked: true,
        object: { cellId: 'CELL-A' },
      } as PickingInfo;

      // First hover should emit
      layer.getPickingInfo({ info: pickingInfo1, mode: 'hover' });
      expect(emitSpy).toHaveBeenCalledTimes(1);

      // Second hover on same cell should NOT emit (deduplicated)
      layer.getPickingInfo({ info: pickingInfo1, mode: 'hover' });
      expect(emitSpy).toHaveBeenCalledTimes(1);

      // Hover on different cell should emit
      const pickingInfo2 = {
        picked: true,
        object: { cellId: 'CELL-B' },
      } as PickingInfo;
      layer.getPickingInfo({ info: pickingInfo2, mode: 'hover' });
      expect(emitSpy).toHaveBeenCalledTimes(2);
    });

    it('should not emit events when enableInteractivity is false', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        enableInteractivity: false,
      });

      setLayerContext(layer, mockViewport);

      const pickingInfo = {
        picked: true,
        object: { cellId: 'TEST-123' },
        coordinate: [0, 0],
      } as PickingInfo;

      layer.getPickingInfo({ info: pickingInfo, mode: 'hover' });
      layer.getPickingInfo({ info: pickingInfo, mode: 'query' });

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit click when picking info has no object', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        enableInteractivity: true,
      });

      setLayerContext(layer, mockViewport);

      const pickingInfo = {
        picked: false,
        object: undefined,
        coordinate: [0, 0],
      } as PickingInfo;

      layer.getPickingInfo({ info: pickingInfo, mode: 'query' });

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not emit click when picking info has no coordinate', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        enableInteractivity: true,
      });

      setLayerContext(layer, mockViewport);

      const pickingInfo = {
        picked: true,
        object: { cellId: 'TEST-123' },
        coordinate: undefined,
      } as PickingInfo;

      layer.getPickingInfo({ info: pickingInfo, mode: 'query' });

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Interactivity Configuration', () => {
    it('should enable polygon pickability when enableInteractivity is true', () => {
      const layer = new BaseGridLayer({
        id: 'test-layer',
        definition: mockDefinition,
        enableInteractivity: true,
      });

      setLayerContext(layer, mockViewport);

      const renderedLayers = layer.renderLayers();

      // Should not create polygon layer when interactivity is disabled
      const polygonLayer = renderedLayers.find((l) =>
        l.id.includes('polygons'),
      );
      expect(polygonLayer).toBeDefined();
    });
  });
});
