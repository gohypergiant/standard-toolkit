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
import { useOn } from '@accelint/bus/react';
import { MapEvents } from '../deckgl/base-map/events';
import type { UniqueId } from '@accelint/core';
import type { Map as MapLibre } from 'maplibre-gl';
import type { RefObject } from 'react';
import type {
  MapDisablePanEvent,
  MapDisableZoomEvent,
  MapEnablePanEvent,
  MapEnableZoomEvent,
} from '../deckgl/base-map/types';

type MapControlsProps = {
  id: UniqueId;
  mapRef: RefObject<MapLibre | null>;
};

/**
 * Headless component that listens for map control events and applies them to the MapLibre instance.
 *
 * This component should be rendered inside BaseMap to wire up event listeners
 * for pan and zoom control events.
 *
 * @example
 * ```tsx
 * // Inside BaseMap component
 * <MapControls id={id} mapRef={mapLibreRef} />
 * ```
 */
export function MapControls({ id, mapRef }: MapControlsProps) {
  useOn<MapEnablePanEvent>(MapEvents.enablePan, (event) => {
    if (event.payload.id === id) {
      mapRef.current?.dragPan.enable();
    }
  });

  useOn<MapDisablePanEvent>(MapEvents.disablePan, (event) => {
    if (event.payload.id === id) {
      mapRef.current?.dragPan.disable();
    }
  });

  useOn<MapEnableZoomEvent>(MapEvents.enableZoom, (event) => {
    if (event.payload.id === id) {
      mapRef.current?.scrollZoom.enable();
      mapRef.current?.doubleClickZoom.enable();
    }
  });

  useOn<MapDisableZoomEvent>(MapEvents.disableZoom, (event) => {
    if (event.payload.id === id) {
      mapRef.current?.scrollZoom.disable();
      mapRef.current?.doubleClickZoom.disable();
    }
  });

  return null;
}
