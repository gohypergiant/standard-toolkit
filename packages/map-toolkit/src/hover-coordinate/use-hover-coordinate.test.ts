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

//import { Broadcast } from '@accelint/bus';
import { useEmit } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetMockBroadcastChannel } from 'vitest-broadcast-channel-mock';
import { MapEvents } from '../deckgl/base-map/events';
import { useHoverCoordinate } from './use-hover-coordinate';
import type { UniqueId } from '@accelint/core';
import type {
  //MapEventType,
  MapHoverEvent,
  MapHoverPayload,
} from '../deckgl/base-map/types';

describe('useHoverCoordinates', () => {
  let id: UniqueId = uuid();
  // let bus: ReturnType<typeof Broadcast.getInstance<MapEventType>>;
  let mockPayload: MapHoverPayload;

  beforeEach(() => {
    // Create fresh instances for each test
    id = uuid();

    // Get bus instance AFTER mocking
    // bus = Broadcast.getInstance<MapEventType>();

    mockPayload = {
      id,
      info: { coordinate: [5, 5] } as any,
      event: {} as any,
    };
  });

  afterEach(() => {
    // Clean up bus
    resetMockBroadcastChannel();
  });

  describe('Hook Behavior', () => {
    it('returns --, -- for coordinate on mount', () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      expect(result.current.formattedCoord).toBe('--, --');
    });

    it('provides setFormat function', () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      expect(typeof result.current.setFormat).toBe('function');
    });

    it('throws error when used outside MapProvider without id', () => {
      expect(() => {
        renderHook(() => useHoverCoordinate());
      }).toThrow(
        'useHoverCoordinate requires either an id parameter or to be used within a MapProvider',
      );
    });

    it('updates coordinate value on map hover event', () => {
      const emitHover = useEmit<MapHoverEvent>(MapEvents.hover);
      const { result } = renderHook(() => useHoverCoordinate(id));
      // const listener = vi.fn();
      // bus.on(MapEvents.hover, listener);

      emitHover(mockPayload);

      console.log(`Value: ${result.current.formattedCoord}`);

      expect(result.current.formattedCoord).toEqual('hello');
    });

    it('resets coordinate string when format type is changed', () => {
      const emitHover = useEmit<MapHoverEvent>(MapEvents.hover);
      const { result } = renderHook(() => useHoverCoordinate(id));
      // const listener = vi.fn();
      // bus.on(MapEvents.hover, listener);

      emitHover(mockPayload);
      result.current.setFormat('mgrs');

      expect(result.current.formattedCoord).toBe('--, --');
    });
  });
});
