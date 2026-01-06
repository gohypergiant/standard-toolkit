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
import { Button } from '@accelint/design-toolkit';
import { useState } from 'react';
import { useMapCursor } from '../../../map-cursor';
import { BaseMap } from '../../base-map/index';
import { mockShapes } from '../__fixtures__/mock-shapes';
import { useShapeSelection } from '../display-shape-layer/use-shape-selection';
import { ShapeEvents } from '../shared/events';
import { ShapeFeatureType } from '../shared/types';
import type { ShapeHoveredEvent } from '../shared/events';
import type { Shape } from '../shared/types';
import '../display-shape-layer/fiber';
import './fiber';
import { DrawShapeLayer } from './index';
import { useDrawShapes } from './use-draw-shapes';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'DeckGL/Shapes/Draw Shape Layer',
};

export default meta;
type Story = StoryObj<typeof meta>;

// Use fixture shapes with unique IDs for each story render
function createSampleShapes(): Shape[] {
  return mockShapes.map((shape) => ({
    ...shape,
    id: uuid(),
    lastUpdated: Date.now(),
  }));
}

// Stable ID for Storybook
const DRAW_MAP_ID = uuid();

/**
 * Basic shape drawing demonstration
 *
 * This story demonstrates:
 * - Drawing all 6 shape types (Point, LineString, Polygon, Rectangle, Circle, Ellipse)
 * - Real-time distance/area tooltips during drawing
 * - Protected drawing mode (drawing cannot be interrupted by other mode requests)
 * - Displaying drawn shapes with DisplayShapeLayer
 *
 * Instructions:
 * 1. Click a shape type button to start drawing
 * 2. Click on the map to place points
 * 3. For polygons/rectangles: double-click or click the starting point to complete
 * 4. For lines: double-click to complete
 * 5. For circles: click center, then click to set radius
 * 6. For ellipses: click two points for major axis, then click for minor axis
 * 7. Press ESC or click Cancel to abort drawing
 */
export const BasicDrawing: Story = {
  render: () => {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [eventLog, setEventLog] = useState<
      Array<{ id: string; message: string }>
    >([]);

    // Subscribe to cursor store to enable cursor change requests
    const { cursor } = useMapCursor(DRAW_MAP_ID);

    const { draw, cancel, isDrawing, activeShapeType } = useDrawShapes(
      DRAW_MAP_ID,
      {
        onCreate: (shape) => {
          setShapes((prev) => [...prev, shape]);
          setEventLog((log) => [
            ...log.slice(-9),
            {
              id: `${Date.now()}-created`,
              message: `Created: ${shape.shapeType} "${shape.name}"`,
            },
          ]);
        },
        onCancel: (shapeType) => {
          setEventLog((log) => [
            ...log.slice(-9),
            {
              id: `${Date.now()}-canceled`,
              message: `Canceled: ${shapeType}`,
            },
          ]);
        },
      },
    );

    const handleClearShapes = () => {
      setShapes([]);
      setEventLog((log) => [
        ...log.slice(-9),
        { id: `${Date.now()}-cleared`, message: 'Cleared all shapes' },
      ]);
    };

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={DRAW_MAP_ID}>
          {/* Display previously drawn shapes */}
          <displayShapeLayer
            id='drawn-shapes'
            mapId={DRAW_MAP_ID}
            data={shapes}
            showLabels
            pickable={false}
          />
          {/* Drawing layer - renders only when actively drawing */}
          <DrawShapeLayer mapId={DRAW_MAP_ID} />
        </BaseMap>

        {/* Drawing toolbar */}
        <div className='absolute top-l left-l z-10 flex max-h-[calc(100%-2rem)] w-[320px] flex-col gap-l overflow-y-auto rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Draw Shapes</p>

          {/* Status indicator */}
          <div className='rounded-lg bg-info-muted p-s'>
            <p className='mb-xs text-body-xs'>Status</p>
            <code className='text-body-m'>
              {isDrawing ? `Drawing: ${activeShapeType}` : 'Ready'}
            </code>
            <p className='mt-xs text-body-xs'>
              Cursor: <code>{cursor}</code>
            </p>
          </div>

          {/* Shape type buttons */}
          <div className='flex flex-col gap-s'>
            <p className='font-semibold text-body-s'>Shape Types</p>
            <div className='grid grid-cols-2 gap-s'>
              <Button
                variant={
                  activeShapeType === ShapeFeatureType.Point
                    ? 'filled'
                    : 'outline'
                }
                color={
                  activeShapeType === ShapeFeatureType.Point
                    ? 'accent'
                    : 'mono-muted'
                }
                onPress={() => draw(ShapeFeatureType.Point)}
                isDisabled={isDrawing}
              >
                Point
              </Button>
              <Button
                variant={
                  activeShapeType === ShapeFeatureType.LineString
                    ? 'filled'
                    : 'outline'
                }
                color={
                  activeShapeType === ShapeFeatureType.LineString
                    ? 'accent'
                    : 'mono-muted'
                }
                onPress={() => draw(ShapeFeatureType.LineString)}
                isDisabled={isDrawing}
              >
                Line
              </Button>
              <Button
                variant={
                  activeShapeType === ShapeFeatureType.Polygon
                    ? 'filled'
                    : 'outline'
                }
                color={
                  activeShapeType === ShapeFeatureType.Polygon
                    ? 'accent'
                    : 'mono-muted'
                }
                onPress={() => draw(ShapeFeatureType.Polygon)}
                isDisabled={isDrawing}
              >
                Polygon
              </Button>
              <Button
                variant={
                  activeShapeType === ShapeFeatureType.Rectangle
                    ? 'filled'
                    : 'outline'
                }
                color={
                  activeShapeType === ShapeFeatureType.Rectangle
                    ? 'accent'
                    : 'mono-muted'
                }
                onPress={() => draw(ShapeFeatureType.Rectangle)}
                isDisabled={isDrawing}
              >
                Rectangle
              </Button>
              <Button
                variant={
                  activeShapeType === ShapeFeatureType.Circle
                    ? 'filled'
                    : 'outline'
                }
                color={
                  activeShapeType === ShapeFeatureType.Circle
                    ? 'accent'
                    : 'mono-muted'
                }
                onPress={() => draw(ShapeFeatureType.Circle)}
                isDisabled={isDrawing}
              >
                Circle
              </Button>
              <Button
                variant={
                  activeShapeType === ShapeFeatureType.Ellipse
                    ? 'filled'
                    : 'outline'
                }
                color={
                  activeShapeType === ShapeFeatureType.Ellipse
                    ? 'accent'
                    : 'mono-muted'
                }
                onPress={() => draw(ShapeFeatureType.Ellipse)}
                isDisabled={isDrawing}
              >
                Ellipse
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex gap-s'>
            <Button
              variant='outline'
              color='critical'
              onPress={cancel}
              isDisabled={!isDrawing}
              className='flex-1'
            >
              Cancel (ESC)
            </Button>
            <Button
              variant='outline'
              color='mono-muted'
              onPress={handleClearShapes}
              isDisabled={shapes.length === 0}
              className='flex-1'
            >
              Clear All
            </Button>
          </div>

          {/* Event log */}
          <div className='flex flex-col'>
            <p className='mb-s font-semibold text-body-s'>
              Event Log ({shapes.length} shapes)
            </p>
            <div className='h-[100px] overflow-y-auto rounded-lg border border-border-default bg-surface-subtle p-s'>
              {eventLog.length === 0 ? (
                <p className='text-body-xs text-content-disabled'>
                  Click a shape type to start drawing...
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

          {/* Instructions */}
          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>Drawing Tips:</p>
            <ul className='list-inside list-disc space-y-xs text-body-xs text-content-secondary'>
              <li>Point: Single click</li>
              <li>Line: Click points, double-click to finish</li>
              <li>Polygon: Click points, close loop to finish</li>
              <li>Rectangle: Click two corners (Shift for square)</li>
              <li>Circle: Click center, then click to set radius</li>
              <li>Ellipse: Click two points for axis, then set width</li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Drawing with custom style defaults
 *
 * Demonstrates passing style defaults when initiating drawing.
 * The tentative shape and final shape will use these colors.
 */
const CUSTOM_STYLES_MAP_ID = uuid();

export const CustomStyleDefaults: Story = {
  render: () => {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedColor, setSelectedColor] = useState<
      'red' | 'blue' | 'green'
    >('red');

    const colorStyles = {
      red: {
        fillColor: [255, 100, 100, 180] as [number, number, number, number],
        strokeColor: [200, 0, 0, 255] as [number, number, number, number],
      },
      blue: {
        fillColor: [100, 100, 255, 180] as [number, number, number, number],
        strokeColor: [0, 0, 200, 255] as [number, number, number, number],
      },
      green: {
        fillColor: [100, 255, 100, 180] as [number, number, number, number],
        strokeColor: [0, 200, 0, 255] as [number, number, number, number],
      },
    };

    // Subscribe to cursor store to enable cursor change requests
    useMapCursor(CUSTOM_STYLES_MAP_ID);

    const { draw, cancel, isDrawing } = useDrawShapes(CUSTOM_STYLES_MAP_ID, {
      onCreate: (shape) => {
        setShapes((prev) => [...prev, shape]);
      },
    });

    const handleDrawWithColor = (shapeType: ShapeFeatureType) => {
      draw(shapeType, { styleDefaults: colorStyles[selectedColor] });
    };

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={CUSTOM_STYLES_MAP_ID}>
          <displayShapeLayer
            id='colored-shapes'
            mapId={CUSTOM_STYLES_MAP_ID}
            data={shapes}
            showLabels
            pickable={false}
          />
          <DrawShapeLayer mapId={CUSTOM_STYLES_MAP_ID} />
        </BaseMap>

        <div className='absolute top-l left-l z-10 flex w-[280px] flex-col gap-l rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Custom Colors</p>

          {/* Color selector */}
          <div className='flex gap-s'>
            <Button
              variant={selectedColor === 'red' ? 'filled' : 'outline'}
              color={selectedColor === 'red' ? 'critical' : 'mono-muted'}
              onPress={() => setSelectedColor('red')}
            >
              Red
            </Button>
            <Button
              variant={selectedColor === 'blue' ? 'filled' : 'outline'}
              color={selectedColor === 'blue' ? 'accent' : 'mono-muted'}
              onPress={() => setSelectedColor('blue')}
            >
              Blue
            </Button>
            <Button
              variant={selectedColor === 'green' ? 'filled' : 'outline'}
              color={selectedColor === 'green' ? 'serious' : 'mono-muted'}
              onPress={() => setSelectedColor('green')}
            >
              Green
            </Button>
          </div>

          {/* Shape buttons */}
          <div className='flex flex-col gap-s'>
            <Button
              variant='outline'
              onPress={() => handleDrawWithColor(ShapeFeatureType.Polygon)}
              isDisabled={isDrawing}
            >
              Draw {selectedColor} Polygon
            </Button>
            <Button
              variant='outline'
              onPress={() => handleDrawWithColor(ShapeFeatureType.Circle)}
              isDisabled={isDrawing}
            >
              Draw {selectedColor} Circle
            </Button>
          </div>

          {isDrawing && (
            <Button variant='outline' color='critical' onPress={cancel}>
              Cancel
            </Button>
          )}

          <p className='text-body-xs text-content-secondary'>
            Shapes: {shapes.length}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Combined Display and Draw
 *
 * Shows how DrawShapeLayer works alongside existing shapes in DisplayShapeLayer.
 * This is the typical real-world usage pattern.
 */
const COMBINED_MAP_ID = uuid();

export const CombinedDisplayAndDraw: Story = {
  render: () => {
    // Start with pre-existing shapes from fixtures
    const [shapes, setShapes] = useState<Shape[]>(createSampleShapes);

    // Subscribe to cursor store and shape selection
    const { requestCursorChange, clearCursor } = useMapCursor(COMBINED_MAP_ID);
    const { selectedId } = useShapeSelection(COMBINED_MAP_ID);

    const { draw, cancel, isDrawing, activeShapeType } = useDrawShapes(
      COMBINED_MAP_ID,
      {
        onCreate: (shape) => {
          setShapes((prev) => [...prev, shape]);
          // Log shape for fixture capture
          console.log('Shape created:', JSON.stringify(shape, null, 2));
        },
      },
    );

    // Handle hover events for cursor changes on existing shapes
    useOn<ShapeHoveredEvent>(ShapeEvents.hovered, (event) => {
      if (event.payload.mapId !== COMBINED_MAP_ID) {
        return;
      }
      if (isDrawing) {
        return; // Don't change cursor while drawing
      }

      if (event.payload.shapeId) {
        requestCursorChange('pointer', 'display-shapes');
      } else {
        clearCursor('display-shapes');
      }
    });

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={COMBINED_MAP_ID}>
          <displayShapeLayer
            id='all-shapes'
            mapId={COMBINED_MAP_ID}
            data={shapes}
            showLabels
            pickable={!isDrawing}
            selectedShapeId={selectedId}
          />
          <DrawShapeLayer mapId={COMBINED_MAP_ID} />
        </BaseMap>

        <div className='absolute top-l left-l z-10 flex w-[260px] flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Add Shapes</p>

          <p className='text-body-xs text-content-secondary'>
            {shapes.length} shape{shapes.length !== 1 ? 's' : ''} on map
          </p>

          <div className='flex flex-wrap gap-s'>
            <Button
              size='small'
              variant='outline'
              onPress={() => draw(ShapeFeatureType.Point)}
              isDisabled={isDrawing}
            >
              + Point
            </Button>
            <Button
              size='small'
              variant='outline'
              onPress={() => draw(ShapeFeatureType.LineString)}
              isDisabled={isDrawing}
            >
              + Line
            </Button>
            <Button
              size='small'
              variant='outline'
              onPress={() => draw(ShapeFeatureType.Polygon)}
              isDisabled={isDrawing}
            >
              + Polygon
            </Button>
            <Button
              size='small'
              variant='outline'
              onPress={() => draw(ShapeFeatureType.Rectangle)}
              isDisabled={isDrawing}
            >
              + Rectangle
            </Button>
            <Button
              size='small'
              variant='outline'
              onPress={() => draw(ShapeFeatureType.Circle)}
              isDisabled={isDrawing}
            >
              + Circle
            </Button>
            <Button
              size='small'
              variant='outline'
              onPress={() => draw(ShapeFeatureType.Ellipse)}
              isDisabled={isDrawing}
            >
              + Ellipse
            </Button>
          </div>

          {isDrawing && (
            <div className='flex items-center gap-s'>
              <span className='text-body-xs'>Drawing {activeShapeType}...</span>
              <Button
                size='small'
                variant='flat'
                color='critical'
                onPress={cancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  },
};
