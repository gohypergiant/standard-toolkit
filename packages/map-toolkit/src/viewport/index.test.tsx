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
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MapEvents } from '../deckgl/base-map/events';
import { clearViewportState, useViewportState, ViewportSize } from './index';
import type {
  MapEventType,
  MapViewportPayload,
} from '../deckgl/base-map/types';

const bus = Broadcast.getInstance<MapEventType>();

describe('useViewportState', () => {
  beforeEach(() => {
    // Clear any existing state before each test
    clearViewportState('test-view');
  });

  afterEach(() => {
    // Clean up after each test
    clearViewportState('test-view');
  });

  it('returns empty object initially when no viewport event has been emitted', () => {
    let viewState: MapViewportPayload | undefined;

    function TestComponent() {
      viewState = useViewportState({ viewId: 'test-view' });
      return null;
    }

    render(<TestComponent />);
    expect(viewState).toEqual({});
  });

  it('updates when viewport event is emitted', async () => {
    let viewState: MapViewportPayload | undefined;

    function TestComponent() {
      viewState = useViewportState({ viewId: 'test-view' });
      return <div data-testid='output'>{JSON.stringify(viewState)}</div>;
    }

    render(<TestComponent />);

    const payload: MapViewportPayload = {
      id: 'test-view',
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
      bounds: [-122.5, 37.7, -122.3, 37.8],
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload);
    });

    await waitFor(() => {
      expect(viewState).toEqual(payload);
    });
  });

  it('only responds to events matching its viewId', async () => {
    let viewState: MapViewportPayload | undefined;

    function TestComponent() {
      viewState = useViewportState({ viewId: 'test-view-1' });
      return null;
    }

    render(<TestComponent />);

    const payload1: MapViewportPayload = {
      id: 'test-view-2',
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
    };

    const payload2: MapViewportPayload = {
      id: 'test-view-1',
      latitude: 40.7128,
      longitude: -74.006,
      zoom: 12,
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload1);
    });
    await waitFor(() => {
      expect(viewState).toEqual({});
    });

    act(() => {
      bus.emit(MapEvents.viewport, payload2);
    });
    await waitFor(() => {
      expect(viewState).toEqual(payload2);
    });
  });

  it('supports multiple subscribers to the same viewId', async () => {
    let viewState1: MapViewportPayload | undefined;
    let viewState2: MapViewportPayload | undefined;

    function TestComponent1() {
      viewState1 = useViewportState({ viewId: 'test-view' });
      return null;
    }

    function TestComponent2() {
      viewState2 = useViewportState({ viewId: 'test-view' });
      return null;
    }

    const { rerender } = render(
      <>
        <TestComponent1 />
        <TestComponent2 />
      </>,
    );

    const payload: MapViewportPayload = {
      id: 'test-view',
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
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
      id: 'test-view',
      latitude: 40.7128,
      longitude: -74.006,
      zoom: 12,
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
      id: 'custom',
      latitude: 51.5074,
      longitude: -0.1278,
      zoom: 8,
    };

    const customSubscribe = vi.fn(() => {
      // biome-ignore lint/suspicious/noEmptyBlockStatements: mock cleanup function
      return () => {};
    });

    const customGetSnapshot = vi.fn(() => customPayload);

    let viewState: MapViewportPayload | undefined;

    function TestComponent() {
      viewState = useViewportState({
        viewId: 'custom-view',
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
      viewState = useViewportState({ viewId: 'test-view' });
      return null;
    }

    const { unmount } = render(<TestComponent />);

    const payload: MapViewportPayload = {
      id: 'test-view',
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
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
      id: 'test-view',
      latitude: 40.7128,
      longitude: -74.006,
      zoom: 12,
    };

    expect(() => {
      act(() => {
        bus.emit(MapEvents.viewport, payload2);
      });
    }).not.toThrow();
  });
});

describe('ViewportSize', () => {
  beforeEach(() => {
    clearViewportState('test-view');
  });

  afterEach(() => {
    clearViewportState('test-view');
  });

  it('renders default placeholder when no bounds are available', () => {
    render(<ViewportSize viewId='test-view' />);
    expect(screen.getByText('-- x -- NM')).toBeInTheDocument();
  });

  it('renders viewport size when bounds are available', async () => {
    render(<ViewportSize viewId='test-view' data-testid='viewport-size' />);

    const payload: MapViewportPayload = {
      id: 'test-view',
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
      bounds: [-82, 22, -71, 52],
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload);
    });

    await waitFor(() => {
      expect(screen.getByTestId('viewport-size').textContent).toMatch(
        /^\d{1,3}(,\d{3})* x \d{1,3}(,\d{3})* NM$/,
      );
    });
  });

  it('respects custom unit prop', async () => {
    render(
      <ViewportSize viewId='test-view' unit='km' data-testid='viewport-size' />,
    );

    const payload: MapViewportPayload = {
      id: 'test-view',
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
      bounds: [-82, 22, -71, 52],
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload);
    });

    await waitFor(() => {
      expect(screen.getByTestId('viewport-size').textContent).toMatch(/KM$/);
    });
  });

  it('applies custom className', () => {
    render(
      <ViewportSize
        viewId='test-view'
        className='custom-class'
        data-testid='viewport-size'
      />,
    );
    expect(screen.getByTestId('viewport-size')).toHaveClass('custom-class');
  });

  it('updates when viewport changes', async () => {
    render(<ViewportSize viewId='test-view' data-testid='viewport-size' />);

    const payload1: MapViewportPayload = {
      id: 'test-view',
      bounds: [-82, 22, -71, 52],
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload1);
    });

    await waitFor(() => {
      expect(screen.getByTestId('viewport-size').textContent).not.toBe(
        '-- x -- NM',
      );
    });

    const firstContent = screen.getByTestId('viewport-size').textContent;

    const payload2: MapViewportPayload = {
      id: 'test-view',
      bounds: [-100, 30, -90, 40],
    };

    act(() => {
      bus.emit(MapEvents.viewport, payload2);
    });

    await waitFor(() => {
      const secondContent = screen.getByTestId('viewport-size').textContent;
      expect(secondContent).not.toBe(firstContent);
    });
  });
});

describe('clearViewportState', () => {
  it('clears viewport state for a specific viewId', async () => {
    let viewState: MapViewportPayload | undefined;

    function TestComponent() {
      viewState = useViewportState({ viewId: 'test-view' });
      return null;
    }

    const { unmount } = render(<TestComponent />);

    const payload: MapViewportPayload = {
      id: 'test-view',
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
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
    clearViewportState('test-view');

    // Re-mount and verify state is cleared
    render(<TestComponent />);

    // After clearing, new subscriptions should start with empty state
    expect(viewState).toEqual({});
  });
});
