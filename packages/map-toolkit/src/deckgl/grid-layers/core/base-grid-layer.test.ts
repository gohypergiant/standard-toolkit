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

import { describe, it, expect, vi } from 'vitest';
import type { GridDefinition, GridRenderer, RenderContext } from './types.ts';
import { BaseGridLayer } from './base-grid-layer.ts';

describe('BaseGridLayer', () => {
  // Mock renderer
  const mockRenderer: GridRenderer = {
    // biome-ignore lint/correctness/noUnusedFunctionParameters: Mock doesn't need to use context
    render: vi.fn((context: RenderContext) => ({
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
    })),
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
        lineColor: [255, 0, 0, 255],
        lineWidth: 2,
      },
      FINE: {
        lineColor: [0, 255, 0, 255],
        lineWidth: 1,
      },
    },
    renderer: mockRenderer,
  };

  // Mock viewport
  const mockViewport = {
    zoom: 3,
    width: 800,
    height: 600,
    unproject: vi.fn((coords: number[]) => {
      // Simple mock: return coords as-is for bounds calculation
      return [coords[0] / 100, coords[1] / 100];
    }),
  };

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

  it('should render layers for visible zoom ranges', () => {
    const layer = new BaseGridLayer({
      id: 'test-layer',
      definition: mockDefinition,
    });

    // Mock context
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = { viewport: mockViewport };

    const renderedLayers = layer.renderLayers();

    // At zoom 3, only COARSE should be visible (0-5)
    expect(renderedLayers).toHaveLength(1);
    expect(renderedLayers.some((l) => l.id.includes('coarse'))).toBe(true);
    expect(renderedLayers.some((l) => l.id.includes('fine'))).toBe(false);
  });

  it('should filter zoom ranges by current zoom level', () => {
    const layer = new BaseGridLayer({
      id: 'test-layer',
      definition: mockDefinition,
    });

    // Zoom at 6 - only FINE should be visible (5-10)
    const viewport = { ...mockViewport, zoom: 6 };
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = { viewport };

    const renderedLayers = layer.renderLayers();

    expect(renderedLayers.some((l) => l.id.includes('fine'))).toBe(true);
    expect(renderedLayers.some((l) => l.id.includes('coarse'))).toBe(false);
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

    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = { viewport: mockViewport };

    const renderedLayers = layer.renderLayers();
    const pathLayer = renderedLayers.find((l) => l.id.includes('lines-coarse'));

    expect(pathLayer).toBeDefined();
    // Check that the override color is used
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to access internal props
    const props = (pathLayer as any).props;
    expect(props.getColor).toEqual([0, 0, 255, 255]);
  });

  it('should render label layers when showLabels is true', () => {
    const layer = new BaseGridLayer({
      id: 'test-layer',
      definition: mockDefinition,
      showLabels: true,
    });

    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = { viewport: mockViewport };

    const renderedLayers = layer.renderLayers();

    // Should have both lines and labels
    expect(renderedLayers.some((l) => l.id.includes('lines'))).toBe(true);
    expect(renderedLayers.some((l) => l.id.includes('labels'))).toBe(true);
  });

  it('should not render label layers when showLabels is false', () => {
    const layer = new BaseGridLayer({
      id: 'test-layer',
      definition: mockDefinition,
      showLabels: false,
    });

    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = { viewport: mockViewport };

    const renderedLayers = layer.renderLayers();

    // Should have lines but no labels
    expect(renderedLayers.some((l) => l.id.includes('lines'))).toBe(true);
    expect(renderedLayers.some((l) => l.id.includes('labels'))).toBe(false);
  });

  it('should not render labels below labelMinZoom threshold', () => {
    const layer = new BaseGridLayer({
      id: 'test-layer',
      definition: mockDefinition,
      showLabels: true,
    });

    // Zoom at 6 - FINE grid is visible but labelMinZoom is 7
    const viewport = { ...mockViewport, zoom: 6 };
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = { viewport };

    const renderedLayers = layer.renderLayers();

    // Should have lines but no labels (below labelMinZoom)
    expect(renderedLayers.some((l) => l.id.includes('lines-fine'))).toBe(true);
    expect(renderedLayers.some((l) => l.id.includes('labels-fine'))).toBe(
      false,
    );
  });

  it('should render labels at labelMinZoom threshold', () => {
    const layer = new BaseGridLayer({
      id: 'test-layer',
      definition: mockDefinition,
      showLabels: true,
    });

    // Zoom at 7 - FINE grid is visible and labelMinZoom is 7
    const viewport = { ...mockViewport, zoom: 7 };
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = { viewport };

    const renderedLayers = layer.renderLayers();

    // Should have both lines and labels
    expect(renderedLayers.some((l) => l.id.includes('lines-fine'))).toBe(true);
    expect(renderedLayers.some((l) => l.id.includes('labels-fine'))).toBe(true);
  });

  it('should disable events when enableEvents is false', () => {
    const layer = new BaseGridLayer({
      id: 'test-layer',
      definition: mockDefinition,
      enableEvents: false,
    });

    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = { viewport: mockViewport };

    const renderedLayers = layer.renderLayers();
    const pathLayer = renderedLayers.find((l) => l.id.includes('lines'));

    expect(pathLayer).toBeDefined();
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to access internal props
    const props = (pathLayer as any).props;
    expect(props.pickable).toBe(false);
    expect(props.onClick).toBeUndefined();
    expect(props.onHover).toBeUndefined();
  });

  it('should enable events by default', () => {
    const layer = new BaseGridLayer({
      id: 'test-layer',
      definition: mockDefinition,
    });

    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = { viewport: mockViewport };

    const renderedLayers = layer.renderLayers();
    const pathLayer = renderedLayers.find((l) => l.id.includes('lines'));

    expect(pathLayer).toBeDefined();
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to access internal props
    const props = (pathLayer as any).props;
    expect(props.pickable).toBe(true);
    expect(props.onClick).toBeDefined();
    expect(props.onHover).toBeDefined();
  });

  it('should return empty layers when viewport is not available', () => {
    const layer = new BaseGridLayer({
      id: 'test-layer',
      definition: mockDefinition,
    });

    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = { viewport: undefined };

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

    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = { viewport: mockViewport };

    const renderedLayers = layer.renderLayers();

    // With custom ranges, COARSE should be visible at zoom 3
    expect(renderedLayers.some((l) => l.id.includes('coarse'))).toBe(true);
  });
});
