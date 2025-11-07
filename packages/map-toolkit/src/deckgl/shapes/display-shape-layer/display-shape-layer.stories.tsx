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

import { useEmit, useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { useState } from 'react';
import { MapEvents } from '../../base-map/events';
import { BaseMap } from '../../base-map/index';
import { mockShapes } from '../__fixtures__/mock-shapes';
import {
  type ShapeDeselectedEvent,
  ShapeEvents,
  type ShapeSelectedEvent,
} from '../shared/events';
import './fiber';
import type { Meta, StoryObj } from '@storybook/react';
import type { MapClickEvent } from '../../base-map/types';
import type { ShapeId } from '../shared/types';

const meta: Meta = {
  title: 'DeckGL/Shapes/Display Shape Layer',
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stable ID for Storybook
const DISPLAY_MAP_ID = uuid();
const WITHOUT_LABELS_MAP_ID = uuid();
const NON_INTERACTIVE_MAP_ID = uuid();

/**
 * Basic display of shapes with all types
 *
 * Demonstrates automatic bus integration:
 * - Click a shape to select it (emits shapes:selected via bus automatically)
 * - Click empty space to deselect (emits shapes:deselected via bus)
 * - The highlight layer responds to selection state
 * - Selection state can be controlled via the bus from anywhere in the app
 */
export const BasicDisplay: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<ShapeId | undefined>();
    const [selectedName, setSelectedName] = useState<string | undefined>();
    const [eventLog, setEventLog] = useState<
      Array<{ id: string; message: string }>
    >([]);
    const emitDeselected = useEmit<ShapeDeselectedEvent>(
      ShapeEvents.deselected,
    );

    // Listen to shape selection events emitted automatically by DisplayShapeLayer
    useOn<ShapeSelectedEvent>(ShapeEvents.selected, (event) => {
      const shapeId = event.payload.shapeId;
      const shape = mockShapes.find((s) => s.id === shapeId);
      const shapeName = shape?.name || 'Unknown';

      setSelectedId(shapeId);
      setSelectedName(shapeName);
      setEventLog((log) => [
        ...log.slice(-4),
        {
          id: `${Date.now()}-${shapeId}`,
          message: `shapes:selected - "${shapeName}" (${shapeId.substring(0, 8)}...)`,
        },
      ]);
    });

    // Listen to shape deselection events
    useOn<ShapeDeselectedEvent>(ShapeEvents.deselected, () => {
      setSelectedId(undefined);
      setSelectedName(undefined);
      setEventLog((log) => [
        ...log.slice(-4),
        {
          id: `${Date.now()}-deselected`,
          message: 'shapes:deselected',
        },
      ]);
    });

    // Listen to map clicks to detect clicks on empty space
    useOn<MapClickEvent>(MapEvents.click, (event) => {
      // Only emit deselect if we have a selection and clicked on empty space
      // index is -1 when nothing is picked
      if (
        selectedId &&
        event.payload.id === DISPLAY_MAP_ID &&
        event.payload.info.index === -1
      ) {
        emitDeselected(null);
      }
    });

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={DISPLAY_MAP_ID}>
          <displayShapeLayer
            id='basic-shapes'
            data={mockShapes}
            selectedShapeId={selectedId}
            showLabels={true}
            pickable={true}
          />
        </BaseMap>

        {/* Event log showing bus integration */}
        <div className='absolute top-l left-l z-10 flex max-h-[calc(100vh-2rem)] w-[320px] flex-col gap-l rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Shape Events</p>

          <div className='rounded-lg bg-info-muted p-s'>
            <p className='mb-xs text-body-xs'>Selected Shape</p>
            <code className='text-body-m'>{selectedName || 'None'}</code>
          </div>

          <div className='flex min-h-0 flex-1 flex-col'>
            <p className='mb-s font-semibold text-body-m'>Event Log</p>
            <div className='min-h-0 flex-1 overflow-y-auto rounded-lg border border-border-default bg-surface-subtle p-s'>
              {eventLog.length === 0 ? (
                <p className='text-body-xs text-content-disabled'>
                  Click a shape to see events...
                </p>
              ) : (
                eventLog.map((entry) => (
                  <p key={entry.id} className='mb-xs text-body-xs'>
                    {entry.message}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Display without labels
 */
export const WithoutLabels: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<ShapeId | undefined>();
    const emitDeselected = useEmit<ShapeDeselectedEvent>(
      ShapeEvents.deselected,
    );

    // Listen to shape selection events emitted automatically by DisplayShapeLayer
    useOn<ShapeSelectedEvent>(ShapeEvents.selected, (event) => {
      const shapeId = event.payload.shapeId;

      setSelectedId(shapeId);
    });

    // Listen to shape deselection events
    useOn<ShapeDeselectedEvent>(ShapeEvents.deselected, () => {
      setSelectedId(undefined);
    });

    // Listen to map clicks to detect clicks on empty space
    useOn<MapClickEvent>(MapEvents.click, (event) => {
      // Only emit deselect if we have a selection and clicked on empty space
      // index is -1 when nothing is picked
      if (
        selectedId &&
        event.payload.id === WITHOUT_LABELS_MAP_ID &&
        event.payload.info.index === -1
      ) {
        emitDeselected(null);
      }
    });

    return (
      <BaseMap className='h-dvh w-dvw' id={WITHOUT_LABELS_MAP_ID}>
        <displayShapeLayer
          id='shapes-no-labels'
          data={mockShapes}
          selectedShapeId={selectedId}
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
      <BaseMap className='h-dvh w-dvw' id={NON_INTERACTIVE_MAP_ID}>
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
    const [selectedId, setSelectedId] = useState<ShapeId | undefined>();

    // Listen to shape selection events emitted automatically by DisplayShapeLayer
    useOn<ShapeSelectedEvent>(ShapeEvents.selected, (event) => {
      setSelectedId(event.payload.shapeId);
    });

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
            selectedShapeId={selectedId}
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
