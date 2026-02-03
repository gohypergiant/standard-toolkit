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

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MS_PER_HOUR, TIME_MARKER_WIDTH } from '../../constants';
import { useGanttStore } from '../../store';
import { useTimelineTransform } from './index';
import type { TimeMarkerObject } from '../../types';

describe('useTimelineTransform', () => {
  let mockElement: HTMLDivElement;
  const msPerPx = 10;
  const timeMarkers: TimeMarkerObject[] = [
    { timestampMs: 500 },
    { timestampMs: 1000 },
    { timestampMs: 1500 },
  ];

  beforeEach(() => {
    mockElement = document.createElement('div');
    useGanttStore.setState({ currentPositionMs: 0 });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial transform', () => {
    it('should set transform immediately on mount with null element', () => {
      const msPerPx = MS_PER_HOUR / TIME_MARKER_WIDTH;
      const timeMarkers: TimeMarkerObject[] = [{ timestampMs: 1000 }];

      renderHook(() =>
        useTimelineTransform({
          timelineElement: null,
          msPerPx,
          timeMarkers,
        }),
      );

      expect(mockElement.style.transform).toBe('');
    });

    it('should set transform immediately on mount', async () => {
      useGanttStore.setState({ currentPositionMs: 750 });

      renderHook(() =>
        useTimelineTransform({
          timelineElement: mockElement,
          msPerPx,
          timeMarkers,
        }),
      );

      await waitFor(() => {
        expect(mockElement.style.transform).toBe('translateX(-25px)');
      });
    });

    it('should apply correct initial transform', async () => {
      useGanttStore.setState({ currentPositionMs: 750 });

      renderHook(() =>
        useTimelineTransform({
          timelineElement: mockElement,
          msPerPx,
          timeMarkers,
        }),
      );

      await waitFor(() => {
        expect(mockElement.style.transform).toBe('translateX(-25px)');
      });
    });
  });

  describe('store subscription', () => {
    it('should update transform when store currentPositionMs changes', async () => {
      useGanttStore.setState({ currentPositionMs: 750 });

      renderHook(() =>
        useTimelineTransform({
          timelineElement: mockElement,
          msPerPx,
          timeMarkers,
        }),
      );

      await waitFor(() => {
        expect(mockElement.style.transform).toBe('translateX(-25px)');
      });

      act(() => {
        useGanttStore.setState({ currentPositionMs: 1250 });
      });

      await waitFor(() => {
        expect(mockElement.style.transform).toBe('translateX(-75px)');
      });
    });

    it('should request animation frame on store update', async () => {
      const rafSpy = vi
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((cb) => {
          console.log('hello world');
          cb(0);
          return 0;
        });

      useGanttStore.setState({ currentPositionMs: 100 });

      renderHook(() =>
        useTimelineTransform({
          timelineElement: mockElement,
          msPerPx,
          timeMarkers,
        }),
      );

      act(() => {
        useGanttStore.setState({ currentPositionMs: 500 });
      });
      const expectedNumRafCalls = 2; // One for initial, one for the update

      await waitFor(() => {
        expect(rafSpy).toHaveBeenCalledTimes(expectedNumRafCalls);
      });

      rafSpy.mockRestore();
    });
  });

  describe('null element handling', () => {
    it('should not update transform when element is null', () => {
      const msPerPx = 10;
      const timeMarkers: TimeMarkerObject[] = [{ timestampMs: 1000 }];

      useGanttStore.setState({ currentPositionMs: 0 });

      renderHook(() =>
        useTimelineTransform({
          timelineElement: null,
          msPerPx,
          timeMarkers,
        }),
      );

      expect(mockElement.style.transform).toBe('');

      act(() => {
        useGanttStore.setState({ currentPositionMs: 500 });
      });

      expect(mockElement.style.transform).toBe('');
    });

    it('should start updating after element becomes available', async () => {
      useGanttStore.setState({ currentPositionMs: 750 });

      const { rerender } = renderHook(
        ({ element }) =>
          useTimelineTransform({
            timelineElement: element,
            msPerPx,
            timeMarkers,
          }),
        {
          initialProps: { element: null as HTMLDivElement | null },
        },
      );

      expect(mockElement.style.transform).toBe('');

      rerender({ element: mockElement });

      await waitFor(() => {
        expect(mockElement.style.transform).toBe('translateX(-25px)');
      });
    });
  });
});
