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
import { useSelectShape } from '../display-shape-layer/use-select-shape';
import { DrawShapeLayer } from '../draw-shape-layer/index';
import { useDrawShape } from '../draw-shape-layer/use-draw-shape';
import { ShapeEvents } from '../shared/events';
import { ShapeFeatureType } from '../shared/types';
import type { ShapeHoveredEvent, ShapeSelectedEvent } from '../shared/events';
import type { Shape } from '../shared/types';
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
function createSampleShapes(): Shape[] {
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
    const [shapes, setShapes] = useState<Shape[]>(createSampleShapes);
    const [eventLog, setEventLog] = useState<
      Array<{ id: string; message: string }>
    >([]);

    // Subscribe to cursor store to enable cursor change requests
    const { cursor, requestCursorChange, clearCursor } =
      useMapCursor(EDIT_MAP_ID);

    // useSelectShape handles selection state and auto-deselection on map clicks
    const { selectedId } = useSelectShape(EDIT_MAP_ID);
    const selectedShape = shapes.find((s) => s.id === selectedId) ?? null;

    const { edit, save, cancel, isEditing, editingShape } = useEditShape(
      EDIT_MAP_ID,
      {
        onUpdate: (updatedShape) => {
          setShapes((prev) =>
            prev.map((s) => (s.id === updatedShape.id ? updatedShape : s)),
          );
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

    // Log shape selection events (selection is handled by useSelectShape)
    useOn<ShapeSelectedEvent>(ShapeEvents.selected, (event) => {
      if (event.payload.mapId !== EDIT_MAP_ID) {
        return;
      }
      if (isEditing) {
        return; // Don't log while editing
      }

      const shape = shapes.find((s) => s.id === event.payload.shapeId);
      if (shape) {
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

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={EDIT_MAP_ID}>
          {/* Display all shapes - edit layer renders on top when editing */}
          <displayShapeLayer
            id='shapes'
            mapId={EDIT_MAP_ID}
            data={shapes}
            showLabels='always'
            pickable={!isEditing}
            selectedShapeId={selectedShape?.id ?? editingShape?.id}
          />
          {/* Edit layer - renders only when actively editing */}
          <EditShapeLayer mapId={EDIT_MAP_ID} />
        </BaseMap>

        {/* Editing toolbar */}
        <div className='absolute top-l left-l z-10 flex max-h-[calc(100%-2rem)] w-[320px] flex-col gap-l overflow-y-auto rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
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
              <Button
                variant='filled'
                color='accent'
                onPress={handleStartEditing}
              >
                Edit "{selectedShape.name}"
              </Button>
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

          {/* Event log */}
          <div className='flex flex-col'>
            <p className='mb-s font-semibold text-body-s'>Event Log</p>
            <div className='h-[100px] overflow-y-auto rounded-lg border border-border-default bg-surface-subtle p-s'>
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
              <li>Click and drag to move the shape</li>
              <li>Shift: hold to scale proportionally</li>
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
    const [shapes, setShapes] = useState<Shape[]>(createSampleShapes);

    useMapCursor(COMBINED_MAP_ID);

    // useSelectShape handles selection state and auto-deselection on map clicks
    const { selectedId, clearSelection } = useSelectShape(COMBINED_MAP_ID);
    const selectedShape = shapes.find((s) => s.id === selectedId) ?? null;

    const { draw, isDrawing } = useDrawShape(COMBINED_MAP_ID, {
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
          clearSelection();
        },
        onCancel: () => {
          clearSelection();
        },
      },
    );

    const handleDelete = () => {
      if (selectedShape) {
        setShapes((prev) => prev.filter((s) => s.id !== selectedShape.id));
        clearSelection();
      }
    };

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={COMBINED_MAP_ID}>
          <displayShapeLayer
            id='shapes'
            mapId={COMBINED_MAP_ID}
            data={shapes}
            showLabels='always'
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
            <div className='flex gap-s'>
              <Button variant='outline' color='critical' onPress={handleDelete}>
                Delete
              </Button>
              <Button
                variant='filled'
                color='accent'
                onPress={() => edit(selectedShape)}
              >
                Edit
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

/**
 * Locked Shapes
 *
 * Demonstrates the locked shape behavior:
 * - Locked shapes cannot be edited (Edit button is disabled)
 * - Shapes can be locked/unlocked via a toggle button
 * - Useful for protecting imported data or finalized shapes
 *
 * Instructions:
 * 1. Click on a shape to select it
 * 2. Use "Lock" / "Unlock" to toggle the lock state
 * 3. Try to edit a locked shape - the Edit button will be disabled
 */
const LOCKED_MAP_ID = uuid();

// Create shapes with some pre-locked
function createShapesWithLocked(): Shape[] {
  return mockShapes.map((shape, index) => ({
    ...shape,
    id: uuid(),
    lastUpdated: Date.now(),
    // Lock every other shape to demonstrate the feature
    locked: index % 2 === 1,
  }));
}

export const LockedShapes: Story = {
  render: () => {
    const [shapes, setShapes] = useState<Shape[]>(createShapesWithLocked);

    useMapCursor(LOCKED_MAP_ID);

    const { selectedId, clearSelection } = useSelectShape(LOCKED_MAP_ID);
    const selectedShape = shapes.find((s) => s.id === selectedId) ?? null;

    const { edit, save, cancel, isEditing, editingShape } = useEditShape(
      LOCKED_MAP_ID,
      {
        onUpdate: (updatedShape) => {
          setShapes((prev) =>
            prev.map((s) => (s.id === updatedShape.id ? updatedShape : s)),
          );
          clearSelection();
        },
        onCancel: () => {
          clearSelection();
        },
      },
    );

    const handleToggleLock = () => {
      if (selectedShape) {
        setShapes((prev) =>
          prev.map((s) =>
            s.id === selectedShape.id ? { ...s, locked: !s.locked } : s,
          ),
        );
      }
    };

    return (
      <div className='relative h-dvh w-dvw'>
        <BaseMap className='absolute inset-0' id={LOCKED_MAP_ID}>
          <displayShapeLayer
            id='shapes'
            mapId={LOCKED_MAP_ID}
            data={shapes}
            showLabels='always'
            pickable={!isEditing}
            selectedShapeId={selectedShape?.id ?? editingShape?.id}
          />
          <EditShapeLayer mapId={LOCKED_MAP_ID} />
        </BaseMap>

        <div className='absolute top-l left-l z-10 flex w-[320px] flex-col gap-m rounded-lg bg-surface-default p-l shadow-elevation-overlay'>
          <p className='font-bold text-header-l'>Locked Shapes</p>

          {/* Status indicator */}
          <div className='rounded-lg bg-info-muted p-s'>
            <code className='text-body-s'>
              {isEditing
                ? `Editing: ${editingShape?.name}`
                : selectedShape
                  ? `Selected: ${selectedShape.name}${selectedShape.locked ? ' 🔒' : ''}`
                  : 'Click a shape to select'}
            </code>
          </div>

          {/* Selection actions */}
          {selectedShape && !isEditing && (
            <div className='flex flex-col gap-s'>
              <div className='flex gap-s'>
                <Button
                  variant='outline'
                  onPress={handleToggleLock}
                  size='small'
                >
                  {selectedShape.locked ? '🔓 Unlock' : '🔒 Lock'}
                </Button>
                <Button
                  variant='filled'
                  color='accent'
                  onPress={() => edit(selectedShape)}
                  isDisabled={selectedShape.locked}
                  size='small'
                >
                  Edit
                </Button>
              </div>
              {selectedShape.locked && (
                <p className='text-body-xs text-warning-default'>
                  This shape is locked and cannot be edited.
                </p>
              )}
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

          {/* Shape list with lock indicators */}
          <div className='flex flex-col'>
            <p className='mb-s font-semibold text-body-s'>
              Shapes ({shapes.filter((s) => !s.locked).length} editable,{' '}
              {shapes.filter((s) => s.locked).length} locked)
            </p>
            <div className='flex flex-col'>
              {shapes.map((shape) => (
                <div
                  key={shape.id}
                  className={`flex items-center justify-between p-s text-body-xs ${
                    selectedShape?.id === shape.id
                      ? 'bg-accent-muted'
                      : 'bg-surface-subtle'
                  }`}
                >
                  <span>
                    <span className='font-medium'>{shape.name}</span>
                    <span className='ml-s text-content-secondary'>
                      ({shape.shapeType})
                    </span>
                  </span>
                  {shape.locked && <span title='Locked'>🔒</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className='rounded-lg bg-surface-contrast-subtle p-s'>
            <p className='mb-xs font-semibold text-body-xs'>
              About Locked Shapes:
            </p>
            <ul className='list-inside list-disc space-y-xs text-body-xs text-content-secondary'>
              <li>Locked shapes cannot be edited</li>
              <li>Toggle lock state with the Lock/Unlock button</li>
              <li>Useful for protecting imported or finalized data</li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
};
