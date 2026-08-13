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
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createGanttStoreProvider } from '@/components/gantt/__fixtures__/store-provider';
import { useGanttStoreApi } from '@/components/gantt/context/store';
import { selectors } from '@/components/gantt/store';
import * as helpers from '@/components/gantt/utils/helpers';
import { useHorizontalScrollUpdate } from './index';
import type { UIEvent } from 'react';
import type { TemporalDataContextValue } from '@/components/gantt/context/temporal-data';

vi.mock('@/components/gantt/context/temporal-data', () => ({
  useTemporalDataContext: vi.fn(),
}));

vi.mock('@/components/gantt/utils/helpers', async () => {
  const actual = await vi.importActual('@/components/gantt/utils/helpers');
  return {
    ...actual,
    getHorizontalScrolledPixels: vi.fn(),
  };
});

import { useTemporalDataContext } from '@/components/gantt/context/temporal-data';

describe('useHorizontalScrollUpdate', () => {
  const mockTotalBounds = { startMs: 1000, endMs: 10000 };
  const mockMsPerPx = 10;

  const baseContextValue = {
    totalBounds: mockTotalBounds,
    msPerPx: mockMsPerPx,
  } as unknown as TemporalDataContextValue;

  const wrapper = createGanttStoreProvider({ startTimeMs: 0 });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTemporalDataContext).mockReturnValue(baseContextValue);
  });

  it('should calculate and set current position based on scroll pixels', () => {
    const scrolledPixels = 50;
    vi.mocked(helpers.getHorizontalScrolledPixels).mockReturnValue(
      scrolledPixels,
    );

    const { result } = renderHook(
      () => ({
        hook: useHorizontalScrollUpdate(),
        store: useGanttStoreApi(),
      }),
      { wrapper },
    );

    const mockEvent = {} as UIEvent<HTMLDivElement>;
    result.current.hook.onScroll(mockEvent);

    const expectedPositionMs =
      mockTotalBounds.startMs + scrolledPixels * mockMsPerPx;
    const actualPositionMs = selectors.currentPositionMs(
      result.current.store.getState(),
    );
    expect(actualPositionMs).toBe(expectedPositionMs);
    expect(actualPositionMs).toBe(1500);
  });
});
