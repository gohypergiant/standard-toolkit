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

import { Broadcast } from '@accelint/bus/broadcast';
import { type UniqueId, uuid } from '@accelint/core/utility/uuid';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CameraEventTypes } from './events';
import { clearCameraState, useCameraState } from './store';
import type { CameraEvent } from './types';

describe('useCameraState', () => {
  let testid: UniqueId;
  const bus = Broadcast.getInstance<CameraEvent>();

  beforeEach(() => {
    // Create a stable id for each test
    testid = uuid();
    clearCameraState(testid);
  });
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCameraState(testid));
    expect(result.current.cameraState.latitude).toEqual(0);
    expect(result.current.cameraState.longitude).toEqual(0);
    expect(result.current.cameraState.zoom).toEqual(0);
  });

  it('should update position', () => {
    const { result } = renderHook(() => useCameraState(testid));
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
    const { result } = renderHook(() => useCameraState(testid));
    act(() => {
      bus.emit(CameraEventTypes.setZoom, {
        id: testid,
        zoom: 2,
      });
    });
    expect(result.current.cameraState.zoom).toEqual(2);
  });

  it('should update pitch if view is 2.5D', () => {
    const { result } = renderHook(() =>
      useCameraState(testid, { view: '2.5D' }),
    );
    act(() => {
      bus.emit(CameraEventTypes.setPitch, {
        id: testid,
        pitch: 60,
      });
    });
    expect(result.current.cameraState.pitch).toEqual(60);
  });

  it('should not update pitch if view is 2D', () => {
    const { result } = renderHook(() => useCameraState(testid, { view: '2D' }));
    act(() => {
      bus.emit(CameraEventTypes.setPitch, {
        id: testid,
        pitch: 60,
      });
    });
    expect(result.current.cameraState.pitch).not.toEqual(60);
  });

  it('should update rotation', () => {
    const { result } = renderHook(() => useCameraState(testid));
    act(() => {
      bus.emit(CameraEventTypes.setRotation, {
        id: testid,
        rotation: 45,
      });
    });
    expect(result.current.cameraState.rotation).toEqual(45);
  });

  it('should update projection', () => {
    const { result } = renderHook(() => useCameraState(testid));
    act(() => {
      bus.emit(CameraEventTypes.setProjection, {
        id: testid,
        projection: 'globe',
      });
    });
    expect(result.current.cameraState.projection).toEqual('globe');
  });

  it('should update view', () => {
    const { result } = renderHook(() => useCameraState(testid, { view: '3D' }));
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
    const { result } = renderHook(() => useCameraState(testid));
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
    const { result } = renderHook(() => useCameraState(testid));
    act(() => {
      bus.emit(CameraEventTypes.reset, { id: testid });
    });
    expect(result.current.cameraState.latitude).toEqual(0);
    expect(result.current.cameraState.longitude).toEqual(0);
    expect(result.current.cameraState.zoom).toEqual(0);
  });

  it('should ignore events for other instanceIds', () => {
    const otherId = uuid();
    const { result } = renderHook(() => useCameraState(testid));
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
    const { result } = renderHook(() => useCameraState(testid));
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
    const { result, unmount } = renderHook(() => useCameraState(testid));
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
    const { result: newResult } = renderHook(() => useCameraState(testid));
    expect(newResult.current.cameraState.latitude).toEqual(0);
    expect(newResult.current.cameraState.longitude).toEqual(0);
    expect(newResult.current.cameraState.zoom).toEqual(0);
  });
});
