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
import { Button } from '@accelint/design-toolkit';
import { useCallback, useEffect, useState } from 'react';
import { BaseMap } from '../../base-map/index';
import { mockShapes } from '../__fixtures__/mock-shapes';
import './fiber';
import { EditableShapeLayer } from './';
import { useShapeEdits } from './hooks';
import { createShapeStore, type ShapeStore, useShapeStore } from './store';
import type { Meta, StoryObj } from '@storybook/react';
import type { EditShapeMode } from '../shared/events';
import type { EditableShape, ShapeId } from '../shared/types';

const meta: Meta = {
  title: 'DeckGL/Shapes/Editable Shape Layer',
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stable IDs for Storybook - generated once at module level
const EDITABLE_MAP_ID = uuid();
const LAYER_ID = `editable-shapes-${uuid()}`;

// Use mock shapes from fixtures
const mockInitialShapes: EditableShape[] = mockShapes;

/**
 * Helper component that manages the shape store
 */
function EditableShapeDemo({
  initialShapes = mockInitialShapes,
  initialMode = 'view',
}: {
  initialShapes?: EditableShape[];
  initialMode?: EditShapeMode;
}) {
  const [store] = useState<ShapeStore>(() =>
    createShapeStore({ shapes: initialShapes, mode: initialMode }),
  );
  const [selectedId, setSelectedId] = useState<ShapeId | undefined>();
  const [mode, setMode] = useState<EditShapeMode>(initialMode);

  // Subscribe to store updates
  const storeState = useShapeStore(store);

  const { handleEdit } = useShapeEdits({ store });

  // Sync mode changes to store
  useEffect(() => {
    store.setMode(mode);
  }, [mode, store]);

  // Memoize callbacks to prevent layer recreation on every render
  const handleShapeClick = useCallback((shape: EditableShape) => {
    console.log('Shape clicked:', shape);
    setSelectedId(shape.id);
    // Automatically enter modify mode when a shape is clicked
    setMode('modify');
  }, []);

  const handleShapeHover = useCallback((shape: EditableShape | null) => {
    console.log('Shape hovered:', shape);
  }, []);

  // Two-layer architecture matching NGC2:
  // 1. DisplayShapeLayer: Shows ALL shapes (read-only)
  // 2. EditableShapeLayer: Shows ONLY the selected shape (when in modify mode)
  //
  // Note: Unlike React components, deck.gl layers should NOT be wrapped in useMemo.
  // deck.gl handles layer stability internally - wrapping in useMemo with data dependencies
  // causes unnecessary layer recreation and deck.gl assertion errors.

  return (
    <div className='flex h-dvh w-dvw flex-col'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-2 bg-gray-800 p-4 text-white'>
        <span className='font-bold'>Mode:</span>
        <Button
          type='button'
          onPress={() => setMode('view')}
          variant={mode === 'view' ? 'filled' : 'outline'}
        >
          View
        </Button>
        <Button
          type='button'
          onPress={() => setMode('drawCircle')}
          variant={mode === 'drawCircle' ? 'filled' : 'outline'}
        >
          Draw Circle
        </Button>
        <Button
          type='button'
          onPress={() => setMode('drawPolygon')}
          variant={mode === 'drawPolygon' ? 'filled' : 'outline'}
        >
          Draw Polygon
        </Button>
        <Button
          type='button'
          onPress={() => setMode('drawLine')}
          variant={mode === 'drawLine' ? 'filled' : 'outline'}
        >
          Draw Line
        </Button>
        <Button
          type='button'
          onPress={() => setMode('drawPoint')}
          variant={mode === 'drawPoint' ? 'filled' : 'outline'}
        >
          Draw Point
        </Button>
        <Button
          type='button'
          onPress={() => setMode('modify')}
          variant={mode === 'modify' ? 'filled' : 'outline'}
        >
          Modify
        </Button>
        <span className='ml-4'>Shapes: {storeState.shapes.length}</span>
      </div>

      {/* Map */}
      <BaseMap className='flex-1' id={EDITABLE_MAP_ID}>
        {/* Display layer: shows all shapes in read-only mode */}
        <displayShapeLayer
          id={`${LAYER_ID}-display`}
          data={store.shapes}
          selectedShapeId={selectedId}
          showLabels={true}
          pickable={mode !== 'modify'} // Disable picking in modify mode
          onShapeClick={handleShapeClick}
          onShapeHover={handleShapeHover}
        />
        {/* Edit layer: shows only the selected shape for editing */}
        {/* Only render when not in view mode to avoid unnecessary layer mounting */}
        {mode !== 'view' && (
          <EditableShapeLayer
            id={`${LAYER_ID}-edit`}
            data={store.shapes}
            mode={mode}
            selectedShapeId={selectedId}
            pickable={true}
            onEdit={handleEdit}
          />
        )}
      </BaseMap>
    </div>
  );
}

/**
 * Basic editable shapes with all drawing modes
 */
export const BasicEditing: Story = {
  render: () => <EditableShapeDemo />,
};

/**
 * Start in draw circle mode
 */
export const DrawCircleMode: Story = {
  render: () => (
    <EditableShapeDemo initialMode='drawCircle' initialShapes={[]} />
  ),
};

/**
 * Start in draw polygon mode
 */
export const DrawPolygonMode: Story = {
  render: () => (
    <EditableShapeDemo initialMode='drawPolygon' initialShapes={[]} />
  ),
};

/**
 * Start in draw line mode
 */
export const DrawLineMode: Story = {
  render: () => <EditableShapeDemo initialMode='drawLine' initialShapes={[]} />,
};

/**
 * Start in draw point mode
 */
export const DrawPointMode: Story = {
  render: () => (
    <EditableShapeDemo initialMode='drawPoint' initialShapes={[]} />
  ),
};

/**
 * Start in modify mode with existing shapes
 */
export const ModifyMode: Story = {
  render: () => <EditableShapeDemo initialMode='modify' />,
};
