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
import { mockShapes } from '../__fixtures__/mock-shapes';
import {
  isCircleShape,
  isEllipseShape,
  isLineGeometry,
  isLineStringShape,
  isPointShape,
  isPolygonGeometry,
  isPolygonShape,
  isRectangleShape,
  ShapeFeatureType,
} from './types';
import type { Geometry } from 'geojson';
import type {
  CircleShape,
  EllipseShape,
  LineStringShape,
  PointShape,
  PolygonShape,
  RectangleShape,
  Shape,
} from './types';

/** Typed fixture references for each shape variant. */
const circleFixture = mockShapes[0] as CircleShape;
const lineStringFixture = mockShapes[1] as LineStringShape;
const pointFixture = mockShapes[2] as PointShape;
const polygonFixture = mockShapes[3] as PolygonShape;
const rectangleFixture = mockShapes[4] as RectangleShape;
const ellipseFixture = mockShapes[5] as EllipseShape;

describe('Type Guards', () => {
  describe('isCircleShape', () => {
    it('returns true for Circle shapes', () => {
      expect(isCircleShape(circleFixture)).toBe(true);
    });

    it.each([
      ['Ellipse', ellipseFixture],
      ['Polygon', polygonFixture],
      ['Rectangle', rectangleFixture],
      ['LineString', lineStringFixture],
      ['Point', pointFixture],
    ] as [string, Shape][])('returns false for %s shape', (_label, shape) => {
      expect(isCircleShape(shape)).toBe(false);
    });

    it('provides type narrowing for circleProperties', () => {
      const shape: Shape = circleFixture;

      if (isCircleShape(shape)) {
        expect(shape.feature.properties.circleProperties.center).toEqual([
          -82.16095, 41.459647,
        ]);
        expect(shape.feature.properties.circleProperties.radius.value).toBe(
          250,
        );
      }
    });
  });

  describe('isEllipseShape', () => {
    it('returns true for Ellipse shapes', () => {
      expect(isEllipseShape(ellipseFixture)).toBe(true);
    });

    it.each([
      ['Circle', circleFixture],
      ['Polygon', polygonFixture],
      ['Rectangle', rectangleFixture],
      ['LineString', lineStringFixture],
      ['Point', pointFixture],
    ] as [string, Shape][])('returns false for %s shape', (_label, shape) => {
      expect(isEllipseShape(shape)).toBe(false);
    });

    it('provides type narrowing for ellipseProperties', () => {
      const shape: Shape = ellipseFixture;

      if (isEllipseShape(shape)) {
        expect(shape.feature.properties.ellipseProperties.center).toEqual([
          -84.53249402465865, 36.093725788749154,
        ]);
        expect(shape.feature.properties.ellipseProperties.xSemiAxis.value).toBe(
          101.01710768121133,
        );
        expect(shape.feature.properties.ellipseProperties.ySemiAxis.value).toBe(
          244.01551298835645,
        );
        expect(shape.feature.properties.ellipseProperties.angle).toBe(
          81.85494137591265,
        );
      }
    });
  });

  describe('isPolygonShape', () => {
    it('returns true for Polygon shapes', () => {
      expect(isPolygonShape(polygonFixture)).toBe(true);
    });

    it.each([
      ['Circle', circleFixture],
      ['Ellipse', ellipseFixture],
      ['Rectangle', rectangleFixture],
      ['LineString', lineStringFixture],
      ['Point', pointFixture],
    ] as [string, Shape][])('returns false for %s shape', (_label, shape) => {
      expect(isPolygonShape(shape)).toBe(false);
    });

    it('provides type narrowing for PolygonShape', () => {
      const shape: Shape = polygonFixture;

      if (isPolygonShape(shape)) {
        expect(shape.shape).toBe(ShapeFeatureType.Polygon);
      }
    });
  });

  describe('isRectangleShape', () => {
    it('returns true for Rectangle shapes', () => {
      expect(isRectangleShape(rectangleFixture)).toBe(true);
    });

    it.each([
      ['Circle', circleFixture],
      ['Ellipse', ellipseFixture],
      ['Polygon', polygonFixture],
      ['LineString', lineStringFixture],
      ['Point', pointFixture],
    ] as [string, Shape][])('returns false for %s shape', (_label, shape) => {
      expect(isRectangleShape(shape)).toBe(false);
    });

    it('provides type narrowing for RectangleShape', () => {
      const shape: Shape = rectangleFixture;

      if (isRectangleShape(shape)) {
        expect(shape.shape).toBe(ShapeFeatureType.Rectangle);
      }
    });
  });

  describe('isLineStringShape', () => {
    it('returns true for LineString shapes', () => {
      expect(isLineStringShape(lineStringFixture)).toBe(true);
    });

    it.each([
      ['Circle', circleFixture],
      ['Ellipse', ellipseFixture],
      ['Polygon', polygonFixture],
      ['Rectangle', rectangleFixture],
      ['Point', pointFixture],
    ] as [string, Shape][])('returns false for %s shape', (_label, shape) => {
      expect(isLineStringShape(shape)).toBe(false);
    });

    it('provides type narrowing for LineStringShape', () => {
      const shape: Shape = lineStringFixture;

      if (isLineStringShape(shape)) {
        expect(shape.shape).toBe(ShapeFeatureType.LineString);
      }
    });
  });

  describe('isPointShape', () => {
    it('returns true for Point shapes', () => {
      expect(isPointShape(pointFixture)).toBe(true);
    });

    it.each([
      ['Circle', circleFixture],
      ['Ellipse', ellipseFixture],
      ['Polygon', polygonFixture],
      ['Rectangle', rectangleFixture],
      ['LineString', lineStringFixture],
    ] as [string, Shape][])('returns false for %s shape', (_label, shape) => {
      expect(isPointShape(shape)).toBe(false);
    });

    it('provides type narrowing for PointShape', () => {
      const shape: Shape = pointFixture;

      if (isPointShape(shape)) {
        expect(shape.shape).toBe(ShapeFeatureType.Point);
      }
    });
  });

  describe('Type guard mutual exclusivity', () => {
    it('each shape type matches exactly one type guard', () => {
      const allShapes: Shape[] = [
        circleFixture,
        ellipseFixture,
        polygonFixture,
        rectangleFixture,
        lineStringFixture,
        pointFixture,
      ];

      const typeGuards = [
        isCircleShape,
        isEllipseShape,
        isPolygonShape,
        isRectangleShape,
        isLineStringShape,
        isPointShape,
      ];

      for (const shape of allShapes) {
        const matchCount = typeGuards.filter((guard) => guard(shape)).length;
        expect(matchCount).toBe(1);
      }
    });
  });
});

describe('Geometry Type Predicates', () => {
  // Minimal geometry stubs keyed by type — only `type` matters for the predicates
  const geo = (type: string) => ({ type }) as Geometry;

  describe('isPolygonGeometry', () => {
    it.each(['Polygon', 'MultiPolygon'])('returns true for %s', (type) => {
      expect(isPolygonGeometry(geo(type))).toBe(true);
    });

    it.each([
      'Point',
      'LineString',
      'MultiLineString',
      'MultiPoint',
    ])('returns false for %s', (type) => {
      expect(isPolygonGeometry(geo(type))).toBe(false);
    });
  });

  describe('isLineGeometry', () => {
    it.each([
      'LineString',
      'MultiLineString',
    ])('returns true for %s', (type) => {
      expect(isLineGeometry(geo(type))).toBe(true);
    });

    it.each([
      'Point',
      'Polygon',
      'MultiPolygon',
      'MultiPoint',
    ])('returns false for %s', (type) => {
      expect(isLineGeometry(geo(type))).toBe(false);
    });
  });
});

describe('ShapeFeatureType', () => {
  it('contains all expected shape types', () => {
    expect(ShapeFeatureType.Circle).toBe('Circle');
    expect(ShapeFeatureType.Ellipse).toBe('Ellipse');
    expect(ShapeFeatureType.Polygon).toBe('Polygon');
    expect(ShapeFeatureType.Rectangle).toBe('Rectangle');
    expect(ShapeFeatureType.LineString).toBe('LineString');
    expect(ShapeFeatureType.Point).toBe('Point');
  });

  it('has exactly 6 shape types', () => {
    const shapeTypes = Object.keys(ShapeFeatureType);
    expect(shapeTypes).toHaveLength(6);
  });
});
