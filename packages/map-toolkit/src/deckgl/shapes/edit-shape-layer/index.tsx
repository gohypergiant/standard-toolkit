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
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
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
import { VERTEX_BBOX_MODE } from './modes/utils/vertex-bbox-chrome';
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
 * Fill in defaults for any field of `style` the caller didn't specify,
 * pulling from the package constants. Returned shape is the same as
 * `EditShapeStyle` but with every field required, so the rest of the
 * layer code can read fields directly without per-field `??`. The
 * explicit `Required<EditShapeStyle>` annotation also fails compilation
 * if a new field is added to `EditShapeStyle` without a default here.
 */
function resolveEditShapeStyle(
  style: EditShapeStyle | undefined,
): Required<EditShapeStyle> {
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

/**
 * Sentinel value passed to deck.gl color accessors on renders that
 * happen *before* a shape is open for editing — the component
 * short-circuits to `return null` in that case, so this color never
 * reaches the GPU. It exists only to keep the surrounding `useMemo`
 * inputs typed as `Color` (vs `Color | null`) so the memos and their
 * deps stay simple and JIT-stable.
 */
const EMPTY_COLOR: Color = [0, 0, 0, 0];

/**
 * Bundle of per-feature accessor functions handed to
 * `<editableGeoJsonLayer>`. Keeping them in a single object means the
 * `useMemo` that owns them has one stable identity per dep change — all
 * six accessors get a fresh reference together when (and only when) one
 * of the underlying inputs changes, instead of each fluctuating
 * independently and forcing N separate sub-layer prop diffs in deck.gl.
 */
type EditShapeAccessors = {
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
  tentativeLineColor: (feature: any) => Color;
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
  tentativeLineWidth: (feature: any) => number;
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
  editHandlePointColor: (feature: any) => Color;
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
  editHandlePointOutlineColor: (feature: any) => Color;
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
  editHandlePointRadius: (feature: any) => number;
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
  guidesGetDashArray: (feature: any) => [number, number];
};

/**
 * Build the six per-feature accessor functions deck.gl reads off the
 * editable layer. Each one closes over the resolved style + a handful
 * of feature-derived values, and dispatches on `feature.properties`
 * (`mode` for bbox vs. shape lines, `editHandleType` for the three
 * handle roles). Module-scope so the body never escapes V8's inline
 * cache when the closure values change.
 */
/**
 * One bundle per edit-handle role (`vertex` is the fallback for
 * `'existing'` / `'intermediate'` and any unrecognized `editHandleType`).
 * Bundling lets the three handle-point accessors share role resolution
 * via a single closure instead of repeating the `editHandleType ===
 * 'scale' ? X : editHandleType === 'rotate' ? Y : Z` cascade.
 */
type HandleRoleStyle = {
  color: Color;
  outlineColor: Color;
  radius: number;
};

/**
 * Hoisted to module scope to avoid per-frame allocation. deck.gl calls
 * `guidesGetDashArray` once per guide feature per render; returning a
 * shared reference for the non-bbox case keeps the accessor allocation-
 * free.
 */
const NO_DASH_ARRAY: [number, number] = [0, 0];

function buildEditShapeAccessors(args: {
  resolvedStyle: Required<EditShapeStyle>;
  lineColor: Color;
  shapeLineWidth: number;
}): EditShapeAccessors {
  const { resolvedStyle, lineColor, shapeLineWidth } = args;

  // Build the three role bundles once per accessor-bundle construction
  // (i.e. once per useMemo dep change). The three handle-point accessors
  // close over these stable references, so per-feature-per-frame
  // accessor calls do a 2-comparison lookup instead of allocating a
  // fresh `{ color, outlineColor, radius }` object each time.
  const scaleRole: HandleRoleStyle = {
    color: resolvedStyle.scaleHandleColor,
    outlineColor: resolvedStyle.scaleHandleOutlineColor,
    radius: resolvedStyle.scaleHandleRadius,
  };
  const rotateRole: HandleRoleStyle = {
    color: resolvedStyle.rotateHandleColor,
    outlineColor: resolvedStyle.rotateHandleOutlineColor,
    radius: resolvedStyle.rotateHandleRadius,
  };
  const vertexRole: HandleRoleStyle = {
    color: resolvedStyle.vertexHandleColor,
    outlineColor: resolvedStyle.vertexHandleOutlineColor,
    radius: resolvedStyle.vertexHandleRadius,
  };
  const roleFor = (editHandleType: unknown): HandleRoleStyle => {
    if (editHandleType === 'scale') {
      return scaleRole;
    }

    if (editHandleType === 'rotate') {
      return rotateRole;
    }

    return vertexRole;
  };

  return {
    // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
    tentativeLineColor: (feature: any): Color =>
      feature?.properties?.mode === VERTEX_BBOX_MODE
        ? resolvedStyle.bboxLineColor
        : lineColor,
    // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
    tentativeLineWidth: (feature: any): number =>
      feature?.properties?.mode === VERTEX_BBOX_MODE
        ? resolvedStyle.bboxLineWidth
        : shapeLineWidth,
    // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
    editHandlePointColor: (feature: any): Color =>
      roleFor(feature?.properties?.editHandleType).color,
    // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
    editHandlePointOutlineColor: (feature: any): Color =>
      roleFor(feature?.properties?.editHandleType).outlineColor,
    // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
    editHandlePointRadius: (feature: any): number =>
      roleFor(feature?.properties?.editHandleType).radius,
    // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
    guidesGetDashArray: (feature: any): [number, number] =>
      feature?.properties?.mode === VERTEX_BBOX_MODE
        ? resolvedStyle.bboxDashArray
        : NO_DASH_ARRAY,
  };
}

/**
 * Build the merged `_subLayerProps` object passed to
 * `<editableGeoJsonLayer>`. Combines the default tooltip + edit-handle
 * sub-layer configs with the oriented-bounding-box dash extension for the guides layer
 * and optional icon-point overrides when the shape uses icon points.
 */
function buildEditShapeSubLayerProps(args: {
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl sub-layer prop bag
  defaults: any;
  hasIcons: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: icon atlas / mapping types vary
  iconAtlas: any;
  // biome-ignore lint/suspicious/noExplicitAny: icon atlas / mapping types vary
  iconMapping: any;
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl feature shape varies
  guidesGetDashArray: (feature: any) => [number, number];
  // biome-ignore lint/suspicious/noExplicitAny: deck.gl sub-layer prop bag is loose
}): any {
  const { defaults, hasIcons, iconAtlas, iconMapping, guidesGetDashArray } =
    args;

  return {
    ...defaults,
    guides: {
      extensions: [DASH_EXTENSION],
      getDashArray: guidesGetDashArray,
    },
    ...(hasIcons
      ? {
          geojson: {
            pointType: 'icon' as const,
            ...getIconLayerProps(hasIcons, iconAtlas, iconMapping),
          },
        }
      : {}),
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
 * - Each shape type uses a dedicated edit mode (rectangle, ellipse,
 *   polygon/line, circle, point), wired up in `modes/index.ts`
 * - Fill colors render at 20% opacity; edit handles are split into
 *   three roles (vertex / scale / rotate) with distinct default colors
 * - Visual customization via the `style` prop (see {@link EditShapeStyle})
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
  style,
}: EditShapeLayerProps) {
  // Resolve style defaults once per `style` prop reference. deck.gl
  // sub-layer prop diffs are reference-equality based, so a fresh
  // resolved object on every render would defeat the memoized accessor
  // bundle below (each accessor closes over `resolvedStyle` fields).
  const resolvedStyle = useMemo(() => resolveEditShapeStyle(style), [style]);

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
  }, [actualMapId, hotkeyConfig.panning]);

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

  // Hooks below must run on every render to keep React's call-order
  // contract. The early "no editing shape, render nothing" branch
  // happens *after* all hooks; we derive editing-feature inputs with
  // safe fallbacks here so the memos receive defined values even when
  // there's nothing to render.
  const editingShape = editingState?.editingShape ?? null;
  const editingFeature = editingShape?.feature ?? null;
  // Memoize style/config inputs keyed on `editingFeature` identity so
  // the `accessors` and `subLayerProps` memos below see stable
  // references. Without these, `getFillColor` / `getLineColor` /
  // `getIconConfig` return fresh `[r,g,b,a]` arrays + object literals
  // every render and the downstream memos invalidate on every parent
  // re-render — defeating the layer-prop stability they were added for.
  const fillColor = useMemo(
    () => (editingFeature ? getFillColor(editingFeature, true) : EMPTY_COLOR),
    [editingFeature],
  );
  const lineColor = useMemo(
    () => (editingFeature ? getLineColor(editingFeature) : EMPTY_COLOR),
    [editingFeature],
  );
  const shapeLineWidth = editingFeature ? getLineWidth(editingFeature) : 0;
  const iconConfig = useMemo(
    () => getIconConfig(editingFeature ? [editingFeature] : []),
    [editingFeature],
  );
  const defaultProps = getDefaultEditableLayerProps(unit);

  // Memoize accessors and sub-layer props as one stable bundle each.
  // deck.gl diffs prop accessors by reference identity, so a fresh
  // closure per render makes the underlying GeoJsonLayer rebuild
  // attribute buffers even when the resolved values would be identical.
  const accessors = useMemo(
    () =>
      buildEditShapeAccessors({
        resolvedStyle,
        lineColor,
        shapeLineWidth,
      }),
    [resolvedStyle, lineColor, shapeLineWidth],
  );
  const subLayerProps = useMemo(
    () =>
      buildEditShapeSubLayerProps({
        defaults: defaultProps._subLayerProps,
        hasIcons: iconConfig.hasIcons,
        iconAtlas: iconConfig.atlas,
        iconMapping: iconConfig.mapping,
        guidesGetDashArray: accessors.guidesGetDashArray,
      }),
    [
      defaultProps._subLayerProps,
      iconConfig.hasIcons,
      iconConfig.atlas,
      iconConfig.mapping,
      accessors.guidesGetDashArray,
    ],
  );

  // Stable edit-event handler. Wrapped in `useCallback` so deck.gl's
  // prop-diff doesn't see a fresh function reference each render —
  // consistent with the memoization story for the accessor bundle and
  // sub-layer props above. The only closure inputs are `actualMapId`
  // (stable for the component's lifetime) and `cancelPendingUpdate`
  // (already memoized), so the callback's identity is stable across
  // renders.
  const handleEdit = useCallback(
    ({ updatedData, editType }: EditAction<FeatureCollection>) => {
      // Single cast at the library boundary: editable-layers Feature is
      // structurally compatible with geojson Feature but typed differently.
      const feature = updatedData.features[0] as Feature | undefined;

      // Continuous events (during drag): batch with RAF for smooth performance.
      if (isContinuousEditType(editType) && feature) {
        cancelPendingUpdate();
        const rafId = requestAnimationFrame(() => {
          updateFeature(actualMapId, feature, editType);
          pendingUpdateRef.current = null;
        });
        pendingUpdateRef.current = { feature, rafId };

        return;
      }

      // Completion events (drag end): update immediately.
      if (isCompletionEditType(editType)) {
        cancelPendingUpdate();

        if (feature) {
          updateFeature(actualMapId, feature, editType);
        }

        return;
      }

      // ESC key cancellation.
      if (editType === 'cancelFeature') {
        cancelPendingUpdate();
        cancelEditingFromLayer(actualMapId);
      }
    },
    [actualMapId, cancelPendingUpdate],
  );

  // If not editing, return null (don't render the editable layer)
  if (!(editingState && editingShape)) {
    return null;
  }

  const { editMode, featureBeingEdited } = editingState;

  // Get the cached mode instance
  const mode = getEditModeInstance(editMode);

  // Use the live feature being edited, or fall back to original shape
  const featureToRender = featureBeingEdited ?? editingShape.feature;
  const data = toFeatureCollection(featureToRender, editingShape.shape);

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
      getTentativeLineColor={accessors.tentativeLineColor}
      getTentativeLineWidth={accessors.tentativeLineWidth}
      getEditHandlePointColor={accessors.editHandlePointColor}
      getEditHandlePointOutlineColor={accessors.editHandlePointOutlineColor}
      getEditHandlePointRadius={accessors.editHandlePointRadius}
      editHandlePointStrokeWidth={resolvedStyle.editHandleStrokeWidth}
      editHandlePointOutline={resolvedStyle.editHandleOutline}
      _subLayerProps={subLayerProps}
    />
  );
}
