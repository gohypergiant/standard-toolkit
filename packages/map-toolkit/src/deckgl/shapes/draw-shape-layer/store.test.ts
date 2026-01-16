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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapModeEvents } from '@/map-mode/events';
import { ShapeFeatureType } from '../shared/types';
import {
  clearDrawingState,
  completeDrawingFromLayer,
  drawStore,
  getDrawingState,
} from './store';
import type { UniqueId } from '@accelint/core';
import type { MapModeEventType } from '@/map-mode/types';

describe('draw-shape-layer store', () => {
  let mapId: UniqueId;

  beforeEach(() => {
    mapId = uuid();
  });

  afterEach(() => {
    clearDrawingState(mapId);
  });

  describe('drawStore.subscribe', () => {
    it('creates a subscription function for a mapId', () => {
      const subscription = drawStore.subscribe(mapId);
      expect(typeof subscription).toBe('function');
    });

    it('returns the same subscription function for the same mapId', () => {
      const subscription1 = drawStore.subscribe(mapId);
      const subscription2 = drawStore.subscribe(mapId);
      expect(subscription1).toBe(subscription2);
    });

    it('returns different subscription functions for different mapIds', () => {
      const mapId2 = uuid();
      const subscription1 = drawStore.subscribe(mapId);
      const subscription2 = drawStore.subscribe(mapId2);
      expect(subscription1).not.toBe(subscription2);
      clearDrawingState(mapId2);
    });

    it('subscription notifies callback on store changes', () => {
      const subscription = drawStore.subscribe(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);
      const { draw } = drawStore.actions(mapId);

      // Start drawing should notify
      draw(ShapeFeatureType.Polygon);

      expect(callback).toHaveBeenCalled();

      unsubscribe();
    });

    it('unsubscribe removes callback from notifications', () => {
      const subscription = drawStore.subscribe(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);
      unsubscribe();

      // Clear and reset
      callback.mockClear();

      const { draw } = drawStore.actions(mapId);
      draw(ShapeFeatureType.Polygon);

      // Should not be called after unsubscribe
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('drawStore.snapshot', () => {
    it('creates a snapshot function for a mapId', () => {
      const snapshot = drawStore.snapshot(mapId);
      expect(typeof snapshot).toBe('function');
    });

    it('returns the same snapshot function for the same mapId', () => {
      const snapshot1 = drawStore.snapshot(mapId);
      const snapshot2 = drawStore.snapshot(mapId);
      expect(snapshot1).toBe(snapshot2);
    });

    it('snapshot returns state (lazy initialization)', () => {
      const snapshot = drawStore.snapshot(mapId);
      const state = snapshot();
      expect(state).not.toBeNull();
      expect(state?.activeShapeType).toBeNull();
    });
  });

  describe('drawStore.serverSnapshot', () => {
    it('server snapshot returns default state', () => {
      const serverSnapshot = drawStore.serverSnapshot();
      expect(serverSnapshot.activeShapeType).toBeNull();
      expect(serverSnapshot.tentativeFeature).toBeNull();
    });
  });

  describe('drawStore.actions().draw', () => {
    it('creates a draw function for a mapId', () => {
      const { draw } = drawStore.actions(mapId);
      expect(typeof draw).toBe('function');
    });

    it('returns the same actions for the same mapId', () => {
      const actions1 = drawStore.actions(mapId);
      const actions2 = drawStore.actions(mapId);
      expect(actions1.draw).toBe(actions2.draw);
    });

    it('draw starts drawing and updates state', () => {
      const { draw } = drawStore.actions(mapId);

      draw(ShapeFeatureType.Polygon);

      const state = drawStore.get(mapId);
      expect(state?.activeShapeType).toBe(ShapeFeatureType.Polygon);
    });

    it('draw accepts style defaults', () => {
      const { draw } = drawStore.actions(mapId);

      const styleDefaults = {
        fillColor: [255, 0, 0, 255] as [number, number, number, number],
        lineColor: [0, 0, 0, 255] as [number, number, number, number],
        lineWidth: 4 as const,
        linePattern: 'dashed' as const,
      };

      draw(ShapeFeatureType.Circle, { styleDefaults });

      const state = drawStore.get(mapId);
      expect(state?.styleDefaults).toEqual(styleDefaults);
    });

    it('draw accepts circle defaults', () => {
      const { draw } = drawStore.actions(mapId);

      const circleDefaults = {
        radius: { value: 100, units: 'kilometers' as const },
      };

      draw(ShapeFeatureType.Circle, { circleDefaults });

      const state = drawStore.get(mapId);
      expect(state?.circleDefaults).toEqual(circleDefaults);
    });

    it('draw cancels existing drawing before starting new one', () => {
      const { draw } = drawStore.actions(mapId);

      draw(ShapeFeatureType.Polygon);
      expect(drawStore.get(mapId)?.activeShapeType).toBe(
        ShapeFeatureType.Polygon,
      );

      draw(ShapeFeatureType.Circle);
      expect(drawStore.get(mapId)?.activeShapeType).toBe(
        ShapeFeatureType.Circle,
      );
    });
  });

  describe('drawStore.actions().cancel', () => {
    it('creates a cancel function for a mapId', () => {
      const { cancel } = drawStore.actions(mapId);
      expect(typeof cancel).toBe('function');
    });

    it('returns the same cancel function for the same mapId', () => {
      const actions1 = drawStore.actions(mapId);
      const actions2 = drawStore.actions(mapId);
      expect(actions1.cancel).toBe(actions2.cancel);
    });

    it('cancel stops drawing and resets state', () => {
      const { draw, cancel } = drawStore.actions(mapId);

      draw(ShapeFeatureType.Rectangle);
      expect(drawStore.get(mapId)?.activeShapeType).toBe(
        ShapeFeatureType.Rectangle,
      );

      cancel();
      expect(drawStore.get(mapId)?.activeShapeType).toBeNull();
    });

    it('cancel does nothing when not drawing', () => {
      const { cancel } = drawStore.actions(mapId);

      // Should not throw
      cancel();
      expect(drawStore.get(mapId)?.activeShapeType).toBeNull();
    });
  });

  describe('completeDrawingFromLayer', () => {
    it('throws when not currently drawing', () => {
      // Initialize store
      drawStore.get(mapId);

      const mockFeature = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'Polygon' as const,
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
          ],
        },
      };

      expect(() => completeDrawingFromLayer(mapId, mockFeature)).toThrow(
        'Cannot complete drawing - not currently drawing',
      );
    });

    it('completes drawing and returns shape', () => {
      const { draw } = drawStore.actions(mapId);

      draw(ShapeFeatureType.Polygon);

      const mockFeature = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'Polygon' as const,
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
          ],
        },
      };

      const shape = completeDrawingFromLayer(mapId, mockFeature);

      expect(shape).toBeDefined();
      expect(shape.shape).toBe(ShapeFeatureType.Polygon);
      expect(shape.id).toBeDefined();
      expect(shape.name).toBeDefined();
      expect(drawStore.get(mapId)?.activeShapeType).toBeNull();
    });
  });

  describe('getDrawingState', () => {
    it('returns null when no state exists', () => {
      expect(getDrawingState(mapId)).toBeNull();
    });

    it('returns state after initialization', () => {
      // Initialize by getting actions
      drawStore.actions(mapId);
      const state = getDrawingState(mapId);
      expect(state).not.toBeNull();
      expect(state?.activeShapeType).toBeNull();
    });
  });

  describe('clearDrawingState', () => {
    it('clears all state for a mapId', () => {
      const { draw } = drawStore.actions(mapId);
      draw(ShapeFeatureType.Polygon);

      expect(getDrawingState(mapId)).not.toBeNull();

      clearDrawingState(mapId);

      expect(getDrawingState(mapId)).toBeNull();
    });

    it('cancels active drawing before clearing', () => {
      const { draw } = drawStore.actions(mapId);
      draw(ShapeFeatureType.Circle);

      // Should not throw
      clearDrawingState(mapId);

      expect(getDrawingState(mapId)).toBeNull();
    });
  });

  describe('Mode change authorization', () => {
    it('rejects mode change requests when drawing', () => {
      const mapModeBus = Broadcast.getInstance<MapModeEventType>();
      const decisionSpy = vi.fn();

      mapModeBus.on(MapModeEvents.changeDecision, decisionSpy);

      // Start subscription to set up bus listener
      const subscription = drawStore.subscribe(mapId);
      const callback = vi.fn();
      subscription(callback);

      // Start drawing
      const { draw } = drawStore.actions(mapId);
      draw(ShapeFeatureType.Polygon);

      // Simulate mode change authorization request
      mapModeBus.emit(MapModeEvents.changeAuthorization, {
        authId: uuid(),
        desiredMode: 'default',
        owner: 'some-other-component',
        id: mapId,
      });

      expect(decisionSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            approved: false,
            reason: 'Drawing in progress - cancel drawing first',
          }),
        }),
      );

      mapModeBus.off(MapModeEvents.changeDecision, decisionSpy);
    });

    it('ignores mode change requests for other maps', () => {
      const mapModeBus = Broadcast.getInstance<MapModeEventType>();
      const decisionSpy = vi.fn();
      const otherMapId = uuid();

      mapModeBus.on(MapModeEvents.changeDecision, decisionSpy);

      // Start subscription to set up bus listener
      const subscription = drawStore.subscribe(mapId);
      const callback = vi.fn();
      subscription(callback);

      // Start drawing
      const { draw } = drawStore.actions(mapId);
      draw(ShapeFeatureType.Polygon);

      // Simulate mode change authorization request for a different map
      mapModeBus.emit(MapModeEvents.changeAuthorization, {
        authId: uuid(),
        desiredMode: 'default',
        owner: 'some-other-component',
        id: otherMapId,
      });

      // Should not have rejected (no decision emitted for this map)
      expect(decisionSpy).not.toHaveBeenCalled();

      mapModeBus.off(MapModeEvents.changeDecision, decisionSpy);
    });
  });

  describe('cleanup behavior', () => {
    it('preserves state after last subscriber unsubscribes (for Strict Mode support)', () => {
      const subscription = drawStore.subscribe(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);

      // Unsubscribe - state is preserved for potential remount (Strict Mode)
      unsubscribe();

      // State should still exist (preserved for Strict Mode remount)
      expect(getDrawingState(mapId)).not.toBeNull();

      // Use clearDrawingState for explicit cleanup
      clearDrawingState(mapId);
      expect(getDrawingState(mapId)).toBeNull();
    });

    it('maintains state while subscribers exist', () => {
      const subscription = drawStore.subscribe(mapId);
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = subscription(callback1);
      const unsubscribe2 = subscription(callback2);

      // Unsubscribe first callback
      unsubscribe1();

      // State should still exist (second subscriber still active)
      expect(getDrawingState(mapId)).not.toBeNull();

      // Unsubscribe second callback
      unsubscribe2();

      // State is preserved for Strict Mode support
      expect(getDrawingState(mapId)).not.toBeNull();

      // Use clearDrawingState for explicit cleanup
      clearDrawingState(mapId);
      expect(getDrawingState(mapId)).toBeNull();
    });
  });
});
