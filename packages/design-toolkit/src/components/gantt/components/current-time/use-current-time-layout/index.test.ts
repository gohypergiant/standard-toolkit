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
import { useCurrentTimeLayout } from '.';

const mocks = vi.hoisted(() => {
  return {
    deriveCurrentTimeTranslateX: vi.fn(() => 150),
  };
});

vi.mock('@/components/gantt/hooks/use-layout-subscription', () => ({
  useLayoutSubscription: vi.fn(),
}));

vi.mock('@/components/gantt/context', () => ({
  useGanttContext: vi.fn(),
}));

vi.mock('@/components/gantt/context/temporal-data', () => ({
  useTemporalDataContext: vi.fn(),
}));

vi.mock('@/components/gantt/utils/layout', () => ({
  deriveCurrentTimeTranslateX: vi.fn(),
}));

vi.mock('@/components/gantt/store', () => ({
  selectors: {
    currentPositionMs: vi.fn(() => 'selector-function'),
  },
}));

import { GANTT_HEADER_HEIGHT_PX } from '@/components/gantt/constants';
import { useGanttContext } from '@/components/gantt/context';
import { useTemporalDataContext } from '@/components/gantt/context/temporal-data';
import { useLayoutSubscription } from '@/components/gantt/hooks/use-layout-subscription';
import { deriveCurrentTimeTranslateX } from '@/components/gantt/utils/layout';

describe('useCurrentTimeLayout', () => {
  const capturedCallbackHarness: { callback?: (ms: number) => void } = {};

  const mockCurrentTimeMs = 1500;
  const mockUpdatedPositionMs = 1200;

  const mockScrollContainerElement = {
    clientWidth: 800,
    clientHeight: 600,
  } as HTMLDivElement;

  const mockTimelineContainerElement = {
    clientHeight: 50,
  } as HTMLDivElement;

  const mockHeaderElement = {
    clientHeight: GANTT_HEADER_HEIGHT_PX,
  } as HTMLDivElement;

  const mockGanttContextValue = {
    scrollContainerElement: mockScrollContainerElement,
    timelineContainerElement: mockTimelineContainerElement,
    headerElement: mockHeaderElement,
    assignTimelineContainerElementRef: vi.fn(),
    assignScrollContainerElementRef: vi.fn(),
    assignHeaderElementRef: vi.fn(),
  };

  const mockTemporalDataContextValue = {
    msPerPx: 10,
    renderedRegionBounds: { startMs: 1000, endMs: 2500 },
    timescale: '1h' as const,
    totalBounds: { startMs: 0, endMs: 5000 },
    timelineChunks: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useGanttContext).mockReturnValue(mockGanttContextValue);

    vi.mocked(useTemporalDataContext).mockReturnValue(
      mockTemporalDataContextValue,
    );

    vi.mocked(useLayoutSubscription).mockImplementation(
      ({ callback }: { callback: (ms: number) => void }) => {
        capturedCallbackHarness.callback = callback;
      },
    );

    vi.mocked(deriveCurrentTimeTranslateX).mockImplementation(
      mocks.deriveCurrentTimeTranslateX,
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('updates element translateX style when subscription callback runs', () => {
    const currentTimeElement = document.createElement('div');
    const indicatorElement = document.createElement('div');

    renderHook(() =>
      useCurrentTimeLayout({
        currentTimeElement,
        currentTimeMs: mockCurrentTimeMs,
        indicatorElement,
      }),
    );

    capturedCallbackHarness.callback?.(mockUpdatedPositionMs);

    expect(currentTimeElement.style.getPropertyValue('--translate-x')).toBe(
      '150px',
    );
  });

  it('does not update styles when currentTimeElement is null', () => {
    const indicatorElement = document.createElement('div');

    renderHook(() =>
      useCurrentTimeLayout({
        currentTimeElement: null,
        currentTimeMs: mockCurrentTimeMs,
        indicatorElement,
      }),
    );

    expect(() =>
      capturedCallbackHarness.callback?.(mockUpdatedPositionMs),
    ).not.toThrow();
  });

  it('adjusts indicator height when translateX exceeds scroll container width', () => {
    const currentTimeElement = document.createElement('div');
    const indicatorElement = document.createElement('div');

    vi.mocked(deriveCurrentTimeTranslateX).mockReturnValue(
      mockScrollContainerElement.clientWidth + 50,
    );

    renderHook(() =>
      useCurrentTimeLayout({
        currentTimeElement,
        currentTimeMs: mockCurrentTimeMs,
        indicatorElement,
      }),
    );

    capturedCallbackHarness.callback?.(mockUpdatedPositionMs);

    expect(indicatorElement.style.height).toBeTruthy();
  });

  it('handles null indicatorElement gracefully', () => {
    const currentTimeElement = document.createElement('div');

    renderHook(() =>
      useCurrentTimeLayout({
        currentTimeElement,
        currentTimeMs: mockCurrentTimeMs,
        indicatorElement: null,
      }),
    );

    expect(() =>
      capturedCallbackHarness.callback?.(mockUpdatedPositionMs),
    ).not.toThrow();
  });
});
