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

'use client';

import 'client-only';
import { useBus } from '@accelint/bus/react';
import { useContext, useMemo } from 'react';
import { MapContext } from '../../base-map/provider';
import { DrawShapeEvents } from './events';
import { drawStore } from './store';
import type { UniqueId } from '@accelint/core';
import type { DrawShapeEvent } from './events';
import type { UseDrawShapeOptions, UseDrawShapeReturn } from './types';

/**
 * Hook to access the shape drawing state and actions.
 *
 * This hook uses `useSyncExternalStore` to subscribe to drawing state changes,
 * providing concurrent-safe state updates. Uses a fan-out pattern where
 * a single bus listener per map instance notifies N React component subscribers.
 *
 * @param mapId - Optional map instance ID. If not provided, will use the ID from `MapContext`.
 * @param options - Optional callbacks for onCreate and onCancel events
 * @returns Drawing state, draw function, cancel function, and convenience flags
 * @throws Error if no `mapId` is provided and hook is used outside of `MapProvider`
 *
 * @example
 * ```tsx
 * // Inside MapProvider (within BaseMap children) - uses context
 * function DrawingToolbar() {
 *   const { draw, cancel, isDrawing, activeShapeType } = useDrawShape(undefined, {
 *     onCreate: (shape) => {
 *       console.log('Shape created:', shape);
 *       setShapes(prev => [...prev, shape]);
 *     },
 *     onCancel: (shapeType) => {
 *       console.log('Drawing canceled:', shapeType);
 *     },
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={() => draw(ShapeFeatureType.Polygon)}>
 *         Draw Polygon
 *       </button>
 *       <button onClick={() => draw(ShapeFeatureType.Circle)}>
 *         Draw Circle
 *       </button>
 *       {isDrawing && (
 *         <button onClick={cancel}>
 *           Cancel ({activeShapeType})
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Outside MapProvider - pass mapId directly
 * function ExternalDrawingControl({ mapId }: { mapId: UniqueId }) {
 *   const { draw, isDrawing } = useDrawShape(mapId);
 *
 *   return (
 *     <button
 *       onClick={() => draw(ShapeFeatureType.Point)}
 *       disabled={isDrawing}
 *     >
 *       Add Point
 *     </button>
 *   );
 * }
 * ```
 */
export function useDrawShape(
  mapId?: UniqueId,
  options?: UseDrawShapeOptions,
): UseDrawShapeReturn {
  const contextId = useContext(MapContext);
  const actualId = mapId ?? contextId;

  if (!actualId) {
    throw new Error(
      'useDrawShape requires either a mapId parameter or to be used within a MapProvider',
    );
  }

  const { onCreate, onCancel } = options ?? {};

  // Use the v2 store API directly
  const { state: drawingState, draw, cancel } = drawStore.use(actualId);

  // Listen for completion/cancellation events to trigger callbacks
  // useOn handles cleanup automatically and uses useEffectEvent for stable callbacks
  const { useOn } = useBus<DrawShapeEvent>();

  useOn(DrawShapeEvents.drawn, (event) => {
    if (event.payload.mapId === actualId && onCreate) {
      onCreate(event.payload.shape);
    }
  });

  useOn(DrawShapeEvents.canceled, (event) => {
    if (event.payload.mapId === actualId && onCancel) {
      onCancel(event.payload.shapeType);
    }
  });

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      drawingState,
      draw,
      cancel,
      isDrawing: !!drawingState?.activeShapeType,
      activeShapeType: drawingState?.activeShapeType ?? null,
    }),
    [drawingState, draw, cancel],
  );
}
