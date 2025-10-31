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
import { useEmit } from '@accelint/bus/react';
import { Deckgl, useDeckgl } from '@deckgl-fiber-renderer/dom';
import { useCallback, useId, useMemo } from 'react';
import { INITIAL_VIEW_STATE } from '../../maplibre/constants';
import { useMapLibre } from '../../maplibre/hooks/use-maplibre';
import { BASE_MAP_STYLE, PARAMETERS } from './constants';
import { MapEvents } from './events';
import { MapProvider } from './provider';
import type { UniqueId } from '@accelint/core';
import type { PickingInfo } from '@deck.gl/core';
import type { DeckglProps } from '@deckgl-fiber-renderer/types';
import type { IControl } from 'maplibre-gl';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';
import type { MapClickEvent, MapHoverEvent } from './types';

/**
 * Props for the BaseMap component.
 * Extends all Deck.gl props and adds additional map-specific properties.
 */
export type BaseMapProps = DeckglProps & {
  /** Optional CSS class name to apply to the map container element */
  className?: string;
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
};

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
  className,
  children,
  id,
  onClick,
  onHover,
  parameters,
  ...rest
}: BaseMapProps) {
  const deckglInstance = useDeckgl();
  const container = useId();

  // Memoize MapLibre options to avoid creating new object on every render
  const mapOptions = useMemo(
    () => ({
      container,
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude] as [
        number,
        number,
      ],
      zoom: INITIAL_VIEW_STATE.zoom,
      doubleClickZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      rollEnabled: false,
    }),
    [container],
  );

  // Use the custom hook to handle MapLibre
  useMapLibre(deckglInstance as IControl, BASE_MAP_STYLE, mapOptions);

  const emitClick = useEmit<MapClickEvent>(MapEvents.click);
  const emitHover = useEmit<MapHoverEvent>(MapEvents.hover);

  const handleMapClick = useCallback(
    (info: PickingInfo, event: MjolnirGestureEvent) => {
      // send full pickingInfo and event to user-defined onClick
      onClick?.(info, event);

      // the bus cannot serialize functions, so we omit them from the event payloads
      const { viewport, ...infoRest } = info;
      const {
        stopImmediatePropagation,
        stopPropagation,
        preventDefault,
        srcEvent,
        rootElement,
        target,
        changedPointers,
        pointers,
        ...eventRest
      } = event;

      emitClick({
        info: infoRest,
        event: eventRest,
        id,
      });
    },
    [emitClick, id, onClick],
  );

  const handleMapHover = useCallback(
    (info: PickingInfo, event: MjolnirPointerEvent) => {
      // send full pickingInfo and event to user-defined onHover
      onHover?.(info, event);

      // the bus cannot serialize functions, so we omit them from the event payloads
      const { viewport, ...infoRest } = info;
      const {
        stopImmediatePropagation,
        stopPropagation,
        preventDefault,
        srcEvent,
        rootElement,
        target,
        ...eventRest
      } = event;

      emitHover({
        info: infoRest,
        event: eventRest,
        id,
      });
    },
    [emitHover, id, onHover],
  );

  return (
    <div id={container} className={className}>
      <MapProvider id={id}>
        <Deckgl
          {...rest}
          controller
          interleaved
          useDevicePixels={false}
          onHover={handleMapHover}
          onClick={handleMapClick}
          // @ts-expect-error - DeckglProps parameters type is overly strict for WebGL parameter spreading.
          // The merged object is valid at runtime but TypeScript cannot verify all possible parameter combinations.
          parameters={{ ...PARAMETERS, ...parameters }}
        >
          {children}
        </Deckgl>
      </MapProvider>
    </div>
  );
}
