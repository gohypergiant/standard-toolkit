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
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MapEvents } from '../../base-map/events';
import { clearSelection } from './store';
import { CoffinCornerEvents } from './types';
import { useCoffinCorner } from './use-coffin-corner';
import type { UniqueId } from '@accelint/core';
import type { MapEventType } from '../../base-map/types';
import type { CoffinCornerEvent } from './types';

/** Minimal MapEvents.hover payload — only the fields the store reads. */
function createHoverEvent(id: UniqueId, info: Record<string, unknown> = {}) {
  return {
    id,
    info: {
      index: 0,
      picked: true,
      x: 0,
      y: 0,
      coordinate: [0, 0],
      pixel: [0, 0],
      devicePixel: [0, 0],
      pixelRatio: 1,
      color: null,
      ...info,
    },
    event: {} as never,
  };
}

describe('useCoffinCorner', () => {
  let mapId: UniqueId;
  let layerId: string;
  let bus: ReturnType<typeof Broadcast.getInstance<CoffinCornerEvent>>;

  beforeEach(() => {
    mapId = uuid();
    layerId = 'symbols';
    bus = Broadcast.getInstance();
  });

  afterEach(() => {
    clearSelection(mapId, layerId);
  });

  describe('initial state', () => {
    it('should return undefined for selectedId when nothing is selected', () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      expect(result.current.selectedId).toBeUndefined();
      expect(result.current.hoveredId).toBeUndefined();
    });

    it('should provide setSelectedId and deselect functions', () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      expect(typeof result.current.setSelectedId).toBe('function');
      expect(typeof result.current.deselect).toBe('function');
    });
  });

  describe('setSelectedId', () => {
    it('should update selectedId when selecting an entity', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      act(() => result.current.setSelectedId('entity-1'));

      await waitFor(() => {
        expect(result.current.selectedId).toBe('entity-1');
      });
    });

    it('should update selectedId when changing selection', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      act(() => result.current.setSelectedId('entity-1'));

      await waitFor(() => {
        expect(result.current.selectedId).toBe('entity-1');
      });

      act(() => result.current.setSelectedId('entity-2'));

      await waitFor(() => {
        expect(result.current.selectedId).toBe('entity-2');
      });
    });

    it('should clear selectedId when passing undefined', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      act(() => result.current.setSelectedId('entity-1'));

      await waitFor(() => {
        expect(result.current.selectedId).toBe('entity-1');
      });

      act(() => result.current.setSelectedId(undefined));

      await waitFor(() => {
        expect(result.current.selectedId).toBeUndefined();
      });
    });
  });

  describe('deselect', () => {
    it('should clear selectedId', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      act(() => result.current.setSelectedId('entity-1'));

      await waitFor(() => {
        expect(result.current.selectedId).toBe('entity-1');
      });

      act(() => result.current.deselect());

      await waitFor(() => {
        expect(result.current.selectedId).toBeUndefined();
      });
    });
  });

  describe('hoveredId via bus events', () => {
    it('should update hoveredId when HOVERED event is emitted', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      act(() =>
        bus.emit(CoffinCornerEvents.HOVERED, {
          hoveredId: 'entity-5',
          layerId: 'symbols',
          mapId,
        }),
      );

      await waitFor(() => {
        expect(result.current.hoveredId).toBe('entity-5');
      });
    });

    it('should clear hoveredId when HOVERED event has no hoveredId', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      act(() =>
        bus.emit(CoffinCornerEvents.HOVERED, {
          hoveredId: 'entity-5',
          layerId: 'symbols',
          mapId,
        }),
      );

      await waitFor(() => {
        expect(result.current.hoveredId).toBe('entity-5');
      });

      act(() =>
        bus.emit(CoffinCornerEvents.HOVERED, {
          hoveredId: undefined,
          layerId: 'symbols',
          mapId,
        }),
      );

      await waitFor(() => {
        expect(result.current.hoveredId).toBeUndefined();
      });
    });

    it('should ignore HOVERED events for different mapId', () => {
      const otherMapId = uuid();
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      act(() =>
        bus.emit(CoffinCornerEvents.HOVERED, {
          hoveredId: 'entity-5',
          layerId: 'symbols',
          mapId: otherMapId,
        }),
      );

      expect(result.current.hoveredId).toBeUndefined();
    });
  });

  describe('getEntityId option', () => {
    it('uses custom getEntityId when resolving hovered entity from map hover events', async () => {
      const customAccessor = (item: { uid: string }) => item.uid;
      const mapBus = Broadcast.getInstance<MapEventType>();
      const { result } = renderHook(() =>
        useCoffinCorner(mapId, 'symbols', { getEntityId: customAccessor }),
      );

      await act(async () => {
        mapBus.emit(
          MapEvents.hover,
          createHoverEvent(mapId, {
            layerId: 'symbols',
            object: { uid: 'from-custom-accessor' },
          }),
        );
      });

      expect(result.current.hoveredId).toBe('from-custom-accessor');
    });

    it('uses the updated getEntityId after the option changes', async () => {
      const accessor1 = (item: { uid: string }) => item.uid;
      const accessor2 = (item: { code: string }) => item.code;
      const mapBus = Broadcast.getInstance<MapEventType>();
      const { result, rerender } = renderHook(
        ({ getEntityId }) => useCoffinCorner(mapId, 'symbols', { getEntityId }),
        {
          initialProps: { getEntityId: accessor1 as (item: unknown) => string },
        },
      );

      await act(async () => {
        mapBus.emit(
          MapEvents.hover,
          createHoverEvent(mapId, {
            layerId: 'symbols',
            object: { uid: 'via-accessor1' },
          }),
        );
      });
      expect(result.current.hoveredId).toBe('via-accessor1');

      rerender({ getEntityId: accessor2 as (item: unknown) => string });

      await act(async () => {
        mapBus.emit(
          MapEvents.hover,
          createHoverEvent(mapId, {
            layerId: 'symbols',
            object: { code: 'via-accessor2' },
          }),
        );
      });
      expect(result.current.hoveredId).toBe('via-accessor2');
    });
  });

  describe('layerId changes', () => {
    it('routes hover events to the currently-registered layer after a layerId change', async () => {
      const mapBus = Broadcast.getInstance<MapEventType>();
      const { result, rerender } = renderHook(
        ({ layerId }) =>
          useCoffinCorner(mapId, layerId, {
            getEntityId: (item: { id: string }) => item.id,
          }),
        { initialProps: { layerId: 'layer-a' } },
      );

      // Hover on layer-a resolves through the current registration.
      await act(async () => {
        mapBus.emit(
          MapEvents.hover,
          createHoverEvent(mapId, {
            layerId: 'layer-a',
            object: { id: 'on-a' },
          }),
        );
      });
      expect(result.current.hoveredId).toBe('on-a');

      rerender({ layerId: 'layer-b' });

      // After rerender, the hook watches layer-b and ignores hovers on layer-a.
      await act(async () => {
        mapBus.emit(
          MapEvents.hover,
          createHoverEvent(mapId, {
            layerId: 'layer-b',
            object: { id: 'on-b' },
          }),
        );
      });
      expect(result.current.hoveredId).toBe('on-b');
    });
  });

  describe('multiple map instances', () => {
    it('should isolate state between different mapIds', async () => {
      const mapId1 = uuid();
      const mapId2 = uuid();

      const { result: result1, unmount: unmount1 } = renderHook(() =>
        useCoffinCorner(mapId1, 'symbols'),
      );

      act(() => result1.current.setSelectedId('entity-1'));

      await waitFor(() => {
        expect(result1.current.selectedId).toBe('entity-1');
      });

      unmount1();
      clearSelection(mapId1);

      // Map2 should start fresh
      const { result: result2, unmount: unmount2 } = renderHook(() =>
        useCoffinCorner(mapId2, 'symbols'),
      );

      expect(result2.current.selectedId).toBeUndefined();

      act(() => result2.current.setSelectedId('entity-2'));

      await waitFor(() => {
        expect(result2.current.selectedId).toBe('entity-2');
      });

      unmount2();
      clearSelection(mapId2);
    });
  });
});
