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
import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapEvents } from '../deckgl/base-map/events';
import { clearViewportState, useViewportState } from './index';
import type {
  MapEventType,
  MapViewportPayload,
} from '../deckgl/base-map/types';

const bus = Broadcast.getInstance<MapEventType>();
const instanceId = uuid();
const instanceIdTwo = uuid();

const defaultPayload = {
  zoom: Number.NaN,
  latitude: Number.NaN,
  longitude: Number.NaN,
  id: instanceId,
  bounds: [Number.NaN, Number.NaN, Number.NaN, Number.NaN],
  width: 0,
  height: 0,
};

describe('useViewportState', () => {
  beforeEach(() => {
    // Clear any existing state before each test
    clearViewportState(instanceId);
  });

  afterEach(() => {
    // Clean up after each test
    clearViewportState(instanceId);
  });

  it('returns empty object initially when no viewport event has been emitted', () => {
    let viewState: MapViewportPayload | undefined;

    function TestComponent() {
      viewState = useViewportState({ instanceId });
      return null;
    }

    render(<TestComponent />);
    expect(viewState).toEqual(defaultPayload);
  });

  it('updates when viewport event is emitted', async () => {
    let viewState: MapViewportPayload | undefined;

    function TestComponent() {
      viewState = useViewportState({ instanceId });
      return <div data-testid='output'>{JSON.stringify(viewState)}</div>;
    }

    render(<TestComponent />);

    const payload: MapViewportPayload = {
      id: instanceId,
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
      bounds: [-122.5, 37.7, -122.3, 37.8],
      width: 800,
      height: 600,
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload);
    });

    await waitFor(() => {
      expect(viewState).toEqual(payload);
    });
  });

  it('only responds to events matching its instanceId', async () => {
    let viewState: MapViewportPayload | undefined;

    function TestComponent() {
      viewState = useViewportState({ instanceId });
      return null;
    }

    render(<TestComponent />);

    const payload1: MapViewportPayload = {
      id: instanceId,
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
      bounds: [0, 0, 0, 0],
      width: 800,
      height: 600,
    };

    const payload2: MapViewportPayload = {
      id: instanceIdTwo,
      latitude: 40.7128,
      longitude: -74.006,
      zoom: 12,
      bounds: [0, 0, 0, 0],
      width: 800,
      height: 600,
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload1);
    });
    await waitFor(() => {
      expect(viewState).toEqual(payload1);
    });

    act(() => {
      bus.emit(MapEvents.viewport, payload2);
    });
    await waitFor(() => {
      expect(viewState).toEqual(payload1);
    });
  });

  it('supports multiple subscribers to the same instanceId', async () => {
    let viewState1: MapViewportPayload | undefined;
    let viewState2: MapViewportPayload | undefined;

    function TestComponent1() {
      viewState1 = useViewportState({ instanceId });
      return null;
    }

    function TestComponent2() {
      viewState2 = useViewportState({ instanceId });
      return null;
    }

    const { rerender } = render(
      <>
        <TestComponent1 />
        <TestComponent2 />
      </>,
    );

    const payload: MapViewportPayload = {
      id: instanceId,
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
      bounds: [0, 0, 0, 0],
      width: 800,
      height: 600,
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload);
    });

    await waitFor(() => {
      expect(viewState1).toEqual(payload);
      expect(viewState2).toEqual(payload);
    });

    rerender(<TestComponent1 />);

    const payload2: MapViewportPayload = {
      id: instanceId,
      latitude: 40.7128,
      longitude: -74.006,
      zoom: 12,
      bounds: [0, 0, 0, 0],
      width: 800,
      height: 600,
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload2);
    });

    await waitFor(() => {
      expect(viewState1).toEqual(payload2);
    });
  });

  it('supports custom subscribe and getSnapshot functions', () => {
    const customPayload: MapViewportPayload = {
      id: instanceIdTwo,
      latitude: 51.5074,
      longitude: -0.1278,
      zoom: 8,
      bounds: [0, 0, 0, 0],
      width: 800,
      height: 600,
    };

    const customSubscribe = vi.fn(() => {
      // biome-ignore lint/suspicious/noEmptyBlockStatements: mock cleanup function
      return () => {};
    });

    const customGetSnapshot = vi.fn(() => customPayload);

    let viewState: MapViewportPayload | undefined;

    function TestComponent() {
      viewState = useViewportState({
        instanceId: instanceIdTwo,
        subscribe: customSubscribe,
        getSnapshot: customGetSnapshot,
      });
      return null;
    }

    render(<TestComponent />);

    expect(customSubscribe).toHaveBeenCalled();
    expect(customGetSnapshot).toHaveBeenCalled();
    expect(viewState).toEqual(customPayload);
  });

  it('cleans up subscriptions when unmounted', async () => {
    let viewState: MapViewportPayload | undefined;

    function TestComponent() {
      viewState = useViewportState({ instanceId });
      return null;
    }

    const { unmount } = render(<TestComponent />);

    const payload: MapViewportPayload = {
      id: instanceId,
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
      bounds: [0, 0, 0, 0],
      width: 800,
      height: 600,
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload);
    });

    await waitFor(() => {
      expect(viewState).toEqual(payload);
    });

    unmount();

    // After unmount, emitting another event should not cause issues
    const payload2: MapViewportPayload = {
      id: instanceId,
      latitude: 40.7128,
      longitude: -74.006,
      zoom: 12,
      bounds: [0, 0, 0, 0],
      width: 800,
      height: 600,
    };

    expect(() => {
      act(() => {
        bus.emit(MapEvents.viewport, payload2);
      });
    }).not.toThrow();
  });
});

describe('clearViewportState', () => {
  it('clears viewport state for a specific instanceId', async () => {
    let viewState: MapViewportPayload | undefined;

    function TestComponent() {
      viewState = useViewportState({ instanceId });
      return null;
    }

    const { unmount } = render(<TestComponent />);

    const payload: MapViewportPayload = {
      id: instanceId,
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
      bounds: [0, 0, 0, 0],
      width: 800,
      height: 600,
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload);
    });

    await waitFor(() => {
      expect(viewState).toEqual(payload);
    });

    // Unmount to avoid stale subscriptions
    unmount();

    // Clear the state
    clearViewportState(instanceId);

    // Re-mount and verify state is cleared
    render(<TestComponent />);

    // After clearing, new subscriptions should start with empty state
    expect(viewState).toEqual(defaultPayload);
  });
});
