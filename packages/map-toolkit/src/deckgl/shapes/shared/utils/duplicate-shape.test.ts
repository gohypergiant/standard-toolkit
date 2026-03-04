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
import { mockShapes } from '../../__fixtures__/mock-shapes';
import { duplicateShape } from './duplicate-shape';
import type { LineString, Point, Polygon } from 'geojson';
import type {
  CircleShape,
  EllipseShape,
  LineStringShape,
  PointShape,
  PolygonShape,
  RectangleShape,
  Shape,
} from '../types';

// Extract individual shapes from fixtures by type
const circleShape = mockShapes.find((s) => s.shape === 'Circle') as CircleShape;
const lineStringShape = mockShapes.find(
  (s) => s.shape === 'LineString',
) as LineStringShape;
const pointShape = mockShapes.find((s) => s.shape === 'Point') as PointShape;
const polygonShape = mockShapes.find(
  (s) => s.shape === 'Polygon',
) as PolygonShape;
const rectangleShape = mockShapes.find(
  (s) => s.shape === 'Rectangle',
) as RectangleShape;
const ellipseShape = mockShapes.find(
  (s) => s.shape === 'Ellipse',
) as EllipseShape;

describe('duplicateShape', () => {
  it('should return a shape with a new unique ID', () => {
    const clone = duplicateShape(pointShape);

    expect(clone.id).not.toBe(pointShape.id);
    expect(clone.id).toBeTypeOf('string');
    expect(clone.id.length).toBeGreaterThan(0);
  });

  it('should set shapeId in feature properties to match the new shape ID', () => {
    const clone = duplicateShape(pointShape);

    expect(clone.feature.properties.shapeId).toBe(clone.id);
    expect(clone.feature.properties.shapeId).not.toBe(pointShape.id);
  });

  it('should default the name to "{original name} (copy)"', () => {
    const clone = duplicateShape(pointShape);

    expect(clone.name).toBe(`${pointShape.name} (copy)`);
  });

  it('should use a custom name when provided', () => {
    const clone = duplicateShape(pointShape, { name: 'Backup Zone' });

    expect(clone.name).toBe('Backup Zone');
  });

  it('should set label to the resolved name', () => {
    const clone = duplicateShape(pointShape);

    expect(clone.label).toBe(`${pointShape.name} (copy)`);
  });

  it('should set label to the custom name when provided', () => {
    const clone = duplicateShape(pointShape, { name: 'Backup Zone' });

    expect(clone.label).toBe('Backup Zone');
  });

  it.each([
    ['Circle', circleShape],
    ['Ellipse', ellipseShape],
    ['Polygon', polygonShape],
    ['Rectangle', rectangleShape],
    ['LineString', lineStringShape],
    ['Point', pointShape],
  ] as const)('should preserve the shape type discriminant for %s', (expectedType, shape) => {
    const clone = duplicateShape(shape as Shape);

    expect(clone.shape).toBe(expectedType);
  });

  it('should deep-clone geometry (not share references)', () => {
    const clone = duplicateShape(polygonShape);

    expect(clone.feature.geometry).toEqual(polygonShape.feature.geometry);
    expect(clone.feature.geometry).not.toBe(polygonShape.feature.geometry);
  });

  it('should preserve style properties', () => {
    const clone = duplicateShape(pointShape);

    expect(clone.feature.properties.styleProperties).toEqual(
      pointShape.feature.properties.styleProperties,
    );
  });

  it('should preserve circle properties', () => {
    const clone = duplicateShape(circleShape);

    expect(clone.feature.properties.circleProperties).toEqual(
      circleShape.feature.properties.circleProperties,
    );
  });

  it('should preserve ellipse properties', () => {
    const clone = duplicateShape(ellipseShape);

    expect(clone.feature.properties.ellipseProperties).toEqual(
      ellipseShape.feature.properties.ellipseProperties,
    );
  });

  it('should always set locked to false even if source was locked', () => {
    const lockedShape: Shape = { ...pointShape, locked: true };

    const clone = duplicateShape(lockedShape);

    expect(clone.locked).toBe(false);
  });

  it('should set a fresh lastUpdated timestamp', () => {
    const clone = duplicateShape(pointShape);

    expect(clone.lastUpdated).toBeGreaterThan(0);
    expect(clone.lastUpdated).not.toBe(pointShape.lastUpdated);
  });

  describe('offset', () => {
    it('should not offset coordinates by default', () => {
      const clone = duplicateShape(pointShape);

      expect(clone.feature.geometry).toEqual(pointShape.feature.geometry);
    });

    it('should preserve elevation when offsetting Point coordinates', () => {
      const shapeWithElevation: Shape = {
        ...pointShape,
        feature: {
          ...pointShape.feature,
          geometry: {
            type: 'Point',
            coordinates: [-80, 35, 1000],
          },
        },
      };

      const clone = duplicateShape(shapeWithElevation, { offset: [1, 2] });

      expect(clone.feature.geometry).toEqual({
        type: 'Point',
        coordinates: [-79, 37, 1000],
      });
    });

    it('should offset Point coordinates', () => {
      const offset: [number, number] = [1, 2];
      const [lng, lat] = (pointShape.feature.geometry as Point).coordinates as [
        number,
        number,
      ];

      const clone = duplicateShape(pointShape, { offset });

      expect(clone.feature.geometry).toEqual({
        type: 'Point',
        coordinates: [lng + offset[0], lat + offset[1]],
      });
    });

    it('should offset Polygon coordinates', () => {
      const offset: [number, number] = [1, 1];
      const originalRing = (polygonShape.feature.geometry as Polygon)
        .coordinates[0] as [number, number][];
      const expectedRing = originalRing.map(([lng, lat]) => [
        lng + offset[0],
        lat + offset[1],
      ]);

      const clone = duplicateShape(polygonShape, { offset });

      const cloneRing = (clone.feature.geometry as Polygon).coordinates[0];
      expect(cloneRing).toEqual(expectedRing);
    });

    it('should offset LineString coordinates', () => {
      const offset: [number, number] = [0.5, -0.5];
      const originalCoords = (lineStringShape.feature.geometry as LineString)
        .coordinates as [number, number][];
      const expectedCoords = originalCoords.map(([lng, lat]) => [
        lng + offset[0],
        lat + offset[1],
      ]);

      const clone = duplicateShape(lineStringShape, { offset });

      const cloneCoords = (clone.feature.geometry as LineString).coordinates;
      expect(cloneCoords).toEqual(expectedCoords);
    });

    it('should offset MultiLineString coordinates', () => {
      const multiLineShape: Shape = {
        ...lineStringShape,
        feature: {
          ...lineStringShape.feature,
          geometry: {
            type: 'MultiLineString',
            coordinates: [
              [
                [0, 0],
                [1, 1],
              ],
              [
                [10, 10],
                [11, 11],
              ],
            ],
          },
        },
      };
      const offset: [number, number] = [5, 5];

      const clone = duplicateShape(multiLineShape, { offset });

      expect(clone.feature.geometry).toEqual({
        type: 'MultiLineString',
        coordinates: [
          [
            [5, 5],
            [6, 6],
          ],
          [
            [15, 15],
            [16, 16],
          ],
        ],
      });
    });

    it('should offset MultiPolygon coordinates', () => {
      const multiPolygonShape: Shape = {
        ...polygonShape,
        feature: {
          ...polygonShape.feature,
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [0, 0],
                  [1, 0],
                  [1, 1],
                  [0, 0],
                ],
              ],
              [
                [
                  [10, 10],
                  [11, 10],
                  [11, 11],
                  [10, 10],
                ],
              ],
            ],
          },
        },
      };
      const offset: [number, number] = [5, 5];

      const clone = duplicateShape(multiPolygonShape, { offset });

      expect(clone.feature.geometry).toEqual({
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [5, 5],
              [6, 5],
              [6, 6],
              [5, 5],
            ],
          ],
          [
            [
              [15, 15],
              [16, 15],
              [16, 16],
              [15, 15],
            ],
          ],
        ],
      });
    });

    it('should offset GeometryCollection coordinates', () => {
      const geoCollectionShape: Shape = {
        ...pointShape,
        feature: {
          ...pointShape.feature,
          geometry: {
            type: 'GeometryCollection',
            geometries: [
              { type: 'Point', coordinates: [0, 0] },
              {
                type: 'LineString',
                coordinates: [
                  [1, 1],
                  [2, 2],
                ],
              },
            ],
          },
        },
      };
      const offset: [number, number] = [10, 20];

      const clone = duplicateShape(geoCollectionShape, { offset });

      expect(clone.feature.geometry).toEqual({
        type: 'GeometryCollection',
        geometries: [
          { type: 'Point', coordinates: [10, 20] },
          {
            type: 'LineString',
            coordinates: [
              [11, 21],
              [12, 22],
            ],
          },
        ],
      });
    });

    it('should offset circle center in circleProperties', () => {
      const offset: [number, number] = [1, 2];
      const originalCenter =
        circleShape.feature.properties.circleProperties.center;

      const clone = duplicateShape(circleShape, { offset });

      expect(clone.feature.properties.circleProperties?.center).toEqual([
        originalCenter[0] + offset[0],
        originalCenter[1] + offset[1],
      ]);
    });

    it('should offset ellipse center in ellipseProperties', () => {
      const offset: [number, number] = [1, 2];
      const originalCenter =
        ellipseShape.feature.properties.ellipseProperties.center;

      const clone = duplicateShape(ellipseShape, { offset });

      expect(clone.feature.properties.ellipseProperties?.center).toEqual([
        originalCenter[0] + offset[0],
        originalCenter[1] + offset[1],
      ]);
    });

    it('should preserve circle radius when offsetting', () => {
      const clone = duplicateShape(circleShape, { offset: [1, 2] });

      expect(clone.feature.properties.circleProperties?.radius).toEqual(
        circleShape.feature.properties.circleProperties.radius,
      );
    });

    it('should preserve ellipse axes and angle when offsetting', () => {
      const clone = duplicateShape(ellipseShape, { offset: [1, 2] });

      const originalProps = ellipseShape.feature.properties.ellipseProperties;
      const cloneProps = clone.feature.properties.ellipseProperties;
      expect(cloneProps?.xSemiAxis).toEqual(originalProps.xSemiAxis);
      expect(cloneProps?.ySemiAxis).toEqual(originalProps.ySemiAxis);
      expect(cloneProps?.angle).toBe(originalProps.angle);
    });
  });
});
