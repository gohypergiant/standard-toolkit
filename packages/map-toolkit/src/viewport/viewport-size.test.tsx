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
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MapEvents } from '../deckgl/base-map/events';
import { clearViewportState, ViewportSize } from './index';
import type {
  MapEventType,
  MapViewportPayload,
} from '../deckgl/base-map/types';

const bus = Broadcast.getInstance<MapEventType>();
const instanceId = uuid();

describe('ViewportSize', () => {
  beforeEach(() => {
    clearViewportState(instanceId);
  });

  afterEach(() => {
    clearViewportState(instanceId);
  });

  it('renders default placeholder when no bounds are available', () => {
    render(<ViewportSize instanceId={instanceId} />);
    expect(screen.getByText('-- x -- NM')).toBeInTheDocument();
  });

  it('renders viewport size when bounds are available', async () => {
    render(
      <ViewportSize instanceId={instanceId} data-testid='viewport-size' />,
    );

    const payload: MapViewportPayload = {
      id: instanceId,
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
      bounds: [-82, 22, -71, 52],
      width: 800,
      height: 600,
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
      <ViewportSize
        instanceId={instanceId}
        unit='km'
        data-testid='viewport-size'
      />,
    );

    const payload: MapViewportPayload = {
      id: instanceId,
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
      bounds: [-82, 22, -71, 52],
      width: 800,
      height: 600,
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
        instanceId={instanceId}
        className='custom-class'
        data-testid='viewport-size'
      />,
    );
    expect(screen.getByTestId('viewport-size')).toHaveClass('custom-class');
  });

  it('updates when viewport changes', async () => {
    render(
      <ViewportSize instanceId={instanceId} data-testid='viewport-size' />,
    );

    const payload1: MapViewportPayload = {
      id: instanceId,
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 10,
      bounds: [-82, 22, -71, 52],
      width: 800,
      height: 600,
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

    // Different zoom level should result in different calculated size
    const payload2: MapViewportPayload = {
      id: instanceId,
      bounds: [-100, 30, -90, 40],
      latitude: 37.7749,
      longitude: -122.4194,
      zoom: 8, // Different zoom for different output
      width: 800,
      height: 600,
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
