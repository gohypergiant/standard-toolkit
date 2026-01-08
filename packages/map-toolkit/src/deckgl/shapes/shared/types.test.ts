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

import { uuid } from '@accelint/core';
import { describe, expect, it } from 'vitest';
import {
  ShapeFeatureType,
  isCircleShape,
  isEllipseShape,
  isLineStringShape,
  isPointShape,
  isPolygonShape,
  isRectangleShape,
} from './types';
import type {
  CircleShape,
  EllipseShape,
  LineStringShape,
  PointShape,
  PolygonShape,
  RectangleShape,
  Shape,
} from './types';

/**
 * Creates a base feature structure for testing
 */
function createBaseFeature() {
  return {
    type: 'Feature' as const,
    properties: {
      styleProperties: {
        fillColor: [255, 255, 255, 255] as [number, number, number, number],
        lineColor: [0, 0, 0, 255] as [number, number, number, number],
        lineWidth: 2 as const,
        linePattern: 'solid' as const,
      },
    },
    geometry: {
      type: 'Polygon' as const,
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    },
  };
}

/**
 * Creates a mock CircleShape for testing
 */
function createCircleShape(): CircleShape {
  return {
    id: uuid(),
    name: 'Test Circle',
    shape: ShapeFeatureType.Circle,
    feature: {
      ...createBaseFeature(),
      properties: {
        styleProperties: {
          fillColor: [255, 255, 255, 255],
          lineColor: [0, 0, 0, 255],
          lineWidth: 2,
          linePattern: 'solid',
        },
        circleProperties: {
          center: [-82.16, 41.46],
          radius: {
            value: 250,
            units: 'kilometers',
          },
        },
      },
    },
  };
}

/**
 * Creates a mock EllipseShape for testing
 */
function createEllipseShape(): EllipseShape {
  return {
    id: uuid(),
    name: 'Test Ellipse',
    shape: ShapeFeatureType.Ellipse,
    feature: {
      ...createBaseFeature(),
      properties: {
        styleProperties: {
          fillColor: [255, 255, 255, 255],
          lineColor: [0, 0, 0, 255],
          lineWidth: 2,
          linePattern: 'solid',
        },
        ellipseProperties: {
          center: [-84.53, 36.09],
          xSemiAxis: {
            value: 100,
            units: 'kilometers',
          },
          ySemiAxis: {
            value: 200,
            units: 'kilometers',
          },
          angle: 45,
        },
      },
    },
  };
}

/**
 * Creates a mock PolygonShape for testing
 */
function createPolygonShape(): PolygonShape {
  return {
    id: uuid(),
    name: 'Test Polygon',
    shape: ShapeFeatureType.Polygon,
    feature: createBaseFeature(),
  };
}

/**
 * Creates a mock RectangleShape for testing
 */
function createRectangleShape(): RectangleShape {
  return {
    id: uuid(),
    name: 'Test Rectangle',
    shape: ShapeFeatureType.Rectangle,
    feature: createBaseFeature(),
  };
}

/**
 * Creates a mock LineStringShape for testing
 */
function createLineStringShape(): LineStringShape {
  return {
    id: uuid(),
    name: 'Test LineString',
    shape: ShapeFeatureType.LineString,
    feature: {
      ...createBaseFeature(),
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          [0, 0],
          [1, 1],
          [2, 0],
        ],
      },
    },
  };
}

/**
 * Creates a mock PointShape for testing
 */
function createPointShape(): PointShape {
  return {
    id: uuid(),
    name: 'Test Point',
    shape: ShapeFeatureType.Point,
    feature: {
      ...createBaseFeature(),
      geometry: {
        type: 'Point' as const,
        coordinates: [0, 0],
      },
    },
  };
}

describe('Type Guards', () => {
  describe('isCircleShape', () => {
    it('returns true for Circle shapes', () => {
      const circle = createCircleShape();
      expect(isCircleShape(circle)).toBe(true);
    });

    it('returns false for non-Circle shapes', () => {
      const shapes: Shape[] = [
        createEllipseShape(),
        createPolygonShape(),
        createRectangleShape(),
        createLineStringShape(),
        createPointShape(),
      ];

      for (const shape of shapes) {
        expect(isCircleShape(shape)).toBe(false);
      }
    });

    it('provides type narrowing for circleProperties', () => {
      const shape: Shape = createCircleShape();

      if (isCircleShape(shape)) {
        // TypeScript should know circleProperties exists
        expect(shape.feature.properties.circleProperties.center).toEqual([
          -82.16, 41.46,
        ]);
        expect(shape.feature.properties.circleProperties.radius.value).toBe(
          250,
        );
      }
    });
  });

  describe('isEllipseShape', () => {
    it('returns true for Ellipse shapes', () => {
      const ellipse = createEllipseShape();
      expect(isEllipseShape(ellipse)).toBe(true);
    });

    it('returns false for non-Ellipse shapes', () => {
      const shapes: Shape[] = [
        createCircleShape(),
        createPolygonShape(),
        createRectangleShape(),
        createLineStringShape(),
        createPointShape(),
      ];

      for (const shape of shapes) {
        expect(isEllipseShape(shape)).toBe(false);
      }
    });

    it('provides type narrowing for ellipseProperties', () => {
      const shape: Shape = createEllipseShape();

      if (isEllipseShape(shape)) {
        // TypeScript should know ellipseProperties exists
        expect(shape.feature.properties.ellipseProperties.center).toEqual([
          -84.53, 36.09,
        ]);
        expect(shape.feature.properties.ellipseProperties.xSemiAxis.value).toBe(
          100,
        );
        expect(shape.feature.properties.ellipseProperties.ySemiAxis.value).toBe(
          200,
        );
        expect(shape.feature.properties.ellipseProperties.angle).toBe(45);
      }
    });
  });

  describe('isPolygonShape', () => {
    it('returns true for Polygon shapes', () => {
      const polygon = createPolygonShape();
      expect(isPolygonShape(polygon)).toBe(true);
    });

    it('returns false for non-Polygon shapes', () => {
      const shapes: Shape[] = [
        createCircleShape(),
        createEllipseShape(),
        createRectangleShape(),
        createLineStringShape(),
        createPointShape(),
      ];

      for (const shape of shapes) {
        expect(isPolygonShape(shape)).toBe(false);
      }
    });

    it('provides type narrowing for PolygonShape', () => {
      const shape: Shape = createPolygonShape();

      if (isPolygonShape(shape)) {
        // TypeScript should narrow to PolygonShape
        expect(shape.shape).toBe(ShapeFeatureType.Polygon);
      }
    });
  });

  describe('isRectangleShape', () => {
    it('returns true for Rectangle shapes', () => {
      const rectangle = createRectangleShape();
      expect(isRectangleShape(rectangle)).toBe(true);
    });

    it('returns false for non-Rectangle shapes', () => {
      const shapes: Shape[] = [
        createCircleShape(),
        createEllipseShape(),
        createPolygonShape(),
        createLineStringShape(),
        createPointShape(),
      ];

      for (const shape of shapes) {
        expect(isRectangleShape(shape)).toBe(false);
      }
    });

    it('provides type narrowing for RectangleShape', () => {
      const shape: Shape = createRectangleShape();

      if (isRectangleShape(shape)) {
        // TypeScript should narrow to RectangleShape
        expect(shape.shape).toBe(ShapeFeatureType.Rectangle);
      }
    });
  });

  describe('isLineStringShape', () => {
    it('returns true for LineString shapes', () => {
      const lineString = createLineStringShape();
      expect(isLineStringShape(lineString)).toBe(true);
    });

    it('returns false for non-LineString shapes', () => {
      const shapes: Shape[] = [
        createCircleShape(),
        createEllipseShape(),
        createPolygonShape(),
        createRectangleShape(),
        createPointShape(),
      ];

      for (const shape of shapes) {
        expect(isLineStringShape(shape)).toBe(false);
      }
    });

    it('provides type narrowing for LineStringShape', () => {
      const shape: Shape = createLineStringShape();

      if (isLineStringShape(shape)) {
        // TypeScript should narrow to LineStringShape
        expect(shape.shape).toBe(ShapeFeatureType.LineString);
      }
    });
  });

  describe('isPointShape', () => {
    it('returns true for Point shapes', () => {
      const point = createPointShape();
      expect(isPointShape(point)).toBe(true);
    });

    it('returns false for non-Point shapes', () => {
      const shapes: Shape[] = [
        createCircleShape(),
        createEllipseShape(),
        createPolygonShape(),
        createRectangleShape(),
        createLineStringShape(),
      ];

      for (const shape of shapes) {
        expect(isPointShape(shape)).toBe(false);
      }
    });

    it('provides type narrowing for PointShape', () => {
      const shape: Shape = createPointShape();

      if (isPointShape(shape)) {
        // TypeScript should narrow to PointShape
        expect(shape.shape).toBe(ShapeFeatureType.Point);
      }
    });
  });

  describe('Type guard mutual exclusivity', () => {
    it('each shape type matches exactly one type guard', () => {
      const allShapes: Shape[] = [
        createCircleShape(),
        createEllipseShape(),
        createPolygonShape(),
        createRectangleShape(),
        createLineStringShape(),
        createPointShape(),
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
