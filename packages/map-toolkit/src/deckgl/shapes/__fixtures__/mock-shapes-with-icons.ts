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
import { MAP_INTERACTION } from '../display-shape-layer/constants';
import { MARKER, MARKER_SERIOUS } from './atlas';
import ATLAS_JSON from './atlas.json';
import ATLAS_PNG from './atlas.png';
import type { DisplayShape } from '../shared/types';

/**
 * Mock shapes with icon configuration for Storybook examples
 * Demonstrates how to use icon atlases for Point geometries
 */
export const mockShapesWithIcons: DisplayShape[] = [
  // Point with icon
  {
    id: uuid(),
    name: 'Location Marker',
    label: 'Marker 1',
    shapeType: 'Point',
    feature: {
      type: 'Feature',
      properties: {
        styleProperties: {
          fillColor: [255, 255, 255, 255],
          strokeColor: [136, 138, 143, 255],
          strokeWidth: 2,
          strokePattern: 'solid',
          icon: {
            atlas: ATLAS_PNG,
            mapping: ATLAS_JSON,
            name: MARKER,
            size: MAP_INTERACTION.ICON_SIZE,
          },
          // Position label below icon
          labelOffset: [0, 10],
          labelVerticalAnchor: 'top',
          labelHorizontalAnchor: 'center',
        },
        shapeId: uuid(),
      },
      geometry: {
        type: 'Point',
        coordinates: [-79.35476906757644, 34.81657315443721],
      },
    },
    lastUpdated: Date.now(),
  },
  // Another Point with icon (serious/warning variant)
  {
    id: uuid(),
    name: 'Serious Marker',
    label: 'Serious',
    shapeType: 'Point',
    feature: {
      type: 'Feature',
      properties: {
        styleProperties: {
          fillColor: [230, 150, 0, 255],
          strokeColor: [230, 150, 0, 255],
          strokeWidth: 2,
          strokePattern: 'solid',
          icon: {
            atlas: ATLAS_PNG,
            mapping: ATLAS_JSON,
            name: MARKER_SERIOUS,
            size: MAP_INTERACTION.ICON_SIZE,
          },
          // Position label below icon
          labelOffset: [0, 10],
          labelVerticalAnchor: 'top',
          labelHorizontalAnchor: 'center',
        },
        shapeId: uuid(),
      },
      geometry: {
        type: 'Point',
        coordinates: [-74.46583143039219, 39.27006247796291],
      },
    },
    lastUpdated: Date.now(),
  },
  // LineString (no icon, uses standard rendering)
  {
    id: uuid(),
    name: 'Connection Line',
    label: 'Route',
    shapeType: 'LineString',
    feature: {
      type: 'Feature',
      properties: {
        styleProperties: {
          fillColor: [255, 255, 255, 255],
          strokeColor: [136, 138, 143, 255],
          strokeWidth: 2,
          strokePattern: 'dashed',
          // Position label at center of line to avoid overlap with point icons
          labelCoordinateAnchor: 'center',
        },
        shapeId: uuid(),
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-79.35476906757644, 34.81657315443721],
          [-74.46583143039219, 39.27006247796291],
        ],
      },
    },
    lastUpdated: Date.now(),
  },
];
