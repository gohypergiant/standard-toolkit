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

import { useEffectEvent, useEmit } from '@accelint/bus/react';
import { Deckgl, useDeckgl } from '@deckgl-fiber-renderer/dom';
import type { PickingInfo, ViewStateChangeParameters } from '@deck.gl/core';
import 'client-only';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Map as MapLibre,
  type MapRef,
  useControl,
  type ViewState,
} from 'react-map-gl/maplibre';
import { RbzHandler } from '@/maplibre';
import { isActiveMap, setActiveMap } from '@/maplibre/active-map-store';
import { useMapCamera } from '../../camera';
import { CameraEventTypes } from '../../camera/events';
import { cameraStore } from '../../camera/store';
import { getCursor } from '../../map-cursor/store';
import { getMapGeneration } from '../../shared/cleanup';
import { DEFAULT_VIEW_STATE } from '../../shared/constants';
import { DARK_BASE_MAP_STYLE, PARAMETERS, PICKING_RADIUS } from './constants';
import { MapControls } from './controls';
import { MapEvents } from './events';
import { MapProvider } from './provider';
import {
  isTiltGesture,
  MOUSE_TILT_SENSITIVITY,
  type TiltBaseline,
  type TiltGesture,
  tiltCommandFor,
} from './tilt-gesture';
import { LOCKED_MAP_LIBRE_OPTION_KEYS } from './types';
import type {
  IControl,
  MapOptions,
  WebGLContextAttributesWithType,
} from 'maplibre-gl';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';
import type { CameraSetViewEvent } from '../../camera/types';
import type {
  BaseMapProps,
  MapClickEvent,
  MapHoverEvent,
  MapLibreOptions,
  MapViewportEvent,
  SerializablePickingInfo,
} from './types';

const CANVAS_CONTEXT_ATTRIBUTES: WebGLContextAttributesWithType = {
  antialias: true,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: false,
  failIfMajorPerformanceCaveat: false,
  desynchronized: false,
  contextType: 'webgl2',
} as const;

const DEFAULT_ATTRIBUTION_CONTROL: MapOptions['attributionControl'] = {
  compact: true,
};

const LOCKED_MAP_LIBRE_OPTION_KEY_SET: ReadonlySet<string> = new Set(
  LOCKED_MAP_LIBRE_OPTION_KEYS,
);

/**
 * Removes locked keys from `mapLibreOptions` before they reach the underlying
 * MapLibre instance. Locked keys are either derived from BaseMap's camera/view
 * state, required by Deck.gl picking/interaction, or already exposed as
 * dedicated BaseMap props.
 *
 * @internal Exported solely for unit testing. Not part of the public API.
 */
export function stripLockedMapLibreOptions(
  options: MapLibreOptions | undefined,
): MapLibreOptions {
  if (!options) {
    return {};
  }
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(options)) {
    if (!LOCKED_MAP_LIBRE_OPTION_KEY_SET.has(key)) {
      result[key] = value;
    }
  }

  return result as MapLibreOptions;
}

/**
 * Serializes PickingInfo for event bus transmission by removing non-cloneable properties.
 * Omits viewport, layer, and sourceLayer (contain functions) but preserves layer IDs.
 *
 * @param info - The PickingInfo object from Deck.gl.
 * @returns Serializable picking info with layer IDs extracted.
 */
function serializePickingInfo(info: PickingInfo): SerializablePickingInfo {
  const { viewport, layer, sourceLayer, ...infoRest } = info;

  return {
    layerId: layer?.id,
    sourceLayerId: sourceLayer?.id,
    ...infoRest,
  };
}

/**
 * Strips non-serializable properties from Mjolnir events for event bus transmission.
 * Overloaded to handle both GestureEvent and PointerEvent types.
 * Removes functions, DOM elements, and PointerEvent objects that cannot be cloned.
 *
 * @param event - The MjolnirGestureEvent from Deck.gl.
 * @returns Serializable gesture event with non-cloneable properties removed.
 */
function serializeMjolnirEvent(
  event: MjolnirGestureEvent,
): Omit<
  MjolnirGestureEvent,
  | 'stopPropagation'
  | 'preventDefault'
  | 'stopImmediatePropagation'
  | 'srcEvent'
  | 'rootElement'
  | 'target'
  | 'changedPointers'
  | 'pointers'
>;
/**
 * Strips non-serializable properties from Mjolnir events for event bus transmission.
 * Overloaded to handle both GestureEvent and PointerEvent types.
 * Removes functions and DOM elements that cannot be cloned.
 *
 * @param event - The MjolnirPointerEvent from Deck.gl.
 * @returns Serializable pointer event with non-cloneable properties removed.
 */
function serializeMjolnirEvent(
  event: MjolnirPointerEvent,
): Omit<
  MjolnirPointerEvent,
  | 'stopPropagation'
  | 'preventDefault'
  | 'stopImmediatePropagation'
  | 'srcEvent'
  | 'rootElement'
  | 'target'
>;
function serializeMjolnirEvent(
  event: MjolnirGestureEvent | MjolnirPointerEvent,
) {
  const {
    stopImmediatePropagation,
    stopPropagation,
    preventDefault,
    srcEvent,
    rootElement,
    target,
    ...rest
  } = event;

  // Remove pointer arrays if present (only on MjolnirGestureEvent)
  if ('changedPointers' in rest) {
    const { changedPointers, pointers, ...gestureRest } = rest;

    return gestureRest;
  }

  return rest;
}

/**
 * Projects a Deck.gl gesture event onto the {@link TiltGesture} shape the tilt
 * handlers need: the mouse buttons, cumulative drag deltas, and the modifier
 * key (which lives on the wrapped `srcEvent`, not the gesture event itself).
 *
 * @param event - The Deck.gl/Mjolnir gesture event from `onDragStart`/`onDrag`.
 * @returns The button + delta + modifier subset used to classify and map the drag.
 */
function toTiltGesture(event: MjolnirGestureEvent): TiltGesture {
  return {
    leftButton: event.leftButton,
    rightButton: event.rightButton,
    deltaX: event.deltaX,
    deltaY: event.deltaY,
    ctrlKey: event.srcEvent.ctrlKey,
  };
}

/**
 * Internal component that registers the Deck.gl instance as a MapLibre control.
 * Enables the Deck.gl canvas to render within the MapLibre GL map container.
 *
 * @returns null (headless component)
 */
function AddDeckglControl() {
  const deckglInstance = useDeckgl();
  useControl(() => deckglInstance as IControl);

  return null;
}

/**
 * A React component that provides a Deck.gl-powered base map with MapLibre GL integration.
 *
 * This component serves as the foundation for building interactive map applications with
 * support for click and hover events through a centralized event bus. It integrates
 * Deck.gl for 3D visualizations with MapLibre GL for the base map tiles.
 *
 * **Map Mode Integration**: BaseMap automatically creates a `MapProvider` internally,
 * which sets up the map mode state management for this instance.
 * - **Children**: Only Deck.gl layer components can be rendered as children. Custom Deck.gl
 *   layers can use `useMapMode()` without parameters to access context.
 * - **Siblings**: UI components (buttons, toolbars, etc.) must be rendered as siblings
 *   and pass `id` to `useMapMode(id)`.
 *
 * **Event Bus**: Click and hover events are emitted through the event bus with the `id`
 * included in the payload, allowing multiple map instances to coexist without interference.
 *
 * @param props - Component props including id (required), className, onClick, onHover, and all Deck.gl props
 * @returns A map component with Deck.gl and MapLibre GL integration
 *
 * @example
 * ```tsx
 * // Basic usage with id (recommended: module-level constant)
 * import { BaseMap } from '@accelint/map-toolkit/deckgl';
 * import { uuid } from '@accelint/core';
 *
 * // Create id at module level for stability and easy sharing
 * const MAIN_MAP_ID = uuid();
 *
 * export function MapView() {
 *   return <BaseMap className="w-full h-full" id={MAIN_MAP_ID} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With map mode and event handlers
 * import { BaseMap } from '@accelint/map-toolkit/deckgl';
 * import { useMapMode } from '@accelint/map-toolkit/map-mode';
 * import { uuid } from '@accelint/core';
 * import type { PickingInfo } from '@deck.gl/core';
 * import type { MjolnirGestureEvent } from 'mjolnir.js';
 *
 * // Module-level constant - stable and shareable across all components
 * const MAIN_MAP_ID = uuid();
 *
 * function Toolbar() {
 *   // Access map mode using the shared id
 *   const { mode, requestModeChange } = useMapMode(MAIN_MAP_ID);
 *   return <div>Current mode: {mode}</div>;
 * }
 *
 * export function InteractiveMap() {
 *   const handleClick = (info: PickingInfo, event: MjolnirGestureEvent) => {
 *     console.log('Clicked:', info.object);
 *   };
 *
 *   return (
 *     <div className="relative w-full h-full">
 *       <BaseMap
 *         className="absolute inset-0"
 *         id={MAIN_MAP_ID}
 *         onClick={handleClick}
 *       />
 *       <Toolbar />
 *     </div>
 *   );
 * }
 * ```
 */
export function BaseMap({
  id,
  className,
  children,
  controller = true,
  enableControlEvents = true,
  interleaved = true,
  parameters = {},
  styleUrl = DARK_BASE_MAP_STYLE,
  useDevicePixels = false,
  widgets: widgetsProp = [],
  defaultView = '2D',
  initialViewState,
  onClick,
  onHover,
  onDragStart,
  onDrag,
  onDragEnd,
  onViewStateChange,
  pickingRadius,
  enableRbz = false,
  rbzOptions,
  boxZoom: boxZoomProp,
  mapLibreOptions,
  ...rest
}: BaseMapProps) {
  const mapGeneration = getMapGeneration(id);
  const deckglInstance = useDeckgl();
  const container = useId();
  const mapRef = useRef<MapRef>(null);
  const rbzRef = useRef<RbzHandler | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Camera rotation/pitch captured at the start of a tilt drag; the gesture's
  // (per-drag, resets-to-zero) delta is applied on top so each new drag
  // continues from the current angle instead of snapping to an absolute.
  // Captured in `handleDragStart`, cleared in `handleDragEnd`; non-null only
  // while a tilt drag is in flight.
  const tiltBaselineRef = useRef<TiltBaseline | null>(null);
  // Latest rotation/pitch a drag frame wants applied, plus the rAF handle that
  // will apply it. `onDrag` fires once per raw pointermove (often several per
  // animation frame); writing the camera on each one forces a MapLibre repaint
  // per event and starves the next pointermove, which is the drag stutter. We
  // instead stash the newest target and let one rAF coalesce them into a single
  // `setCameraState` per frame — the same one-repaint-per-frame cadence
  // MapLibre's own handlers use.
  const pendingTiltRef = useRef<TiltBaseline | null>(null);
  const tiltFrameRef = useRef<number | null>(null);

  // Derive boxZoom: disable when RBZ is enabled to avoid conflicts
  const boxZoom = boxZoomProp ?? !enableRbz;

  const { cameraState, setCameraState } = useMapCamera(id, {
    view: defaultView,
    zoom: initialViewState?.zoom ?? DEFAULT_VIEW_STATE.zoom,
    latitude: initialViewState?.latitude ?? DEFAULT_VIEW_STATE.latitude,
    longitude: initialViewState?.longitude ?? DEFAULT_VIEW_STATE.longitude,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only need to recompute when cameraState changes.
  const viewState = useMemo<ViewState>(
    () => ({
      // @ts-expect-error squirrelly deckglInstance typing
      ...(deckglInstance?._deck?._getViewState() as ViewState),
      ...cameraState,
      bearing: cameraState.rotation,
    }),
    [cameraState],
  );

  const filteredMapLibreOptions = useMemo(
    () => stripLockedMapLibreOptions(mapLibreOptions),
    [mapLibreOptions],
  );

  // Spread order: default → consumer overrides → locked keys (last wins).
  //
  // Don't add `projection` here. react-map-gl's `_updateSettings` iterates
  // its `settingNames` list (which includes `projection`) on every `setProps`
  // call and invokes each setter unconditionally - bypassing the style-load
  // guard on its `_updateStyleComponents` path. maplibre's `setProjection`
  // then throws "Style is not done loading." Sync via the post-load pattern
  // below - same approach as `useMapLibre` uses for the same setter.
  // 2.5D is the only view that permits pitch (the camera store locks 2D and 3D
  // to pitch:0). `maxPitch` must allow the store-driven pitch through in 2.5D;
  // MapLibre clamps an applied `pitch` to `maxPitch`.
  const allowTilt = cameraState.view === '2.5D';

  const mapOptions = useMemo(() => {
    const options = {
      attributionControl: DEFAULT_ATTRIBUTION_CONTROL,
      ...filteredMapLibreOptions,
      container,
      doubleClickZoom: false,
      // MapLibre's own rotate/pitch handlers stay disabled. Rotation and pitch
      // are driven through the camera store from the `onDrag` handler below
      // (right-drag / ctrl+left-drag), so the camera stays the single source of
      // truth and sensitivity is a simple delta multiplier — no reaching into
      // MapLibre's handler internals.
      dragRotate: false,
      pitchWithRotate: false,
      rollEnabled: false,
      maxPitch: allowTilt ? 85 : 0,
      canvasContextAttributes: CANVAS_CONTEXT_ATTRIBUTES,
      boxZoom,
    };

    // Only include camera position when NOT transitioning
    // Let MapLibre's easeTo fully control the camera during transitions
    if (!(isTransitioning || cameraState.transitionDuration)) {
      Object.assign(options, {
        zoom: viewState.zoom,
        pitch: viewState.pitch,
        bearing: viewState.bearing,
        latitude: viewState.latitude,
        longitude: viewState.longitude,
      });
    }

    return options;
  }, [
    viewState,
    container,
    allowTilt,
    cameraState.view,
    cameraState.transitionDuration,
    boxZoom,
    filteredMapLibreOptions,
    isTransitioning,
  ]);

  // Cancel a scheduled tilt frame if the map unmounts mid-drag.
  useEffect(() => {
    return () => {
      if (tiltFrameRef.current !== null) {
        cancelAnimationFrame(tiltFrameRef.current);
      }
    };
  }, []);

  // `setProjection` throws if called before the style is loaded. Initial
  // application happens in `handleMapLoad`; this effect syncs later changes.
  useEffect(() => {
    const map = mapRef.current?.getMap();

    if (!map?.isStyleLoaded()) {
      return;
    }

    map.setProjection({ type: cameraState.projection });
  }, [cameraState.projection]);

  // Use MapLibre's easeTo for smooth transitions
  useEffect(() => {
    if (cameraState.transitionDuration && mapRef.current && !isTransitioning) {
      setIsTransitioning(true);
      const map = mapRef.current.getMap
        ? mapRef.current.getMap()
        : mapRef.current;

      map.easeTo({
        center: [cameraState.longitude, cameraState.latitude],
        zoom: cameraState.zoom,
        bearing: cameraState.rotation,
        pitch: cameraState.pitch,
        duration: cameraState.transitionDuration,
        easing: (t) => {
          switch (cameraState.transitionEasing) {
            case 'ease-in':
              return t * t;
            case 'ease-out':
              return t * (2 - t);
            case 'ease-in-out':
              return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            case 'linear':
              return t;
            default:
              return t * (2 - t);
          }
        },
      });

      // Clear transition properties after animation completes to ensure subsequent
      // transitions trigger properly. Without clearing, the useEffect won't fire on
      // the next setCenter call if transitionDuration/transitionEasing remain unchanged.
      setTimeout(() => {
        setIsTransitioning(false);
        setCameraState({
          latitude: cameraState.latitude,
          longitude: cameraState.longitude,
          zoom: cameraState.zoom,
          pitch: cameraState.pitch,
          rotation: cameraState.rotation,
          transitionDuration: undefined,
          transitionEasing: undefined,
        });
      }, cameraState.transitionDuration + 50);
    }
  }, [
    cameraState.transitionDuration,
    cameraState.latitude,
    cameraState.longitude,
    cameraState.zoom,
    cameraState.pitch,
    cameraState.rotation,
    cameraState.transitionEasing,
    setCameraState,
    isTransitioning,
  ]);

  const emitClick = useEmit<MapClickEvent>(MapEvents.click);
  const emitHover = useEmit<MapHoverEvent>(MapEvents.hover);
  const emitViewport = useEmit<MapViewportEvent>(MapEvents.viewport);
  const emitSetView = useEmit<CameraSetViewEvent>(CameraEventTypes.setView);

  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(
    (info: PickingInfo, event: MjolnirGestureEvent) => {
      // send full pickingInfo and event to user-defined onClick
      onClick?.(info, event);

      emitClick({
        info: serializePickingInfo(info),
        event: serializeMjolnirEvent(event),
        id,
      });
    },
    [emitClick, id, onClick],
  );

  const handleHover = useCallback(
    (info: PickingInfo, event: MjolnirPointerEvent) => {
      // Mark this map as the active instance for keyboard shortcuts (e.g. Shift for RBZ)
      setActiveMap(id);

      // send full pickingInfo and event to user-defined onHover
      onHover?.(info, event);

      emitHover({
        info: serializePickingInfo(info),
        event: serializeMjolnirEvent(event),
        id,
      });
    },
    [emitHover, id, onHover],
  );

  // Apply the latest coalesced tilt target (if any) to the camera and clear it.
  // Shared by the rAF callback (per-frame) and `handleDragEnd` (final flush).
  const flushPendingTilt = useEffectEvent(() => {
    const pending = pendingTiltRef.current;

    if (pending) {
      setCameraState({ rotation: pending.rotation, pitch: pending.pitch });
      pendingTiltRef.current = null;
    }
  });

  const handleDragStart = useEffectEvent(
    (info: PickingInfo, event: MjolnirGestureEvent) => {
      // send full pickingInfo and event to user-defined onDragStart first
      onDragStart?.(info, event);

      // Right-drag (or ctrl + left-drag) rotates + pitches the camera; plain
      // left-drag stays a pan. The camera store is driven directly so it remains
      // the single source of truth — MapLibre's own rotate/pitch handlers are off.
      if (!isTiltGesture(toTiltGesture(event))) {
        return;
      }

      // Capture the baseline once, here, from the live store — `onDragStart`
      // fires exactly once per gesture, so each new drag continues from the
      // current camera angle instead of snapping to an absolute derived from the
      // (per-gesture, resets-to-zero) drag delta. Reading the store rather than
      // the render closure avoids a stale `cameraState` when the bus has updated
      // the camera without re-rendering BaseMap.
      const liveCamera = cameraStore.get(id);
      tiltBaselineRef.current = {
        rotation: liveCamera.rotation,
        pitch: liveCamera.pitch,
      };

      // Promote a flat 2D view to 2.5D so pitch can apply. Doing it here (not in
      // `handleDrag`) gives the view flip — which raises `maxPitch` from 0 to 85
      // — a full frame to reach MapLibre before the first tilt delta arrives.
      if (liveCamera.view === '2D') {
        emitSetView({ id, view: '2.5D' });
      }
    },
  );

  const handleDrag = useEffectEvent(
    (info: PickingInfo, event: MjolnirGestureEvent) => {
      // send full pickingInfo and event to user-defined onDrag first
      onDrag?.(info, event);

      // No baseline means `handleDragStart` classified this as a pan, not a
      // tilt; leave the camera untouched.
      if (!tiltBaselineRef.current) {
        return;
      }

      const command = tiltCommandFor(
        toTiltGesture(event),
        MOUSE_TILT_SENSITIVITY,
        tiltBaselineRef.current,
      );

      // Coalesce to one camera update per animation frame. Record the newest
      // target and, if no frame is already scheduled, schedule one. The rAF
      // callback applies whatever the latest target is and clears the handle, so
      // a burst of pointermoves within a frame collapses to a single
      // `setCameraState` (one MapLibre repaint) instead of one per event.
      pendingTiltRef.current = command;

      if (tiltFrameRef.current === null) {
        tiltFrameRef.current = requestAnimationFrame(() => {
          tiltFrameRef.current = null;
          flushPendingTilt();
        });
      }
    },
  );

  const handleDragEnd = useEffectEvent(
    (info: PickingInfo, event: MjolnirGestureEvent) => {
      // send full pickingInfo and event to user-defined onDragEnd first
      onDragEnd?.(info, event);

      // Flush the last pending target so the camera lands exactly where the drag
      // ended (a frame may have been scheduled but not yet fired), then cancel
      // the pending frame and drop the baseline so the next gesture re-captures.
      if (tiltFrameRef.current !== null) {
        cancelAnimationFrame(tiltFrameRef.current);
        tiltFrameRef.current = null;
      }

      flushPendingTilt();
      tiltBaselineRef.current = null;
    },
  );

  const handleGetCursor = useCallback(() => {
    return getCursor(id);
  }, [id]);

  const handleViewStateChange = useEffectEvent(
    (params: ViewStateChangeParameters) => {
      onViewStateChange?.(params);

      const {
        viewId,
        viewState: { latitude, longitude, zoom },
      } = params;

      // @ts-expect-error squirrelly deckglInstance typing
      const viewports = deckglInstance._deck?.getViewports();
      if (!viewports) {
        return;
      }

      // @ts-expect-error squirrelly deckglInstance typing
      const viewport = viewports.find((vp) => vp.id === viewId);

      if (!viewport) {
        return;
      }

      emitViewport({
        id,
        bounds: viewport?.getBounds(),
        latitude,
        longitude,
        zoom,
        width: viewport?.width ?? 0,
        height: viewport?.height ?? 0,
      });
    },
  );

  const handleResize = useEffectEvent((params) => {
    // Clear existing timeout
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Debounce
    resizeTimeoutRef.current = setTimeout(() => {
      // @ts-expect-error squirrelly deckglInstance typing
      const viewports = deckglInstance._deck?.getViewports();
      if (!viewports) {
        return;
      }
      for (const vp of viewports) {
        handleViewStateChange({
          viewId: vp.id,
          viewState: {
            latitude: vp.latitude,
            longitude: vp.longitude,
            zoom: vp.zoom,
            id: vp.id,
            bounds: vp.getBounds(),
            width: params.width,
            height: params.height,
          },
        } as ViewStateChangeParameters);
      }
    }, 200);
  });

  // First point at which `setProjection` is safe (after `style.load`).
  const handleMapLoad = useEffectEvent(() => {
    mapRef.current?.getMap().setProjection({ type: cameraState.projection });
  });

  const handleLoad = useEffectEvent(() => {
    //--- force update viewport state once all viewports initialized ---
    // @ts-expect-error squirrelly deckglInstance typing
    const viewports = deckglInstance._deck?.getViewports();
    if (!viewports) {
      return;
    }
    for (const vp of viewports) {
      handleViewStateChange({
        viewId: vp.id,
        viewState: {
          latitude: vp.latitude,
          longitude: vp.longitude,
          zoom: vp.zoom,
          id: vp.id,
          bounds: vp.getBounds(),
          width: vp.width,
          height: vp.height,
        },
      } as ViewStateChangeParameters);
    }
    if (enableRbz && mapRef.current) {
      const map = mapRef.current.getMap();
      rbzRef.current = new RbzHandler(map, {
        ...rbzOptions,
        shouldActivate: () => isActiveMap(id),
      });
      // _add is a private MapLibre API — no public equivalent exists for registering custom handlers.
      // Tested against maplibre-gl 5.x. Re-verify on major upgrades.
      map.handlers._add('customRbz', rbzRef.current);
      rbzRef.current.startListening();

      // Ensure window has focus for keyboard events (critical in iframes like Storybook)
      window.focus();

      // Clean up when the map is removed
      map.once('remove', () => {
        rbzRef.current?.destroy();
        rbzRef.current = null;
      });
    }
  });

  return (
    <div id={container} className={className}>
      {enableControlEvents && (
        <MapControls id={id} mapRef={mapRef} rbzRef={rbzRef} />
      )}
      <MapProvider id={id}>
        <MapLibre
          key={mapGeneration}
          onMove={(evt) => {
            // Runs on EVERY MapLibre move (drag, zoom, inertial pan, flyTo/easeTo,
            // programmatic setBearing) — not just tilt drags. That breadth is
            // intended: `onMove` is MapLibre's authoritative "the camera moved"
            // event, so any heading change must flow back to the store, which is
            // the single source of truth. The store keys on `rotation` while
            // MapLibre reports it as `bearing`, so we remap here; without it the
            // `viewState` memo would push a stale `rotation` back and snap the
            // bearing. Pitch is unaffected since it's named the same.
            const { bearing, ...rest } = evt.viewState;
            setCameraState({ ...rest, rotation: bearing });
          }}
          onLoad={handleMapLoad}
          mapStyle={styleUrl}
          ref={mapRef}
          {...mapOptions}
        >
          <Deckgl
            {...rest}
            controller={controller}
            interleaved={interleaved}
            getCursor={handleGetCursor}
            useDevicePixels={useDevicePixels}
            onClick={handleClick}
            pickingRadius={pickingRadius ?? PICKING_RADIUS}
            onHover={handleHover}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onLoad={handleLoad}
            onResize={handleResize}
            onViewStateChange={handleViewStateChange}
            widgets={widgetsProp}
            // @ts-expect-error - DeckglProps parameters type is overly strict for WebGL parameter spreading.
            // The merged object is valid at runtime but TypeScript cannot verify all possible parameter combinations.
            parameters={{ ...PARAMETERS, ...parameters }}
          >
            <AddDeckglControl />
            {children}
          </Deckgl>
        </MapLibre>
      </MapProvider>
    </div>
  );
}
