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

'use client';

import 'client-only';
import { useBus } from '@accelint/bus/react';
import { useContext, useMemo } from 'react';
import { MapContext } from '../../base-map/provider';
import { EditShapeEvents } from './events';
import { editStore } from './store';
import type { UniqueId } from '@accelint/core';
import type { EditShapeEvent } from './events';
import type { UseEditShapeOptions, UseEditShapeReturn } from './types';

/**
 * Hook to access the shape editing state and actions.
 *
 * This hook uses `useSyncExternalStore` to subscribe to editing state changes,
 * providing concurrent-safe state updates. Uses a fan-out pattern where
 * a single bus listener per map instance notifies N React component subscribers.
 *
 * @param mapId - Optional map instance ID. If not provided, will use the ID from `MapContext`.
 * @param options - Optional callbacks for onUpdate and onCancel events
 * @returns Editing state, edit/save/cancel functions, and convenience flags
 * @throws Error if no `mapId` is provided and hook is used outside of `MapProvider`
 *
 * @example
 * ```tsx
 * // Inside MapProvider (within BaseMap children) - uses context
 * function ShapeEditor() {
 *   const { edit, save, cancel, isEditing, editingShape } = useEditShape(undefined, {
 *     onUpdate: (shape) => {
 *       console.log('Shape updated:', shape);
 *       setShapes(prev => prev.map(s => s.id === shape.id ? shape : s));
 *     },
 *     onCancel: (shape) => {
 *       console.log('Editing canceled:', shape.name);
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       {selectedShape && !isEditing && (
 *         <button onClick={() => edit(selectedShape)}>
 *           Edit Shape
 *         </button>
 *       )}
 *       {isEditing && (
 *         <>
 *           <button onClick={save}>Save</button>
 *           <button onClick={cancel}>Cancel</button>
 *         </>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Outside MapProvider - pass mapId directly
 * function ExternalEditControl({ mapId, shape }: { mapId: UniqueId; shape: Shape }) {
 *   const { edit, isEditing } = useEditShape(mapId);
 *
 *   return (
 *     <button
 *       onClick={() => edit(shape)}
 *       disabled={isEditing}
 *     >
 *       Edit
 *     </button>
 *   );
 * }
 * ```
 */
export function useEditShape(
  mapId?: UniqueId,
  options?: UseEditShapeOptions,
): UseEditShapeReturn {
  const contextId = useContext(MapContext);
  const actualId = mapId ?? contextId;

  if (!actualId) {
    throw new Error(
      'useEditShape requires either a mapId parameter or to be used within a MapProvider',
    );
  }

  const { onUpdate, onCancel } = options ?? {};

  // Use the v2 store API directly
  const { state: editingState, edit, save, cancel } = editStore.use(actualId);

  // Listen for completion/cancellation events to trigger callbacks
  // useOn handles cleanup automatically and uses useEffectEvent for stable callbacks
  const { useOn } = useBus<EditShapeEvent>();

  useOn(EditShapeEvents.updated, (event) => {
    if (event.payload.mapId === actualId && onUpdate) {
      onUpdate(event.payload.shape);
    }
  });

  useOn(EditShapeEvents.canceled, (event) => {
    if (event.payload.mapId === actualId && onCancel) {
      onCancel(event.payload.shape);
    }
  });

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      editingState,
      edit,
      save,
      cancel,
      isEditing: !!editingState?.editingShape,
      editingShape: editingState?.editingShape ?? null,
    }),
    [editingState, edit, save, cancel],
  );
}
