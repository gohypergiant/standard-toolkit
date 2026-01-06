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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapModeEvents } from '../../../map-mode/events';
import { ShapeFeatureType } from '../shared/types';
import {
  clearDrawingState,
  completeDrawingFromLayer,
  getDrawingState,
  getOrCreateCancel,
  getOrCreateDraw,
  getOrCreateServerSnapshot,
  getOrCreateSnapshot,
  getOrCreateSubscription,
} from './store';
import type { UniqueId } from '@accelint/core';
import type { MapModeEventType } from '../../../map-mode/types';

describe('draw-shape-layer store', () => {
  let mapId: UniqueId;

  beforeEach(() => {
    mapId = uuid();
  });

  afterEach(() => {
    clearDrawingState(mapId);
  });

  describe('getOrCreateSubscription', () => {
    it('creates a subscription function for a mapId', () => {
      const subscription = getOrCreateSubscription(mapId);
      expect(typeof subscription).toBe('function');
    });

    it('returns the same subscription function for the same mapId', () => {
      const subscription1 = getOrCreateSubscription(mapId);
      const subscription2 = getOrCreateSubscription(mapId);
      expect(subscription1).toBe(subscription2);
    });

    it('returns different subscription functions for different mapIds', () => {
      const mapId2 = uuid();
      const subscription1 = getOrCreateSubscription(mapId);
      const subscription2 = getOrCreateSubscription(mapId2);
      expect(subscription1).not.toBe(subscription2);
      clearDrawingState(mapId2);
    });

    it('subscription notifies callback on store changes', () => {
      const subscription = getOrCreateSubscription(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);
      const draw = getOrCreateDraw(mapId);

      // Start drawing should notify
      draw(ShapeFeatureType.Polygon);

      expect(callback).toHaveBeenCalled();

      unsubscribe();
    });

    it('unsubscribe removes callback from notifications', () => {
      const subscription = getOrCreateSubscription(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);
      unsubscribe();

      // Clear and reset
      callback.mockClear();

      const draw = getOrCreateDraw(mapId);
      draw(ShapeFeatureType.Polygon);

      // Should not be called after unsubscribe
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('getOrCreateSnapshot', () => {
    it('creates a snapshot function for a mapId', () => {
      const snapshot = getOrCreateSnapshot(mapId);
      expect(typeof snapshot).toBe('function');
    });

    it('returns the same snapshot function for the same mapId', () => {
      const snapshot1 = getOrCreateSnapshot(mapId);
      const snapshot2 = getOrCreateSnapshot(mapId);
      expect(snapshot1).toBe(snapshot2);
    });

    it('snapshot returns null when no state exists', () => {
      const snapshot = getOrCreateSnapshot(mapId);
      expect(snapshot()).toBeNull();
    });

    it('snapshot returns state after subscription initializes it', () => {
      // Subscription initializes state
      getOrCreateSubscription(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const state = snapshot();
      expect(state).not.toBeNull();
      expect(state?.activeShapeType).toBeNull();
      expect(state?.tentativeFeature).toBeNull();
    });
  });

  describe('getOrCreateServerSnapshot', () => {
    it('creates a server snapshot function for a mapId', () => {
      const serverSnapshot = getOrCreateServerSnapshot(mapId);
      expect(typeof serverSnapshot).toBe('function');
    });

    it('returns the same server snapshot function for the same mapId', () => {
      const serverSnapshot1 = getOrCreateServerSnapshot(mapId);
      const serverSnapshot2 = getOrCreateServerSnapshot(mapId);
      expect(serverSnapshot1).toBe(serverSnapshot2);
    });

    it('server snapshot always returns null (client-only state)', () => {
      const serverSnapshot = getOrCreateServerSnapshot(mapId);

      // Even after initializing state
      getOrCreateSubscription(mapId);
      const draw = getOrCreateDraw(mapId);
      draw(ShapeFeatureType.Circle);

      expect(serverSnapshot()).toBeNull();
    });
  });

  describe('getOrCreateDraw', () => {
    it('creates a draw function for a mapId', () => {
      const draw = getOrCreateDraw(mapId);
      expect(typeof draw).toBe('function');
    });

    it('returns the same draw function for the same mapId', () => {
      const draw1 = getOrCreateDraw(mapId);
      const draw2 = getOrCreateDraw(mapId);
      expect(draw1).toBe(draw2);
    });

    it('draw starts drawing and updates state', () => {
      getOrCreateSubscription(mapId);
      const draw = getOrCreateDraw(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      draw(ShapeFeatureType.Polygon);

      const state = snapshot();
      expect(state?.activeShapeType).toBe(ShapeFeatureType.Polygon);
    });

    it('draw accepts style defaults', () => {
      getOrCreateSubscription(mapId);
      const draw = getOrCreateDraw(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const styleDefaults = {
        fillColor: [255, 0, 0, 255] as [number, number, number, number],
        lineColor: [0, 0, 0, 255] as [number, number, number, number],
        lineWidth: 4 as const,
        linePattern: 'dashed' as const,
      };

      draw(ShapeFeatureType.Circle, { styleDefaults });

      const state = snapshot();
      expect(state?.styleDefaults).toEqual(styleDefaults);
    });

    it('draw accepts circle defaults', () => {
      getOrCreateSubscription(mapId);
      const draw = getOrCreateDraw(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      const circleDefaults = {
        radius: { value: 100, units: 'kilometers' as const },
      };

      draw(ShapeFeatureType.Circle, { circleDefaults });

      const state = snapshot();
      expect(state?.circleDefaults).toEqual(circleDefaults);
    });

    it('draw cancels existing drawing before starting new one', () => {
      getOrCreateSubscription(mapId);
      const draw = getOrCreateDraw(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      draw(ShapeFeatureType.Polygon);
      expect(snapshot()?.activeShapeType).toBe(ShapeFeatureType.Polygon);

      draw(ShapeFeatureType.Circle);
      expect(snapshot()?.activeShapeType).toBe(ShapeFeatureType.Circle);
    });
  });

  describe('getOrCreateCancel', () => {
    it('creates a cancel function for a mapId', () => {
      const cancel = getOrCreateCancel(mapId);
      expect(typeof cancel).toBe('function');
    });

    it('returns the same cancel function for the same mapId', () => {
      const cancel1 = getOrCreateCancel(mapId);
      const cancel2 = getOrCreateCancel(mapId);
      expect(cancel1).toBe(cancel2);
    });

    it('cancel stops drawing and resets state', () => {
      getOrCreateSubscription(mapId);
      const draw = getOrCreateDraw(mapId);
      const cancel = getOrCreateCancel(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      draw(ShapeFeatureType.Rectangle);
      expect(snapshot()?.activeShapeType).toBe(ShapeFeatureType.Rectangle);

      cancel();
      expect(snapshot()?.activeShapeType).toBeNull();
    });

    it('cancel does nothing when not drawing', () => {
      getOrCreateSubscription(mapId);
      const cancel = getOrCreateCancel(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

      // Should not throw
      cancel();
      expect(snapshot()?.activeShapeType).toBeNull();
    });
  });

  describe('completeDrawingFromLayer', () => {
    it('throws when not currently drawing', () => {
      getOrCreateSubscription(mapId);

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
      getOrCreateSubscription(mapId);
      const draw = getOrCreateDraw(mapId);
      const snapshot = getOrCreateSnapshot(mapId);

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
      expect(shape.shapeType).toBe(ShapeFeatureType.Polygon);
      expect(shape.id).toBeDefined();
      expect(shape.name).toBeDefined();
      expect(snapshot()?.activeShapeType).toBeNull();
    });
  });

  describe('getDrawingState', () => {
    it('returns null when no state exists', () => {
      expect(getDrawingState(mapId)).toBeNull();
    });

    it('returns state after initialization', () => {
      getOrCreateSubscription(mapId);
      const state = getDrawingState(mapId);
      expect(state).not.toBeNull();
      expect(state?.activeShapeType).toBeNull();
    });
  });

  describe('clearDrawingState', () => {
    it('clears all state for a mapId', () => {
      getOrCreateSubscription(mapId);
      const draw = getOrCreateDraw(mapId);
      draw(ShapeFeatureType.Polygon);

      expect(getDrawingState(mapId)).not.toBeNull();

      clearDrawingState(mapId);

      expect(getDrawingState(mapId)).toBeNull();
    });

    it('cancels active drawing before clearing', () => {
      getOrCreateSubscription(mapId);
      const draw = getOrCreateDraw(mapId);
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
      const subscription = getOrCreateSubscription(mapId);
      const callback = vi.fn();
      subscription(callback);

      // Start drawing
      const draw = getOrCreateDraw(mapId);
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
      const subscription = getOrCreateSubscription(mapId);
      const callback = vi.fn();
      subscription(callback);

      // Start drawing
      const draw = getOrCreateDraw(mapId);
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
    it('cleans up bus listener when last subscriber unsubscribes', () => {
      const subscription = getOrCreateSubscription(mapId);
      const callback = vi.fn();

      const unsubscribe = subscription(callback);

      // Unsubscribe should trigger cleanup
      unsubscribe();

      // State should be cleared
      expect(getDrawingState(mapId)).toBeNull();
    });

    it('maintains bus listener while subscribers exist', () => {
      const subscription = getOrCreateSubscription(mapId);
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

      // Now state should be cleaned up
      expect(getDrawingState(mapId)).toBeNull();
    });
  });
});
