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

export const bus = Broadcast.getInstance<MapEventType>();

export type UseViewportStateProps = {
  viewId: string;
  subscribe?: Parameters<typeof useSyncExternalStore<MapViewportPayload>>[0];
  getSnapshot?: Parameters<typeof useSyncExternalStore<MapViewportPayload>>[1];
  getServerSnapshot?: Parameters<
    typeof useSyncExternalStore<MapViewportPayload>
  >[2];
};

const viewportStore = new Map<string, MapViewportPayload>();

function defaultSubscription(onStoreChange: () => void, viewId: string) {
  const handler = (e: MapViewportEvent) => {
    if (viewId === e.payload.id) {
      viewportStore.set(viewId, e.payload);
      onStoreChange();
    }
  };

  const unsub = bus.on(MapEvents.viewport, handler);

  return unsub;
}

function getViewportSnapshot(viewId: string): MapViewportPayload {
  return viewportStore.get(viewId) ?? {};
}

export function useViewportState({
  viewId,
  subscribe,
  getSnapshot,
  getServerSnapshot,
}: UseViewportStateProps) {
  const subscribeFn =
    subscribe ??
    ((onStoreChange) => defaultSubscription(onStoreChange, viewId));

  const getSnapshotFn = getSnapshot ?? (() => getViewportSnapshot(viewId));

  const viewState = useSyncExternalStore<MapViewportPayload>(
    subscribeFn,
    getSnapshotFn,
    getServerSnapshot,
  );

  return viewState;
}

export type ViewportScaleProps = ComponentProps<'span'> & {
  unit?: AllowedUnit;
};

/**
 * A span with the currend viewport bounds, i.e. `660 x 1,801 NMI`
 * @param {Object} props - Extends `<span>` props
 * @param {string} props.unit - Measure of distance, `km | m | nmi | mi | ft`. Defaults to `nmi`
 * @param {string} props.className - styles
 */
export function ViewportScale({
  unit,
  className,
  ...rest
}: ViewportScaleProps) {
  const { bounds } = useViewportState({ viewId: 'default ' });
  const scale = getViewportScale({ bounds, unit });

  return (
    <span className={className} {...rest}>
      {scale}
    </span>
  );
}
