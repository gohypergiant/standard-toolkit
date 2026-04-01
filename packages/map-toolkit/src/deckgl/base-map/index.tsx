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
import { useCallback, useEffect, useId, useMemo, useRef } from 'react';
import {
  Map as MapLibre,
  type MapRef,
  useControl,
  type ViewState,
} from 'react-map-gl/maplibre';
import { useMapCamera } from '../../camera';
import { getCursor } from '../../map-cursor/store';
import { getMapGeneration } from '../../shared/cleanup';
import { DEFAULT_VIEW_STATE } from '../../shared/constants';
import { DARK_BASE_MAP_STYLE, PARAMETERS, PICKING_RADIUS } from './constants';
import { MapControls } from './controls';
import { MapEvents } from './events';
import { MapProvider } from './provider';
import { serializeMjolnirEvent, serializePickingInfo } from './serialization';
import type {
  IControl,
  Map as MaplibreMap,
  WebGLContextAttributesWithType,
} from 'maplibre-gl';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';
import type {
  BaseMapProps,
  MapClickEvent,
  MapHoverEvent,
  MapViewportEvent,
} from './types';

/** Options object passed to `deck.needsRedraw()` to trigger a synchronous redraw. */
const CLEAR_REDRAW_FLAGS = { clearRedrawFlags: true } as const;

/** WebGL2 canvas context attributes optimized for map rendering performance. */
const CANVAS_CONTEXT_ATTRIBUTES: WebGLContextAttributesWithType = {
  antialias: true,
  powerPreference: 'high-performance',
  preserveDrawingBuffer: false,
  failIfMajorPerformanceCaveat: false,
  desynchronized: false,
  contextType: 'webgl2',
} as const;

/**
 * Internal component that registers the Deck.gl instance as a MapLibre control.
 * Enables the Deck.gl canvas to render within the MapLibre GL map container.
 *
 * @returns null (headless component)
 */
function AddDeckglControl() {
  const deckglInstance = useDeckgl();
  useControl(() => deckglInstance as IControl);

  // In interleaved mode, getDeckInstance registers map.on('move', handler)
  // to keep the deck viewport in sync with MapLibre. However, that handler
  // self-deregisters if deck.isInitialized is false on the first move event.
  // MapLibre can fire a 'move' during its own initialization before deck
  // finishes initializing, permanently killing the viewport sync. This
  // control re-registers the sync so picking coordinates stay accurate.
  useControl(() => {
    let onMapMove: (() => void) | undefined;
    let mapInstance: MaplibreMap | undefined;

    return {
      onAdd(map: MaplibreMap) {
        mapInstance = map;
        onMapMove = () => {
          // biome-ignore lint/suspicious/noExplicitAny: accessing private deck.gl property on MapLibre map instance
          const deck = (map as any).__deck as
            | {
                isInitialized: boolean;
                setProps: (p: Record<string, unknown>) => void;
                needsRedraw: (o: Record<string, boolean>) => void;
              }
            | undefined;
          if (deck?.isInitialized) {
            const { lng, lat } = map.getCenter();
            deck.setProps({
              viewState: {
                longitude: ((lng + 540) % 360) - 180,
                latitude: lat,
                zoom: map.getZoom(),
                bearing: map.getBearing(),
                pitch: map.getPitch(),
                padding: map.getPadding(),
                repeat: map.getRenderWorldCopies(),
              },
            });
            deck.needsRedraw(CLEAR_REDRAW_FLAGS);
          }
        };
        map.on('move', onMapMove);
        return document.createElement('div');
      },
      onRemove() {
        if (mapInstance && onMapMove) {
          mapInstance.off('move', onMapMove);
        }
      },
    };
  });

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
 * @param props - BaseMap component props.
 * @param props.id - Unique identifier for this map instance, used in event bus payloads and mode management.
 * @param props.className - CSS class applied to the root container div.
 * @param props.children - Deck.gl layer components to render within the map.
 * @param props.controller - Whether Deck.gl controller is enabled (default: true).
 * @param props.enableControlEvents - Whether to attach keyboard/mouse control event listeners (default: true).
 * @param props.interleaved - Whether to interleave Deck.gl layers with MapLibre layers (default: true).
 * @param props.parameters - WebGL parameters merged with base defaults.
 * @param props.styleUrl - MapLibre style URL (default: dark base map).
 * @param props.defaultView - Initial camera view mode, '2D' or '3D' (default: '2D').
 * @param props.initialViewState - Initial map position (zoom, latitude, longitude).
 * @param props.onClick - Callback fired on map click with PickingInfo and MjolnirGestureEvent.
 * @param props.onHover - Callback fired on map hover with PickingInfo and MjolnirPointerEvent.
 * @param props.onViewStateChange - Callback fired when the map viewport changes.
 * @param props.pickingRadius - Pixel radius for object picking (default: PICKING_RADIUS constant).
 * @returns A map component with Deck.gl and MapLibre GL integration.
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
  styleUrl = DARK_BASE_MAP_STYLE,
  useDevicePixels = false,
  widgets: widgetsProp = [],
  defaultView = '2D',
  initialViewState,
  onClick,
  onHover,
  onViewStateChange,
  pickingRadius,
  ...rest
}: BaseMapProps) {
  const mapGeneration = getMapGeneration(id);
  const deckglInstance = useDeckgl();
  const container = useId();
  const mapRef = useRef<MapRef>(null);

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
      canvasContextAttributes: CANVAS_CONTEXT_ATTRIBUTES,
    }),
    [viewState, container, cameraState.projection, cameraState.view],
  );

  const emitClick = useEmit<MapClickEvent>(MapEvents.click);
  const emitHover = useEmit<MapHoverEvent>(MapEvents.hover);
  const emitViewport = useEmit<MapViewportEvent>(MapEvents.viewport);

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

  const mergedParameters = useMemo(
    () => ({ ...PARAMETERS, ...parameters }),
    [parameters],
  );

  const handleGetCursor = useCallback(() => {
    return getCursor(id);
  }, [id]);

  const handleMapMove = useEffectEvent((evt: { viewState: ViewState }) => {
    setCameraState(evt.viewState);
  });

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
        bounds: viewport.getBounds(),
        latitude,
        longitude,
        zoom,
        width: viewport.width ?? 0,
        height: viewport.height ?? 0,
      });
    },
  );

  const emitAllViewports = useCallback(
    (dimensionOverride?: { width: number; height: number }) => {
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
            width: dimensionOverride?.width ?? vp.width,
            height: dimensionOverride?.height ?? vp.height,
          },
        } as ViewStateChangeParameters);
      }
    },
    [deckglInstance, handleViewStateChange],
  );

  const handleResize = useEffectEvent(
    (params: { width: number; height: number }) => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        emitAllViewports(params);
      }, 200);
    },
  );

  // Clean up debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  const handleLoad = useEffectEvent(() => {
    emitAllViewports();
  });

  return (
    <div id={container} className={className}>
      {enableControlEvents && <MapControls id={id} mapRef={mapRef} />}
      <MapProvider id={id}>
        <MapLibre
          key={mapGeneration}
          onMove={handleMapMove}
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
            onLoad={handleLoad}
            onResize={handleResize}
            onViewStateChange={handleViewStateChange}
            widgets={widgetsProp}
            // @ts-expect-error - DeckglProps parameters type is overly strict for WebGL parameter spreading.
            // The merged object is valid at runtime but TypeScript cannot verify all possible parameter combinations.
            parameters={mergedParameters}
          >
            <AddDeckglControl />
            {children}
          </Deckgl>
        </MapLibre>
      </MapProvider>
    </div>
  );
}
