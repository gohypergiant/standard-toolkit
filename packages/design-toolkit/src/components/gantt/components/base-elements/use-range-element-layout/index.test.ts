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
import { useRangeElementLayout } from '.';
import type { TemporalDataContextValue } from '@/components/gantt/context/temporal-data';

const mocks = vi.hoisted(() => {
  const returnedLayout = { translateX: 123, widthPx: 456 };

  return {
    returnedLayout,
    deriveRangeElementLayout: vi.fn(() => returnedLayout),
  };
});

vi.mock('@/components/gantt/hooks/use-layout-subscription', () => ({
  useLayoutSubscription: vi.fn(),
}));

vi.mock('@/components/gantt/context/temporal-data', () => {
  const mockTemporalDataContextValue: Partial<TemporalDataContextValue> = {
    msPerPx: 10,
    renderedRegionBounds: { startMs: 1000, endMs: 2500 },
    totalBounds: { startMs: 0, endMs: 5000 },
    timescale: '1h',
    timelineChunks: [],
  };

  return {
    useTemporalDataContext: () => mockTemporalDataContextValue,
  };
});

vi.mock('@/components/gantt/utils/layout', () => ({
  deriveRangeElementLayout: vi.fn(),
}));

import { useLayoutSubscription } from '@/components/gantt/hooks/use-layout-subscription';
import { deriveRangeElementLayout } from '@/components/gantt/utils/layout';

describe('useRangeElementLayout', () => {
  const capturedCallbackHarness: { callback?: (ms: number) => void } = {};

  beforeEach(() => {
    vi.mocked(useLayoutSubscription).mockImplementation(
      ({ callback }: { callback: (ms: number) => void }) => {
        // Capture callback passed into useLayoutSubscription
        capturedCallbackHarness.callback = callback;
      },
    );

    vi.mocked(deriveRangeElementLayout).mockImplementation(
      mocks.deriveRangeElementLayout,
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('updates element styles when subscription callback runs', () => {
    const div = document.createElement('div');

    renderHook(() =>
      useRangeElementLayout({
        element: div,
        timeBounds: { startMs: 1000, endMs: 1500 },
      }),
    );

    const updatedTimestampMs = 775;

    // simulate store update that triggers the subscription callback
    capturedCallbackHarness.callback?.(updatedTimestampMs);

    expect(div.style.transform).toBe(
      `translateX(${mocks.returnedLayout.translateX}px)`,
    );
    expect(div.style.width).toBe(`${mocks.returnedLayout.widthPx}px`);
  });

  it('does nothing if elementRef.current is null', () => {
    renderHook(() =>
      useRangeElementLayout({
        element: null,
        timeBounds: { startMs: 1000, endMs: 1500 },
      }),
    );

    expect(() => capturedCallbackHarness.callback?.(123)).not.toThrow();
    expect(mocks.deriveRangeElementLayout).not.toHaveBeenCalled();
  });
});
