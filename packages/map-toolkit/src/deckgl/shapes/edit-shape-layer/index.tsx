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
import { DASH_EXTENSION } from '../display-shape-layer/constants';
import {
  getIconConfig,
  getIconLayerProps,
} from '../display-shape-layer/utils/icon-config';
import {
  DEFAULT_EDIT_HANDLE_COLOR,
  DEFAULT_EDIT_HANDLE_OUTLINE_COLOR,
  DEFAULT_EDIT_HANDLE_RADIUS,
  DEFAULT_EDIT_HANDLE_STROKE_WIDTH,
  DEFAULT_VERTEX_BBOX_LINE_WIDTH,
  ROTATE_HANDLE_COLOR,
  SCALE_HANDLE_COLOR,
  VERTEX_BBOX_DASH_ARRAY,
  VERTEX_BBOX_LINE_COLOR,
} from '../shared/constants';
import { useShiftZoomDisable } from '../shared/hooks/use-shift-zoom-disable';
import { getDefaultEditableLayerProps } from '../shared/utils/layer-config';
import {
  getFillColor,
  getLineColor,
  getLineWidth,
} from '../shared/utils/style-utils';
import {
  COMPLETION_EDIT_TYPES,
  CONTINUOUS_EDIT_TYPES,
  DEFAULT_HOTKEY_CONFIG,
  EDIT_SHAPE_LAYER_ID,
  SHAPE_PROPERTY_MAP,
} from './constants';
import { getEditModeInstance } from './modes';
import { VERTEX_BBOX_MODE } from './modes/vertex-transform-mode';
import {
  cancelEditingFromLayer,
  disableEditPanning,
  editStore,
  enableEditPanning,
  saveEditingFromLayer,
  updateFeature,
} from './store';
import { useEditActionHotkey } from './use-edit-action-hotkey';
import type { Color } from '@deck.gl/core';
import type {
  EditAction,
  FeatureCollection,
} from '@deck.gl-community/editable-layers';
import type { Feature } from 'geojson';
import type { ShapeFeatureType } from '../shared/types';
import type { EditShapeLayerProps, EditShapeStyle } from './types';
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
/**
 * Fill in defaults for any field of `style` the caller didn't specify,
 * pulling from the package constants. Returned shape is the same as
 * `EditShapeStyle` but with every field required, so the rest of the
 * layer code can read fields directly without per-field `??`.
 */
function resolveEditShapeStyle(style: EditShapeStyle | undefined) {
  return {
    vertexHandleColor: style?.vertexHandleColor ?? DEFAULT_EDIT_HANDLE_COLOR,
    scaleHandleColor: style?.scaleHandleColor ?? SCALE_HANDLE_COLOR,
    rotateHandleColor: style?.rotateHandleColor ?? ROTATE_HANDLE_COLOR,
    vertexHandleOutlineColor:
      style?.vertexHandleOutlineColor ?? DEFAULT_EDIT_HANDLE_OUTLINE_COLOR,
    scaleHandleOutlineColor:
      style?.scaleHandleOutlineColor ?? DEFAULT_EDIT_HANDLE_OUTLINE_COLOR,
    rotateHandleOutlineColor:
      style?.rotateHandleOutlineColor ?? DEFAULT_EDIT_HANDLE_OUTLINE_COLOR,
    vertexHandleRadius: style?.vertexHandleRadius ?? DEFAULT_EDIT_HANDLE_RADIUS,
    scaleHandleRadius: style?.scaleHandleRadius ?? DEFAULT_EDIT_HANDLE_RADIUS,
    rotateHandleRadius: style?.rotateHandleRadius ?? DEFAULT_EDIT_HANDLE_RADIUS,
    editHandleStrokeWidth:
      style?.editHandleStrokeWidth ?? DEFAULT_EDIT_HANDLE_STROKE_WIDTH,
    editHandleOutline: style?.editHandleOutline ?? true,
    bboxLineColor: style?.bboxLineColor ?? VERTEX_BBOX_LINE_COLOR,
    bboxLineWidth: style?.bboxLineWidth ?? DEFAULT_VERTEX_BBOX_LINE_WIDTH,
    bboxDashArray: style?.bboxDashArray ?? VERTEX_BBOX_DASH_ARRAY,
  };
}

export function EditShapeLayer({
  id = EDIT_SHAPE_LAYER_ID,
  mapId,
  unit,
  hotkeyConfig = DEFAULT_HOTKEY_CONFIG,
  style,
}: EditShapeLayerProps) {
  const resolvedStyle = resolveEditShapeStyle(style);

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

  // Save on Enter.
  useEditActionHotkey({
    mapId: actualMapId,
    id: 'saveEditHotkey',
    keyCode: Keycode.Enter,
    action: saveEditingFromLayer,
    cancelPendingUpdate,
    editingState,
  });

  // Cancel on Escape. The editable-layers library only emits `cancelFeature`
  // for draw modes — transform/translate/rotate/scale modes ignore Escape —
  // so the edit layer registers its own handler.
  useEditActionHotkey({
    mapId: actualMapId,
    id: 'cancelEditHotkey',
    keyCode: Keycode.Escape,
    action: cancelEditingFromLayer,
    cancelPendingUpdate,
    editingState,
  });

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

  // Reset rotate-anchor locks at edit-session boundary. Mode instances are
  // cached at module level so they survive across sessions; without this,
  // re-opening a previously-rotated shape would render the rotate handle on
  // the stale shape-local point instead of the current geographic top.
  const editingShapeId = editingState?.editingShape?.id;
  useEffect(() => {
    if (!editingShapeId) {
      return;
    }
    const mode = getEditModeInstance(editingState?.editMode ?? 'view');
    if (
      'resetLockedAnchor' in mode &&
      typeof (mode as { resetLockedAnchor?: () => void }).resetLockedAnchor ===
        'function'
    ) {
      (mode as { resetLockedAnchor: () => void }).resetLockedAnchor();
    }
  }, [editingShapeId, editingState?.editMode]);

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
        updateFeature(actualMapId, feature, editType);
        pendingUpdateRef.current = null;
      });
      pendingUpdateRef.current = { feature, rafId };
      return;
    }

    // Completion events (drag end): update immediately
    if (isCompletionEditType(editType)) {
      cancelPendingUpdate();
      if (feature) {
        updateFeature(actualMapId, feature, editType);
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

  // Per-feature line color: muted look for the polygon/line bounding box
  // (tagged `mode: VERTEX_BBOX_MODE` by VertexTransformMode), original
  // line color for everything else. Other shape types don't tag features
  // with this `mode`, so they fall through to `lineColor` unchanged.
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl accessor receives mixed feature shapes
  const tentativeLineColor = (feature: any): Color => {
    if (feature?.properties?.mode === VERTEX_BBOX_MODE) {
      return resolvedStyle.bboxLineColor;
    }
    return lineColor;
  };

  // Per-feature line width: bounding-box outline width is independent of
  // the shape's own line width so users can mute/emphasize the bbox
  // independently.
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl accessor receives mixed feature shapes
  const tentativeLineWidth = (feature: any): number => {
    if (feature?.properties?.mode === VERTEX_BBOX_MODE) {
      return resolvedStyle.bboxLineWidth;
    }
    return getLineWidth(editingShape.feature);
  };

  // Per-feature edit-handle fill: distinct colors for the three handle
  // roles (vertex / scale / rotate). Each role can be overridden via
  // `style` on the layer; this accessor resolves whichever fill the
  // caller specified or the package default if not.
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl accessor receives mixed feature shapes
  const editHandlePointColor = (feature: any): Color => {
    const editHandleType = feature?.properties?.editHandleType;
    if (editHandleType === 'scale') {
      return resolvedStyle.scaleHandleColor;
    }
    if (editHandleType === 'rotate') {
      return resolvedStyle.rotateHandleColor;
    }
    return resolvedStyle.vertexHandleColor;
  };

  // Per-feature edit-handle outline color: same role split as the fill
  // accessor above. Drawn as the ring around each handle dot when
  // `editHandleOutline` is `true`.
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl accessor receives mixed feature shapes
  const editHandlePointOutlineColor = (feature: any): Color => {
    const editHandleType = feature?.properties?.editHandleType;
    if (editHandleType === 'scale') {
      return resolvedStyle.scaleHandleOutlineColor;
    }
    if (editHandleType === 'rotate') {
      return resolvedStyle.rotateHandleOutlineColor;
    }
    return resolvedStyle.vertexHandleOutlineColor;
  };

  // Per-feature edit-handle radius (pixels): each role can be sized
  // independently so e.g. the rotate handle can be made larger than the
  // vertex handles for emphasis.
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl accessor receives mixed feature shapes
  const editHandlePointRadius = (feature: any): number => {
    const editHandleType = feature?.properties?.editHandleType;
    if (editHandleType === 'scale') {
      return resolvedStyle.scaleHandleRadius;
    }
    if (editHandleType === 'rotate') {
      return resolvedStyle.rotateHandleRadius;
    }
    return resolvedStyle.vertexHandleRadius;
  };

  // Dash the bounding box outline only; other guide LineStrings (rotate
  // stem connector, etc.) stay solid. PathStyleExtension reads
  // `getDashArray` on the linestrings sub-layer of the guides
  // GeoJsonLayer.
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl accessor receives mixed feature shapes
  const guidesGetDashArray = (feature: any): [number, number] => {
    if (feature?.properties?.mode === VERTEX_BBOX_MODE) {
      return resolvedStyle.bboxDashArray;
    }
    return [0, 0];
  };

  const guidesSubLayerProps = {
    extensions: [DASH_EXTENSION],
    getDashArray: guidesGetDashArray,
  };

  const subLayerProps = {
    ...defaultProps._subLayerProps,
    guides: guidesSubLayerProps,
    ...(hasIcons
      ? {
          geojson: {
            pointType: 'icon' as const,
            ...getIconLayerProps(hasIcons, iconAtlas, iconMapping),
          },
        }
      : {}),
  };

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
      {...defaultProps}
      getTentativeLineColor={tentativeLineColor}
      getTentativeLineWidth={tentativeLineWidth}
      getEditHandlePointColor={editHandlePointColor}
      getEditHandlePointOutlineColor={editHandlePointOutlineColor}
      getEditHandlePointRadius={editHandlePointRadius}
      editHandlePointStrokeWidth={resolvedStyle.editHandleStrokeWidth}
      editHandlePointOutline={resolvedStyle.editHandleOutline}
      _subLayerProps={subLayerProps}
    />
  );
}
