/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
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
import { DEFAULT_STYLE_PROPERTIES } from '../../shared/constants';
import { ShapeFeatureType } from '../../shared/types';
import { convertFeatureToShape } from './feature-conversion';
import type { Feature, LineString, Point, Polygon } from 'geojson';

describe('convertFeatureToShape', () => {
  describe('Point conversion', () => {
    it('converts a Point feature to Shape', () => {
      const pointFeature: Feature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.4, 37.8],
        },
        properties: {},
      };

      const result = convertFeatureToShape(
        pointFeature,
        ShapeFeatureType.Point,
      );

      expect(result.shape).toBe(ShapeFeatureType.Point);
      // Name includes timestamp, so just check it starts with "New Point"
      expect(result.name).toMatch(/^New Point/);
      expect(result.id).toBeDefined();
      expect(result.feature.geometry).toEqual(pointFeature.geometry);
      expect(result.feature.properties.styleProperties).toEqual(
        DEFAULT_STYLE_PROPERTIES,
      );
    });

    it('applies custom style defaults for Point', () => {
      const pointFeature: Feature<Point> = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.4, 37.8],
        },
        properties: {},
      };

      const customStyles = {
        fillColor: [255, 0, 0, 255] as [number, number, number, number],
        lineColor: [0, 0, 255, 255] as [number, number, number, number],
      };

      const result = convertFeatureToShape(
        pointFeature,
        ShapeFeatureType.Point,
        customStyles,
      );

      expect(result.feature.properties.styleProperties.fillColor).toEqual(
        customStyles.fillColor,
      );
      expect(result.feature.properties.styleProperties.lineColor).toEqual(
        customStyles.lineColor,
      );
    });
  });

  describe('LineString conversion', () => {
    it('converts a LineString feature to Shape', () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-122.4, 37.8],
            [-122.5, 37.9],
            [-122.6, 37.7],
          ],
        },
        properties: {},
      };

      const result = convertFeatureToShape(
        lineFeature,
        ShapeFeatureType.LineString,
      );

      expect(result.shape).toBe(ShapeFeatureType.LineString);
      expect(result.name).toMatch(/^New LineString/);
      expect(result.feature.geometry).toEqual(lineFeature.geometry);
    });
  });

  describe('Polygon conversion', () => {
    it('converts a Polygon feature to Shape', () => {
      const polygonFeature: Feature<Polygon> = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-122.4, 37.8],
              [-122.5, 37.8],
              [-122.5, 37.9],
              [-122.4, 37.9],
              [-122.4, 37.8],
            ],
          ],
        },
        properties: {},
      };

      const result = convertFeatureToShape(
        polygonFeature,
        ShapeFeatureType.Polygon,
      );

      expect(result.shape).toBe(ShapeFeatureType.Polygon);
      expect(result.name).toMatch(/^New Polygon/);
      expect(result.feature.geometry).toEqual(polygonFeature.geometry);
    });
  });

  describe('Rectangle conversion', () => {
    it('converts a Rectangle (Polygon) feature to Shape', () => {
      const rectangleFeature: Feature<Polygon> = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-122.4, 37.8],
              [-122.5, 37.8],
              [-122.5, 37.9],
              [-122.4, 37.9],
              [-122.4, 37.8],
            ],
          ],
        },
        properties: {},
      };

      const result = convertFeatureToShape(
        rectangleFeature,
        ShapeFeatureType.Rectangle,
      );

      expect(result.shape).toBe(ShapeFeatureType.Rectangle);
      expect(result.name).toMatch(/^New Rectangle/);
    });
  });

  describe('Circle conversion', () => {
    it('computes circle properties from polygon approximation', () => {
      // Create a rough circle polygon approximation
      const circleCoords: [number, number][] = [];
      const center: [number, number] = [-122.4, 37.8];
      const radiusInDegrees = 0.01;

      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * 2 * Math.PI;
        circleCoords.push([
          center[0] + radiusInDegrees * Math.cos(angle),
          center[1] + radiusInDegrees * Math.sin(angle),
        ]);
      }

      const circleFeature: Feature<Polygon> = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [circleCoords],
        },
        properties: {},
      };

      const result = convertFeatureToShape(
        circleFeature,
        ShapeFeatureType.Circle,
      );

      expect(result.shape).toBe(ShapeFeatureType.Circle);
      expect(result.name).toMatch(/^New Circle/);
      expect(result.feature.properties.circleProperties).toBeDefined();
      expect(result.feature.properties.circleProperties?.center).toBeDefined();
      expect(result.feature.properties.circleProperties?.radius).toBeDefined();
      expect(result.feature.properties.circleProperties?.radius.units).toBe(
        'kilometers',
      );
    });

    it('computes center close to actual center', () => {
      const center: [number, number] = [-122.4, 37.8];
      const radiusInDegrees = 0.01;
      const circleCoords: [number, number][] = [];

      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * 2 * Math.PI;
        circleCoords.push([
          center[0] + radiusInDegrees * Math.cos(angle),
          center[1] + radiusInDegrees * Math.sin(angle),
        ]);
      }

      const circleFeature: Feature<Polygon> = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [circleCoords],
        },
        properties: {},
      };

      const result = convertFeatureToShape(
        circleFeature,
        ShapeFeatureType.Circle,
      );

      const computedCenter = result.feature.properties.circleProperties?.center;
      expect(computedCenter).toBeDefined();
      if (computedCenter) {
        // Center should be very close to the actual center
        expect(Math.abs(computedCenter[0] - center[0])).toBeLessThan(0.001);
        expect(Math.abs(computedCenter[1] - center[1])).toBeLessThan(0.001);
      }
    });
  });

  describe('ID handling', () => {
    it('generates unique IDs for each conversion', () => {
      const feature: Feature<Point> = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: {},
      };

      const result1 = convertFeatureToShape(feature, ShapeFeatureType.Point);
      const result2 = convertFeatureToShape(feature, ShapeFeatureType.Point);

      expect(result1.id).not.toBe(result2.id);
    });

    it('sets shapeId in feature properties to match id', () => {
      const feature: Feature<Point> = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: {},
      };

      const result = convertFeatureToShape(feature, ShapeFeatureType.Point);

      expect(result.feature.properties.shapeId).toBe(result.id);
    });

    it('sets lastUpdated timestamp', () => {
      const before = Date.now();
      const feature: Feature<Point> = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: {},
      };

      const result = convertFeatureToShape(feature, ShapeFeatureType.Point);
      const after = Date.now();

      expect(result.lastUpdated).toBeGreaterThanOrEqual(before);
      expect(result.lastUpdated).toBeLessThanOrEqual(after);
    });
  });

  describe('style merging', () => {
    it('uses default styles when no overrides provided', () => {
      const feature: Feature<Point> = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: {},
      };

      const result = convertFeatureToShape(feature, ShapeFeatureType.Point);

      expect(result.feature.properties.styleProperties).toEqual(
        DEFAULT_STYLE_PROPERTIES,
      );
    });

    it('merges partial style overrides with defaults', () => {
      const feature: Feature<Point> = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: {},
      };

      const partialStyles = {
        lineWidth: 4 as const,
      };

      const result = convertFeatureToShape(
        feature,
        ShapeFeatureType.Point,
        partialStyles,
      );

      expect(result.feature.properties.styleProperties.lineWidth).toBe(4);
      // Other properties should still have defaults
      expect(result.feature.properties.styleProperties.fillColor).toEqual(
        DEFAULT_STYLE_PROPERTIES.fillColor,
      );
    });

    it('handles null styleDefaults', () => {
      const feature: Feature<Point> = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: {},
      };

      const result = convertFeatureToShape(
        feature,
        ShapeFeatureType.Point,
        null,
      );

      expect(result.feature.properties.styleProperties).toEqual(
        DEFAULT_STYLE_PROPERTIES,
      );
    });
  });
});
