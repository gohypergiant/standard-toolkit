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
import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapEvents } from '@/deckgl/base-map/events';
import { measurementStore } from './store';
import { MeasurementTool } from './measurement-tool';
import type { UniqueId } from '@accelint/core';
import type { MapEventType } from '@/deckgl/base-map/types';

// Prevent the fiber side-effect from trying to register the deck.gl layer.
// The fiber module calls `extend({ MeasurementLayer })` which is irrelevant in jsdom.
vi.mock('./fiber', () => ({}));

// Prevent MeasurementLayer from importing @accelint/formatters/bearing (not a declared
// map-toolkit dependency). The layer class is not directly invoked by MeasurementTool —
// it renders <measurementLayer> via the fiber JSX intrinsic — so a stub class is enough.
vi.mock('./measurement-layer', () => ({
  MeasurementLayer: class MockMeasurementLayer {},
}));

// No-op the fiber renderer's extend() so the module import doesn't fail.
vi.mock('@deckgl-fiber-renderer/dom', () => ({
  extend: vi.fn(),
  Deckgl: vi.fn(),
  useDeckgl: vi.fn(),
}));

/** Emit a dragStart event for the given map and coordinate. */
function emitDragStart(
  bus: ReturnType<typeof Broadcast.getInstance<MapEventType>>,
  mapId: UniqueId,
  coordinate: [number, number],
  modifiers?: { shiftKey?: boolean; ctrlKey?: boolean; altKey?: boolean },
) {
  bus.emit(MapEvents.dragStart, {
    id: mapId,
    coordinate,
    shiftKey: modifiers?.shiftKey ?? false,
    ctrlKey: modifiers?.ctrlKey ?? false,
    altKey: modifiers?.altKey ?? false,
  });
}

/** Emit a drag event for the given map and coordinate. */
function emitDrag(
  bus: ReturnType<typeof Broadcast.getInstance<MapEventType>>,
  mapId: UniqueId,
  coordinate: [number, number],
  modifiers?: { shiftKey?: boolean; ctrlKey?: boolean; altKey?: boolean },
) {
  bus.emit(MapEvents.drag, {
    id: mapId,
    coordinate,
    shiftKey: modifiers?.shiftKey ?? false,
    ctrlKey: modifiers?.ctrlKey ?? false,
    altKey: modifiers?.altKey ?? false,
  });
}

/** Emit a dragEnd event for the given map and coordinate. */
function emitDragEnd(
  bus: ReturnType<typeof Broadcast.getInstance<MapEventType>>,
  mapId: UniqueId,
  coordinate: [number, number],
) {
  bus.emit(MapEvents.dragEnd, {
    id: mapId,
    coordinate,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
  });
}

describe('MeasurementTool', () => {
  let mapId: UniqueId;
  let bus: ReturnType<typeof Broadcast.getInstance<MapEventType>>;

  beforeEach(() => {
    mapId = uuid();
    bus = Broadcast.getInstance<MapEventType>();
  });

  afterEach(() => {
    measurementStore.clear(mapId);
  });

  describe('render gating', () => {
    it('renders nothing when not measuring', () => {
      const { container } = render(<MeasurementTool mapId={mapId} />);

      // Component returns null — no child nodes
      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when measuring has started but pointB is not yet set', async () => {
      const { container } = render(<MeasurementTool mapId={mapId} />);

      act(() => {
        emitDragStart(bus, mapId, [10, 20]);
      });

      await waitFor(() =>
        expect(measurementStore.get(mapId).isMeasuring).toBe(true),
      );

      // pointB is still null — component returns null
      expect(container.firstChild).toBeNull();
    });

    it('renders measurementLayer element when isMeasuring and both points are set', async () => {
      const { container } = render(<MeasurementTool mapId={mapId} />);

      act(() => {
        emitDragStart(bus, mapId, [10, 20]);
      });

      await waitFor(() =>
        expect(measurementStore.get(mapId).isMeasuring).toBe(true),
      );

      act(() => {
        emitDrag(bus, mapId, [11, 21]);
      });

      // <measurementLayer> is a fiber intrinsic — React renders it as a custom DOM element
      await waitFor(() => {
        expect(container.querySelector('measurementlayer')).not.toBeNull();
      });
    });

    it('hides the layer after measurement completes (isMeasuring becomes false)', async () => {
      const { container } = render(<MeasurementTool mapId={mapId} />);

      act(() => {
        emitDragStart(bus, mapId, [10, 20]);
      });

      await waitFor(() =>
        expect(measurementStore.get(mapId).isMeasuring).toBe(true),
      );

      act(() => {
        emitDrag(bus, mapId, [11, 21]);
      });

      await waitFor(() =>
        expect(container.querySelector('measurementlayer')).not.toBeNull(),
      );

      act(() => {
        emitDragEnd(bus, mapId, [11, 21]);
      });

      await waitFor(() => {
        expect(container.querySelector('measurementlayer')).toBeNull();
      });
    });
  });

  describe('modifier key filtering', () => {
    it('does not start measuring when requiresModifier=shift and shift is not pressed', async () => {
      const { container } = render(
        <MeasurementTool mapId={mapId} requiresModifier='shift' />,
      );

      act(() => {
        emitDragStart(bus, mapId, [10, 20], { shiftKey: false });
      });

      // Give event handlers time to process
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      expect(container.firstChild).toBeNull();
      expect(measurementStore.get(mapId).isMeasuring).toBe(false);
    });

    it('starts measuring when requiresModifier=shift and shift is pressed', async () => {
      const { container } = render(
        <MeasurementTool mapId={mapId} requiresModifier='shift' />,
      );

      act(() => {
        emitDragStart(bus, mapId, [10, 20], { shiftKey: true });
      });

      await waitFor(() =>
        expect(measurementStore.get(mapId).isMeasuring).toBe(true),
      );

      act(() => {
        emitDrag(bus, mapId, [11, 21], { shiftKey: true });
      });

      await waitFor(() => {
        expect(container.querySelector('measurementlayer')).not.toBeNull();
      });
    });

    it('starts measuring when no requiresModifier is set and no modifier key is pressed', async () => {
      const { container } = render(<MeasurementTool mapId={mapId} />);

      act(() => {
        emitDragStart(bus, mapId, [10, 20], {
          shiftKey: false,
          ctrlKey: false,
          altKey: false,
        });
      });

      await waitFor(() =>
        expect(measurementStore.get(mapId).isMeasuring).toBe(true),
      );

      act(() => {
        emitDrag(bus, mapId, [11, 21]);
      });

      await waitFor(() => {
        expect(container.querySelector('measurementlayer')).not.toBeNull();
      });
    });
  });
});
