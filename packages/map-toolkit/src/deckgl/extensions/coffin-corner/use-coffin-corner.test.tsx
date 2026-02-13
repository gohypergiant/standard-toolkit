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
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';
import { clearSelection } from './store';
import { CoffinCornerEvents } from './types';
import { useCoffinCorner } from './use-coffin-corner';
import type { UniqueId } from '@accelint/core';
import type { CoffinCornerEvent } from './types';

const consoleError = console.error;

describe('useCoffinCorner', () => {
  let mapId: UniqueId;
  let bus: ReturnType<typeof Broadcast.getInstance<CoffinCornerEvent>>;

  beforeAll(() => {
    console.error = (...args: unknown[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('not wrapped in act')
      ) {
        return;
      }
      consoleError.call(console, ...args);
    };
  });

  afterAll(() => {
    console.error = consoleError;
  });

  beforeEach(() => {
    mapId = uuid();
    bus = Broadcast.getInstance();
  });

  afterEach(() => {
    clearSelection(mapId);
  });

  describe('initial state', () => {
    it('should return undefined for selectedId when nothing is selected', () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      expect(result.current.selectedId).toBeUndefined();
      expect(result.current.hoveredId).toBeUndefined();
    });

    it('should provide setSelectedId and clearSelection functions', () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      expect(typeof result.current.setSelectedId).toBe('function');
      expect(typeof result.current.clearSelection).toBe('function');
    });
  });

  describe('setSelectedId', () => {
    it('should update selectedId when selecting an entity', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      result.current.setSelectedId('entity-1');

      await waitFor(() => {
        expect(result.current.selectedId).toBe('entity-1');
      });
    });

    it('should update selectedId when changing selection', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      result.current.setSelectedId('entity-1');

      await waitFor(() => {
        expect(result.current.selectedId).toBe('entity-1');
      });

      result.current.setSelectedId('entity-2');

      await waitFor(() => {
        expect(result.current.selectedId).toBe('entity-2');
      });
    });

    it('should clear selectedId when passing undefined', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      result.current.setSelectedId('entity-1');

      await waitFor(() => {
        expect(result.current.selectedId).toBe('entity-1');
      });

      result.current.setSelectedId(undefined);

      await waitFor(() => {
        expect(result.current.selectedId).toBeUndefined();
      });
    });
  });

  describe('clearSelection', () => {
    it('should clear selectedId', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      result.current.setSelectedId('entity-1');

      await waitFor(() => {
        expect(result.current.selectedId).toBe('entity-1');
      });

      result.current.clearSelection();

      await waitFor(() => {
        expect(result.current.selectedId).toBeUndefined();
      });
    });
  });

  describe('hoveredId via bus events', () => {
    it('should update hoveredId when HOVERED event is emitted', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      bus.emit(CoffinCornerEvents.HOVERED, {
        hoveredId: 'entity-5',
        mapId,
      });

      await waitFor(() => {
        expect(result.current.hoveredId).toBe('entity-5');
      });
    });

    it('should clear hoveredId when HOVERED event has no hoveredId', async () => {
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      bus.emit(CoffinCornerEvents.HOVERED, {
        hoveredId: 'entity-5',
        mapId,
      });

      await waitFor(() => {
        expect(result.current.hoveredId).toBe('entity-5');
      });

      bus.emit(CoffinCornerEvents.HOVERED, {
        hoveredId: undefined,
        mapId,
      });

      await waitFor(() => {
        expect(result.current.hoveredId).toBeUndefined();
      });
    });

    it('should ignore HOVERED events for different mapId', async () => {
      const otherMapId = uuid();
      const { result } = renderHook(() => useCoffinCorner(mapId, 'symbols'));

      bus.emit(CoffinCornerEvents.HOVERED, {
        hoveredId: 'entity-5',
        mapId: otherMapId,
      });

      // Wait a tick
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(result.current.hoveredId).toBeUndefined();
    });
  });

  describe('multiple map instances', () => {
    it('should isolate state between different mapIds', async () => {
      const mapId1 = uuid();
      const mapId2 = uuid();

      const { result: result1, unmount: unmount1 } = renderHook(() =>
        useCoffinCorner(mapId1, 'symbols'),
      );

      result1.current.setSelectedId('entity-1');

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

      result2.current.setSelectedId('entity-2');

      await waitFor(() => {
        expect(result2.current.selectedId).toBe('entity-2');
      });

      unmount2();
      clearSelection(mapId2);
    });
  });
});
