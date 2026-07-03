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
import { MeasurementLayer } from './measurement-layer';
import type { MeasurementLayerProps } from './types';
import type { Layer } from '@deck.gl/core';

// Mock external dependencies that are not relevant to unit-testing renderLayers output
vi.mock('@accelint/geo/geodesy', () => ({
  bearing: vi.fn(() => 45),
  distance: vi.fn(() => 10_000), // 10 km
}));

vi.mock('@accelint/formatters/bearing', () => ({
  formatBearing: vi.fn(() => '045°'),
  formatDistance: vi.fn(() => '10.0 km / 5.4 NM'),
}));

const POINT_A: [number, number] = [-97.0, 32.7];
const POINT_B: [number, number] = [-90.1, 29.9];

/**
 * Creates a MeasurementLayer instance and injects the minimum context needed
 * to call renderLayers() without a live deck.gl rendering environment.
 */
function makeLayer(
  props: Partial<MeasurementLayerProps> = {},
): MeasurementLayer {
  const layer = new MeasurementLayer({
    id: 'test-measurement',
    pointA: POINT_A,
    pointB: POINT_B,
    ...props,
  });

  // deck.gl stores props on `this.props` after construction; simulate it.
  Object.defineProperty(layer, 'props', {
    value: {
      id: 'test-measurement',
      pointA: POINT_A,
      pointB: POINT_B,
      showLabel: true,
      ...props,
    },
    writable: true,
    configurable: true,
  });

  Object.defineProperty(layer, 'id', {
    value: 'test-measurement',
    writable: true,
    configurable: true,
  });

  return layer;
}

describe('MeasurementLayer', () => {
  describe('layerName', () => {
    it('should have the correct static layer name', () => {
      expect(MeasurementLayer.layerName).toBe('MeasurementLayer');
    });
  });

  describe('renderLayers', () => {
    it('should return PathLayer, ScatterplotLayer, and TextLayer when showLabel is true', () => {
      const layer = makeLayer({ showLabel: true });

      const layers = layer.renderLayers();

      expect(layers).toHaveLength(3);
      expect(layers[0]?.id).toBe('test-measurement-path');
      expect(layers[1]?.id).toBe('test-measurement-endpoints');
      expect(layers[2]?.id).toBe('test-measurement-label');
    });

    it('should return only PathLayer and ScatterplotLayer when showLabel is false', () => {
      const layer = makeLayer({ showLabel: false });

      const layers = layer.renderLayers();

      expect(layers).toHaveLength(2);
      expect(layers[0]?.id).toBe('test-measurement-path');
      expect(layers[1]?.id).toBe('test-measurement-endpoints');
    });

    it('should default to showLabel=true when showLabel is not provided', () => {
      const layer = makeLayer();

      const layers = layer.renderLayers();

      // Default includes TextLayer
      expect(layers).toHaveLength(3);
    });

    it('should use a custom getLabel function when provided', () => {
      const customLabel = 'CUSTOM: A→B';
      const getLabel = vi.fn(() => customLabel);
      const layer = makeLayer({ showLabel: true, getLabel });

      const layers = layer.renderLayers();

      expect(getLabel).toHaveBeenCalledWith(POINT_A, POINT_B, [
        'kilometers',
        'nauticalmiles',
      ]);
      expect(layers).toHaveLength(3);
    });

    it('should use the provided lineColor', () => {
      const lineColor: [number, number, number, number] = [0, 200, 255, 180];
      const layer = makeLayer({ lineColor });

      const layers = layer.renderLayers();
      const pathLayer = layers[0];

      // PathLayer exposes props; verify the color was forwarded
      expect(pathLayer).toBeDefined();
      expect(
        (pathLayer as unknown as { props: { getColor: unknown } }).props
          .getColor,
      ).toEqual(lineColor);
    });

    it('should use the provided endpointColor', () => {
      const endpointColor: [number, number, number, number] = [
        255, 100, 0, 255,
      ];
      const layer = makeLayer({ endpointColor });

      const layers = layer.renderLayers();
      const scatterLayer = layers[1];

      expect(scatterLayer).toBeDefined();
      expect(
        (scatterLayer as unknown as { props: { getFillColor: unknown } }).props
          .getFillColor,
      ).toEqual(endpointColor);
    });
  });
});
