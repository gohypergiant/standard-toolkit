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
import { BRIGHTNESS_FACTOR } from '../constants';
import { brightenColor } from './display-style';
import {
  buildIndicatorLineData,
  classifyElevatedFeatures,
  createCurtainPolygonFeatures,
  createCurtainPolygonsFromLine,
  createElevationLineSegments,
  flattenFeatureTo2D,
  getElevationFromCoordinates,
  getFeatureElevation,
  partitionCurtains,
} from './elevation';
import type { Color } from '@deck.gl/core';
import type { Shape, ShapeId } from '../../shared/types';
import type { CurtainFeature } from '../types';

// =============================================================================
// Shared test data
// =============================================================================

const BASE_COLOR: Color = [98, 166, 255, 255];
const WHITE: [number, number, number, number] = [255, 255, 255, 255];
const ZERO_COLOR: [number, number, number, number] = [0, 0, 0, 0];

/** Common coordinate fixtures */
const COORDS = {
  point3D: [10, 20, 5000] as number[],
  point2D: [10, 20] as number[],
  line3D: [
    [10, 20, 5000],
    [11, 21, 6000],
  ] as number[][],
  linePartialGround: [
    [10, 20, 0],
    [11, 21, 5000],
  ] as number[][],
  polygonRing3D: [
    [0, 0, 5000],
    [1, 0, 5000],
    [1, 1, 5000],
    [0, 0, 5000],
  ] as number[][],
  polygonRing2D: [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 0],
  ] as number[][],
  multiLine3D: [
    [
      [10, 20, 3000],
      [11, 21, 4000],
    ],
    [[12, 22, 5000]],
  ] as number[][][],
};

/** Create a minimal feature with the given geometry. */
function createFeature(
  geometry: Shape['feature']['geometry'],
  lineColor: Color = BASE_COLOR,
): Shape['feature'] {
  return {
    type: 'Feature',
    properties: {
      styleProperties: {
        fillColor: BASE_COLOR,
        lineColor,
        lineWidth: 2,
        linePattern: 'solid',
      },
      shapeId: 'test-shape',
    },
    geometry,
  } as Shape['feature'];
}

describe('Elevation Utilities', () => {
  describe('getElevationFromCoordinates', () => {
    it.each([
      { input: COORDS.point3D, expected: 5000, label: 'single 3D coordinate' },
      {
        input: COORDS.point2D,
        expected: 0,
        label: '2D coordinate (no elevation)',
      },
      {
        input: COORDS.line3D,
        expected: 5000,
        label: 'nested coordinate array',
      },
      {
        input: [COORDS.multiLine3D[0]],
        expected: 3000,
        label: 'double-nested coordinate array',
      },
    ])('returns $expected for $label', ({
      input,
      expected,
    }: {
      input: unknown;
      expected: number;
    }) => {
      expect(getElevationFromCoordinates(input)).toBe(expected);
    });

    it('returns 0 for non-array input', () => {
      expect(getElevationFromCoordinates(null)).toBe(0);
    });

    it('returns 0 for empty array', () => {
      expect(getElevationFromCoordinates([])).toBe(0);
    });
  });

  describe('getFeatureElevation', () => {
    it('returns elevation from Point geometry', () => {
      const feature = createFeature({
        type: 'Point',
        coordinates: COORDS.point3D,
      });

      expect(getFeatureElevation(feature)).toBe(5000);
    });

    it('returns 0 for 2D Point geometry', () => {
      const feature = createFeature({
        type: 'Point',
        coordinates: COORDS.point2D,
      });

      expect(getFeatureElevation(feature)).toBe(0);
    });

    it('returns 0 for GeometryCollection', () => {
      const feature = createFeature({
        type: 'GeometryCollection',
        geometries: [],
      } as unknown as Shape['feature']['geometry']);

      expect(getFeatureElevation(feature)).toBe(0);
    });

    it('returns 0 when geometry is missing', () => {
      const feature = {
        type: 'Feature',
        properties: {},
        geometry: undefined,
      } as unknown as Shape['feature'];

      expect(getFeatureElevation(feature)).toBe(0);
    });

    it('returns maxElevation when present in properties', () => {
      const feature = createFeature({
        type: 'Polygon',
        coordinates: [COORDS.polygonRing2D],
      });
      (feature.properties as Record<string, unknown>).maxElevation = 43500;

      expect(getFeatureElevation(feature)).toBe(43500);
    });

    it('prefers maxElevation over coordinate Z', () => {
      const feature = createFeature({
        type: 'Point',
        coordinates: COORDS.point3D,
      });
      (feature.properties as Record<string, unknown>).maxElevation = 99999;

      expect(getFeatureElevation(feature)).toBe(99999);
    });
  });

  describe('createElevationLineSegments', () => {
    it('creates vertical segment for Point with elevation', () => {
      const geometry = { type: 'Point', coordinates: COORDS.point3D };

      const segments = createElevationLineSegments(
        geometry as Shape['feature']['geometry'],
        WHITE,
      );

      expect(segments).toHaveLength(1);
      expect(segments[0]).toEqual({
        source: [10, 20, 0],
        target: [10, 20, 5000],
        color: WHITE,
      });
    });

    it('creates segment per coordinate for LineString', () => {
      const geometry = { type: 'LineString', coordinates: COORDS.line3D };

      const segments = createElevationLineSegments(
        geometry as Shape['feature']['geometry'],
        WHITE,
      );

      expect(segments).toHaveLength(2);
      expect(segments[0]?.source).toEqual([10, 20, 0]);
      expect(segments[0]?.target).toEqual([10, 20, 5000]);
      expect(segments[1]?.source).toEqual([11, 21, 0]);
      expect(segments[1]?.target).toEqual([11, 21, 6000]);
    });

    it('skips ground-level coordinates in LineString', () => {
      const geometry = {
        type: 'LineString',
        coordinates: COORDS.linePartialGround,
      };

      const segments = createElevationLineSegments(
        geometry as Shape['feature']['geometry'],
        WHITE,
      );

      expect(segments).toHaveLength(1);
      expect(segments[0]?.target).toEqual([11, 21, 5000]);
    });

    it('returns empty array for GeometryCollection', () => {
      const geometry = { type: 'GeometryCollection', geometries: [] };

      const segments = createElevationLineSegments(
        geometry as unknown as Shape['feature']['geometry'],
        WHITE,
      );

      expect(segments).toEqual([]);
    });

    it('returns empty array for Point without elevation', () => {
      const geometry = { type: 'Point', coordinates: COORDS.point2D };

      const segments = createElevationLineSegments(
        geometry as Shape['feature']['geometry'],
        WHITE,
      );

      expect(segments).toEqual([]);
    });

    it('handles MultiLineString geometry', () => {
      const geometry = {
        type: 'MultiLineString',
        coordinates: COORDS.multiLine3D,
      };

      const segments = createElevationLineSegments(
        geometry as Shape['feature']['geometry'],
        WHITE,
      );

      expect(segments).toHaveLength(3);
    });
  });

  describe('classifyElevatedFeatures', () => {
    it('classifies elevated LineString into lines and nonPolygons', () => {
      const lineFeature = createFeature({
        type: 'LineString',
        coordinates: COORDS.line3D,
      });

      const result = classifyElevatedFeatures([lineFeature], () => 5000);

      expect(result.lines).toHaveLength(1);
      expect(result.nonPolygons).toHaveLength(1);
      expect(result.polygons).toHaveLength(0);
    });

    it('classifies elevated Polygon into polygons only', () => {
      const polygonFeature = createFeature({
        type: 'Polygon',
        coordinates: [COORDS.polygonRing3D],
      });

      const result = classifyElevatedFeatures([polygonFeature], () => 5000);

      expect(result.polygons).toHaveLength(1);
      expect(result.lines).toHaveLength(0);
      expect(result.nonPolygons).toHaveLength(0);
    });

    it('classifies elevated Point into nonPolygons only', () => {
      const pointFeature = createFeature({
        type: 'Point',
        coordinates: COORDS.point3D,
      });

      const result = classifyElevatedFeatures([pointFeature], () => 5000);

      expect(result.nonPolygons).toHaveLength(1);
      expect(result.lines).toHaveLength(0);
      expect(result.polygons).toHaveLength(0);
    });

    it('skips features with zero elevation', () => {
      const flatFeature = createFeature({
        type: 'Point',
        coordinates: COORDS.point2D,
      });

      const result = classifyElevatedFeatures([flatFeature], () => 0);

      expect(result.lines).toHaveLength(0);
      expect(result.polygons).toHaveLength(0);
      expect(result.nonPolygons).toHaveLength(0);
    });
  });

  describe('createCurtainPolygonsFromLine', () => {
    it('creates vertical polygon for consecutive coordinate pair', () => {
      const curtains = createCurtainPolygonsFromLine(
        COORDS.line3D,
        [98, 166, 255, 51],
        BASE_COLOR as [number, number, number, number],
        'shape-1',
      );

      expect(curtains).toHaveLength(1);
      expect(curtains[0]?.geometry.type).toBe('Polygon');
      expect(curtains[0]?.properties.fillColor).toEqual([98, 166, 255, 51]);
      expect(curtains[0]?.properties.lineColor).toEqual(BASE_COLOR);
      expect(curtains[0]?.properties.shapeId).toBe('shape-1');

      // Verify ring: bottom-left, bottom-right, top-right, top-left, close
      const ring = curtains[0]?.geometry.coordinates[0];
      expect(ring).toHaveLength(5);
      expect(ring?.[0]).toEqual([10, 20, 0]);
      expect(ring?.[1]).toEqual([11, 21, 0]);
      expect(ring?.[2]).toEqual([11, 21, 6000]);
      expect(ring?.[3]).toEqual([10, 20, 5000]);
      expect(ring?.[4]).toEqual([10, 20, 0]);
    });

    it('skips pairs where both points are at ground level', () => {
      const coordinates = [
        [10, 20, 0],
        [11, 21, 0],
        [12, 22, 5000],
      ];

      const curtains = createCurtainPolygonsFromLine(
        coordinates,
        ZERO_COLOR,
        ZERO_COLOR,
      );

      // First pair [0,0] skipped, second pair [0, 5000] kept
      expect(curtains).toHaveLength(1);
    });

    it('returns empty for single coordinate', () => {
      const curtains = createCurtainPolygonsFromLine(
        [COORDS.point3D],
        ZERO_COLOR,
        ZERO_COLOR,
      );

      expect(curtains).toEqual([]);
    });

    it('returns empty for empty coordinates', () => {
      const curtains = createCurtainPolygonsFromLine(
        [],
        ZERO_COLOR,
        ZERO_COLOR,
      );

      expect(curtains).toEqual([]);
    });
  });

  describe('createCurtainPolygonFeatures', () => {
    it('creates curtains from elevated LineString features', () => {
      const feature = createFeature({
        type: 'LineString',
        coordinates: COORDS.line3D,
      });

      const curtains = createCurtainPolygonFeatures([feature], true);

      expect(curtains).toHaveLength(1);
      expect(curtains[0]?.geometry.type).toBe('Polygon');
    });

    it('applies base opacity when applyBaseOpacity is true', () => {
      const feature = createFeature(
        { type: 'LineString', coordinates: COORDS.line3D },
        [100, 150, 200, 255] as Color,
      );

      const curtains = createCurtainPolygonFeatures([feature], true);

      // Fill alpha should be 20% of line alpha (255 * 0.2 = 51)
      expect(curtains[0]?.properties.fillColor[3]).toBe(51);
    });

    it('uses full line color when applyBaseOpacity is false', () => {
      const feature = createFeature(
        { type: 'LineString', coordinates: COORDS.line3D },
        [100, 150, 200, 255] as Color,
      );

      const curtains = createCurtainPolygonFeatures([feature], false);

      expect(curtains[0]?.properties.fillColor).toEqual([100, 150, 200, 255]);
    });

    it('handles MultiLineString features', () => {
      const feature = createFeature({
        type: 'MultiLineString',
        coordinates: [
          COORDS.line3D,
          [
            [12, 22, 7000],
            [13, 23, 8000],
          ],
        ],
      });

      const curtains = createCurtainPolygonFeatures([feature], true);

      // One curtain per consecutive pair per line: 1 + 1 = 2
      expect(curtains).toHaveLength(2);
    });
  });

  describe('flattenFeatureTo2D', () => {
    it('strips Z from LineString coordinates', () => {
      const feature = createFeature({
        type: 'LineString',
        coordinates: [...COORDS.line3D, [12, 22, 7000]],
      });

      const result = flattenFeatureTo2D(feature);

      expect(result.geometry.type).toBe('LineString');
      const coords = (result.geometry as { coordinates: number[][] })
        .coordinates;
      expect(coords).toEqual([
        [10, 20],
        [11, 21],
        [12, 22],
      ]);
    });

    it('strips Z from MultiLineString coordinates', () => {
      const feature = createFeature({
        type: 'MultiLineString',
        coordinates: [
          [
            [10, 20, 3000],
            [11, 21, 4000],
          ],
          [
            [12, 22, 5000],
            [13, 23, 6000],
          ],
        ],
      });

      const result = flattenFeatureTo2D(feature);

      expect(result.geometry.type).toBe('MultiLineString');
      const coords = (result.geometry as { coordinates: number[][][] })
        .coordinates;
      expect(coords).toEqual([
        [
          [10, 20],
          [11, 21],
        ],
        [
          [12, 22],
          [13, 23],
        ],
      ]);
    });

    it('strips Z from Polygon coordinates', () => {
      const feature = createFeature({
        type: 'Polygon',
        coordinates: [COORDS.polygonRing3D],
      });

      const result = flattenFeatureTo2D(feature);

      expect(result).not.toBe(feature);
      expect(result.geometry.type).toBe('Polygon');
      const coords = (result.geometry as { coordinates: number[][][] })
        .coordinates;
      expect(coords).toEqual([COORDS.polygonRing2D]);
    });

    it('returns same reference for Point (unaffected)', () => {
      const feature = createFeature({
        type: 'Point',
        coordinates: COORDS.point3D,
      });

      const result = flattenFeatureTo2D(feature);

      expect(result).toBe(feature);
    });

    it('preserves all feature properties', () => {
      const feature = createFeature({
        type: 'LineString',
        coordinates: COORDS.line3D,
      });

      const result = flattenFeatureTo2D(feature);

      expect(result.type).toBe(feature.type);
      expect(result.properties).toBe(feature.properties);
    });

    it('returns 2D coordinates for already-2D LineString', () => {
      const feature = createFeature({
        type: 'LineString',
        coordinates: [
          [10, 20],
          [11, 21],
        ],
      });

      const result = flattenFeatureTo2D(feature);

      const coords = (result.geometry as { coordinates: number[][] })
        .coordinates;
      expect(coords).toEqual([
        [10, 20],
        [11, 21],
      ]);
    });
  });

  describe('partitionCurtains', () => {
    function createCurtain(shapeId?: string): CurtainFeature {
      return {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[[0, 0, 0]]] },
        properties: {
          fillColor: ZERO_COLOR,
          lineColor: ZERO_COLOR,
          shapeId: shapeId as ShapeId | undefined,
        },
      };
    }

    it('partitions by hovered and selected shape IDs', () => {
      const main1 = createCurtain('a');
      const hovered1 = createCurtain('b');
      const selected1 = createCurtain('c');

      const result = partitionCurtains(
        [main1, hovered1, selected1],
        'b' as ShapeId,
        'c' as ShapeId,
      );

      expect(result.main).toEqual([main1]);
      expect(result.hovered).toEqual([hovered1]);
      expect(result.selected).toEqual([selected1]);
    });

    it('puts all in main when no hover or selection', () => {
      const c1 = createCurtain('a');
      const c2 = createCurtain('b');

      const result = partitionCurtains([c1, c2], undefined, undefined);

      expect(result.main).toHaveLength(2);
      expect(result.hovered).toHaveLength(0);
      expect(result.selected).toHaveLength(0);
    });

    it('returns empty arrays for empty input', () => {
      const result = partitionCurtains([], 'a' as ShapeId, 'b' as ShapeId);

      expect(result.main).toEqual([]);
      expect(result.hovered).toEqual([]);
      expect(result.selected).toEqual([]);
    });
  });

  describe('buildIndicatorLineData', () => {
    const pointFeature = createFeature(
      { type: 'Point', coordinates: COORDS.point3D },
      BASE_COLOR,
    );

    it('returns empty array for empty input', () => {
      const result = buildIndicatorLineData([], [], undefined, undefined);

      expect(result).toEqual([]);
    });

    it('generates segments with base line color when no interaction', () => {
      const result = buildIndicatorLineData(
        [pointFeature],
        [pointFeature],
        undefined,
        undefined,
      );

      expect(result).toHaveLength(1);
      expect(result[0]?.source).toEqual([10, 20, 0]);
      expect(result[0]?.target).toEqual([10, 20, 5000]);
      expect(result[0]?.color).toEqual(BASE_COLOR);
    });

    it('brightens color when feature is selected', () => {
      const result = buildIndicatorLineData(
        [pointFeature],
        [pointFeature],
        pointFeature.properties?.shapeId,
        undefined,
      );

      expect(result).toHaveLength(1);
      expect(result[0]?.color).toEqual(
        brightenColor(
          BASE_COLOR as [number, number, number, number],
          BRIGHTNESS_FACTOR.HOVER_OR_SELECT,
        ),
      );
    });

    it('brightens color when feature is hovered', () => {
      const result = buildIndicatorLineData(
        [pointFeature],
        [pointFeature],
        undefined,
        0,
      );

      expect(result).toHaveLength(1);
      expect(result[0]?.color).toEqual(
        brightenColor(
          BASE_COLOR as [number, number, number, number],
          BRIGHTNESS_FACTOR.HOVER_OR_SELECT,
        ),
      );
    });

    it('uses HOVER_AND_SELECT factor when both selected and hovered', () => {
      const result = buildIndicatorLineData(
        [pointFeature],
        [pointFeature],
        pointFeature.properties?.shapeId,
        0,
      );

      expect(result).toHaveLength(1);
      expect(result[0]?.color).toEqual(
        brightenColor(
          BASE_COLOR as [number, number, number, number],
          BRIGHTNESS_FACTOR.HOVER_AND_SELECT,
        ),
      );
    });

    it('generates one segment per elevated coordinate in LineString', () => {
      const lineFeature = createFeature({
        type: 'LineString',
        coordinates: COORDS.line3D,
      });

      const result = buildIndicatorLineData(
        [lineFeature],
        [lineFeature],
        undefined,
        undefined,
      );

      expect(result).toHaveLength(2);
    });
  });
});
