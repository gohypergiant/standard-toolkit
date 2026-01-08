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
import { MapEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { RefObject } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';
import type {
  MapDisablePanEvent,
  MapDisableZoomEvent,
  MapEnablePanEvent,
  MapEnableZoomEvent,
} from './types';

type MapControlsProps = {
  id: UniqueId;
  mapRef: RefObject<MapRef | null>;
};

/**
 * Headless component that listens for map control events and applies them to the MapLibre instance.
 *
 * This component is rendered inside BaseMap to wire up event listeners
 * for pan and zoom control events.
 */
export function MapControls({ id, mapRef }: MapControlsProps) {
  useOn<MapEnablePanEvent>(MapEvents.enablePan, (event) => {
    if (event.payload.id === id) {
      mapRef.current?.getMap().dragPan.enable();
    }
  });

  useOn<MapDisablePanEvent>(MapEvents.disablePan, (event) => {
    if (event.payload.id === id) {
      mapRef.current?.getMap().dragPan.disable();
    }
  });

  useOn<MapEnableZoomEvent>(MapEvents.enableZoom, (event) => {
    if (event.payload.id === id) {
      mapRef.current?.getMap().scrollZoom.enable();
      mapRef.current?.getMap().doubleClickZoom.enable();
      mapRef.current?.getMap().boxZoom.enable();
    }
  });

  useOn<MapDisableZoomEvent>(MapEvents.disableZoom, (event) => {
    if (event.payload.id === id) {
      mapRef.current?.getMap().scrollZoom.disable();
      mapRef.current?.getMap().doubleClickZoom.disable();
      mapRef.current?.getMap().boxZoom.disable();
    }
  });

  return null;
}
