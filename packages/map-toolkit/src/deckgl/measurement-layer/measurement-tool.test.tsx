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
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapEvents } from '@/deckgl/base-map/events';
import { makeDragPayload } from './__fixtures__/drag-payload';
import { MeasurementTool } from './measurement-tool';
import { measurementStore } from './store';
import type { UniqueId } from '@accelint/core';
import type { MapEventType } from '@/deckgl/base-map/types';
import type { Modifiers } from './__fixtures__/drag-payload';
import type { MeasurementToolProps } from './measurement-tool';

// Prevent the fiber side-effect from trying to register the deck.gl layer.
// The fiber module calls `extend({ MeasurementLayer })` which is irrelevant in jsdom.
vi.mock('./fiber', () => ({}));

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

  /** Render the tool and emit a dragStart at [10, 20] so measuring begins. */
  function beginDrag(
    props?: Omit<MeasurementToolProps, 'mapId'>,
    modifiers?: Modifiers,
  ) {
    const { container } = render(<MeasurementTool mapId={mapId} {...props} />);

    act(() => {
      bus.emit(
        MapEvents.dragStart,
        makeDragPayload(mapId, [10, 20], modifiers),
      );
    });

    return container;
  }

  describe('render gating', () => {
    it('renders nothing when not measuring', () => {
      const { container } = render(<MeasurementTool mapId={mapId} />);

      expect(container.firstChild).toBeNull();
    });

    it('renders nothing when measuring has started but pointB is not yet set', () => {
      const container = beginDrag();

      expect(measurementStore.get(mapId).isMeasuring).toBe(true);
      expect(container.firstChild).toBeNull();
    });

    it('renders measurementLayer element when isMeasuring and both points are set', () => {
      const container = beginDrag();

      act(() => {
        bus.emit(MapEvents.drag, makeDragPayload(mapId, [11, 21]));
      });

      // <measurementLayer> is a fiber intrinsic — React renders it as a custom DOM element
      expect(container.querySelector('measurementlayer')).not.toBeNull();
    });

    it('hides the layer after measurement completes (isMeasuring becomes false)', () => {
      const container = beginDrag();

      act(() => {
        bus.emit(MapEvents.drag, makeDragPayload(mapId, [11, 21]));
      });

      expect(container.querySelector('measurementlayer')).not.toBeNull();

      act(() => {
        bus.emit(MapEvents.dragEnd, makeDragPayload(mapId, [11, 21]));
      });

      expect(container.querySelector('measurementlayer')).toBeNull();
    });
  });

  describe('modifier key filtering', () => {
    it('does not measure or render on a plain drag when requiresModifier=shift', () => {
      const { container } = render(
        <MeasurementTool mapId={mapId} requiresModifier='shift' />,
      );

      act(() => {
        bus.emit(MapEvents.dragStart, makeDragPayload(mapId, [10, 20]));
        bus.emit(MapEvents.drag, makeDragPayload(mapId, [11, 21]));
        bus.emit(MapEvents.dragEnd, makeDragPayload(mapId, [11, 21]));
      });

      expect(container.firstChild).toBeNull();
      expect(measurementStore.get(mapId).isMeasuring).toBe(false);
    });

    it('starts measuring when requiresModifier=shift and shift is pressed', () => {
      const container = beginDrag(
        { requiresModifier: 'shift' },
        { shiftKey: true },
      );

      act(() => {
        bus.emit(
          MapEvents.drag,
          makeDragPayload(mapId, [11, 21], { shiftKey: true }),
        );
      });

      expect(container.querySelector('measurementlayer')).not.toBeNull();
    });
  });
});
