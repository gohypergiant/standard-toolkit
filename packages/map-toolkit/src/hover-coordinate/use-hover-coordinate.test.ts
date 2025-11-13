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
import { uuid } from '@accelint/core';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MapEvents } from '../deckgl/base-map/events';
import { useHoverCoordinate } from './use-hover-coordinate';
import type { UniqueId } from '@accelint/core';
import type { MapEventType, MapHoverPayload } from '../deckgl/base-map/types';

describe('useHoverCoordinate', () => {
  let id: UniqueId;
  let bus: ReturnType<typeof Broadcast.getInstance<MapEventType>>;
  function createMockPayload(
    mapId: UniqueId,
    coordinate: [number, number] | null | undefined,
  ): MapHoverPayload {
    return {
      id: mapId,
      info: { coordinate } as Partial<MapHoverPayload['info']>,
      event: {} as MapHoverPayload['event'],
    } as MapHoverPayload;
  }

  beforeEach(() => {
    // Create fresh instances for each test
    id = uuid();

    // Get bus instance
    bus = Broadcast.getInstance<MapEventType>();
  });

  describe('Hook Behavior', () => {
    it('returns default placeholder on mount', () => {
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
  });

  describe('Format Changes', () => {
    it('resets coordinate string to placeholder when format type is changed', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      // First emit an event to set a coordinate
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [5, 5]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).not.toBe('--, --');
      });

      // Change format
      act(() => {
        result.current.setFormat('mgrs');
      });

      // Should reset to placeholder after state update
      await waitFor(() => {
        expect(result.current.formattedCoord).toBe('--, --');
      });
    });

    it('displays new format after emitting event post-format change', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      // Set initial coordinate
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [45, 45]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('45');
      });

      const firstFormat = result.current.formattedCoord;

      // Change format
      act(() => {
        result.current.setFormat('ddm');
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toBe('--, --');
      });

      // Emit another hover event
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [45, 45]));
      });

      await waitFor(() => {
        // Should be different from the dd format
        expect(result.current.formattedCoord).not.toBe(firstFormat);
        // DDM format will have space-separated values
        expect(result.current.formattedCoord).not.toBe('--, --');
      });
    });
  });

  describe('Multiple Map Instances', () => {
    it('ignores hover events from other map instances', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));
      const differentId: UniqueId = uuid();

      // Emit event for different map
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(differentId, [10, 10]));
      });

      // Should remain as default
      expect(result.current.formattedCoord).toBe('--, --');

      // Now emit for the correct map
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [5, 5]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).not.toBe('--, --');
      });
    });

    it('only responds to events matching its map id', async () => {
      const map1Id = uuid();
      const map2Id = uuid();

      const { result: result1 } = renderHook(() => useHoverCoordinate(map1Id));
      const { result: result2 } = renderHook(() => useHoverCoordinate(map2Id));

      // Emit to map 1
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(map1Id, [10, 10]));
      });

      await waitFor(() => {
        expect(result1.current.formattedCoord).toContain('10');
      });

      // Map 2 should still be default
      expect(result2.current.formattedCoord).toBe('--, --');

      // Emit to map 2
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(map2Id, [20, 20]));
      });

      await waitFor(() => {
        expect(result2.current.formattedCoord).toContain('20');
      });

      // Map 1 should still show its original value
      expect(result1.current.formattedCoord).toContain('10');
    });
  });

  describe('Edge Cases - Coordinate Boundaries', () => {
    it('handles negative longitude (western hemisphere)', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-122.4194, 37.7749]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('W');
        expect(result.current.formattedCoord).toContain('N');
      });
    });

    it('handles negative latitude (southern hemisphere)', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [151.2093, -33.8688]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('E');
        expect(result.current.formattedCoord).toContain('S');
      });
    });

    it('handles both negative coordinates (SW hemisphere)', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-70.6693, -33.4489]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('W');
        expect(result.current.formattedCoord).toContain('S');
      });
    });

    it('handles zero coordinates (null island)', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [0, 0]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).not.toBe('--, --');
      });
    });

    it('handles maximum longitude boundary (180°)', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [180, 0]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('180');
      });
    });

    it('handles minimum longitude boundary (-180°)', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-180, 0]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('180');
      });
    });

    it('handles maximum latitude boundary (90°)', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [0, 90]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('90');
      });
    });

    it('handles minimum latitude boundary (-90°)', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [0, -90]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('90');
      });
    });
  });

  describe('Edge Cases - International Date Line', () => {
    it('normalizes longitude > 180 (wraps from east)', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      // 181° should become -179°
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [181, 0]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('179');
        expect(result.current.formattedCoord).toContain('W');
      });
    });

    it('normalizes longitude < -180 (wraps from west)', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      // -181° should become 179°
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-181, 0]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('179');
        expect(result.current.formattedCoord).toContain('E');
      });
    });

    it('normalizes large positive longitude values', async () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      // 361° should become 1°
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [361, 0]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('1');
        expect(result.current.formattedCoord).toContain('E');
      });
    });
  });

  describe('Edge Cases - Invalid Coordinates', () => {
    it('handles events with null coordinate gracefully', () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, null));
      });

      // Should not crash and remain at default
      expect(result.current.formattedCoord).toBe('--, --');
    });

    it('handles events with undefined coordinate gracefully', () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, undefined));
      });

      // Should not crash and remain at default
      expect(result.current.formattedCoord).toBe('--, --');
    });

    it('handles events with malformed coordinate array gracefully', () => {
      const { result } = renderHook(() => useHoverCoordinate(id));

      const payload = {
        id,
        info: { coordinate: [1] } as Partial<MapHoverPayload['info']>,
        event: {} as MapHoverPayload['event'],
      } as MapHoverPayload;

      act(() => {
        bus.emit(MapEvents.hover, payload);
      });

      // Should either handle gracefully or stay at default
      // This tests that the hook doesn't crash
      expect(result.current.formattedCoord).toBeDefined();
    });
  });
});
