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

import { PathLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { midpoint } from '@accelint/geo/geodesy';
import { describe, expect, it, vi } from 'vitest';
import { MeasurementLayer } from './measurement-layer';
import type { MeasurementLayerProps } from './types';

const POINT_A: [number, number] = [-97.0, 32.7];
const POINT_B: [number, number] = [-90.1, 29.9];

/** Matches the default label, e.g. `"715.2 km / 386.2 NM | BRG: 116°"`. */
const DEFAULT_LABEL_PATTERN = /^\d+\.\d km \/ \d+\.\d NM \| BRG: \d{3}°$/;

/** Creates a MeasurementLayer with both points set plus any prop overrides. */
function makeLayer(
  props: Partial<MeasurementLayerProps> = {},
): MeasurementLayer {
  return new MeasurementLayer({
    id: 'test-measurement',
    pointA: POINT_A,
    pointB: POINT_B,
    ...props,
  });
}

describe('MeasurementLayer', () => {
  describe('renderLayers', () => {
    it('should return a PathLayer, ScatterplotLayer, and TextLayer when showLabel is true', () => {
      const layer = makeLayer({ showLabel: true });

      const [pathLayer, endpointsLayer, labelLayer] = layer.renderLayers();

      expect(pathLayer).toBeInstanceOf(PathLayer);
      expect(pathLayer?.id).toBe('test-measurement-path');
      expect(endpointsLayer).toBeInstanceOf(ScatterplotLayer);
      expect(endpointsLayer?.id).toBe('test-measurement-endpoints');
      expect(labelLayer).toBeInstanceOf(TextLayer);
      expect(labelLayer?.id).toBe('test-measurement-label');
    });

    it('should return only the PathLayer and ScatterplotLayer when showLabel is false', () => {
      const layer = makeLayer({ showLabel: false });

      const layers = layer.renderLayers();

      expect(layers).toHaveLength(2);
      expect(layers[0]).toBeInstanceOf(PathLayer);
      expect(layers[1]).toBeInstanceOf(ScatterplotLayer);
    });

    it.each([
      ['omitted', {}],
      ['explicitly undefined', { showLabel: undefined }],
    ])('should render the label when showLabel is %s', (_case, props) => {
      const layer = makeLayer(props);

      const layers = layer.renderLayers();

      expect(layers).toHaveLength(3);
      expect(layers[2]).toBeInstanceOf(TextLayer);
    });

    it('should render the default label with dual units and a three-digit bearing', () => {
      const layer = makeLayer();

      const labelLayer = layer.renderLayers()[2] as TextLayer<{ text: string }>;

      expect(labelLayer.props.data).toEqual([
        {
          position: midpoint(POINT_A, POINT_B),
          text: expect.stringMatching(DEFAULT_LABEL_PATTERN),
        },
      ]);
    });

    it.each([
      ['eastward', [179, 0], [-179, 0], [181, 0]],
      ['westward', [-179, 0], [179, 0], [-181, 0]],
    ] as const)('should unwrap the destination so an %s antimeridian-crossing segment draws the short way', (_direction, pointA, pointB, unwrapped) => {
      const layer = makeLayer({ pointA: [...pointA], pointB: [...pointB] });

      const [pathLayer, endpointLayer] = layer.renderLayers();
      const pathData = (pathLayer as PathLayer).props.data as {
        path: [number, number][];
      }[];
      const endpointData = (endpointLayer as ScatterplotLayer).props.data as [
        number,
        number,
      ][];

      expect(pathData[0]?.path).toEqual([pointA, unwrapped]);
      expect(endpointData).toEqual([pointA, unwrapped]);
    });

    it('should unwrap the label position so it sits on the short arc across the antimeridian', () => {
      const layer = makeLayer({ pointA: [170, 0], pointB: [-168, 0] });

      const labelLayer = layer.renderLayers()[2] as TextLayer<{
        position: [number, number];
      }>;
      const labelData = labelLayer.props.data as {
        position: [number, number];
      }[];

      expect(labelData[0]?.position[0]).toBeCloseTo(181, 5);
    });

    it('should render no sublayers when a point is not a finite tuple', () => {
      const layer = makeLayer({ pointB: [Number.NaN, 0] });

      expect(layer.renderLayers()).toEqual([]);
    });

    it('should pass pointA, pointB, and units to a custom getLabel and render its result', () => {
      const getLabel = vi.fn(() => 'CUSTOM: A→B');
      const units = ['miles'] as const;
      const layer = makeLayer({ getLabel, units: [...units] });

      const labelLayer = layer.renderLayers()[2] as TextLayer<{ text: string }>;

      expect(getLabel).toHaveBeenCalledExactlyOnceWith(POINT_A, POINT_B, units);
      expect(labelLayer.props.data).toEqual([
        { position: expect.any(Array), text: 'CUSTOM: A→B' },
      ]);
    });

    it.each([
      ['an empty array', []],
      ['a three-entry array', ['kilometers', 'nauticalmiles', 'miles']],
    ] as const)('should fall back to the default dual label when units is %s', (_case, units) => {
      const layer = makeLayer({ units: [...units] });

      const labelLayer = layer.renderLayers()[2] as TextLayer<{
        text: string;
      }>;
      const labelData = labelLayer.props.data as { text: string }[];

      expect(labelData[0]?.text).toMatch(DEFAULT_LABEL_PATTERN);
    });

    it('should default units to kilometers and nautical miles', () => {
      const getLabel = vi.fn(() => 'label');
      const layer = makeLayer({ getLabel });

      layer.renderLayers();

      expect(getLabel).toHaveBeenCalledExactlyOnceWith(POINT_A, POINT_B, [
        'kilometers',
        'nauticalmiles',
      ]);
    });

    it('should use the provided lineColor', () => {
      const lineColor: [number, number, number, number] = [0, 200, 255, 180];
      const layer = makeLayer({ lineColor });

      const pathLayer = layer.renderLayers()[0] as PathLayer;

      expect(pathLayer.props.getColor).toEqual(lineColor);
    });

    it('should use the provided endpointColor', () => {
      const endpointColor: [number, number, number, number] = [
        255, 100, 0, 255,
      ];
      const layer = makeLayer({ endpointColor });

      const endpointsLayer = layer.renderLayers()[1] as ScatterplotLayer;

      expect(endpointsLayer.props.getFillColor).toEqual(endpointColor);
    });
  });

  describe('defaultProps', () => {
    it('should declare the default line and endpoint colors', () => {
      expect(MeasurementLayer.defaultProps).toEqual({
        lineColor: { type: 'color', value: [255, 255, 255, 200] },
        endpointColor: { type: 'color', value: [255, 255, 255, 255] },
      });
    });
  });
});
