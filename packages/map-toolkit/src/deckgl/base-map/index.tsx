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
import { useEmit } from '@accelint/bus/react';
import { Deckgl, useDeckgl } from '@deckgl-fiber-renderer/dom';
import { useCallback, useId } from 'react';
import { INITIAL_VIEW_STATE } from '../../maplibre/constants';
import { useMapLibre } from '../../maplibre/hooks/use-maplibre';
import { BASE_MAP_STYLE, PARAMETERS } from './constants';
import { MapEvents } from './events';
import type { PickingInfo } from '@deck.gl/core';
import type { DeckglProps } from '@deckgl-fiber-renderer/types';
import type { IControl } from 'maplibre-gl';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';
import type { MapClickEvent, MapEventType, MapHoverEvent } from './types';

type BaseMapProps = DeckglProps & {
  className?: string;
};

export const bus = Broadcast.getInstance<MapEventType>();

export function BaseMap({
  children,
  onClick,
  onHover,
  className,
  parameters,
  ...rest
}: BaseMapProps) {
  const deckglInstance = useDeckgl();
  const container = useId();

  // Use the custom hook to handle MapLibre
  useMapLibre(deckglInstance as IControl, BASE_MAP_STYLE, {
    container,
    center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
    zoom: INITIAL_VIEW_STATE.zoom,
    doubleClickZoom: false,
    dragRotate: false,
    pitchWithRotate: false,
    rollEnabled: false,
  });

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
      });
    },
    [emitClick, onClick],
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
      });
    },
    [emitHover, onHover],
  );

  return (
    <div id={container} className={className}>
      <Deckgl
        {...rest}
        controller
        interleaved
        useDevicePixels={false}
        onHover={handleMapHover}
        onClick={handleMapClick}
        // @ts-expect-error TODO: conflict with deckgl type
        parameters={{ ...PARAMETERS, ...parameters }}
      >
        {children}
      </Deckgl>
    </div>
  );
}
