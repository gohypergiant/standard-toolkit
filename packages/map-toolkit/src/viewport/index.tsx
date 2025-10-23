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

import { Broadcast } from '@accelint/bus';
import { type ComponentProps, useSyncExternalStore } from 'react';
import { MapEvents } from '../deckgl/base-map/events';
import { getViewportScale } from './utils';
import type {
  MapEventType,
  MapViewportEvent,
  MapViewportPayload,
} from '../deckgl/base-map/types';
import type { AllowedUnit } from './types';

const bus = Broadcast.getInstance<MapEventType>();

export type UseViewportStateProps = {
  viewId: string;
  subscribe?: Parameters<typeof useSyncExternalStore<MapViewportPayload>>[0];
  getSnapshot?: Parameters<typeof useSyncExternalStore<MapViewportPayload>>[1];
  getServerSnapshot?: Parameters<
    typeof useSyncExternalStore<MapViewportPayload>
  >[2];
};

const viewportStore = new Map<string, MapViewportPayload>();
const defaultSnapshot = {};

const defaultSubscription = (viewId: string) => (onStoreChange: () => void) => {
  const handler = (e: MapViewportEvent) => {
    if (viewId === e.payload.id) {
      /**
       * onStoreChange just tells react to run "getSnapshot". We can't pass anything
       * to that function directly from here, so we need to store the value somewhere that it can grab it.
       */
      viewportStore.set(viewId, e.payload);
      onStoreChange();
    }
  };

  const unsub = bus.on(MapEvents.viewport, handler);

  return unsub;
};

/**
 * The object returned gets equality checked, so it needs to be stable or react blows up.
 */
const defaultViewportSnapshot = (viewId: string) => (): MapViewportPayload => {
  return viewportStore.get(viewId) ?? defaultSnapshot;
};

/**
 * A thin wrapper around [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore).
 * If you pass in a custom subscribe/getSnapshot you are in full control, otherwise the hook will subscribe to map:viewport
 * events from the Bus.
 *
 * @param {string} viewId - The id of the subscribed viewport.
 *
 * @example
 *
 * const { bounds, id, latitude, longitude, zoom } = useViewportState({ viewId: 'default' });
 */
export function useViewportState({
  viewId,
  subscribe,
  getSnapshot,
  getServerSnapshot,
}: UseViewportStateProps) {
  const viewState = useSyncExternalStore<MapViewportPayload>(
    subscribe ?? defaultSubscription(viewId),
    getSnapshot ?? defaultViewportSnapshot(viewId),
    getServerSnapshot,
  );

  return viewState;
}

export type ViewportScaleProps = ComponentProps<'span'> & {
  viewId: string;
  unit?: AllowedUnit;
};

/**
 * A span with the current viewport bounds, i.e. `660 x 1,801 NMI`
 * @param {Object} props - Extends `<span>` props
 * @param {string} props.viewId - The id of the view to subscribe to.
 * @param {string} props.unit - Measure of distance, `km | m | nmi | mi | ft`. Defaults to `nmi`
 * @param {string} props.className - styles
 */
export function ViewportScale({
  viewId,
  unit = 'nmi',
  className,
  ...rest
}: ViewportScaleProps) {
  const { bounds } = useViewportState({ viewId });
  const scale = getViewportScale({ bounds, unit });

  return (
    <span className={className} {...rest}>
      {scale}
    </span>
  );
}
