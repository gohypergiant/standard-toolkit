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

import { useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { useState } from 'react';
import { BaseMap } from '../../base-map/index';
import { mockShapes } from '../__fixtures__/mock-shapes';
import { ShapeEvents, type ShapeSelectedEvent } from '../shared/events';
import './fiber';
import type { Meta, StoryObj } from '@storybook/react';
import type { ShapeId } from '../shared/types';

const meta: Meta = {
  title: 'DeckGL/Shapes/Display Shape Layer',
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stable ID for Storybook
const DISPLAY_MAP_ID = uuid();

/**
 * Basic display of shapes with all types
 *
 * Demonstrates automatic bus integration:
 * - Click a shape to select it (emits shapes:selected via bus automatically)
 * - The highlight layer responds to selection state
 * - Selection state can be controlled via the bus from anywhere in the app
 */
export const BasicDisplay: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<ShapeId | undefined>();
    const [eventLog, setEventLog] = useState<string[]>([]);

    // Listen to shape selection events emitted automatically by DisplayShapeLayer
    useOn<ShapeSelectedEvent>(ShapeEvents.selected, (event) => {
      const shapeId = event.payload.shapeId;
      setSelectedId(shapeId);
      setEventLog((log) => [
        ...log.slice(-4),
        `shapes:selected - ${shapeId.substring(0, 8)}...`,
      ]);
    });

    return (
      <div className='flex h-dvh w-dvw flex-col'>
        {/* Event log showing bus integration */}
        <div className='bg-gray-800 p-4 text-white'>
          <div className='mb-2 font-bold'>Bus Events (automatic):</div>
          <div className='space-y-1 font-mono text-sm'>
            {eventLog.length === 0 ? (
              <div className='text-gray-400'>
                Click a shape to see events...
              </div>
            ) : (
              eventLog.map((log) => (
                <div key={`${log}-${Date.now()}`} className='text-green-400'>
                  {log}
                </div>
              ))
            )}
          </div>
          {selectedId && (
            <div className='mt-2 text-sm'>
              Selected: {selectedId.substring(0, 8)}... (highlight layer active)
            </div>
          )}
        </div>

        <BaseMap className='flex-1' id={DISPLAY_MAP_ID}>
          <displayShapeLayer
            id='basic-shapes'
            data={mockShapes}
            selectedShapeId={selectedId}
            showLabels={true}
            pickable={true}
            onShapeHover={(shape) => {
              if (shape) {
                console.log('Shape hovered:', shape.name);
              }
            }}
          />
        </BaseMap>
      </div>
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

// Stable ID for custom offsets story
const CUSTOM_OFFSETS_MAP_ID = uuid();

/**
 * Custom label offsets (Point shapes only)
 *
 * Demonstrates how to customize the label offset for point markers
 * based on your icon size or design.
 *
 * Circle, LineString, and Polygon offsets use fixed values.
 */
export const CustomLabelOffsets: Story = {
  args: {
    pointOffsetX: 0,
    pointOffsetY: -40,
  },
  argTypes: {
    pointOffsetX: {
      control: { type: 'number', min: -100, max: 100, step: 1 },
      description: 'Horizontal offset for POINT labels only (pixels)',
    },
    pointOffsetY: {
      control: { type: 'number', min: -100, max: 100, step: 1 },
      description:
        'Vertical offset for POINT labels only (pixels, negative = up)',
    },
  },
  render: (args) => {
    return (
      <div className='flex h-dvh w-dvw flex-col'>
        {/* Info banner */}
        <div className='bg-blue-600 p-3 text-white'>
          <div className='font-bold'>
            Note: Controls only affect the Point shape label
          </div>
          <div className='text-sm'>
            Circle, LineString, and Polygon offsets use fixed values.
          </div>
        </div>

        <BaseMap className='flex-1' id={CUSTOM_OFFSETS_MAP_ID}>
          <displayShapeLayer
            id='shapes-custom-offsets'
            data={mockShapes}
            showLabels={true}
            pickable={true}
            labelOptions={{
              // Custom offset for point markers [x, y]
              // This only affects the Point shape label
              pointOffset: [args.pointOffsetX, args.pointOffsetY],
            }}
          />
        </BaseMap>
      </div>
    );
  },
};
