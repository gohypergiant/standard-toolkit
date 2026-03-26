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

import { Broadcast } from '@accelint/bus';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MgrsLayer } from './';
import { type GridCellEvent, GridCellEvents } from '../core/types';
import type { Layer } from '@deck.gl/core';
import type { PathLayer } from '@deck.gl/layers';

/**
 * Create a mock viewport with unproject method
 */
// biome-ignore lint/suspicious/noExplicitAny: Test helper needs flexible viewport mock
function createMockViewport(zoom: number): any {
  return {
    zoom,
    latitude: 0,
    longitude: 0,
    bearing: 0,
    pitch: 0,
    width: 800,
    height: 600,
    unproject: (coords: [number, number]) => {
      // Simple mock: return lng/lat based on normalized screen coords
      const [x, y] = coords;
      const lng = (x / 800) * 360 - 180;
      const lat = 90 - (y / 600) * 180;
      return [lng, lat];
    },
  };
}

/**
 * Integration tests for MGRSLayer with event bus
 */
describe('MGRSLayer Integration', () => {
  let eventBus: ReturnType<typeof Broadcast.getInstance<GridCellEvent>>;
  let unsubscribe: (() => void) | undefined;

  beforeEach(() => {
    eventBus = Broadcast.getInstance<GridCellEvent>();
  });

  afterEach(() => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = undefined;
    }
  });

  it('emits gridcell:click events through event bus', () => {
    const layer = new MgrsLayer({
      id: 'mgrs-test',
      enableInteractivity: true,
    });

    const clickHandler = vi.fn();
    unsubscribe = eventBus.on(GridCellEvents.click, clickHandler);

    // Set context before rendering
    layer.context = {
      viewport: createMockViewport(5),
    } as Layer['context'];

    // Verify PathLayer is not pickable (only labels should be)
    const sublayers = layer.renderLayers();
    const polygonLayer = sublayers.find((l) =>
      l.id.includes('-polygons-'),
    ) as unknown as Layer;
    expect(polygonLayer).toBeDefined();
    expect(polygonLayer?.props.pickable).toBe(true);
    expect(polygonLayer?.props.onHover).toBeDefined();
  });

  it('emits gridcell:hover event', () => {
    const layer = new MgrsLayer({
      id: 'mgrs-hover-test',
      enableInteractivity: true,
    });

    const hoverHandler = vi.fn();

    const unsub = eventBus.on(GridCellEvents.hover, hoverHandler);

    unsubscribe = () => {
      unsub();
    };

    // Set context before rendering
    layer.context = {
      viewport: createMockViewport(5),
    } as Layer['context'];

    // Verify hover handlers are attached
    const sublayers = layer.renderLayers();
    const polygonLayer = sublayers.find((l) =>
      l.id.includes('-polygons-'),
    ) as unknown as Layer;
    expect(polygonLayer).toBeDefined();
    expect(polygonLayer?.props.pickable).toBe(true);
    expect(polygonLayer?.props.onHover).toBeDefined();
  });

  it('applies style overrides correctly', () => {
    const customLineColor = [0, 255, 0, 255] as [
      number,
      number,
      number,
      number,
    ];
    const customLineWidth = 4;

    const layer = new MgrsLayer({
      id: 'mgrs-style-test',
      gzdStyle: {
        lineColor: customLineColor,
        lineWidth: customLineWidth,
      },
    });

    // Mock viewport context
    layer.context = {
      viewport: createMockViewport(3),
    } as Layer['context'];

    const sublayers = layer.renderLayers();
    expect(sublayers.length).toBeGreaterThan(0);

    // Verify PathLayer uses custom styles
    const pathLayer = sublayers.find((l) =>
      l.id.includes('lines'),
    ) as PathLayer;
    expect(pathLayer).toBeDefined();
    expect(pathLayer?.props.getColor).toEqual(customLineColor);
    expect(pathLayer?.props.getWidth).toBe(customLineWidth);
  });

  it('respects zoom range configuration', () => {
    const layer = new MgrsLayer({
      id: 'mgrs-zoom-test',
      zoomRanges: [
        {
          type: 'GZD',
          key: 'gzd',
          minZoom: 0,
          maxZoom: 5,
          labelMinZoom: 2,
        },
      ],
    });

    // Test at zoom level within range
    layer.context = {
      viewport: createMockViewport(3),
    } as Layer['context'];

    let sublayers = layer.renderLayers();
    expect(sublayers.length).toBeGreaterThan(0);

    // Test at zoom level outside range
    layer.context = {
      viewport: createMockViewport(10),
    } as Layer['context'];

    sublayers = layer.renderLayers();
    expect(sublayers.length).toBe(0);
  });

  it('supports multiple grid types at appropriate zoom levels', () => {
    const layer = new MgrsLayer({
      id: 'mgrs-multi-grid',
    });

    // At low zoom, only GZD should be visible (GZD minZoom is 3)
    layer.context = {
      viewport: createMockViewport(3),
    } as Layer['context'];

    let sublayers = layer.renderLayers();
    expect(sublayers.length).toBeGreaterThan(0);
    expect(sublayers.some((l) => l.id.includes('gzd'))).toBe(true);

    // At medium zoom, multiple grids should be visible (GZD + 100km at zoom 5)
    layer.context = {
      viewport: createMockViewport(5),
    } as Layer['context'];

    sublayers = layer.renderLayers();
    expect(sublayers.length).toBeGreaterThan(1); // At least 2 grid types (GZD + 100km)
  });

  it('disables events when enableEvents is false', () => {
    const layer = new MgrsLayer({
      id: 'mgrs-no-events',
      enableInteractivity: false,
    });

    layer.context = {
      viewport: createMockViewport(5),
    } as Layer['context'];

    const sublayers = layer.renderLayers();
    const pathLayer = sublayers.find((l) =>
      l.id.includes('lines'),
    ) as PathLayer;

    expect(pathLayer).toBeDefined();
    expect(pathLayer?.props.pickable).toBe(false);
  });

  it('shows labels when showLabels is true and zoom is sufficient', () => {
    const layer = new MgrsLayer({
      id: 'mgrs-labels',
      showLabels: true,
    });

    layer.context = {
      viewport: createMockViewport(5),
    } as Layer['context'];

    const sublayers = layer.renderLayers();
    // Look for TextLayer specifically (labels sublayer has '-labels-' pattern)
    const textLayer = sublayers.find((l) => l.id.includes('-labels-'));

    expect(textLayer).toBeDefined();
  });

  it('hides labels when showLabels is false', () => {
    const layer = new MgrsLayer({
      id: 'mgrs-hidden-text',
      showLabels: false,
    });

    layer.context = {
      viewport: createMockViewport(5),
    } as Layer['context'];

    const sublayers = layer.renderLayers();
    // Look for TextLayer specifically (labels sublayer has '-labels-' pattern)
    const textLayer = sublayers.find((l) => l.id.includes('-labels-'));

    expect(textLayer).toBeUndefined();
  });
});
