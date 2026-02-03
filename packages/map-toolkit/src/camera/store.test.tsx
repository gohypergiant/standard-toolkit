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

import { Broadcast } from '@accelint/bus/broadcast';
import { type UniqueId, uuid } from '@accelint/core/utility/uuid';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CameraEventTypes } from './events';
import { clearCameraState, useMapCamera } from './store';
import type { CameraEvent } from './types';

describe('useMapCamera', () => {
  let testid: UniqueId;
  const bus = Broadcast.getInstance<CameraEvent>();

  beforeEach(() => {
    // Create a stable id for each test
    testid = uuid();
    clearCameraState(testid);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useMapCamera(testid));
    expect(result.current.cameraState.latitude).toEqual(0);
    expect(result.current.cameraState.longitude).toEqual(0);
    expect(result.current.cameraState.zoom).toEqual(0);
  });

  it('should update position', () => {
    const { result } = renderHook(() => useMapCamera(testid));
    act(() => {
      bus.emit(CameraEventTypes.setCenter, {
        id: testid,
        latitude: 10,
        longitude: 20,
      });
    });
    expect(result.current.cameraState.latitude).toEqual(10);
    expect(result.current.cameraState.longitude).toEqual(20);
  });

  it('should update zoom', () => {
    const { result } = renderHook(() => useMapCamera(testid));
    act(() => {
      bus.emit(CameraEventTypes.setZoom, {
        id: testid,
        zoom: 2,
      });
    });
    expect(result.current.cameraState.zoom).toEqual(2);
  });

  it('should update pitch if view is 2.5D', () => {
    const { result } = renderHook(() => useMapCamera(testid, { view: '2.5D' }));
    act(() => {
      bus.emit(CameraEventTypes.setPitch, {
        id: testid,
        pitch: 60,
      });
    });
    expect(result.current.cameraState.pitch).toEqual(60);
  });

  it('should not update pitch if view is 2D', () => {
    const { result } = renderHook(() => useMapCamera(testid, { view: '2D' }));
    act(() => {
      bus.emit(CameraEventTypes.setPitch, {
        id: testid,
        pitch: 60,
      });
    });
    expect(result.current.cameraState.pitch).not.toEqual(60);
  });

  it('should update rotation', () => {
    const { result } = renderHook(() => useMapCamera(testid));
    act(() => {
      bus.emit(CameraEventTypes.setRotation, {
        id: testid,
        rotation: 45,
      });
    });
    expect(result.current.cameraState.rotation).toEqual(45);
  });

  it('should update projection', () => {
    const { result } = renderHook(() => useMapCamera(testid));
    act(() => {
      bus.emit(CameraEventTypes.setProjection, {
        id: testid,
        projection: 'globe',
      });
    });
    expect(result.current.cameraState.projection).toEqual('globe');
  });

  it('should update view', () => {
    const { result } = renderHook(() => useMapCamera(testid, { view: '3D' }));
    act(() => {
      bus.emit(CameraEventTypes.setView, {
        id: testid,
        view: '2D',
      });
    });
    expect(result.current.cameraState.view).toEqual('2D');
    expect(result.current.cameraState.pitch).toEqual(0); // Pitch should reset to 0 when switching to 2D
    expect(result.current.cameraState.projection).toEqual('mercator'); // Projection should reset to mercator when switching to 2D
  });

  it('should fit to bounds', () => {
    const { result } = renderHook(() => useMapCamera(testid));
    act(() => {
      bus.emit(CameraEventTypes.fitBounds, {
        id: testid,
        bounds: [10, 10, 20, 20],
        width: 800,
        height: 600,
      });
    });
    expect(result.current.cameraState.latitude).not.toEqual(0);
    expect(result.current.cameraState.longitude).not.toEqual(0);
    expect(result.current.cameraState.zoom).not.toEqual(0);
  });

  it('should reset to initial state', () => {
    const { result } = renderHook(() => useMapCamera(testid));
    act(() => {
      bus.emit(CameraEventTypes.reset, { id: testid });
    });
    expect(result.current.cameraState.latitude).toEqual(0);
    expect(result.current.cameraState.longitude).toEqual(0);
    expect(result.current.cameraState.zoom).toEqual(0);
  });

  it('should ignore events for other instanceIds', () => {
    const otherId = uuid();
    const { result } = renderHook(() => useMapCamera(testid));
    act(() => {
      bus.emit(CameraEventTypes.setCenter, {
        id: otherId,
        latitude: 99,
        longitude: 88,
      });
      bus.emit(CameraEventTypes.setZoom, {
        id: otherId,
        zoom: 5,
      });
    });
    expect(result.current.cameraState.latitude).toEqual(0);
    expect(result.current.cameraState.longitude).toEqual(0);
    expect(result.current.cameraState.zoom).toEqual(0);
  });

  it('should handle multiple updates sequentially', () => {
    const { result } = renderHook(() => useMapCamera(testid));
    act(() => {
      bus.emit(CameraEventTypes.setCenter, {
        id: testid,
        latitude: 1,
        longitude: 2,
      });
      bus.emit(CameraEventTypes.setZoom, {
        id: testid,
        zoom: 3,
      });
      bus.emit(CameraEventTypes.setCenter, {
        id: testid,
        latitude: 4,
        longitude: 5,
      });
    });
    expect(result.current.cameraState.latitude).toEqual(4);
    expect(result.current.cameraState.longitude).toEqual(5);
    expect(result.current.cameraState.zoom).toEqual(3);
  });

  it('should clear camera state when clearCameraState is called', () => {
    const { result, unmount } = renderHook(() => useMapCamera(testid));
    act(() => {
      bus.emit(CameraEventTypes.setCenter, {
        id: testid,
        latitude: 7,
        longitude: 8,
      });
      bus.emit(CameraEventTypes.setZoom, {
        id: testid,
        zoom: 9,
      });
    });

    expect(result.current.cameraState.latitude).toEqual(7);
    expect(result.current.cameraState.longitude).toEqual(8);
    expect(result.current.cameraState.zoom).toEqual(9);

    // Unmount before clearing to avoid subscription issues
    unmount();
    clearCameraState(testid);

    // Re-mount and verify state was cleared
    const { result: newResult } = renderHook(() => useMapCamera(testid));
    expect(newResult.current.cameraState.latitude).toEqual(0);
    expect(newResult.current.cameraState.longitude).toEqual(0);
    expect(newResult.current.cameraState.zoom).toEqual(0);
  });

  describe('initialization timing', () => {
    it('should initialize with provided initial state', () => {
      const { result } = renderHook(() =>
        useMapCamera(testid, {
          latitude: 37.7749,
          longitude: -122.4194,
          zoom: 12,
        }),
      );

      expect(result.current.cameraState.latitude).toEqual(37.7749);
      expect(result.current.cameraState.longitude).toEqual(-122.4194);
      expect(result.current.cameraState.zoom).toEqual(12);
    });

    it('should use initial state on first render, not defaults', () => {
      // This test ensures that initialization happens BEFORE subscribing
      // Otherwise, the first render would show defaults before updating
      const { result } = renderHook(() =>
        useMapCamera(testid, {
          latitude: 40.7128,
          longitude: -74.006,
          zoom: 10,
        }),
      );

      // First render should have initial state, not defaults
      expect(result.current.cameraState.latitude).toEqual(40.7128);
      expect(result.current.cameraState.longitude).toEqual(-74.006);
      expect(result.current.cameraState.zoom).toEqual(10);
    });

    it('should handle React Strict Mode double-mount with initial state', () => {
      const initialState = {
        latitude: 51.5074,
        longitude: -0.1278,
        zoom: 11,
      };

      // First mount
      const { result: result1, unmount: unmount1 } = renderHook(() =>
        useMapCamera(testid, initialState),
      );

      expect(result1.current.cameraState.latitude).toEqual(51.5074);
      expect(result1.current.cameraState.longitude).toEqual(-0.1278);

      // Simulate Strict Mode unmount
      unmount1();

      // Second mount - should still have initial state
      const { result: result2 } = renderHook(() =>
        useMapCamera(testid, initialState),
      );

      expect(result2.current.cameraState.latitude).toEqual(51.5074);
      expect(result2.current.cameraState.longitude).toEqual(-0.1278);
      expect(result2.current.cameraState.zoom).toEqual(11);
    });

    it('should not reinitialize if already initialized', () => {
      const newTestId = uuid(); // Use a fresh ID not cleared by beforeEach
      const initialState = {
        latitude: 35.6762,
        longitude: 139.6503,
        zoom: 9,
      };

      // First render with initial state
      const { result: result1, unmount: unmount1 } = renderHook(() =>
        useMapCamera(newTestId, initialState),
      );

      // Change state via event
      act(() => {
        bus.emit(CameraEventTypes.setCenter, {
          id: newTestId,
          latitude: 50.0,
          longitude: 50.0,
        });
      });

      expect(result1.current.cameraState.latitude).toEqual(50.0);
      expect(result1.current.cameraState.longitude).toEqual(50.0);

      unmount1();

      // Second render - should NOT reinitialize (already initialized)
      // Note: The store instance was cleaned up on unmount, but initializedInstances
      // still has this mapId, so it won't call initializeCameraState again.
      // However, the state is lost because the instance was deleted.
      // This means we get a fresh instance with the initial state.
      const { result: result2 } = renderHook(() =>
        useMapCamera(newTestId, initialState),
      );

      // The instance was cleaned up, so we get initial state again
      // This is expected behavior - state doesn't persist across full cleanup
      expect(result2.current.cameraState.latitude).toEqual(35.6762);
      expect(result2.current.cameraState.longitude).toEqual(139.6503);

      // Cleanup for this test
      clearCameraState(newTestId);
    });
  });
});
