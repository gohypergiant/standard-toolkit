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
import { MARKER } from './atlas';
import ATLAS_JSON from './atlas.json';
import ATLAS_PNG from './atlas.png';
import type { EditableShape } from '../shared/types';

/**
 * Mock shapes with icon configuration for Storybook examples
 * Demonstrates how to use icon atlases for Point geometries
 */
export const mockShapesWithIcons: EditableShape[] = [
  // Point with icon
  {
    id: uuid(),
    name: 'Location Marker',
    label: 'Marker 1',
    locked: false,
    shapeType: 'Point',
    feature: {
      type: 'Feature',
      properties: {
        styleProperties: {
          fillColor: [98, 166, 255, 255],
          strokeColor: [98, 166, 255, 255],
          strokeWidth: 4,
          strokePattern: 'solid',
          icon: {
            atlas: ATLAS_PNG,
            mapping: ATLAS_JSON,
            name: MARKER,
            size: MAP_INTERACTION.ICON_SIZE,
          },
          // Position label above icon
          labelOffset: [0, -43],
          labelVerticalAnchor: 'bottom',
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
  // Another Point with icon
  {
    id: uuid(),
    name: 'Second Marker',
    label: 'Marker 2',
    locked: false,
    shapeType: 'Point',
    feature: {
      type: 'Feature',
      properties: {
        styleProperties: {
          fillColor: [48, 210, 126, 255],
          strokeColor: [48, 210, 126, 255],
          strokeWidth: 4,
          strokePattern: 'solid',
          icon: {
            atlas: ATLAS_PNG,
            mapping: ATLAS_JSON,
            name: MARKER,
            size: MAP_INTERACTION.ICON_SIZE,
          },
          // Position label above icon
          labelOffset: [0, -43],
          labelVerticalAnchor: 'bottom',
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
    locked: false,
    shapeType: 'LineString',
    feature: {
      type: 'Feature',
      properties: {
        styleProperties: {
          fillColor: [98, 166, 255, 255],
          strokeColor: [212, 35, 29, 255],
          strokeWidth: 4,
          strokePattern: 'dashed',
          // Custom label positioning to avoid collision with the line
          labelVerticalAnchor: 'bottom',
          labelHorizontalAnchor: 'right',
          labelCoordinateAnchor: 'middle',
          labelOffset: [0, -25],
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
