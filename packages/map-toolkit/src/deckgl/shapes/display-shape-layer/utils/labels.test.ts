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
import {
  getLabelBorderColor,
  getLabelFillColor,
  getLabelPosition2d,
  getLabelText,
  getLineStringEndpoint,
  getLineStringMidpoint,
  getPolygonMidpoint,
  interpolatePoint,
  type LabelPositionOptions,
} from './labels';
import type { Color } from '@deck.gl/core';
import type { Shape } from '../../shared/types';

describe('Label Positioning Utilities', () => {
  describe('interpolatePoint', () => {
    it('returns start point when ratio is 0', () => {
      const start: [number, number] = [-122.4, 37.8];
      const end: [number, number] = [-122.3, 37.9];
      const result = interpolatePoint(start, end, 0);

      expect(result).toEqual(start);
    });

    it('returns end point when ratio is 1', () => {
      const start: [number, number] = [-122.4, 37.8];
      const end: [number, number] = [-122.3, 37.9];
      const result = interpolatePoint(start, end, 1);

      expect(result).toEqual(end);
    });

    it('returns midpoint when ratio is 0.5', () => {
      const start: [number, number] = [-122.4, 37.8];
      const end: [number, number] = [-122.2, 38.0];
      const result = interpolatePoint(start, end, 0.5);

      expect(result[0]).toBeCloseTo(-122.3);
      expect(result[1]).toBeCloseTo(37.9);
    });

    it('clamps ratio to 0-1 range', () => {
      const start: [number, number] = [-122.4, 37.8];
      const end: [number, number] = [-122.3, 37.9];

      const negativeResult = interpolatePoint(start, end, -0.5);
      expect(negativeResult).toEqual(start);

      const overResult = interpolatePoint(start, end, 1.5);
      expect(overResult).toEqual(end);
    });

    it('interpolates correctly at quarter point', () => {
      const start: [number, number] = [0, 0];
      const end: [number, number] = [100, 100];
      const result = interpolatePoint(start, end, 0.25);

      expect(result).toEqual([25, 25]);
    });
  });

  describe('getLineStringEndpoint', () => {
    it('returns last coordinate of LineString', () => {
      const coordinates: [number, number][] = [
        [-122.4, 37.8],
        [-122.3, 37.9],
        [-122.2, 38.0],
      ];
      const result = getLineStringEndpoint(coordinates);

      expect(result).toEqual([-122.2, 38.0]);
    });

    it('returns [0, 0] for empty coordinates', () => {
      const result = getLineStringEndpoint([]);

      expect(result).toEqual([0, 0]);
    });

    it('returns the only point for single coordinate', () => {
      const coordinates: [number, number][] = [[-122.4, 37.8]];
      const result = getLineStringEndpoint(coordinates);

      expect(result).toEqual([-122.4, 37.8]);
    });
  });

  describe('getLineStringMidpoint', () => {
    it('returns [0, 0] for empty coordinates', () => {
      const result = getLineStringMidpoint([]);

      expect(result).toEqual([0, 0]);
    });

    it('returns the only point for single coordinate', () => {
      const coordinates: [number, number][] = [[-122.4, 37.8]];
      const result = getLineStringMidpoint(coordinates);

      expect(result).toEqual([-122.4, 37.8]);
    });

    it('returns midpoint for two-segment line', () => {
      const coordinates: [number, number][] = [
        [0, 0],
        [100, 0],
        [100, 100],
      ];
      const result = getLineStringMidpoint(coordinates);

      // Total length: 100 + 100 = 200, midpoint at 100
      // First segment is 100 units, so midpoint is at end of first segment
      expect(result).toEqual([100, 0]);
    });

    it('calculates midpoint correctly for straight line', () => {
      const coordinates: [number, number][] = [
        [0, 0],
        [100, 0],
      ];
      const result = getLineStringMidpoint(coordinates);

      expect(result).toEqual([50, 0]);
    });
  });

  describe('getPolygonMidpoint', () => {
    it('returns [0, 0] for empty rings', () => {
      const result = getPolygonMidpoint([]);

      expect(result).toEqual([0, 0]);
    });

    it('returns [0, 0] for empty outer ring', () => {
      const result = getPolygonMidpoint([[]]);

      expect(result).toEqual([0, 0]);
    });

    it('calculates midpoint of outer ring only', () => {
      const coordinates: [number, number][][] = [
        // Outer ring (square)
        [
          [0, 0],
          [100, 0],
          [100, 100],
          [0, 100],
          [0, 0],
        ],
        // Inner ring (hole) - should be ignored
        [
          [25, 25],
          [75, 25],
          [75, 75],
          [25, 75],
          [25, 25],
        ],
      ];
      const result = getPolygonMidpoint(coordinates);

      // Should calculate midpoint of outer ring only
      // Total perimeter: 400, midpoint at 200
      expect(result).toEqual([100, 100]);
    });
  });

  describe('getLabelText', () => {
    it('returns label when provided', () => {
      const shape: Shape = {
        id: '1',
        name: 'Full Name',
        label: 'Label',
        shapeType: 'Point',
        locked: false,
        feature: {
          type: 'Feature',
          properties: { styleProperties: {} },
          geometry: { type: 'Point', coordinates: [0, 0] },
        },
      };

      expect(getLabelText(shape)).toBe('LABEL');
    });

    it('falls back to name when label is not provided', () => {
      const shape: Shape = {
        id: '1',
        name: 'Full Name',
        shapeType: 'Point',
        locked: false,
        feature: {
          type: 'Feature',
          properties: { styleProperties: {} },
          geometry: { type: 'Point', coordinates: [0, 0] },
        },
      };

      expect(getLabelText(shape)).toBe('FULL NAME');
    });

    it('prefers label over name when both provided', () => {
      const shape: Shape = {
        id: '1',
        name: 'Full Name',
        label: 'Short',
        shapeType: 'Point',
        locked: false,
        feature: {
          type: 'Feature',
          properties: { styleProperties: {} },
          geometry: { type: 'Point', coordinates: [0, 0] },
        },
      };

      expect(getLabelText(shape)).toBe('SHORT');
    });
  });

  describe('getLabelFillColor', () => {
    it('extracts RGB from RGBA and applies fixed label opacity', () => {
      const shape: Shape = {
        id: '1',
        name: 'Test',
        shapeType: 'Point',
        locked: false,
        feature: {
          type: 'Feature',
          properties: {
            styleProperties: {
              fillColor: [98, 166, 255, 150] as Color,
              strokeColor: [0, 0, 0, 255] as Color,
              strokeWidth: 2,
              strokePattern: 'solid',
            },
          },
          geometry: { type: 'Point', coordinates: [0, 0] },
        },
      };

      const result = getLabelFillColor(shape);

      // RGB from fillColor with fixed label opacity (200)
      expect(result).toEqual([98, 166, 255, 200]);
    });

    it('uses default color when fillColor is not provided', () => {
      const shape: Shape = {
        id: '1',
        name: 'Test',
        shapeType: 'Point',
        locked: false,
        feature: {
          type: 'Feature',
          properties: {
            styleProperties: {
              fillColor: undefined as unknown as Color,
              strokeColor: [0, 0, 0, 255] as Color,
              strokeWidth: 2,
              strokePattern: 'solid',
            },
          },
          geometry: { type: 'Point', coordinates: [0, 0] },
        },
      };

      const result = getLabelFillColor(shape);

      // Default: [98, 166, 255] with label opacity 200
      expect(result).toEqual([98, 166, 255, 200]);
    });

    it('handles different RGBA colors correctly', () => {
      const shape: Shape = {
        id: '1',
        name: 'Test',
        shapeType: 'Point',
        locked: false,
        feature: {
          type: 'Feature',
          properties: {
            styleProperties: {
              fillColor: [255, 0, 0, 100] as Color,
              strokeColor: [0, 0, 0, 255] as Color,
              strokeWidth: 2,
              strokePattern: 'solid',
            },
          },
          geometry: { type: 'Point', coordinates: [0, 0] },
        },
      };

      const result = getLabelFillColor(shape);

      // RGB extracted, fixed label opacity applied (200)
      expect(result).toEqual([255, 0, 0, 200]);
    });
  });

  describe('getLabelBorderColor', () => {
    it('extracts RGB from RGBA and applies full opacity', () => {
      const shape: Shape = {
        id: '1',
        name: 'Test',
        shapeType: 'Point',
        locked: false,
        feature: {
          type: 'Feature',
          properties: {
            styleProperties: {
              fillColor: [0, 0, 0, 255] as Color,
              strokeColor: [98, 166, 255, 150] as Color,
              strokeWidth: 2,
              strokePattern: 'solid',
            },
          },
          geometry: { type: 'Point', coordinates: [0, 0] },
        },
      };

      const result = getLabelBorderColor(shape);

      // RGB from strokeColor with full opacity (255)
      expect(result).toEqual([98, 166, 255, 255]);
    });

    it('uses default color when strokeColor is not provided', () => {
      const shape: Shape = {
        id: '1',
        name: 'Test',
        shapeType: 'Point',
        locked: false,
        feature: {
          type: 'Feature',
          properties: {
            styleProperties: {
              fillColor: [0, 0, 0, 255] as Color,
              strokeColor: undefined as unknown as Color,
              strokeWidth: 2,
              strokePattern: 'solid',
            },
          },
          geometry: { type: 'Point', coordinates: [0, 0] },
        },
      };

      const result = getLabelBorderColor(shape);

      // Default: [98, 166, 255] with full opacity 255
      expect(result).toEqual([98, 166, 255, 255]);
    });
  });

  describe('getLabelPosition2d', () => {
    describe('Point geometry', () => {
      it('uses default positioning when no options provided', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Point',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: { type: 'Point', coordinates: [-122.4, 37.8] },
          },
        };

        const result = getLabelPosition2d(shape);

        // Default: label below point with 10px offset
        expect(result).toEqual({
          coordinates: [-122.4, 37.8],
          textAnchor: 'middle',
          alignmentBaseline: 'top',
          pixelOffset: [0, 10],
        });
      });

      it('uses global label options', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Point',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: { type: 'Point', coordinates: [-122.4, 37.8] },
          },
        };

        const options: LabelPositionOptions = {
          pointLabelVerticalAnchor: 'bottom',
          pointLabelHorizontalAnchor: 'left',
          pointLabelOffset: [10, 10],
        };

        const result = getLabelPosition2d(shape, options);

        expect(result).toEqual({
          coordinates: [-122.4, 37.8],
          textAnchor: 'start',
          alignmentBaseline: 'bottom',
          pixelOffset: [10, 10],
        });
      });

      it('prioritizes per-shape properties over global options', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Point',
          locked: false,
          feature: {
            type: 'Feature',
            properties: {
              styleProperties: {
                labelVerticalAnchor: 'middle',
                labelHorizontalAnchor: 'right',
                labelOffset: [5, 5],
              },
            },
            geometry: { type: 'Point', coordinates: [-122.4, 37.8] },
          },
        };

        const options: LabelPositionOptions = {
          pointLabelVerticalAnchor: 'bottom',
          pointLabelHorizontalAnchor: 'left',
          pointLabelOffset: [10, 10],
        };

        const result = getLabelPosition2d(shape, options);

        expect(result).toEqual({
          coordinates: [-122.4, 37.8],
          textAnchor: 'end',
          alignmentBaseline: 'center',
          pixelOffset: [5, 5],
        });
      });
    });

    describe('LineString geometry', () => {
      it('uses default positioning at bottom edge', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'LineString',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'LineString',
              coordinates: [
                [-122.4, 37.8], // min latitude (bottom)
                [-122.3, 37.9],
                [-122.2, 38.0], // max latitude (top)
              ],
            },
          },
        };

        const result = getLabelPosition2d(shape);

        // Default is bottom edge (min latitude)
        expect(result).toEqual({
          coordinates: [-122.4, 37.8],
          textAnchor: 'middle',
          alignmentBaseline: 'top',
          pixelOffset: [0, 10],
        });
      });

      it('positions at top edge when coordinateAnchor is top', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'LineString',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'LineString',
              coordinates: [
                [0, 0], // bottom-left
                [100, 50], // right
                [50, 100], // top
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          lineStringLabelCoordinateAnchor: 'top',
        };

        const result = getLabelPosition2d(shape, options);

        // Should find the point with max latitude (y=100)
        expect(result.coordinates).toEqual([50, 100]);
      });

      it('positions at right edge when coordinateAnchor is right', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'LineString',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'LineString',
              coordinates: [
                [0, 0], // left
                [100, 50], // right (max longitude)
                [50, 100],
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          lineStringLabelCoordinateAnchor: 'right',
        };

        const result = getLabelPosition2d(shape, options);

        // Should find the point with max longitude (x=100)
        expect(result.coordinates).toEqual([100, 50]);
      });

      it('positions at left edge when coordinateAnchor is left', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'LineString',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'LineString',
              coordinates: [
                [0, 50], // left (min longitude)
                [100, 0],
                [50, 100],
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          lineStringLabelCoordinateAnchor: 'left',
        };

        const result = getLabelPosition2d(shape, options);

        // Should find the point with min longitude (x=0)
        expect(result.coordinates).toEqual([0, 50]);
      });

      it('positions at center (centroid) when coordinateAnchor is center', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'LineString',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'LineString',
              coordinates: [
                [0, 0],
                [100, 0],
                [100, 100],
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          lineStringLabelCoordinateAnchor: 'center',
        };

        const result = getLabelPosition2d(shape, options);

        // Centroid of [0,0], [100,0], [100,100] = average = [66.67, 33.33]
        expect(result.coordinates[0]).toBeCloseTo(66.67, 1);
        expect(result.coordinates[1]).toBeCloseTo(33.33, 1);
      });
    });

    describe('Polygon geometry', () => {
      it('uses default positioning at bottom edge', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Polygon',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 0], // bottom-left (min latitude)
                  [100, 0], // bottom-right (min latitude)
                  [100, 100], // top-right
                  [0, 100], // top-left
                  [0, 0], // close
                ],
              ],
            },
          },
        };

        const result = getLabelPosition2d(shape);

        // Default is bottom edge (min latitude) - first vertex with y=0
        expect(result).toEqual({
          coordinates: [0, 0],
          textAnchor: 'middle',
          alignmentBaseline: 'top',
          pixelOffset: [0, 10],
        });
      });

      it('positions at top edge when coordinateAnchor is top', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Polygon',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 0],
                  [100, 0],
                  [100, 100], // top-right (max latitude)
                  [0, 100], // top-left (max latitude)
                  [0, 0],
                ],
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          polygonLabelCoordinateAnchor: 'top',
        };

        const result = getLabelPosition2d(shape, options);

        // Should find vertex with max latitude (y=100)
        expect(result.coordinates).toEqual([100, 100]);
      });

      it('positions at right edge when coordinateAnchor is right', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Polygon',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 0],
                  [100, 0], // right (max longitude)
                  [100, 100], // right (max longitude)
                  [0, 100],
                  [0, 0],
                ],
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          polygonLabelCoordinateAnchor: 'right',
        };

        const result = getLabelPosition2d(shape, options);

        // Should find vertex with max longitude (x=100)
        expect(result.coordinates).toEqual([100, 0]);
      });

      it('positions at left edge when coordinateAnchor is left', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Polygon',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 0], // left (min longitude)
                  [100, 0],
                  [100, 100],
                  [0, 100], // left (min longitude)
                  [0, 0],
                ],
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          polygonLabelCoordinateAnchor: 'left',
        };

        const result = getLabelPosition2d(shape, options);

        // Should find vertex with min longitude (x=0)
        expect(result.coordinates).toEqual([0, 0]);
      });

      it('positions at center (centroid) when coordinateAnchor is center', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Polygon',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 0],
                  [100, 0],
                  [100, 100],
                  [0, 100],
                  [0, 0], // closing vertex
                ],
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          polygonLabelCoordinateAnchor: 'center',
        };

        const result = getLabelPosition2d(shape, options);

        // Centroid of square [0,0], [100,0], [100,100], [0,100], [0,0] = [40, 40]
        // (5 vertices including closing, sum = 200/5 = 40)
        expect(result.coordinates).toEqual([40, 40]);
      });
    });

    describe('Circle geometry', () => {
      it('positions at bottom edge by default', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Circle',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 100], // left
                  [50, 150], // top
                  [100, 100], // right
                  [50, 50], // bottom (min latitude)
                  [0, 100], // back to start
                ],
              ],
            },
          },
        };

        const result = getLabelPosition2d(shape);

        // Default is bottom edge (min latitude y=50)
        expect(result.coordinates).toEqual([50, 50]);
        expect(result.pixelOffset).toEqual([0, 10]);
      });

      it('positions at top edge', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Circle',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 100],
                  [50, 150], // top (max latitude)
                  [100, 100],
                  [50, 50],
                  [0, 100],
                ],
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          circleLabelCoordinateAnchor: 'top',
        };

        const result = getLabelPosition2d(shape, options);

        // Should find the vertex with max latitude (y=150)
        expect(result.coordinates).toEqual([50, 150]);
      });

      it('positions at right edge', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Circle',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 100],
                  [50, 150],
                  [100, 100],
                  [50, 50],
                  [0, 100],
                ],
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          circleLabelCoordinateAnchor: 'right',
        };

        const result = getLabelPosition2d(shape, options);

        // Should find the vertex with max longitude (x=100)
        expect(result.coordinates).toEqual([100, 100]);
      });

      it('positions at bottom edge', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Circle',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 100],
                  [50, 150],
                  [100, 100],
                  [50, 50],
                  [0, 100],
                ],
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          circleLabelCoordinateAnchor: 'bottom',
        };

        const result = getLabelPosition2d(shape, options);

        // Should find the vertex with min latitude (y=50)
        expect(result.coordinates).toEqual([50, 50]);
      });

      it('positions at left edge', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Circle',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 100],
                  [50, 150],
                  [100, 100],
                  [50, 50],
                  [0, 100],
                ],
              ],
            },
          },
        };

        const options: LabelPositionOptions = {
          circleLabelCoordinateAnchor: 'left',
        };

        const result = getLabelPosition2d(shape, options);

        // Should find the vertex with min longitude (x=0)
        expect(result.coordinates).toEqual([0, 100]);
      });

      it('uses custom per-shape label positioning', () => {
        const shape: Shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Circle',
          locked: false,
          feature: {
            type: 'Feature',
            properties: {
              styleProperties: {
                labelCoordinateAnchor: 'bottom',
                labelVerticalAnchor: 'top',
                labelHorizontalAnchor: 'center',
                labelOffset: [0, 10],
              },
            },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 100],
                  [50, 150],
                  [100, 100],
                  [50, 50],
                  [0, 100],
                ],
              ],
            },
          },
        };

        const result = getLabelPosition2d(shape);

        expect(result).toEqual({
          coordinates: [50, 50],
          textAnchor: 'middle',
          alignmentBaseline: 'top',
          pixelOffset: [0, 10],
        });
      });
    });

    describe('Unknown geometry fallback', () => {
      it('returns null for unknown geometry type', () => {
        const shape = {
          id: '1',
          name: 'Test',
          shapeType: 'Unknown',
          locked: false,
          feature: {
            type: 'Feature',
            properties: { styleProperties: {} },
            geometry: { type: 'Unknown', coordinates: [] },
          },
        } as unknown as Shape;

        const result = getLabelPosition2d(shape);

        expect(result).toBeNull();
      });
    });
  });
});
