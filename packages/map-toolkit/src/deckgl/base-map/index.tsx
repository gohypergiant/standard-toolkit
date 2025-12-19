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
import { useEffectEvent, useEmit } from '@accelint/bus/react';
import { Deckgl, useDeckgl } from '@deckgl-fiber-renderer/dom';
import { useCallback, useId, useMemo, useRef } from 'react';
import {
  Map as MapLibre,
  type MapRef,
  useControl,
  type ViewState,
} from 'react-map-gl/maplibre';
import { useCameraState } from '../../camera';
import { getCursor } from '../../map-cursor/store';
import { BASE_MAP_STYLE, PARAMETERS } from './constants';
import { MapControls } from './controls';
import { MapEvents } from './events';
import { MapProvider } from './provider';
import type { UniqueId } from '@accelint/core';
import type { PickingInfo, ViewStateChangeParameters } from '@deck.gl/core';
import type { DeckglProps } from '@deckgl-fiber-renderer/types';
import type { IControl } from 'maplibre-gl';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';
import type {
  MapClickEvent,
  MapHoverEvent,
  MapViewportEvent,
  SerializablePickingInfo,
} from './types';

/**
 * Serializes PickingInfo for event bus transmission.
 * Omits viewport, layer, and sourceLayer (contain functions) but preserves layer IDs.
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
 * Strips non-serializable properties from MjolnirGestureEvent for event bus transmission.
 * Removes functions, DOM elements, and PointerEvent objects that cannot be cloned.
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
 * Strips non-serializable properties from MjolnirPointerEvent for event bus transmission.
 * Removes functions and DOM elements that cannot be cloned.
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
 * Props for the BaseMap component.
 * Extends all Deck.gl props and adds additional map-specific properties.
 */
export type BaseMapProps = DeckglProps & {
  /** Optional CSS class name to apply to the map container element */
  className?: string;
  /**
   * Whether to enable listening for map control events (pan/zoom enable/disable).
   * When true, the map will respond to control events emitted via the event bus.
   * @default true
   */
  enableControlEvents?: boolean;
  /**
   * Unique identifier for this map instance (required).
   *
   * Used to isolate map mode state between multiple map instances (e.g., main map vs minimap).
   * This should be a UUID generated using `uuid()` from `@accelint/core`.
   *
   * The same id should be passed to `useMapMode()` when accessing map mode state
   * from components rendered outside of the BaseMap's children (i.e., as siblings).
   */
  id: UniqueId;
  /**
   * Default view for the map: '2D', '2.5D', or '3D'. Defaults to '2D'.
   */
  defaultView?: '2D' | '2.5D' | '3D';
};

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
 * Basic usage with id (recommended: module-level constant):
 * ```tsx
 * import { BaseMap } from '@accelint/map-toolkit/deckgl';
 * import { View } from '@deckgl-fiber-renderer/dom';
 * import { uuid } from '@accelint/core';
 *
 * // Create id at module level for stability and easy sharing
 * const MAIN_MAP_ID = uuid();
 *
 * export function MapView() {
 *   return (
 *     <BaseMap className="w-full h-full" id={MAIN_MAP_ID}>
 *       <View id="main" controller />
 *     </BaseMap>
 *   );
 * }
 * ```
 *
 * @example
 * With map mode and event handlers (module-level constant for sharing):
 * ```tsx
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
 *       <BaseMap className="absolute inset-0" id={MAIN_MAP_ID} onClick={handleClick}>
 *         <View id="main" controller />
 *       </BaseMap>
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
  useDevicePixels = false,
  widgets: widgetsProp = [],
  defaultView = '2D',
  onClick,
  onHover,
  onViewStateChange,
  ...rest
}: BaseMapProps) {
  const deckglInstance = useDeckgl();
  const container = useId();
  const mapRef = useRef<MapRef>(null);

  const { cameraState, setCameraState } = useCameraState({
    instanceId: id,
    initialCameraState: { view: defaultView },
  });

  const viewState = useMemo<ViewState>(
    () => ({
      // @ts-expect-error squirrelly deckglInstance typing
      ...(deckglInstance?._deck?._getViewState() as ViewState),
      ...cameraState,
      bearing: cameraState.rotation,
    }),
    // @ts-expect-error squirrelly deckglInstance typing
    [cameraState, deckglInstance?._deck?._getViewState],
  );

  // Memoize MapLibre options to avoid creating new object on every render
  const mapOptions = useMemo(
    () => ({
      container,
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
      latitude: viewState.latitude,
      longitude: viewState.longitude,
      doubleClickZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      rollEnabled: false,
      attributionControl: { compact: true },
      projection: cameraState.projection,
      maxPitch: cameraState.view === '2D' ? 0 : 85,
    }),
    [viewState, container, cameraState.projection, cameraState.view],
  );

  // Use the custom hook to handle MapLibre

  const emitClick = useEmit<MapClickEvent>(MapEvents.click);
  const emitHover = useEmit<MapHoverEvent>(MapEvents.hover);
  const emitViewport = useEmit<MapViewportEvent>(MapEvents.viewport);

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
      const viewport = deckglInstance._deck
        .getViewports()
        // @ts-expect-error squirrelly deckglInstance typing
        ?.find((vp) => vp.id === viewId);

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

  const handleLoad = useEffectEvent(() => {
    //--- force update viewport state once all viewports initialized ---
    // @ts-expect-error squirrelly deckglInstance typing
    const viewports = deckglInstance._deck.getViewports() ?? [];
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
  });

  return (
    <div id={container} className={className}>
      {enableControlEvents && <MapControls id={id} mapRef={mapRef} />}
      <MapProvider id={id}>
        <MapLibre
          onMove={(evt) => setCameraState(id, evt.viewState)}
          mapStyle={BASE_MAP_STYLE}
          ref={mapRef}
          {...mapOptions}
        >
          <Deckgl
            {...rest}
            interleaved={interleaved}
            getCursor={handleGetCursor}
            useDevicePixels={useDevicePixels}
            onClick={handleClick}
            onHover={handleHover}
            onLoad={handleLoad}
            onViewStateChange={handleViewStateChange}
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
