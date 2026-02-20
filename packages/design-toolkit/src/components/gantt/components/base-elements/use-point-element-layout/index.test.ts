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

import { renderHook } from '@testing-library/react';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePointElementLayout } from '.';
import type { GanttContextValue } from '../../../context';

const mocks = vi.hoisted(() => {
  const returnedLayout = { translateX: 123 };

  return {
    returnedLayout,
    derivePointElementLayout: vi.fn(() => returnedLayout),
  };
});

vi.mock('../../../hooks/use-layout-subscription', () => ({
  useLayoutSubscription: vi.fn(),
}));

vi.mock('../../../context', () => {
  const mockGanttContextValue: Partial<GanttContextValue> = {
    msPerPx: 10,
    renderedRegionBounds: { startMs: 1000, endMs: 2500 },
    totalBounds: { startMs: 0, endMs: 5000 },
    timescale: '1h',
  };

  return {
    useGanttContext: () => mockGanttContextValue,
  };
});

vi.mock('../../../utils/layout', () => ({
  derivePointElementLayout: vi.fn(),
}));

vi.mock('../../../store', () => ({
  selectors: {
    roundedCurrentPositionMs: vi.fn(() => 'selector-function'),
  },
}));

import { useLayoutSubscription } from '../../../hooks/use-layout-subscription';
import { derivePointElementLayout } from '../../../utils/layout';

describe('usePointElementLayout', () => {
  const capturedCallbackHarness: { callback?: (ms: number) => void } = {};

  // Define constants for test values
  const mockRenderedRegionBounds = { startMs: 1000, endMs: 2500 };
  const mockTotalBounds = { startMs: 0, endMs: 5000 };
  const mockMsPerPx = 10;

  beforeEach(() => {
    vi.mocked(useLayoutSubscription).mockImplementation(
      ({ callback }: { callback: (ms: number) => void }) => {
        // Capture callback passed into useLayoutSubscription
        capturedCallbackHarness.callback = callback;
      },
    );

    vi.mocked(derivePointElementLayout).mockImplementation(
      mocks.derivePointElementLayout,
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('updates element styles when subscription callback runs', () => {
    const div = document.createElement('div');
    const pointTimeMs = 1200;

    renderHook(() =>
      usePointElementLayout({
        element: div,
        timeMs: pointTimeMs,
      }),
    );

    const updatedTimestampMs = 775;

    // simulate store update that triggers the subscription callback
    capturedCallbackHarness.callback?.(updatedTimestampMs);

    // Verify the correct parameters were passed to derivePointElementLayout
    expect(mocks.derivePointElementLayout).toHaveBeenCalledWith(
      expect.objectContaining(mockRenderedRegionBounds),
      pointTimeMs,
      expect.objectContaining(mockTotalBounds),
      mockMsPerPx,
    );

    // Verify the CSS custom property was set correctly
    expect(div.style.getPropertyValue('--translate-x')).toBe(
      `${mocks.returnedLayout.translateX}px`,
    );
  });

  it('does nothing if element is null', () => {
    renderHook(() =>
      usePointElementLayout({
        element: null,
        timeMs: 1200,
      }),
    );

    expect(() => capturedCallbackHarness.callback?.(123)).not.toThrow();
    expect(mocks.derivePointElementLayout).not.toHaveBeenCalled();
  });
});
