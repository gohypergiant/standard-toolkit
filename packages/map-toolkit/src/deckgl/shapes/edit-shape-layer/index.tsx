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

import {
  globalBind,
  Keycode,
  registerHotkey,
  unregisterHotkey,
} from '@accelint/hotkey-manager';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { MapContext } from '../../base-map/provider';
import {
  getIconConfig,
  getIconLayerProps,
} from '../display-shape-layer/utils/icon-config';
import { useShiftZoomDisable } from '../shared/hooks/use-shift-zoom-disable';
import { getDefaultEditableLayerProps } from '../shared/utils/layer-config';
import { getFillColor, getLineColor } from '../shared/utils/style-utils';
import {
  COMPLETION_EDIT_TYPES,
  CONTINUOUS_EDIT_TYPES,
  DEFAULT_HOTKEY_CONFIG,
  EDIT_SHAPE_LAYER_ID,
  SHAPE_PROPERTY_MAP,
} from './constants';
import { getEditModeInstance } from './modes';
import {
  cancelEditingFromLayer,
  disableEditPanning,
  editStore,
  enableEditPanning,
  saveEditingFromLayer,
  updateFeatureFromLayer,
} from './store';
import type {
  EditAction,
  FeatureCollection,
} from '@deck.gl-community/editable-layers';
import type { Feature } from 'geojson';
import type { ShapeFeatureType } from '../shared/types';
import type { EditShapeLayerProps } from './types';
import './fiber';

/**
 * Check if an edit type is a continuous event (fires during drag).
 * Continuous events are batched with RAF for smooth performance.
 *
 * @param editType - The edit type string from EditableGeoJsonLayer
 * @returns True if the edit type is continuous (e.g., 'translating', 'scaling', 'rotating')
 */
function isContinuousEditType(editType: string): boolean {
  return CONTINUOUS_EDIT_TYPES.has(editType);
}

/**
 * Check if an edit type is a completion event (fires at drag end).
 * Completion events update state immediately without RAF batching.
 *
 * @param editType - The edit type string from EditableGeoJsonLayer
 * @returns True if the edit type is a completion event (e.g., 'translated', 'scaled', 'rotated')
 */
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
 *
 * @param feature - The GeoJSON Feature to wrap.
 * @param shape - The shape type, used to determine if mode-specific properties are needed.
 * @returns A GeoJSON FeatureCollection containing the single feature.
 */
function toFeatureCollection(
  feature: Feature,
  shape: ShapeFeatureType,
): import('geojson').FeatureCollection {
  // Add shape property for modes that require it
  // - ResizeCircleMode requires shape: 'Circle'
  // - ModifyMode lockRectangles requires shape: 'Rectangle'
  const shapeProperty = SHAPE_PROPERTY_MAP[shape];

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
 * ## Fiber Registration
 * Unlike `DisplayShapeLayer` (a deck.gl layer class), `EditShapeLayer` is a React
 * component that handles its own fiber registration internally. You do **not** need to
 * import `edit-shape-layer/fiber` — but you **do** still need to import
 * `display-shape-layer/fiber` if you use `<displayShapeLayer>` in the same tree.
 *
 * @example
 * ```tsx
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
 *
 * @throws {Error} Throws if neither `mapId` prop nor `MapProvider` context is available.
 */
export function EditShapeLayer({
  id = EDIT_SHAPE_LAYER_ID,
  mapId,
  unit,
  hotkeyConfig = DEFAULT_HOTKEY_CONFIG,
}: EditShapeLayerProps) {
  // Get mapId from context if not provided
  const contextId = useContext(MapContext);
  const actualMapId = mapId ?? contextId;

  if (!actualMapId) {
    throw new Error(
      'EditShapeLayer requires either a mapId prop or to be used within a MapProvider',
    );
  }

  // Subscribe to editing state using the v2 store API
  const { state: editingState } = editStore.use(actualMapId);

  const isEditing = editingState?.editingShape != null;

  // RAF batching for movePosition events to reduce React updates during drag
  const pendingUpdateRef = useRef<{
    feature: Feature;
    rafId: number;
  } | null>(null);

  // Keep a ref to the latest editing state so the hotkey handler can access it
  const editingStateRef = useRef(editingState);
  editingStateRef.current = editingState;

  // Ensure global hotkey listeners are initialized
  // Safe to call multiple times - globalBind() checks if already bound
  useEffect(() => {
    globalBind();
  }, []);

  // Helper to cancel any pending RAF update (stable reference with useCallback)
  const cancelPendingUpdate = useCallback(() => {
    if (pendingUpdateRef.current) {
      cancelAnimationFrame(pendingUpdateRef.current.rafId);
      pendingUpdateRef.current = null;
    }
  }, []);

  // Register Enter key hotkey scoped to this component and map instance.
  // Handles the full lifecycle: register → bind → unbind → unregister.
  // Without unregistering on cleanup, remounting throws a duplicate-id error.
  useEffect(() => {
    const manager = registerHotkey({
      id: `saveEditHotkey-${actualMapId}`,
      key: { code: Keycode.Enter },
      onKeyUp: () => {
        if (editingStateRef.current?.editingShape) {
          cancelPendingUpdate();
          saveEditingFromLayer(actualMapId);
        }
      },
    });

    const unbind = manager.bind();

    return () => {
      unbind();
      unregisterHotkey(manager);
    };
  }, [actualMapId, cancelPendingUpdate]);

  // Register Space key for enabling panning while editing shape.
  // NOTE: Low threshold (50ms) enables near-instant panning response on hold.
  // alwaysTriggerKeyUp ensures panning ends even if onKeyHeld was triggered.
  useEffect(() => {
    const manager = registerHotkey({
      id: `editPanningHotkey-${actualMapId}`,
      key: hotkeyConfig.panning,
      onKeyDown: (e: KeyboardEvent) => {
        if (editStore.get(actualMapId)?.editingShape) {
          e.preventDefault();
        }
      },
      onKeyHeld: () => {
        enableEditPanning(actualMapId);
      },
      onKeyUp: () => {
        disableEditPanning(actualMapId);
      },
      heldThresholdMs: 50,
      alwaysTriggerKeyUp: true,
    });

    const unbind = manager.bind();

    return () => {
      unbind();
      unregisterHotkey(manager);
    };
  }, [actualMapId, hotkeyConfig]);

  // Disable zoom while Shift is held during editing
  // This prevents boxZoom (Shift+drag) from interfering with Shift modifier constraints
  // (e.g., Shift for uniform scaling, Shift for rotation snap)
  useShiftZoomDisable(actualMapId, isEditing);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (pendingUpdateRef.current) {
        cancelAnimationFrame(pendingUpdateRef.current.rafId);
      }
    };
  }, []);

  // If not editing, return null (don't render the editable layer)
  if (!editingState?.editingShape) {
    return null;
  }

  const { editingShape, editMode, featureBeingEdited } = editingState;

  // Get the cached mode instance
  const mode = getEditModeInstance(editMode);

  // Use the live feature being edited, or fall back to original shape
  const featureToRender = featureBeingEdited ?? editingShape.feature;
  const data = toFeatureCollection(featureToRender, editingShape.shape);

  // Handle edit events from EditableGeoJsonLayer
  const handleEdit = ({
    updatedData,
    editType,
  }: EditAction<FeatureCollection>) => {
    // Single cast at the library boundary: editable-layers Feature is structurally
    // compatible with geojson Feature but typed differently
    const feature = updatedData.features[0] as Feature | undefined;

    // Continuous events (during drag): batch with RAF for smooth performance
    if (isContinuousEditType(editType) && feature) {
      cancelPendingUpdate();
      const rafId = requestAnimationFrame(() => {
        updateFeatureFromLayer(actualMapId, feature);
        pendingUpdateRef.current = null;
      });
      pendingUpdateRef.current = { feature, rafId };
      return;
    }

    // Completion events (drag end): update immediately
    if (isCompletionEditType(editType)) {
      cancelPendingUpdate();
      if (feature) {
        updateFeatureFromLayer(actualMapId, feature);
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
  const lineColor = getLineColor(editingShape.feature);

  // Auto-detect icon config from the editing shape's style properties.
  // EditableGeoJsonLayer only proxies a fixed set of props to its inner GeoJsonLayer,
  // so icon props must be injected via _subLayerProps targeting the 'geojson' sub-layer.
  const {
    hasIcons,
    atlas: iconAtlas,
    mapping: iconMapping,
  } = getIconConfig([editingShape.feature]);
  const defaultProps = getDefaultEditableLayerProps(unit);
  const subLayerProps = hasIcons
    ? {
        ...defaultProps._subLayerProps,
        geojson: {
          pointType: 'icon' as const,
          ...getIconLayerProps(hasIcons, iconAtlas, iconMapping),
        },
      }
    : defaultProps._subLayerProps;

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
      {...defaultProps}
      _subLayerProps={subLayerProps}
    />
  );
}
