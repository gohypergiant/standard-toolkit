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

import { useContext, useEffect, useSyncExternalStore } from 'react';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitFromAbbreviation,
} from '../../../shared/units';
import { MapContext } from '../../base-map/provider';
import {
  DEFAULT_EDIT_HANDLE_COLOR,
  DEFAULT_TENTATIVE_FILL_COLOR,
  DEFAULT_TENTATIVE_LINE_COLOR,
  DRAW_SHAPE_LAYER_ID,
  EMPTY_FEATURE_COLLECTION,
  TOOLTIP_SUBLAYER_PROPS,
} from './constants';
import { getModeInstance, triggerDoubleClickFinish } from './modes';
import {
  cancelDrawingFromLayer,
  completeDrawingFromLayer,
  getOrCreateServerSnapshot,
  getOrCreateSnapshot,
  getOrCreateSubscription,
} from './store';
import type {
  EditAction,
  FeatureCollection,
} from '@deck.gl-community/editable-layers';
import type { DrawShapeLayerProps } from './types';

/**
 * DrawShapeLayer - A React component for drawing shapes on the map.
 *
 * This component wraps the EditableGeoJsonLayer from @deck.gl-community/editable-layers
 * and integrates with the map-mode and map-cursor systems for proper coordination.
 *
 * Key features:
 * - Renders only when actively drawing (returns null otherwise)
 * - Uses cached mode instances to prevent deck.gl assertion errors
 * - Integrates with the drawing store for state management
 * - Protected drawing mode (rejects mode change requests while drawing)
 * - Distance/area tooltips during drawing
 *
 * @example
 * ```tsx
 * // Import the fiber registration for JSX support
 * import '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer/fiber';
 *
 * function Map({ mapId }) {
 *   return (
 *     <BaseMap id={mapId}>
 *       <displayShapeLayer data={shapes} mapId={mapId} />
 *       <DrawShapeLayer mapId={mapId} />
 *     </BaseMap>
 *   );
 * }
 * ```
 */
export function DrawShapeLayer({
  id = DRAW_SHAPE_LAYER_ID,
  mapId,
  unit,
}: DrawShapeLayerProps) {
  // Get mapId from context if not provided
  const contextId = useContext(MapContext);
  const actualMapId = mapId ?? contextId;

  if (!actualMapId) {
    throw new Error(
      'DrawShapeLayer requires either a mapId prop or to be used within a MapProvider',
    );
  }

  // Subscribe to drawing state
  const drawingState = useSyncExternalStore(
    getOrCreateSubscription(actualMapId),
    getOrCreateSnapshot(actualMapId),
    getOrCreateServerSnapshot(actualMapId),
  );

  const activeShapeType = drawingState?.activeShapeType ?? null;

  // Set up dblclick listener as workaround for deck.gl-community/editable-layers ~9.1
  // which doesn't register 'dblclick' in EVENT_TYPES
  // @see https://github.com/visgl/deck.gl-community/pull/225
  useEffect(() => {
    if (!activeShapeType) {
      return;
    }

    const handleDblClick = () => {
      triggerDoubleClickFinish(activeShapeType);
    };

    // Add listener to document to catch dblclick anywhere on the map
    document.addEventListener('dblclick', handleDblClick);

    return () => {
      document.removeEventListener('dblclick', handleDblClick);
    };
  }, [activeShapeType]);

  // If not drawing, return null (don't render the editable layer)
  if (!activeShapeType) {
    return null;
  }

  const styleDefaults = drawingState?.styleDefaults ?? null;

  // Get the cached mode instance
  const mode = getModeInstance(activeShapeType);

  // Handle edit events from EditableGeoJsonLayer
  const handleEdit = ({
    updatedData,
    editType,
  }: EditAction<FeatureCollection>) => {
    // Only process addFeature (drawing complete) and cancelFeature (ESC pressed)
    if (editType === 'addFeature') {
      const feature = updatedData.features[updatedData.features.length - 1];
      if (feature) {
        // Type assertion: editable-layers Feature type differs slightly from geojson Feature
        // but they are structurally compatible for our conversion purposes
        completeDrawingFromLayer(
          actualMapId,
          feature as Parameters<typeof completeDrawingFromLayer>[1],
        );
      }
    } else if (editType === 'cancelFeature') {
      cancelDrawingFromLayer(actualMapId);
    }
    // Ignore other edit types during drawing (tentative updates, etc.)
  };

  // Get colors from style defaults or use defaults
  const fillColor = styleDefaults?.fillColor ?? DEFAULT_TENTATIVE_FILL_COLOR;
  const lineColor = styleDefaults?.strokeColor ?? DEFAULT_TENTATIVE_LINE_COLOR;

  return (
    <editableGeoJsonLayer
      id={id}
      data={EMPTY_FEATURE_COLLECTION}
      mode={mode}
      selectedFeatureIndexes={[]}
      onEdit={handleEdit}
      getTentativeFillColor={fillColor}
      getTentativeLineColor={lineColor}
      getEditHandlePointColor={DEFAULT_EDIT_HANDLE_COLOR}
      getEditHandlePointOutlineColor={DEFAULT_EDIT_HANDLE_COLOR}
      modeConfig={{
        distanceUnits: unit
          ? (getDistanceUnitFromAbbreviation(unit) ?? DEFAULT_DISTANCE_UNITS)
          : DEFAULT_DISTANCE_UNITS,
      }}
      _subLayerProps={TOOLTIP_SUBLAYER_PROPS}
    />
  );
}
