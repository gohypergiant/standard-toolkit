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
import { Broadcast } from '@accelint/bus';
import { Deckgl, useDeckgl } from '@deckgl-fiber-renderer/dom';
import { useCallback } from 'react';
import { useMapLibre } from '../../hooks/use-maplibre';
import { INITIAL_VIEW_STATE, MAP_STYLE, PARAMETERS } from './constants';
import { MapEvents } from './events';
import type { PickingInfo } from '@deck.gl/core';
import type { IControl } from 'maplibre-gl';
import type { MapEventType } from './types';

type MapClientProps = {
  children: React.ReactNode;
};

export const bus = Broadcast.getInstance<MapEventType>();

export function MapClient({ children }: MapClientProps) {
  const deckglInstance = useDeckgl();

  // Use the custom hook to handle MapLibre
  useMapLibre(deckglInstance as IControl, MAP_STYLE, {
    container: 'map-client',
    center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
    zoom: INITIAL_VIEW_STATE.zoom,
    doubleClickZoom: false,
    dragRotate: false,
    pitchWithRotate: false,
    rollEnabled: false,
  });

  const handleMapHover = (pickingInfo: PickingInfo) => {
    bus.emit(MapEvents.hover, {
      layer: pickingInfo.layer,
      coordinate: pickingInfo.coordinate,
    });
  };

  const handleMapClick = useCallback((pickingInfo: PickingInfo) => {
    bus.emit(MapEvents.click, {
      layer: pickingInfo.layer,
      coordinate: pickingInfo.coordinate,
    });
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }} id='map-client'>
      <Deckgl
        controller
        interleaved
        useDevicePixels={false}
        onHover={handleMapHover}
        onClick={handleMapClick}
        // @ts-expect-error TODO: conflict with deckgl type
        parameters={PARAMETERS}
      >
        {children}
      </Deckgl>
    </div>
  );
}
