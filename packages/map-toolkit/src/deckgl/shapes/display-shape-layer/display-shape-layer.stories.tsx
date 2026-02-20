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

import { useEmit, useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { Button } from '@accelint/design-toolkit/components/button';
import { OptionsItem } from '@accelint/design-toolkit/components/options/item';
import { SelectField } from '@accelint/design-toolkit/components/select-field';
import { Slider } from '@accelint/design-toolkit/components/slider';
import { useEffect, useMemo, useState } from 'react';
import { CameraEventTypes } from '@/camera/events';
import { useMapCamera } from '@/camera/store';
import { useMapCursor } from '@/map-cursor/use-map-cursor';
import { BaseMap } from '../../base-map/index';
import { mockShapes } from '../__fixtures__/mock-shapes';
import { mockShapes3D } from '../__fixtures__/mock-shapes-3d';
import { mockShapesWithIcons } from '../__fixtures__/mock-shapes-with-icons';
import {
  type ShapeDeselectedEvent,
  ShapeEvents,
  type ShapeHoveredEvent,
  type ShapeSelectedEvent,
} from '../shared/events';
import type {
  CameraResetEvent,
  CameraSetPitchEvent,
  CameraSetProjectionEvent,
  CameraSetRotationEvent,
  CameraSetViewEvent,
  CameraSetZoomEvent,
  ProjectionType,
  ViewType,
} from '@/camera/types';
import './fiber';
import { useSelectShape } from './use-select-shape';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'DeckGL/Shapes/Display Shape Layer',
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stable ID for Storybook
const DISPLAY_MAP_ID = uuid();
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
export const BasicDisplayAndEvents: Story = {
  args: {
    showLabels: 'always',
    pickable: true,
    applyBaseOpacity: true,
    showHighlight: false,
    highlightColorR: 40,
    highlightColorG: 245,
    highlightColorB: 190,
    highlightColorA: 100,
  },
  argTypes: {
    showLabels: {
      control: { type: 'select' },
      options: ['always', 'hover', 'never'],
      description:
        'Label display mode: always (all shapes), hover (hovered shape only), or never (no labels)',
    },
    pickable: {
      control: { type: 'boolean' },
      description: 'Enable/disable shape clicking and hovering',
    },
    applyBaseOpacity: {
      control: { type: 'boolean' },
      description:
        'Multiply fill alpha by 0.2 (20% of original) for semi-transparent look',
    },
    showHighlight: {
      control: { type: 'boolean' },
      description:
        'Show/hide highlight effect around selected shapes (dotted border always shows)',
    },
    highlightColorR: {
      control: { type: 'number', min: 0, max: 255, step: 1 },
      description: 'Highlight color red channel (0-255)',
    },
    highlightColorG: {
      control: { type: 'number', min: 0, max: 255, step: 1 },
      description: 'Highlight color green channel (0-255)',
    },
    highlightColorB: {
      control: { type: 'number', min: 0, max: 255, step: 1 },
      description: 'Highlight color blue channel (0-255)',
    },
    highlightColorA: {
      control: { type: 'number', min: 0, max: 255, step: 1 },
      description: 'Highlight color alpha/opacity (0-255)',
    },
  },
  render: (args) => {
    // useSelectShape handles selection, deselection, and click-away deselection
    const { selectedId } = useSelectShape(DISPLAY_MAP_ID);
    const [eventLog, setEventLog] = useState<
      Array<{ id: string; message: string }>
    >([]);
    const { requestCursorChange, clearCursor } = useMapCursor(DISPLAY_MAP_ID);

    // Derive selected name from selectedId
    const selectedName = selectedId
      ? mockShapes.find((s) => s.id === selectedId)?.name
      : undefined;

    // Log selection events for demonstration purposes
    useOn<ShapeSelectedEvent>(ShapeEvents.selected, (event) => {
      if (event.payload.mapId !== DISPLAY_MAP_ID) {
        return;
      }
      const shape = mockShapes.find((s) => s.id === event.payload.shapeId);
      setEventLog((log) => [
        ...log.slice(-4),
        {
          id: `${Date.now()}-selected-${event.payload.shapeId}`,
          message: `shapes:selected - "${shape?.name || 'Unknown'}"`,
        },
      ]);
    });

    // Log deselection events
    useOn<ShapeDeselectedEvent>(ShapeEvents.deselected, (event) => {
      if (event.payload.mapId !== DISPLAY_MAP_ID) {
        return;
      }
      setEventLog((log) => [
        ...log.slice(-4),
        {
          id: `${Date.now()}-deselected`,
          message: 'shapes:deselected',
        },
      ]);
    });

    // Handle hover events for cursor changes and logging
    useOn<ShapeHoveredEvent>(ShapeEvents.hovered, (event) => {
      if (event.payload.mapId !== DISPLAY_MAP_ID) {
        return;
      }

      if (event.payload.shapeId) {
        requestCursorChange('pointer', 'display-shapes');
        const shape = mockShapes.find((s) => s.id === event.payload.shapeId);
        setEventLog((log) => [
          ...log.slice(-4),
          {
            id: `${Date.now()}-hovered-${event.payload.shapeId}`,
            message: `shapes:hovered - "${shape?.name || 'Unknown'}"`,
          },
        ]);
      } else {
        clearCursor('display-shapes');
        setEventLog((log) => [
          ...log.slice(-4),
          {
            id: `${Date.now()}-hover-end`,
            message: 'shapes:hovered - null (hover ended)',
          },
        ]);
      }
    });

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={DISPLAY_MAP_ID}>
          <displayShapeLayer
            id='basic-shapes'
            mapId={DISPLAY_MAP_ID}
            data={mockShapes3D}
            selectedShapeId={selectedId}
            showLabels={args.showLabels}
            pickable={args.pickable}
            applyBaseOpacity={args.applyBaseOpacity}
            showHighlight={args.showHighlight}
            highlightColor={[
              args.highlightColorR,
              args.highlightColorG,
              args.highlightColorB,
              args.highlightColorA,
            ]}
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
    pointLabelVerticalAnchor: 'top',
    pointLabelHorizontalAnchor: 'center',
    pointLabelOffsetX: 0,
    pointLabelOffsetY: 10,
    // LineString controls
    lineStringLabelCoordinateAnchor: 'bottom',
    lineStringLabelVerticalAnchor: 'top',
    lineStringLabelHorizontalAnchor: 'center',
    lineStringLabelOffsetX: 0,
    lineStringLabelOffsetY: 10,
    // Polygon controls
    polygonLabelCoordinateAnchor: 'bottom',
    polygonLabelVerticalAnchor: 'top',
    polygonLabelHorizontalAnchor: 'center',
    polygonLabelOffsetX: 0,
    polygonLabelOffsetY: 10,
    // Circle controls
    circleLabelCoordinateAnchor: 'bottom',
    circleLabelVerticalAnchor: 'top',
    circleLabelHorizontalAnchor: 'center',
    circleLabelOffsetX: 0,
    circleLabelOffsetY: 10,
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
      options: ['center', 'top', 'right', 'bottom', 'left'],
      description: 'Position on LineString (center or edge)',
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
      options: ['center', 'top', 'right', 'bottom', 'left'],
      description: 'Position on Polygon (center or edge)',
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
      options: ['center', 'top', 'right', 'bottom', 'left'],
      description: 'Position on Circle (center or perimeter)',
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
    // useSelectShape handles selection, deselection, and click-away deselection
    const { selectedId } = useSelectShape(LABEL_POSITIONS_MAP_ID);
    const { requestCursorChange, clearCursor } = useMapCursor(
      LABEL_POSITIONS_MAP_ID,
    );

    // Listen to shape hover events for cursor changes
    useOn<ShapeHoveredEvent>(ShapeEvents.hovered, (event) => {
      if (event.payload.mapId !== LABEL_POSITIONS_MAP_ID) {
        return;
      }
      if (event.payload.shapeId) {
        requestCursorChange('pointer', 'display-shapes');
      } else {
        clearCursor('display-shapes');
      }
    });

    // Memoize labelOptions to prevent unnecessary re-renders
    const labelOptions = useMemo(
      () => ({
        pointLabelVerticalAnchor: args.pointLabelVerticalAnchor,
        pointLabelHorizontalAnchor: args.pointLabelHorizontalAnchor,
        pointLabelOffset: [args.pointLabelOffsetX, args.pointLabelOffsetY] as [
          number,
          number,
        ],
        lineStringLabelVerticalAnchor: args.lineStringLabelVerticalAnchor,
        lineStringLabelHorizontalAnchor: args.lineStringLabelHorizontalAnchor,
        lineStringLabelCoordinateAnchor: args.lineStringLabelCoordinateAnchor,
        lineStringLabelOffset: [
          args.lineStringLabelOffsetX,
          args.lineStringLabelOffsetY,
        ] as [number, number],
        polygonLabelVerticalAnchor: args.polygonLabelVerticalAnchor,
        polygonLabelHorizontalAnchor: args.polygonLabelHorizontalAnchor,
        polygonLabelCoordinateAnchor: args.polygonLabelCoordinateAnchor,
        polygonLabelOffset: [
          args.polygonLabelOffsetX,
          args.polygonLabelOffsetY,
        ] as [number, number],
        circleLabelVerticalAnchor: args.circleLabelVerticalAnchor,
        circleLabelHorizontalAnchor: args.circleLabelHorizontalAnchor,
        circleLabelCoordinateAnchor: args.circleLabelCoordinateAnchor,
        circleLabelOffset: [
          args.circleLabelOffsetX,
          args.circleLabelOffsetY,
        ] as [number, number],
      }),
      [
        args.pointLabelVerticalAnchor,
        args.pointLabelHorizontalAnchor,
        args.pointLabelOffsetX,
        args.pointLabelOffsetY,
        args.lineStringLabelVerticalAnchor,
        args.lineStringLabelHorizontalAnchor,
        args.lineStringLabelCoordinateAnchor,
        args.lineStringLabelOffsetX,
        args.lineStringLabelOffsetY,
        args.polygonLabelVerticalAnchor,
        args.polygonLabelHorizontalAnchor,
        args.polygonLabelCoordinateAnchor,
        args.polygonLabelOffsetX,
        args.polygonLabelOffsetY,
        args.circleLabelVerticalAnchor,
        args.circleLabelHorizontalAnchor,
        args.circleLabelCoordinateAnchor,
        args.circleLabelOffsetX,
        args.circleLabelOffsetY,
      ],
    );

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={LABEL_POSITIONS_MAP_ID}>
          <displayShapeLayer
            id='shapes-label-positioning'
            mapId={LABEL_POSITIONS_MAP_ID}
            data={mockShapes}
            selectedShapeId={selectedId}
            showLabels='always'
            pickable={true}
            applyBaseOpacity={true}
            labelOptions={labelOptions}
          />
        </BaseMap>

        {/* Info banner */}
        <div className='absolute top-l left-l z-10 rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Label Positioning</p>
          <p className='mt-s text-body-s text-content-secondary'>
            Use the Storybook controls panel to adjust
          </p>
          <p className='mt-xs text-body-s text-content-secondary'>
            label positions for each geometry type
          </p>
        </div>
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
export const WithPointIcons: Story = {
  render: () => {
    // useSelectShape handles selection, deselection, and click-away deselection
    const { selectedId } = useSelectShape(WITH_ICONS_MAP_ID);
    const { requestCursorChange, clearCursor } =
      useMapCursor(WITH_ICONS_MAP_ID);

    // Listen to shape hover events for cursor changes
    useOn<ShapeHoveredEvent>(ShapeEvents.hovered, (event) => {
      if (event.payload.mapId !== WITH_ICONS_MAP_ID) {
        return;
      }
      if (event.payload.shapeId) {
        requestCursorChange('pointer', 'display-shapes');
      } else {
        clearCursor('display-shapes');
      }
    });

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={WITH_ICONS_MAP_ID}>
          <displayShapeLayer
            id='shapes-with-icons'
            mapId={WITH_ICONS_MAP_ID}
            data={mockShapesWithIcons}
            selectedShapeId={selectedId}
            showLabels='always'
            pickable={true}
            applyBaseOpacity={true}
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

/**
 * Camera control panel for 3D shape stories.
 * Provides full camera controls like the camera story.
 */
function ShapesCameraControls({
  mapId,
}: {
  mapId: import('@accelint/core').UniqueId;
}) {
  const setZoom = useEmit<CameraSetZoomEvent>(CameraEventTypes.setZoom);
  const setPitch = useEmit<CameraSetPitchEvent>(CameraEventTypes.setPitch);
  const setRotation = useEmit<CameraSetRotationEvent>(
    CameraEventTypes.setRotation,
  );
  const setProjection = useEmit<CameraSetProjectionEvent>(
    CameraEventTypes.setProjection,
  );
  const resetCamera = useEmit<CameraResetEvent>(CameraEventTypes.reset);
  const setView = useEmit<CameraSetViewEvent>(CameraEventTypes.setView);
  const { cameraState } = useMapCamera(mapId);

  return (
    <div className='absolute top-l left-l flex w-[280px] flex-col gap-l rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
      <div>
        <p className='font-bold text-header-l'>3D Shapes with Elevation</p>
        <p className='mt-xs text-body-s text-content-secondary'>
          Shapes with MSL elevation coordinates
        </p>
      </div>

      <div className='flex flex-col gap-s'>
        <p className='font-bold text-body-m'>Camera Controls</p>

        <Button
          variant='filled'
          color='mono-muted'
          onPress={() => resetCamera({ id: mapId })}
          className='w-full'
        >
          Reset Camera
        </Button>

        <Slider
          label='Zoom'
          showLabel
          showInput
          value={cameraState.zoom}
          minValue={0}
          maxValue={22}
          layout='stack'
          onChange={(value) => {
            const zoom = typeof value === 'number' ? value : (value[0] ?? 0);
            setZoom({ id: mapId, zoom });
          }}
        />

        <Slider
          label='Pitch'
          showLabel
          showInput
          value={cameraState.pitch}
          isDisabled={cameraState.view !== '2.5D'}
          minValue={0}
          maxValue={65}
          layout='stack'
          onChange={(value) => {
            const pitch = typeof value === 'number' ? value : (value[0] ?? 0);
            setPitch({ id: mapId, pitch });
          }}
        />

        <Slider
          label='Rotation'
          showLabel
          showInput
          value={cameraState.rotation}
          minValue={0}
          maxValue={360}
          layout='stack'
          onChange={(value) => {
            const rotation =
              typeof value === 'number' ? value : (value[0] ?? 0);
            setRotation({ id: mapId, rotation });
          }}
        />

        <SelectField
          label='Projection'
          value={cameraState.projection}
          onChange={(value) => {
            setProjection({ id: mapId, projection: value as ProjectionType });
          }}
        >
          <OptionsItem id='mercator'>Mercator</OptionsItem>
          <OptionsItem id='globe'>Globe</OptionsItem>
        </SelectField>

        <SelectField
          label='View'
          value={cameraState.view}
          onChange={(value) => {
            setView({ id: mapId, view: value as ViewType });
          }}
        >
          <OptionsItem id='2D'>2D</OptionsItem>
          <OptionsItem id='2.5D'>2.5D</OptionsItem>
          <OptionsItem id='3D'>3D</OptionsItem>
        </SelectField>
      </div>
    </div>
  );
}

/**
 * Display shapes with 3D coordinates in 2.5D view (mercator + pitch)
 *
 * Demonstrates shapes with elevation rendered in 2.5D view:
 * - Uses mockShapes3D with elevation coordinates (MSL in meters)
 * - Camera set to 2.5D view mode (mercator projection with ~45° pitch)
 * - Shapes at different elevations: Circle (13000m), LineString (varying 20000-40000m),
 *   Point (1500m), Polygon (22500m), Rectangle (34000m), Ellipse (43500m)
 * - Full camera controls for interactive exploration
 */
const DISPLAY_25D_MAP_ID_INNER = uuid();

export const DisplayShapes25D: Story = {
  render: () => {
    const setView = useEmit<CameraSetViewEvent>(CameraEventTypes.setView);
    const { selectedId } = useSelectShape(DISPLAY_25D_MAP_ID_INNER);
    const { requestCursorChange, clearCursor } = useMapCursor(
      DISPLAY_25D_MAP_ID_INNER,
    );

    // Set camera to 2.5D view after map loads
    useEffect(() => {
      // Delay to ensure MapLibre style is loaded before changing view
      const timeout = setTimeout(() => {
        setView({
          id: DISPLAY_25D_MAP_ID_INNER,
          view: '2.5D',
        });
      }, 500);

      return () => clearTimeout(timeout);
    }, [setView]);

    // Handle hover events for cursor changes
    useOn<ShapeHoveredEvent>(ShapeEvents.hovered, (event) => {
      if (event.payload.mapId !== DISPLAY_25D_MAP_ID_INNER) {
        return;
      }
      if (event.payload.shapeId) {
        requestCursorChange('pointer', 'display-shapes-25d');
      } else {
        clearCursor('display-shapes-25d');
      }
    });

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={DISPLAY_25D_MAP_ID_INNER}>
          <displayShapeLayer
            id='shapes-25d'
            mapId={DISPLAY_25D_MAP_ID_INNER}
            data={mockShapes3D}
            selectedShapeId={selectedId}
            showLabels='always'
            pickable={true}
            applyBaseOpacity={true}
            enableElevation={true}
          />
        </BaseMap>

        <ShapesCameraControls mapId={DISPLAY_25D_MAP_ID_INNER} />
      </div>
    );
  },
};

/**
 * Display shapes with 3D coordinates on 3D globe
 *
 * Demonstrates shapes with elevation rendered on 3D globe:
 * - Uses mockShapes3D with elevation coordinates (MSL in meters)
 * - Camera set to 3D view mode (globe projection)
 * - Shapes render on globe surface with elevation
 * - Tests shapes at various latitudes/longitudes
 * - Verifies GeoJsonLayer auto-adapts to globe projection
 */
const DISPLAY_3D_MAP_ID_INNER = uuid();

export const DisplayShapes3D: Story = {
  render: () => {
    const setView = useEmit<CameraSetViewEvent>(CameraEventTypes.setView);
    const { selectedId } = useSelectShape(DISPLAY_3D_MAP_ID_INNER);
    const { requestCursorChange, clearCursor } = useMapCursor(
      DISPLAY_3D_MAP_ID_INNER,
    );

    // Set camera to 3D view after map loads
    useEffect(() => {
      // Delay to ensure MapLibre style is loaded before changing to globe projection
      const timeout = setTimeout(() => {
        setView({
          id: DISPLAY_3D_MAP_ID_INNER,
          view: '3D',
        });
      }, 500);

      return () => clearTimeout(timeout);
    }, [setView]);

    // Handle hover events for cursor changes
    useOn<ShapeHoveredEvent>(ShapeEvents.hovered, (event) => {
      if (event.payload.mapId !== DISPLAY_3D_MAP_ID_INNER) {
        return;
      }
      if (event.payload.shapeId) {
        requestCursorChange('pointer', 'display-shapes-3d');
      } else {
        clearCursor('display-shapes-3d');
      }
    });

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={DISPLAY_3D_MAP_ID_INNER}>
          <displayShapeLayer
            id='shapes-3d'
            mapId={DISPLAY_3D_MAP_ID_INNER}
            data={mockShapes3D}
            selectedShapeId={selectedId}
            showLabels='always'
            pickable={true}
            applyBaseOpacity={true}
            enableElevation={true}
          />
        </BaseMap>
      </div>
    );
  },
};
