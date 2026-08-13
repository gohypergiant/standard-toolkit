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
import {
  boundingBoxToScaleHandles,
  filterVertexGuides,
  isRotateChromeFeature,
  replaceRotateChromeWithBoundingBox,
  resolveBoundingBoxGuides,
  VERTEX_BBOX_MODE,
} from './vertex-bbox-chrome';
import type { Feature, Point as GeoPoint, LineString } from 'geojson';
import type { OrientedBoundingBox } from './vertex-bbox-math';

/**
 * Subset of the `editable-layers` guide-feature `properties` shape that
 * the chrome utilities under test inspect. Tighter than `any` so tests
 * fail at compile time when an unexpected property name slips in (and so
 * editor tooling helps when fleshing out new fixtures).
 */
type TestGuideProperties = {
  guideType?: 'editHandle';
  editHandleType?:
    | 'existing'
    | 'intermediate'
    | 'scale'
    | 'rotate'
    | 'snap-source'
    | 'snap-target';
  mode?: 'scale' | 'rotate-stem' | 'vertex-bbox';
  positionIndexes?: number[];
};

function pointGuide(
  coord: [number, number],
  properties: TestGuideProperties,
): Feature<GeoPoint> {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: coord },
    properties,
  };
}

function lineGuide(
  coords: [number, number][],
  properties: TestGuideProperties,
): Feature<LineString> {
  return {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: coords },
    properties,
  };
}

function makeBoundingBox(): OrientedBoundingBox {
  return {
    bottomLeft: [-1, -1],
    bottomRight: [1, -1],
    topRight: [1, 1],
    topLeft: [-1, 1],
    stemBase: [0, 1],
    stemTip: [0, 1.5],
  };
}

describe('filterVertexGuides', () => {
  it("should drop guides with mode 'scale' regardless of other flags", () => {
    const guide = lineGuide(
      [
        [0, 0],
        [1, 1],
      ],
      { mode: 'scale' },
    );

    expect(filterVertexGuides([guide], false, false)).toEqual([]);
  });

  it('should drop existing-vertex handles when isRectangle is true', () => {
    const vertex = pointGuide([0, 0], {
      guideType: 'editHandle',
      editHandleType: 'existing',
    });

    expect(filterVertexGuides([vertex], true, false)).toEqual([]);
    // ... but keep the same vertex when isRectangle is false.
    expect(filterVertexGuides([vertex], false, false)).toEqual([vertex]);
  });

  it('should drop scale corner handles when isRotating is true', () => {
    const scaleHandle = pointGuide([1, 1], {
      guideType: 'editHandle',
      editHandleType: 'scale',
    });

    expect(filterVertexGuides([scaleHandle], false, true)).toEqual([]);
    expect(filterVertexGuides([scaleHandle], false, false)).toEqual([
      scaleHandle,
    ]);
  });

  it('should keep guides that match no drop rule', () => {
    const rotateHandle = pointGuide([0, 1], {
      guideType: 'editHandle',
      editHandleType: 'rotate',
    });
    const stemConnector = lineGuide(
      [
        [0, 1],
        [0, 1.5],
      ],
      { mode: 'rotate-stem' },
    );

    const result = filterVertexGuides(
      [rotateHandle, stemConnector],
      false,
      false,
    );

    expect(result).toEqual([rotateHandle, stemConnector]);
  });
});

describe('isRotateChromeFeature', () => {
  it.each([
    {
      label: '5-coord closed LineString with no mode/editHandleType',
      feature: lineGuide(
        [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
          [-1, -1],
        ],
        {},
      ),
      expected: true,
    },
    {
      label: '2-coord stem connector with no mode/editHandleType',
      feature: lineGuide(
        [
          [0, 1],
          [0, 1.5],
        ],
        {},
      ),
      expected: true,
    },
    {
      label: "Point with editHandleType 'rotate'",
      feature: pointGuide([0, 1.5], { editHandleType: 'rotate' }),
      expected: true,
    },
    {
      label: "Point with editHandleType 'scale'",
      feature: pointGuide([1, 1], { editHandleType: 'scale' }),
      expected: false,
    },
    {
      label: "our own rotate-stem connector (mode='rotate-stem')",
      feature: lineGuide(
        [
          [0, 1],
          [0, 1.5],
        ],
        { mode: 'rotate-stem' },
      ),
      expected: false,
    },
    {
      label: 'LineString with the wrong coordinate count',
      feature: lineGuide(
        [
          [0, 0],
          [1, 0],
          [1, 1],
        ],
        {},
      ),
      expected: false,
    },
  ])('should classify $label as $expected', ({ feature, expected }) => {
    expect(isRotateChromeFeature(feature)).toBe(expected);
  });
});

describe('boundingBoxToScaleHandles', () => {
  it('should emit four Points at the four corners with sequential positionIndexes', () => {
    const result = boundingBoxToScaleHandles(makeBoundingBox());

    expect(result).toHaveLength(4);
    expect(result[0]?.geometry.coordinates).toEqual([-1, -1]);
    expect(result[1]?.geometry.coordinates).toEqual([1, -1]);
    expect(result[2]?.geometry.coordinates).toEqual([1, 1]);
    expect(result[3]?.geometry.coordinates).toEqual([-1, 1]);
    expect(
      result.map((feature) => feature.properties?.positionIndexes),
    ).toEqual([[0], [1], [2], [3]]);
    expect(
      result.every(
        (feature) =>
          feature.properties?.guideType === 'editHandle' &&
          feature.properties?.editHandleType === 'scale',
      ),
    ).toBe(true);
  });
});

describe('replaceRotateChromeWithBoundingBox', () => {
  it('should replace rotate-mode chrome with our oriented-bounding-box chrome', () => {
    const rotateModeBboxLine = lineGuide(
      [
        [-5, -5],
        [5, -5],
        [5, 5],
        [-5, 5],
        [-5, -5],
      ],
      {},
    );
    const rotateModeStem = lineGuide(
      [
        [0, 5],
        [0, 6],
      ],
      {},
    );
    const rotateHandle = pointGuide([0, 6], {
      guideType: 'editHandle',
      editHandleType: 'rotate',
    });
    const scaleHandles = [0, 1, 2, 3].map((index) =>
      pointGuide([0, 0], {
        guideType: 'editHandle',
        editHandleType: 'scale',
        positionIndexes: [index],
      }),
    );
    const vertexHandle = pointGuide([0.5, 0.5], {
      guideType: 'editHandle',
      editHandleType: 'existing',
    });

    const { features: result, scaleHandles: cornerHandles } =
      replaceRotateChromeWithBoundingBox(
        [
          rotateModeBboxLine,
          rotateModeStem,
          rotateHandle,
          ...scaleHandles,
          vertexHandle,
        ],
        makeBoundingBox(),
      );

    // Pass-through: vertex handle survives.
    expect(result).toContain(vertexHandle);

    // The rotate-mode chrome lines are gone.
    expect(result).not.toContain(rotateModeBboxLine);
    expect(result).not.toContain(rotateModeStem);

    // Exactly one bbox-outline LineString tagged with VERTEX_BBOX_MODE.
    const bboxOutlines = result.filter(
      (feature) =>
        feature.geometry.type === 'LineString' &&
        feature.properties?.mode === VERTEX_BBOX_MODE,
    );

    expect(bboxOutlines).toHaveLength(1);

    // Exactly one rotate-stem connector LineString.
    const stemConnectors = result.filter(
      (feature) =>
        feature.geometry.type === 'LineString' &&
        feature.properties?.mode === 'rotate-stem',
    );

    expect(stemConnectors).toHaveLength(1);

    // Four scale-handle Points, repositioned to the bounding box corners.
    const newScaleHandles = result.filter(
      (feature) =>
        feature.geometry.type === 'Point' &&
        feature.properties?.editHandleType === 'scale',
    );

    expect(newScaleHandles).toHaveLength(4);
    expect(
      (newScaleHandles[0] as Feature<GeoPoint>).geometry.coordinates,
    ).toEqual([-1, -1]);
    expect(
      (newScaleHandles[2] as Feature<GeoPoint>).geometry.coordinates,
    ).toEqual([1, 1]);

    // The same four corner handles are surfaced separately so callers
    // can patch the scale-mode corner cache without re-scanning.
    expect(cornerHandles).toHaveLength(4);
    expect(cornerHandles).toEqual(newScaleHandles);

    // One rotate handle Point at the stem tip.
    const newRotateHandles = result.filter(
      (feature) =>
        feature.geometry.type === 'Point' &&
        feature.properties?.editHandleType === 'rotate',
    );

    expect(newRotateHandles).toHaveLength(1);
    expect(
      (newRotateHandles[0] as Feature<GeoPoint>).geometry.coordinates,
    ).toEqual([0, 1.5]);
  });

  it('should preserve scale handles with out-of-range positionIndexes (defensive pass-through)', () => {
    const oddHandle = pointGuide([99, 99], {
      guideType: 'editHandle',
      editHandleType: 'scale',
      positionIndexes: [7],
    });

    const { features: result, scaleHandles: cornerHandles } =
      replaceRotateChromeWithBoundingBox([oddHandle], makeBoundingBox());

    expect(result).toContain(oddHandle);
    // Out-of-range positionIndex doesn't become a corner handle.
    expect(cornerHandles).toHaveLength(0);
  });
});

describe('resolveBoundingBoxGuides', () => {
  it('should strip rotate chrome and ignore the bounding box while rotating', () => {
    const rotateModeBboxLine = lineGuide(
      [
        [-5, -5],
        [5, -5],
        [5, 5],
        [-5, 5],
        [-5, -5],
      ],
      {},
    );
    const vertexHandle = pointGuide([0.5, 0.5], {
      guideType: 'editHandle',
      editHandleType: 'existing',
    });

    const { features, scaleHandles } = resolveBoundingBoxGuides(
      [rotateModeBboxLine, vertexHandle],
      makeBoundingBox(),
      true,
    );

    // The rotate-mode bbox line is stripped; the unrelated vertex handle stays.
    expect(features).toEqual([vertexHandle]);
    // Rotating never repositions corner handles.
    expect(scaleHandles).toEqual([]);
  });

  it('should return the filtered guides unchanged when there is no bounding box', () => {
    const vertexHandle = pointGuide([0.5, 0.5], {
      guideType: 'editHandle',
      editHandleType: 'existing',
    });
    const filtered = [vertexHandle];

    const { features, scaleHandles } = resolveBoundingBoxGuides(
      filtered,
      null,
      false,
    );

    expect(features).toBe(filtered);
    expect(scaleHandles).toEqual([]);
  });

  it('should replace rotate chrome with bounding box chrome in the default branch', () => {
    const rotateModeBboxLine = lineGuide(
      [
        [-5, -5],
        [5, -5],
        [5, 5],
        [-5, 5],
        [-5, -5],
      ],
      {},
    );
    const scaleHandlesInput = [0, 1, 2, 3].map((index) =>
      pointGuide([0, 0], {
        guideType: 'editHandle',
        editHandleType: 'scale',
        positionIndexes: [index],
      }),
    );

    const { features, scaleHandles } = resolveBoundingBoxGuides(
      [rotateModeBboxLine, ...scaleHandlesInput],
      makeBoundingBox(),
      false,
    );

    // Raw rotate-mode line is gone; a tagged bbox outline replaces it.
    expect(features).not.toContain(rotateModeBboxLine);

    const bboxOutlines = features.filter(
      (feature) =>
        feature.geometry.type === 'LineString' &&
        feature.properties?.mode === VERTEX_BBOX_MODE,
    );

    expect(bboxOutlines).toHaveLength(1);
    // The four corner handles are surfaced for the caller's cache sync.
    expect(scaleHandles).toHaveLength(4);
  });
});
