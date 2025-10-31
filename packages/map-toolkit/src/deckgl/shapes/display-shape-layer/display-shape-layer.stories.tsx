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
import { useState } from 'react';
import { BaseMap } from '../../base-map/index';
import './fiber';
import { DEFAULT_STYLE_PROPERTIES } from '../shared/constants';
import type { Meta, StoryObj } from '@storybook/react';
import type { EditableShape, ShapeId } from '../shared/types';

const meta: Meta = {
  title: 'DeckGL/Shapes/Display Shape Layer',
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stable ID for Storybook
const DISPLAY_MAP_ID = uuid();

// Mock shapes data
const mockShapes: EditableShape[] = [
  // Circle shape
  {
    id: uuid(),
    name: 'Sample Circle',
    label: 'Circle',
    shapeType: 'Circle',
    locked: false,
    feature: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.0, 38.9],
            [-76.95, 38.95],
            [-76.9, 38.9],
            [-76.95, 38.85],
            [-77.0, 38.9],
          ],
        ],
      },
      properties: {
        styleProperties: {
          ...DEFAULT_STYLE_PROPERTIES,
          fillColor: '#62a6ff',
          strokeColor: '#62a6ff',
        },
        shapeId: uuid(),
        editProperties: {
          center: [-76.95, 38.9],
          radius: { value: 5, units: 'kilometers' },
        },
      },
    },
  },
  // Polygon shape
  {
    id: uuid(),
    name: 'Sample Polygon',
    label: 'Polygon',
    shapeType: 'Polygon',
    locked: false,
    feature: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.1, 39.0],
            [-77.0, 39.0],
            [-77.0, 38.95],
            [-77.1, 38.95],
            [-77.1, 39.0],
          ],
        ],
      },
      properties: {
        styleProperties: {
          ...DEFAULT_STYLE_PROPERTIES,
          fillColor: '#30D27E',
          strokeColor: '#30D27E',
        },
        shapeId: uuid(),
      },
    },
  },
  // LineString shape
  {
    id: uuid(),
    name: 'Sample Line',
    label: 'Line',
    shapeType: 'LineString',
    locked: false,
    feature: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [-76.8, 38.85],
          [-76.85, 38.9],
          [-76.9, 38.85],
        ],
      },
      properties: {
        styleProperties: {
          ...DEFAULT_STYLE_PROPERTIES,
          strokeColor: '#FCA400',
          strokeWidth: 4,
        },
        shapeId: uuid(),
      },
    },
  },
  // Point shape
  {
    id: uuid(),
    name: 'Sample Point',
    label: 'Point',
    shapeType: 'Point',
    locked: false,
    feature: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-76.75, 38.95],
      },
      properties: {
        styleProperties: {
          ...DEFAULT_STYLE_PROPERTIES,
          strokeColor: '#D4231D',
        },
        shapeId: uuid(),
      },
    },
  },
];

/**
 * Basic display of shapes with all types
 */
export const BasicDisplay: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<ShapeId | undefined>();

    return (
      <BaseMap className='h-dvh w-dvw' id={DISPLAY_MAP_ID}>
        <displayShapeLayer
          id='basic-shapes'
          data={mockShapes}
          selectedShapeId={selectedId}
          showLabels={true}
          pickable={true}
          onShapeClick={(shape) => {
            console.log('Shape clicked:', shape);
            setSelectedId(shape.id);
          }}
          onShapeHover={(shape) => {
            if (shape) {
              console.log('Shape hovered:', shape.name);
            }
          }}
        />
      </BaseMap>
    );
  },
};

/**
 * Display without labels
 */
export const WithoutLabels: Story = {
  render: () => {
    return (
      <BaseMap className='h-dvh w-dvw' id={uuid()}>
        <displayShapeLayer
          id='shapes-no-labels'
          data={mockShapes}
          showLabels={false}
          pickable={true}
        />
      </BaseMap>
    );
  },
};

/**
 * Non-interactive display (not pickable)
 */
export const NonInteractive: Story = {
  render: () => {
    return (
      <BaseMap className='h-dvh w-dvw' id={uuid()}>
        <displayShapeLayer
          id='shapes-static'
          data={mockShapes}
          showLabels={true}
          pickable={false}
        />
      </BaseMap>
    );
  },
};
