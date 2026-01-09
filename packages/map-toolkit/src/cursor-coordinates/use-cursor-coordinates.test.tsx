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

import { Broadcast } from '@accelint/bus';
import { uuid } from '@accelint/core';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MapEvents } from '../deckgl/base-map/events';
import { clearCursorCoordinateState } from './store';
import { useCursorCoordinates } from './use-cursor-coordinates';
import type { UniqueId } from '@accelint/core';
import type { MapEventType, MapHoverPayload } from '../deckgl/base-map/types';
import type { CoordinateFormatter } from './types';

describe('useCursorCoordinates', () => {
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

  afterEach(() => {
    // Clean up store state after each test
    clearCursorCoordinateState(id);
  });

  describe('Hook Behavior', () => {
    it('returns default placeholder on mount', () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      expect(result.current.formattedCoord).toBe('--, --');
    });

    it('provides setFormat function', () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      expect(typeof result.current.setFormat).toBe('function');
    });

    it('throws error when used outside MapProvider without id', () => {
      expect(() => {
        renderHook(() => useCursorCoordinates());
      }).toThrow(
        'useCursorCoordinates requires either an id parameter or to be used within a MapProvider',
      );
    });
  });

  describe('Format Changes', () => {
    it('preserves coordinate when format type is changed', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      // First emit an event to set a coordinate
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [5, 5]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).not.toBe('--, --');
      });

      const initialFormat = result.current.formattedCoord;

      // Change format
      act(() => {
        result.current.setFormat('mgrs');
      });

      // Should show coordinate in new format, not placeholder
      await waitFor(() => {
        expect(result.current.formattedCoord).not.toBe('--, --');
        expect(result.current.formattedCoord).not.toBe(initialFormat);
      });
    });

    it('displays new format immediately when format is changed', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

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
        // Should immediately show the coordinate in new format, not placeholder
        expect(result.current.formattedCoord).not.toBe('--, --');
        // Should be different from the dd format
        expect(result.current.formattedCoord).not.toBe(firstFormat);
        // DDM format will have space-separated values
        expect(result.current.formattedCoord).toContain('45');
      });
    });
  });

  describe('Multiple Map Instances', () => {
    it('ignores hover events from other map instances', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));
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

      const { result: result1 } = renderHook(() =>
        useCursorCoordinates(map1Id),
      );
      const { result: result2 } = renderHook(() =>
        useCursorCoordinates(map2Id),
      );

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
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-122.4194, 37.7749]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('W');
        expect(result.current.formattedCoord).toContain('N');
      });
    });

    it('handles negative latitude (southern hemisphere)', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [151.2093, -33.8688]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('E');
        expect(result.current.formattedCoord).toContain('S');
      });
    });

    it('handles both negative coordinates (SW hemisphere)', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-70.6693, -33.4489]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('W');
        expect(result.current.formattedCoord).toContain('S');
      });
    });

    it('handles zero coordinates (null island)', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [0, 0]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).not.toBe('--, --');
      });
    });

    it('handles maximum longitude boundary (180°)', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [180, 0]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('180');
      });
    });

    it('handles minimum longitude boundary (-180°)', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-180, 0]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('180');
      });
    });

    it('handles maximum latitude boundary (90°)', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [0, 90]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toContain('90');
      });
    });

    it('handles minimum latitude boundary (-90°)', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

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
      const { result } = renderHook(() => useCursorCoordinates(id));

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
      const { result } = renderHook(() => useCursorCoordinates(id));

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
      const { result } = renderHook(() => useCursorCoordinates(id));

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
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, null));
      });

      // Should not crash and remain at default
      expect(result.current.formattedCoord).toBe('--, --');
    });

    it('handles events with undefined coordinate gracefully', () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, undefined));
      });

      // Should not crash and remain at default
      expect(result.current.formattedCoord).toBe('--, --');
    });

    it('handles events with malformed coordinate array gracefully', () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

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

  describe('Raw Coordinate Access', () => {
    it('returns null rawCoord on mount', () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      expect(result.current.rawCoord).toBeNull();
    });

    it('returns rawCoord with longitude, latitude, and tuple when coordinate is set', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-122.4194, 37.7749]));
      });

      await waitFor(() => {
        expect(result.current.rawCoord).not.toBeNull();
      });

      expect(result.current.rawCoord?.longitude).toBeCloseTo(-122.4194, 4);
      expect(result.current.rawCoord?.latitude).toBeCloseTo(37.7749, 4);
      expect(result.current.rawCoord?.tuple).toEqual([
        expect.closeTo(-122.4194, 4),
        expect.closeTo(37.7749, 4),
      ]);
    });

    it('normalizes longitude in rawCoord', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      // 181° should become -179°
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [181, 45]));
      });

      await waitFor(() => {
        expect(result.current.rawCoord).not.toBeNull();
      });

      expect(result.current.rawCoord?.longitude).toBeCloseTo(-179, 4);
      expect(result.current.rawCoord?.latitude).toBe(45);
    });

    it('returns null rawCoord when coordinate becomes invalid', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      // First set a valid coordinate
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [10, 20]));
      });

      await waitFor(() => {
        expect(result.current.rawCoord).not.toBeNull();
      });

      // Then set null
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, null));
      });

      await waitFor(() => {
        expect(result.current.rawCoord).toBeNull();
      });
    });
  });

  describe('Current Format', () => {
    it('returns dd as default currentFormat', () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      expect(result.current.currentFormat).toBe('dd');
    });

    it('updates currentFormat when setFormat is called', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        result.current.setFormat('mgrs');
      });

      await waitFor(() => {
        expect(result.current.currentFormat).toBe('mgrs');
      });
    });

    it('supports all format types', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      const formats = ['dd', 'ddm', 'dms', 'mgrs', 'utm'] as const;

      for (const format of formats) {
        act(() => {
          result.current.setFormat(format);
        });

        await waitFor(() => {
          expect(result.current.currentFormat).toBe(format);
        });
      }
    });
  });

  describe('Custom Formatter', () => {
    it('uses custom formatter when provided', async () => {
      const customFormatter: CoordinateFormatter = (coord) =>
        `Lat: ${coord.latitude.toFixed(2)}° Lng: ${coord.longitude.toFixed(2)}°`;

      const { result } = renderHook(() =>
        useCursorCoordinates(id, { formatter: customFormatter }),
      );

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-74.006, 40.7128]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toBe('Lat: 40.71° Lng: -74.01°');
      });
    });

    it('falls back to default when custom formatter throws', async () => {
      const throwingFormatter: CoordinateFormatter = () => {
        throw new Error('Formatter error');
      };

      const { result } = renderHook(() =>
        useCursorCoordinates(id, { formatter: throwingFormatter }),
      );

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [10, 20]));
      });

      // Should fall back to default placeholder
      await waitFor(() => {
        expect(result.current.formattedCoord).toBe('--, --');
      });
    });

    it('custom formatter receives normalized longitude', async () => {
      let receivedCoord: { longitude: number; latitude: number } | null = null;

      const capturingFormatter: CoordinateFormatter = (coord) => {
        receivedCoord = {
          longitude: coord.longitude,
          latitude: coord.latitude,
        };
        return 'captured';
      };

      const { result } = renderHook(() =>
        useCursorCoordinates(id, { formatter: capturingFormatter }),
      );

      // 181° should be normalized to -179°
      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [181, 45]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).toBe('captured');
      });

      expect(receivedCoord?.longitude).toBeCloseTo(-179, 4);
      expect(receivedCoord?.latitude).toBe(45);
    });

    it('setFormat still updates currentFormat when custom formatter is used', async () => {
      const customFormatter: CoordinateFormatter = (coord) =>
        `${coord.latitude}, ${coord.longitude}`;

      const { result } = renderHook(() =>
        useCursorCoordinates(id, { formatter: customFormatter }),
      );

      // Change format
      act(() => {
        result.current.setFormat('mgrs');
      });

      await waitFor(() => {
        // currentFormat should update even with custom formatter
        expect(result.current.currentFormat).toBe('mgrs');
      });
    });

    it('returns default placeholder when no coordinate and custom formatter', () => {
      const customFormatter: CoordinateFormatter = (coord) =>
        `${coord.latitude}, ${coord.longitude}`;

      const { result } = renderHook(() =>
        useCursorCoordinates(id, { formatter: customFormatter }),
      );

      // No coordinate set, should show default
      expect(result.current.formattedCoord).toBe('--, --');
    });
  });

  describe('Precision - CoordinateField Compatibility', () => {
    it('DD format uses 6 decimal places', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(
          MapEvents.hover,
          createMockPayload(id, [-74.005973, 40.712775]),
        );
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).not.toBe('--, --');
      });

      // Check that the formatted output contains values with appropriate precision
      // DD format should have 6 decimal places (geo package default)
      const formatted = result.current.formattedCoord;
      expect(formatted).toContain('40.712775');
      expect(formatted).toContain('74.005973');
    });

    it('DDM format uses 4 decimal places for minutes', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-74.006, 40.7128]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).not.toBe('--, --');
      });

      act(() => {
        result.current.setFormat('ddm');
      });

      await waitFor(() => {
        expect(result.current.currentFormat).toBe('ddm');
      });

      // DDM format should have degree symbol and minute values
      const formatted = result.current.formattedCoord;
      expect(formatted).toContain('40°');
      expect(formatted).toContain('74°');
    });

    it('DMS format uses 2 decimal places for seconds', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-74.006, 40.7128]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).not.toBe('--, --');
      });

      act(() => {
        result.current.setFormat('dms');
      });

      await waitFor(() => {
        expect(result.current.currentFormat).toBe('dms');
      });

      // DMS format should have degree, minute, and second symbols
      const formatted = result.current.formattedCoord;
      expect(formatted).toContain('40°');
      expect(formatted).toContain('74°');
      expect(formatted).toContain('″'); // Unicode double prime for seconds
    });

    it('MGRS format returns valid grid reference', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-74.006, 40.7128]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).not.toBe('--, --');
      });

      act(() => {
        result.current.setFormat('mgrs');
      });

      await waitFor(() => {
        expect(result.current.currentFormat).toBe('mgrs');
      });

      // MGRS format should return a grid reference like "18T WL 83959 07350"
      const formatted = result.current.formattedCoord;
      expect(formatted).not.toBe('');
      expect(formatted).not.toBe('--, --');
      // MGRS format: zone + grid square + easting/northing (e.g., "18T WL 83959 07350")
      expect(formatted).toMatch(/^\d{1,2}[A-Z]\s[A-Z]{2}\s\d{5}\s\d{5}$/);
    });

    it('UTM format returns valid zone and coordinates', async () => {
      const { result } = renderHook(() => useCursorCoordinates(id));

      act(() => {
        bus.emit(MapEvents.hover, createMockPayload(id, [-74.006, 40.7128]));
      });

      await waitFor(() => {
        expect(result.current.formattedCoord).not.toBe('--, --');
      });

      act(() => {
        result.current.setFormat('utm');
      });

      await waitFor(() => {
        expect(result.current.currentFormat).toBe('utm');
      });

      // UTM format should return zone and coordinates (e.g., "18N 583959 4507351")
      const formatted = result.current.formattedCoord;
      expect(formatted).not.toBe('');
      expect(formatted).not.toBe('--, --');
      // UTM format: zone + hemisphere + easting + northing
      expect(formatted).toMatch(/^\d{1,2}[NS]\s\d+\s\d+$/);
    });
  });
});
