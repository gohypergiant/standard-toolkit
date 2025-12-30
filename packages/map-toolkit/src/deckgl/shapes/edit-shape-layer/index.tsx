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

import { useEmit } from '@accelint/bus/react';
import { useContext, useEffect, useRef, useSyncExternalStore } from 'react';
import {
  DEFAULT_DISTANCE_UNITS,
  getDistanceUnitFromAbbreviation,
} from '../../../shared/units';
import { MapEvents } from '../../base-map/events';
import { MapContext } from '../../base-map/provider';
import {
  getFillColor,
  getStrokeColor,
} from '../display-shape-layer/utils/display-style';
import {
  DEFAULT_EDIT_HANDLE_COLOR,
  EDITABLE_LAYER_SUBLAYER_PROPS,
} from '../shared/constants';
import { ShapeFeatureType, type ShapeFeatureTypeValues } from '../shared/types';
import { EDIT_SHAPE_LAYER_ID } from './constants';
import { getEditModeInstance } from './modes';
import {
  cancelEditingFromLayer,
  getOrCreateServerSnapshot,
  getOrCreateSnapshot,
  getOrCreateSubscription,
  updateFeatureFromLayer,
} from './store';
import type {
  EditAction,
  FeatureCollection,
} from '@deck.gl-community/editable-layers';
import type { Feature } from 'geojson';
import type {
  MapDisableZoomEvent,
  MapEnableZoomEvent,
} from '../../base-map/types';
import type { EditShapeLayerProps } from './types';

/** Continuous edit event types that fire during dragging */
const CONTINUOUS_EDIT_TYPES = new Set([
  'movePosition',
  'unionGeometry',
  'scaling',
  'rotating',
  'translating',
]);

/** Completion edit event types that fire when dragging ends */
const COMPLETION_EDIT_TYPES = new Set([
  'finishMovePosition',
  'addPosition',
  'removePosition',
  'scaled',
  'rotated',
  'translated',
]);

function isContinuousEditType(editType: string): boolean {
  return CONTINUOUS_EDIT_TYPES.has(editType);
}

function isCompletionEditType(editType: string): boolean {
  return COMPLETION_EDIT_TYPES.has(editType);
}

/**
 * Convert a GeoJSON Feature to a FeatureCollection for EditableGeoJsonLayer.
 * The editable-layers library accepts standard GeoJSON FeatureCollection at runtime,
 * but has stricter internal types. We use the geojson types which are compatible.
 *
 * For circles, adds the `shape: 'Circle'` property required by ResizeCircleMode.
 * ResizeCircleMode checks `properties.shape.includes('Circle')` to identify circles.
 *
 * For rectangles, adds the `shape: 'Rectangle'` property required by ModifyMode's
 * lockRectangles feature. ModifyMode checks `properties.shape === 'Rectangle'`.
 */
function toFeatureCollection(
  feature: Feature,
  shapeType: ShapeFeatureTypeValues,
): import('geojson').FeatureCollection {
  // Add shape property for modes that require it
  // - ResizeCircleMode requires shape: 'Circle'
  // - ModifyMode lockRectangles requires shape: 'Rectangle'
  let shapeProperty: string | undefined;
  if (shapeType === ShapeFeatureType.Circle) {
    shapeProperty = 'Circle';
  } else if (shapeType === ShapeFeatureType.Rectangle) {
    shapeProperty = 'Rectangle';
  }

  const featureWithShape = shapeProperty
    ? {
        ...feature,
        properties: {
          ...feature.properties,
          shape: shapeProperty,
        },
      }
    : feature;

  return {
    type: 'FeatureCollection',
    features: [featureWithShape],
  };
}

/**
 * EditShapeLayer - A React component for editing existing shapes on the map.
 *
 * This component wraps the EditableGeoJsonLayer from @deck.gl-community/editable-layers
 * and integrates with the map-mode and map-cursor systems for proper coordination.
 *
 * Key features:
 * - Renders only when actively editing (returns null otherwise)
 * - Uses cached mode instances to prevent deck.gl assertion errors
 * - Integrates with the editing store for state management
 * - Neutral mode authorization (lets UI decide how to handle mode conflicts)
 * - Circles use ResizeCircleMode with tooltip, other shapes use ModifyMode
 * - Fill colors rendered at 20% opacity, edit handles are white
 * - Live dimension/area tooltips during editing
 * - requestAnimationFrame() batching for smooth drag performance
 *
 * @example
 * ```tsx
 * // Import the fiber registration for JSX support
 * import '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer/fiber';
 * import '@accelint/map-toolkit/deckgl/shapes/display-shape-layer/fiber';
 *
 * function Map({ mapId }) {
 *   const { editingShape } = useEditShape(mapId);
 *
 *   return (
 *     <BaseMap id={mapId}>
 *       <displayShapeLayer
 *         data={shapes}
 *         mapId={mapId}
 *         selectedShapeId={editingShape?.id}
 *       />
 *       <EditShapeLayer mapId={mapId} />
 *     </BaseMap>
 *   );
 * }
 * ```
 */
export function EditShapeLayer({
  id = EDIT_SHAPE_LAYER_ID,
  mapId,
  unit,
}: EditShapeLayerProps) {
  // Get mapId from context if not provided
  const contextId = useContext(MapContext);
  const actualMapId = mapId ?? contextId;

  if (!actualMapId) {
    throw new Error(
      'EditShapeLayer requires either a mapId prop or to be used within a MapProvider',
    );
  }

  // Subscribe to editing state
  const editingState = useSyncExternalStore(
    getOrCreateSubscription(actualMapId),
    getOrCreateSnapshot(actualMapId),
    getOrCreateServerSnapshot(actualMapId),
  );

  const isEditing = editingState?.editingShape != null;

  const emitDisableZoom = useEmit<MapDisableZoomEvent>(MapEvents.disableZoom);
  const emitEnableZoom = useEmit<MapEnableZoomEvent>(MapEvents.enableZoom);
  const isZoomDisabledRef = useRef(false);

  // RAF batching for movePosition events to reduce React updates during drag
  const pendingUpdateRef = useRef<{
    feature: Feature;
    rafId: number;
  } | null>(null);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (pendingUpdateRef.current) {
        cancelAnimationFrame(pendingUpdateRef.current.rafId);
      }
    };
  }, []);

  // Disable zoom while Shift is held during editing
  // This prevents boxZoom (Shift+drag) from interfering with Shift modifier constraints
  // (e.g., Shift for square constraint on rectangles, Shift for uniform scaling)
  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift' && !isZoomDisabledRef.current) {
        isZoomDisabledRef.current = true;
        emitDisableZoom({ id: actualMapId });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift' && isZoomDisabledRef.current) {
        isZoomDisabledRef.current = false;
        emitEnableZoom({ id: actualMapId });
      }
    };

    // Re-enable zoom if the window loses focus while Shift is held
    const handleBlur = () => {
      if (isZoomDisabledRef.current) {
        isZoomDisabledRef.current = false;
        emitEnableZoom({ id: actualMapId });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);

      // Ensure zoom is re-enabled when unmounting
      if (isZoomDisabledRef.current) {
        isZoomDisabledRef.current = false;
        emitEnableZoom({ id: actualMapId });
      }
    };
  }, [isEditing, actualMapId, emitDisableZoom, emitEnableZoom]);

  // If not editing, return null (don't render the editable layer)
  if (!editingState?.editingShape) {
    return null;
  }

  const { editingShape, editMode, featureBeingEdited } = editingState;

  // Get the cached mode instance
  const mode = getEditModeInstance(editMode);

  // Get shape type for feature collection conversion
  const shapeType = editingShape.shapeType;

  // Use the live feature being edited, or fall back to original shape
  const featureToRender = featureBeingEdited ?? editingShape.feature;
  const data = toFeatureCollection(featureToRender, shapeType);

  // Helper to cancel any pending RAF update
  const cancelPendingUpdate = () => {
    if (pendingUpdateRef.current) {
      cancelAnimationFrame(pendingUpdateRef.current.rafId);
      pendingUpdateRef.current = null;
    }
  };

  // Handle edit events from EditableGeoJsonLayer
  const handleEdit = ({
    updatedData,
    editType,
  }: EditAction<FeatureCollection>) => {
    const feature = updatedData.features[0];

    // Continuous events (during drag): batch with RAF for smooth performance
    if (isContinuousEditType(editType) && feature) {
      cancelPendingUpdate();
      const rafId = requestAnimationFrame(() => {
        updateFeatureFromLayer(actualMapId, feature as Feature);
        pendingUpdateRef.current = null;
      });
      pendingUpdateRef.current = { feature: feature as Feature, rafId };
      return;
    }

    // Completion events (drag end): update immediately
    if (isCompletionEditType(editType)) {
      cancelPendingUpdate();
      if (feature) {
        updateFeatureFromLayer(actualMapId, feature as Feature);
      }
      return;
    }

    // ESC key cancellation
    if (editType === 'cancelFeature') {
      cancelPendingUpdate();
      cancelEditingFromLayer(actualMapId);
    }
  };

  // Get colors from the shape's existing style properties with base opacity applied
  const fillColor = getFillColor(editingShape.feature, true);
  const lineColor = getStrokeColor(editingShape.feature);

  return (
    <editableGeoJsonLayer
      id={id}
      data={data}
      mode={mode}
      selectedFeatureIndexes={[0]}
      onEdit={handleEdit}
      getFillColor={fillColor}
      getLineColor={lineColor}
      getTentativeFillColor={fillColor}
      getTentativeLineColor={lineColor}
      getEditHandlePointColor={DEFAULT_EDIT_HANDLE_COLOR}
      getEditHandlePointOutlineColor={DEFAULT_EDIT_HANDLE_COLOR}
      modeConfig={{
        distanceUnits: unit
          ? (getDistanceUnitFromAbbreviation(unit) ?? DEFAULT_DISTANCE_UNITS)
          : DEFAULT_DISTANCE_UNITS,
      }}
      _subLayerProps={EDITABLE_LAYER_SUBLAYER_PROPS}
    />
  );
}
