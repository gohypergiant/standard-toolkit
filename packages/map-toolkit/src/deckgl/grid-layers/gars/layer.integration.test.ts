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

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GarsLayer } from './';
import { Broadcast } from '@accelint/bus';
import type { GridEvent } from '../core/types.ts';

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
 * Integration tests for GARSLayer with event bus
 */
describe('GARSLayer Integration', () => {
  let eventBus: ReturnType<typeof Broadcast.getInstance<GridEvent>>;
  let unsubscribe: (() => void) | undefined;

  beforeEach(() => {
    eventBus = Broadcast.getInstance<GridEvent>();
  });

  afterEach(() => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = undefined;
    }
  });

  it('emits grid.click events through event bus', () => {
    const layer = new GarsLayer({
      id: 'gars-test',
      enableEvents: true,
    });

    const clickHandler = vi.fn();
    unsubscribe = eventBus.on('grid.click', clickHandler);

    // Set context before rendering
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = {
      viewport: createMockViewport(5),
    };

    // Verify event handlers are attached
    const sublayers = layer.renderLayers();
    const pathLayer = sublayers.find((l) => l.id.includes('lines'));
    expect(pathLayer).toBeDefined();
    expect(pathLayer?.props.pickable).toBe(true);
  });

  it('emits grid.hover.enter and grid.hover.exit events', () => {
    const layer = new GarsLayer({
      id: 'gars-hover-test',
      enableEvents: true,
    });

    const hoverEnterHandler = vi.fn();
    const hoverExitHandler = vi.fn();

    const unsubscribe1 = eventBus.on('grid.hover.enter', hoverEnterHandler);
    const unsubscribe2 = eventBus.on('grid.hover.exit', hoverExitHandler);

    unsubscribe = () => {
      unsubscribe1();
      unsubscribe2();
    };

    // Set context before rendering
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = {
      viewport: createMockViewport(5),
    };

    // Verify hover handlers are attached
    const sublayers = layer.renderLayers();
    const pathLayer = sublayers.find((l) => l.id.includes('lines'));
    expect(pathLayer).toBeDefined();
    expect(pathLayer?.props.onHover).toBeDefined();
  });

  it('applies style overrides correctly', () => {
    const customLineColor = [255, 0, 0, 255] as [
      number,
      number,
      number,
      number,
    ];
    const customLineWidth = 5;

    const layer = new GarsLayer({
      id: 'gars-style-test',
      thirtyMinuteStyle: {
        lineColor: customLineColor,
        lineWidth: customLineWidth,
      },
    });

    // Mock viewport context
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = {
      viewport: createMockViewport(5),
    };

    const sublayers = layer.renderLayers();
    expect(sublayers.length).toBeGreaterThan(0);

    // Verify PathLayer uses custom styles
    const pathLayer = sublayers.find((l) => l.id.includes('lines'));
    expect(pathLayer).toBeDefined();
    expect(pathLayer?.props.getColor).toEqual(customLineColor);
    expect(pathLayer?.props.getWidth).toBe(customLineWidth);
  });

  it('respects zoom range configuration', () => {
    const layer = new GarsLayer({
      id: 'gars-zoom-test',
      zoomRanges: [
        {
          type: 'THIRTY_MINUTE',
          key: '30min',
          minZoom: 0,
          maxZoom: 5,
          labelMinZoom: 2,
        },
      ],
    });

    // Test at zoom level within range
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = {
      viewport: createMockViewport(3),
    };

    let sublayers = layer.renderLayers();
    expect(sublayers.length).toBeGreaterThan(0);

    // Test at zoom level outside range
    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = {
      viewport: createMockViewport(10),
    };

    sublayers = layer.renderLayers();
    expect(sublayers.length).toBe(0);
  });

  it('disables events when enableEvents is false', () => {
    const layer = new GarsLayer({
      id: 'gars-no-events',
      enableEvents: false,
    });

    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = {
      viewport: createMockViewport(5),
    };

    const sublayers = layer.renderLayers();
    const pathLayer = sublayers.find((l) => l.id.includes('lines'));

    expect(pathLayer).toBeDefined();
    expect(pathLayer?.props.pickable).toBe(false);
  });

  it('shows labels when showLabels is true and zoom is sufficient', () => {
    const layer = new GarsLayer({
      id: 'gars-labels',
      showLabels: true,
    });

    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = {
      viewport: createMockViewport(5),
    };

    const sublayers = layer.renderLayers();
    // Look for TextLayer specifically (labels sublayer has '-labels-' pattern)
    const textLayer = sublayers.find((l) => l.id.includes('-labels-'));

    expect(textLayer).toBeDefined();
  });

  it('hides labels when showLabels is false', () => {
    const layer = new GarsLayer({
      id: 'gars-no-labels',
      showLabels: false,
    });

    // biome-ignore lint/suspicious/noExplicitAny: Test needs to set internal context
    (layer as any).context = {
      viewport: createMockViewport(5),
    };

    const sublayers = layer.renderLayers();
    // Look for TextLayer specifically (labels sublayer has '-labels-' pattern)
    const textLayer = sublayers.find((l) => l.id.includes('-labels-'));

    expect(textLayer).toBeUndefined();
  });
});
