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
import '../draw-shape-layer/fiber';
import { DrawShapeLayer } from '../draw-shape-layer/index';
import { useDrawShapes } from '../draw-shape-layer/use-draw-shapes';
import { ShapeEvents } from '../shared/events';
import { ShapeFeatureType } from '../shared/types';
import type { ShapeHoveredEvent, ShapeSelectedEvent } from '../shared/events';
import type { DisplayShape } from '../shared/types';
import '../display-shape-layer/fiber';
import './fiber';
import { EditShapeLayer } from './index';
import { useEditShape } from './use-edit-shape';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'DeckGL/Shapes/Edit Shape Layer',
};

export default meta;
type Story = StoryObj<typeof meta>;

// Use fixture shapes with unique IDs for each story render
function createSampleShapes(): DisplayShape[] {
  return mockShapes.map((shape) => ({
    ...shape,
    id: uuid(),
    lastUpdated: Date.now(),
  }));
}

// Stable ID for Storybook
const EDIT_MAP_ID = uuid();

/**
 * Basic shape editing demonstration
 *
 * This story demonstrates:
 * - Clicking a shape to select it for editing
 * - Using ModifyMode to drag vertices (polygons, lines, rectangles)
 * - Using ResizeCircleMode to resize circles by dragging the edge
 * - Protected editing mode (editing cannot be interrupted by other mode requests)
 * - Saving or canceling edits
 *
 * Instructions:
 * 1. Click on a shape to select it
 * 2. Click "Edit" button to start editing
 * 3. Drag vertices to modify the shape geometry
 * 4. Click "Save" to keep changes or "Cancel" to revert
 */
export const BasicEditing: Story = {
  render: () => {
    const [shapes, setShapes] = useState<DisplayShape[]>(createSampleShapes);
    const [selectedShape, setSelectedShape] = useState<DisplayShape | null>(
      null,
    );
    const [eventLog, setEventLog] = useState<
      Array<{ id: string; message: string }>
    >([]);

    // Subscribe to cursor store to enable cursor change requests
    const { cursor, requestCursorChange, clearCursor } =
      useMapCursor(EDIT_MAP_ID);

    const { edit, save, cancel, isEditing, editingShape } = useEditShape(
      EDIT_MAP_ID,
      {
        onUpdate: (updatedShape) => {
          setShapes((prev) =>
            prev.map((s) => (s.id === updatedShape.id ? updatedShape : s)),
          );
          setSelectedShape(updatedShape);
          setEventLog((log) => [
            ...log.slice(-9),
            {
              id: `${Date.now()}-updated`,
              message: `Updated: "${updatedShape.name}"`,
            },
          ]);
        },
        onCancel: (shape) => {
          setEventLog((log) => [
            ...log.slice(-9),
            {
              id: `${Date.now()}-canceled`,
              message: `Canceled editing: "${shape.name}"`,
            },
          ]);
        },
      },
    );

    // Handle shape selection events
    useOn<ShapeSelectedEvent>(ShapeEvents.selected, (event) => {
      if (event.payload.mapId !== EDIT_MAP_ID) {
        return;
      }
      if (isEditing) {
        return; // Don't select while editing
      }

      const shape = shapes.find((s) => s.id === event.payload.shapeId);
      if (shape) {
        setSelectedShape(shape);
        setEventLog((log) => [
          ...log.slice(-9),
          {
            id: `${Date.now()}-selected`,
            message: `Selected: "${shape.name}"`,
          },
        ]);
      }
    });

    // Handle hover events for cursor changes
    useOn<ShapeHoveredEvent>(ShapeEvents.hovered, (event) => {
      if (event.payload.mapId !== EDIT_MAP_ID) {
        return;
      }
      if (isEditing) {
        return; // Don't change cursor while editing
      }

      if (event.payload.shapeId) {
        requestCursorChange('pointer', 'display-shapes');
      } else {
        clearCursor('display-shapes');
      }
    });

    const handleStartEditing = () => {
      if (selectedShape) {
        edit(selectedShape);
        setEventLog((log) => [
          ...log.slice(-9),
          {
            id: `${Date.now()}-editing`,
            message: `Editing: "${selectedShape.name}"`,
          },
        ]);
      }
    };

    const handleDeselect = () => {
      setSelectedShape(null);
    };

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={EDIT_MAP_ID}>
          {/* Display all shapes - edit layer renders on top when editing */}
          <displayShapeLayer
            id='shapes'
            mapId={EDIT_MAP_ID}
            data={shapes}
            showLabels
            pickable={!isEditing}
            selectedShapeId={selectedShape?.id ?? editingShape?.id}
          />
          {/* Edit layer - renders only when actively editing */}
          <EditShapeLayer mapId={EDIT_MAP_ID} />
        </BaseMap>

        {/* Editing toolbar */}
        <div className='absolute top-l left-l z-10 flex max-h-[calc(100vh-2rem)] w-[320px] flex-col gap-l rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Edit Shapes</p>

          {/* Status indicator */}
          <div className='rounded-lg bg-info-muted p-s'>
            <p className='mb-xs text-body-xs'>Status</p>
            <code className='text-body-m'>
              {isEditing
                ? `Editing: ${editingShape?.name}`
                : selectedShape
                  ? `Selected: ${selectedShape.name}`
                  : 'Click a shape to select'}
            </code>
            <p className='mt-xs text-body-xs'>
              Cursor: <code>{cursor}</code>
            </p>
          </div>

          {/* Action buttons */}
          <div className='flex flex-col gap-s'>
            {!isEditing && selectedShape && (
              <>
                <Button
                  variant='filled'
                  color='accent'
                  onPress={handleStartEditing}
                >
                  Edit "{selectedShape.name}"
                </Button>
                <Button
                  variant='outline'
                  color='mono-muted'
                  onPress={handleDeselect}
                >
                  Deselect
                </Button>
              </>
            )}

            {isEditing && (
              <>
                <Button variant='filled' color='serious' onPress={save}>
                  Save Changes
                </Button>
                <Button variant='outline' color='critical' onPress={cancel}>
                  Cancel (ESC)
                </Button>
              </>
            )}
          </div>

          {/* Shape list */}
          <div className='flex min-h-0 flex-1 flex-col'>
            <p className='mb-s font-semibold text-body-s'>
              Shapes ({shapes.length})
            </p>
            <div className='flex flex-col gap-xs'>
              {shapes.map((shape) => (
                <div
                  key={shape.id}
                  className={`rounded p-s text-body-xs ${
                    selectedShape?.id === shape.id
                      ? 'bg-accent-muted'
                      : 'bg-surface-subtle'
                  }`}
                >
                  <span className='font-medium'>{shape.name}</span>
                  <span className='ml-s text-content-secondary'>
                    ({shape.shapeType})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Event log */}
          <div className='flex min-h-0 flex-col'>
            <p className='mb-s font-semibold text-body-s'>Event Log</p>
            <div className='max-h-[150px] min-h-0 overflow-y-auto rounded-lg border border-border-default bg-surface-subtle p-s'>
              {eventLog.length === 0 ? (
                <p className='text-body-xs text-content-disabled'>
                  Click a shape to select it...
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
            <p className='mb-xs font-semibold text-body-xs'>Editing Tips:</p>
            <ul className='list-inside list-disc space-y-xs text-body-xs text-content-secondary'>
              <li>Click a shape to select it</li>
              <li>Click "Edit" to start editing</li>
              <li>Drag vertices to modify geometry</li>
              <li>Circles: drag the edge to resize</li>
              <li>Press ESC to cancel</li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Combined Draw and Edit
 *
 * Shows how DrawShapeLayer and EditShapeLayer work together.
 * Draw new shapes and edit existing ones.
 */
const COMBINED_MAP_ID = uuid();

export const CombinedDrawAndEdit: Story = {
  render: () => {
    const [shapes, setShapes] = useState<DisplayShape[]>(createSampleShapes);
    const [selectedShape, setSelectedShape] = useState<DisplayShape | null>(
      null,
    );

    useMapCursor(COMBINED_MAP_ID);

    const { draw, isDrawing } = useDrawShapes(COMBINED_MAP_ID, {
      onCreate: (shape) => {
        setShapes((prev) => [...prev, shape]);
      },
    });

    const { edit, save, cancel, isEditing, editingShape } = useEditShape(
      COMBINED_MAP_ID,
      {
        onUpdate: (updatedShape) => {
          setShapes((prev) =>
            prev.map((s) => (s.id === updatedShape.id ? updatedShape : s)),
          );
          setSelectedShape(null);
        },
        onCancel: () => {
          setSelectedShape(null);
        },
      },
    );

    // Handle shape selection
    useOn<ShapeSelectedEvent>(ShapeEvents.selected, (event) => {
      if (event.payload.mapId !== COMBINED_MAP_ID) {
        return;
      }
      if (isEditing || isDrawing) {
        return;
      }

      const shape = shapes.find((s) => s.id === event.payload.shapeId);
      if (shape) {
        setSelectedShape(shape);
      }
    });

    const handleDelete = () => {
      if (selectedShape) {
        setShapes((prev) => prev.filter((s) => s.id !== selectedShape.id));
        setSelectedShape(null);
      }
    };

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={COMBINED_MAP_ID}>
          <displayShapeLayer
            id='shapes'
            mapId={COMBINED_MAP_ID}
            data={shapes}
            showLabels
            pickable={!(isEditing || isDrawing)}
            selectedShapeId={selectedShape?.id ?? editingShape?.id}
          />
          {/* Both layers can be present - only one will be active at a time */}
          <DrawShapeLayer mapId={COMBINED_MAP_ID} />
          <EditShapeLayer mapId={COMBINED_MAP_ID} />
        </BaseMap>

        <div className='absolute top-l left-l z-10 flex w-[300px] flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Draw & Edit</p>

          {/* Mode indicator */}
          <div className='rounded-lg bg-info-muted p-s'>
            <code className='text-body-s'>
              {isEditing
                ? `Editing: ${editingShape?.name}`
                : isDrawing
                  ? 'Drawing...'
                  : selectedShape
                    ? `Selected: ${selectedShape.name}`
                    : 'Ready'}
            </code>
          </div>

          {/* Draw buttons */}
          {!(isEditing || selectedShape) && (
            <div className='flex flex-col gap-s'>
              <p className='font-semibold text-body-xs'>Draw New Shape</p>
              <div className='flex flex-wrap gap-s'>
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
                  onPress={() => draw(ShapeFeatureType.Circle)}
                  isDisabled={isDrawing}
                >
                  + Circle
                </Button>
              </div>
            </div>
          )}

          {/* Selection actions */}
          {selectedShape && !isEditing && (
            <div className='flex flex-col gap-s'>
              <Button
                variant='filled'
                color='accent'
                onPress={() => edit(selectedShape)}
              >
                Edit
              </Button>
              <Button variant='outline' color='critical' onPress={handleDelete}>
                Delete
              </Button>
              <Button
                variant='flat'
                color='mono-muted'
                onPress={() => setSelectedShape(null)}
              >
                Deselect
              </Button>
            </div>
          )}

          {/* Edit actions */}
          {isEditing && (
            <div className='flex gap-s'>
              <Button variant='filled' color='serious' onPress={save}>
                Save
              </Button>
              <Button variant='outline' color='critical' onPress={cancel}>
                Cancel
              </Button>
            </div>
          )}

          <p className='text-body-xs text-content-secondary'>
            {shapes.length} shape{shapes.length !== 1 ? 's' : ''} on map
          </p>
        </div>
      </div>
    );
  },
};
