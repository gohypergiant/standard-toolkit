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

import { useOn } from '@accelint/bus/react';
import { MapEvents } from '@accelint/map-toolkit/deckgl';
import { useEffect } from 'react';
import type { Payload } from '@accelint/bus';
import type { MapClickEvent } from '@accelint/map-toolkit/deckgl';

export type MapTestViewport = {
  latitude: number;
  longitude: number;
  zoom: number;
  width: number;
  height: number;
  bounds?: [number, number, number, number];
  id: string;
};

/** Minimal, structured-cloneable snapshot of a picked feature. */
export type MapTestPick = {
  /** id of the deck.gl (sub)layer that was picked, if any. */
  layerId: string | null;
  /** `id` of the picked datum, if the click hit a feature. */
  objectId: string | number | null;
  /** Picked object index within the layer, or -1 when nothing was hit. */
  index: number;
};

export type MapTestHandle = {
  ready: boolean;
  viewport: MapTestViewport | null;
  viewportCount: number;
  /** Most recent click pick, populated by routes that wire BaseMap `onClick`. */
  lastPick: MapTestPick | null;
};

declare global {
  interface Window {
    __mapTest?: MapTestHandle;
  }
}

// Mirrors map-toolkit's (non-exported) MapViewportEvent, built from the public
// `MapEvents.viewport` name and the bus `Payload` shape so the bus generics line up.
type MapViewportBusEvent = Payload<typeof MapEvents.viewport, MapTestViewport>;

const EMPTY_HANDLE: MapTestHandle = {
  ready: false,
  viewport: null,
  viewportCount: 0,
  lastPick: null,
};

/**
 * Test-only bridge that mirrors BaseMap readiness and live camera state onto
 * `window.__mapTest` so Playwright integration tests can make deterministic
 * assertions without scraping the WebGL canvas.
 *
 * BaseMap emits `map:viewport` once deck.gl finishes initializing over MapLibre
 * (see its deck `onLoad` handler), so the first event doubles as the
 * "deck + maplibre ready" signal, and every later event reflects camera moves.
 *
 * It also mirrors the most recent click pick (emitted on `map:click`) onto
 * `lastPick`, so any route that drops layers into the shared map gets pick
 * assertions for free without wiring its own `onClick`.
 *
 * This renders nothing and is harmless in any build; it only sets a window
 * property. It exists for the example app's integration suite — not production.
 */
export function MapTestBridge() {
  // Seed the handle before the first event so tests can poll immediately.
  useEffect(() => {
    window.__mapTest ??= { ...EMPTY_HANDLE };
  }, []);

  useOn<MapViewportBusEvent>(MapEvents.viewport, (event) => {
    const current = window.__mapTest ?? EMPTY_HANDLE;

    window.__mapTest = {
      ...current,
      ready: true,
      viewport: event.payload,
      viewportCount: current.viewportCount + 1,
    };
  });

  useOn<MapClickEvent>(MapEvents.click, (event) => {
    const current = window.__mapTest ?? EMPTY_HANDLE;
    const { info } = event.payload;

    window.__mapTest = {
      ...current,
      lastPick: {
        layerId: info.layerId ?? null,
        objectId: (info.object as { id?: string | number })?.id ?? null,
        index: info.index,
      },
    };
  });

  return null;
}
