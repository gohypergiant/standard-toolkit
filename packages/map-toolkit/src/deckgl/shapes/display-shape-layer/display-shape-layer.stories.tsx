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
import { mockShapesWithIcons } from '../__fixtures__/mock-shapes-with-icons';
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
const WITH_ICONS_MAP_ID = uuid();

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

/**
 * Label positioning controls
 *
 * Demonstrates full control over label positioning for different geometry types.
 * Use vertical (top/middle/bottom) and horizontal (left/center/right) positioning
 * combined with pixel offsets to place labels exactly where you want them.
 *
 * Examples:
 * - Circle with label on top: vertical='top', horizontal='center'
 * - Circle with label on right: vertical='middle', horizontal='right'
 * - LineString with label above: vertical='top', horizontal='left'
 *
 * Priority system:
 * 1. Per-shape styleProperties (highest)
 * 2. Global labelOptions (these controls)
 * 3. Default values (fallback)
 */
const LABEL_POSITIONS_MAP_ID = uuid();

export const LabelPositioning: Story = {
  args: {
    // Point controls
    pointLabelVerticalAnchor: 'bottom',
    pointLabelHorizontalAnchor: 'center',
    pointLabelOffsetX: 0,
    pointLabelOffsetY: -45,
    // LineString controls
    lineStringLabelCoordinateAnchor: 'start',
    lineStringLabelVerticalAnchor: 'middle',
    lineStringLabelHorizontalAnchor: 'left',
    lineStringLabelOffsetX: 7,
    lineStringLabelOffsetY: -15,
    // Polygon controls
    polygonLabelCoordinateAnchor: 'start',
    polygonLabelVerticalAnchor: 'middle',
    polygonLabelHorizontalAnchor: 'left',
    polygonLabelOffsetX: 7,
    polygonLabelOffsetY: -15,
    // Circle controls
    circleLabelCoordinateAnchor: 'top',
    circleLabelVerticalAnchor: 'middle',
    circleLabelHorizontalAnchor: 'center',
    circleLabelOffsetX: 0,
    circleLabelOffsetY: -17,
  },
  argTypes: {
    // Point controls
    pointLabelVerticalAnchor: {
      control: { type: 'select' },
      options: ['top', 'middle', 'bottom'],
      description: 'Vertical anchor for Point labels',
    },
    pointLabelHorizontalAnchor: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Horizontal anchor for Point labels',
    },
    pointLabelOffsetX: {
      control: { type: 'number', min: -100, max: 100, step: 1 },
      description: 'Horizontal offset for Point labels (pixels)',
    },
    pointLabelOffsetY: {
      control: { type: 'number', min: -100, max: 100, step: 1 },
      description: 'Vertical offset for Point labels (pixels, negative = up)',
    },
    // LineString controls
    lineStringLabelCoordinateAnchor: {
      control: { type: 'select' },
      options: ['start', 'middle', 'end'],
      description: 'Position along LineString (start/middle/end)',
    },
    lineStringLabelVerticalAnchor: {
      control: { type: 'select' },
      options: ['top', 'middle', 'bottom'],
      description: 'Vertical anchor for LineString labels',
    },
    lineStringLabelHorizontalAnchor: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Horizontal anchor for LineString labels',
    },
    lineStringLabelOffsetX: {
      control: { type: 'number', min: -100, max: 100, step: 1 },
      description: 'Horizontal offset for LineString labels (pixels)',
    },
    lineStringLabelOffsetY: {
      control: { type: 'number', min: -100, max: 100, step: 1 },
      description:
        'Vertical offset for LineString labels (pixels, negative = up)',
    },
    // Polygon controls
    polygonLabelCoordinateAnchor: {
      control: { type: 'select' },
      options: ['start', 'middle', 'end'],
      description: 'Position along Polygon outer ring (start/middle/end)',
    },
    polygonLabelVerticalAnchor: {
      control: { type: 'select' },
      options: ['top', 'middle', 'bottom'],
      description: 'Vertical anchor for Polygon labels',
    },
    polygonLabelHorizontalAnchor: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Horizontal anchor for Polygon labels',
    },
    polygonLabelOffsetX: {
      control: { type: 'number', min: -100, max: 100, step: 1 },
      description: 'Horizontal offset for Polygon labels (pixels)',
    },
    polygonLabelOffsetY: {
      control: { type: 'number', min: -100, max: 100, step: 1 },
      description: 'Vertical offset for Polygon labels (pixels, negative = up)',
    },
    // Circle controls
    circleLabelCoordinateAnchor: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Position on Circle perimeter (top/right/bottom/left)',
    },
    circleLabelVerticalAnchor: {
      control: { type: 'select' },
      options: ['top', 'middle', 'bottom'],
      description: 'Vertical anchor for Circle labels',
    },
    circleLabelHorizontalAnchor: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Horizontal anchor for Circle labels',
    },
    circleLabelOffsetX: {
      control: { type: 'number', min: -100, max: 100, step: 1 },
      description: 'Horizontal offset for Circle labels (pixels)',
    },
    circleLabelOffsetY: {
      control: { type: 'number', min: -100, max: 100, step: 1 },
      description: 'Vertical offset for Circle labels (pixels, negative = up)',
    },
  },
  render: (args) => {
    const [selectedId, setSelectedId] = useState<ShapeId | undefined>();
    const emitDeselected = useEmit<ShapeDeselectedEvent>(
      ShapeEvents.deselected,
    );

    // Listen to shape selection events
    useOn<ShapeSelectedEvent>(ShapeEvents.selected, (event) => {
      setSelectedId(event.payload.shapeId);
    });

    // Listen to shape deselection events
    useOn<ShapeDeselectedEvent>(ShapeEvents.deselected, () => {
      setSelectedId(undefined);
    });

    // Listen to map clicks to detect clicks on empty space
    useOn<MapClickEvent>(MapEvents.click, (event) => {
      if (
        selectedId &&
        event.payload.id === LABEL_POSITIONS_MAP_ID &&
        event.payload.info.index === -1
      ) {
        emitDeselected(null);
      }
    });

    return (
      <div className='flex h-dvh w-dvw flex-col'>
        {/* Info banner */}
        <div className='bg-purple-600 p-3 text-white'>
          <div className='font-bold'>
            Interactive Label Positioning Controls
          </div>
          <div className='text-sm'>
            Use the Storybook controls panel to adjust label positions for each
            geometry type
          </div>
        </div>

        <BaseMap className='flex-1' id={LABEL_POSITIONS_MAP_ID}>
          <displayShapeLayer
            id='shapes-label-positioning'
            data={mockShapes}
            selectedShapeId={selectedId}
            showLabels={true}
            pickable={true}
            labelOptions={{
              pointLabelVerticalAnchor: args.pointLabelVerticalAnchor,
              pointLabelHorizontalAnchor: args.pointLabelHorizontalAnchor,
              pointLabelOffset: [
                args.pointLabelOffsetX,
                args.pointLabelOffsetY,
              ],
              lineStringLabelVerticalAnchor: args.lineStringLabelVerticalAnchor,
              lineStringLabelHorizontalAnchor:
                args.lineStringLabelHorizontalAnchor,
              lineStringLabelCoordinateAnchor:
                args.lineStringLabelCoordinateAnchor,
              lineStringLabelOffset: [
                args.lineStringLabelOffsetX,
                args.lineStringLabelOffsetY,
              ],
              polygonLabelVerticalAnchor: args.polygonLabelVerticalAnchor,
              polygonLabelHorizontalAnchor: args.polygonLabelHorizontalAnchor,
              polygonLabelCoordinateAnchor: args.polygonLabelCoordinateAnchor,
              polygonLabelOffset: [
                args.polygonLabelOffsetX,
                args.polygonLabelOffsetY,
              ],
              circleLabelVerticalAnchor: args.circleLabelVerticalAnchor,
              circleLabelHorizontalAnchor: args.circleLabelHorizontalAnchor,
              circleLabelCoordinateAnchor: args.circleLabelCoordinateAnchor,
              circleLabelOffset: [
                args.circleLabelOffsetX,
                args.circleLabelOffsetY,
              ],
            }}
          />
        </BaseMap>
      </div>
    );
  },
};

/**
 * Display with custom icons for Point geometries
 *
 * Demonstrates how to use icon atlases for Point shapes.
 * Icons are generated from design-toolkit SVGs using smeegl.
 *
 * To regenerate icons: pnpm build:icons
 */
export const WithIcons: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<ShapeId | undefined>();
    const emitDeselected = useEmit<ShapeDeselectedEvent>(
      ShapeEvents.deselected,
    );

    // Listen to shape selection events
    useOn<ShapeSelectedEvent>(ShapeEvents.selected, (event) => {
      setSelectedId(event.payload.shapeId);
    });

    // Listen to shape deselection events
    useOn<ShapeDeselectedEvent>(ShapeEvents.deselected, () => {
      setSelectedId(undefined);
    });

    // Listen to map clicks to detect clicks on empty space
    useOn<MapClickEvent>(MapEvents.click, (event) => {
      if (
        selectedId &&
        event.payload.id === WITH_ICONS_MAP_ID &&
        event.payload.info.index === -1
      ) {
        emitDeselected(null);
      }
    });

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={WITH_ICONS_MAP_ID}>
          <displayShapeLayer
            id='shapes-with-icons'
            data={mockShapesWithIcons}
            selectedShapeId={selectedId}
            showLabels={true}
            pickable={true}
          />
        </BaseMap>

        {/* Info panel */}
        <div className='absolute top-l left-l z-10 rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Icon Demo</p>
          <p className='mt-s text-body-s text-content-secondary'>
            Point shapes use custom marker icons
          </p>
          <p className='mt-xs text-body-s text-content-secondary'>
            from design-toolkit via icon atlas
          </p>
        </div>
      </div>
    );
  },
};
