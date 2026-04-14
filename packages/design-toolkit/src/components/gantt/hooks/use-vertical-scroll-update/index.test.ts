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
import * as helpers from '@/components/gantt/utils/helpers';
import { useVerticalScrollUpdate } from './index';
import type { UIEvent } from 'react';
import type { GanttContextValue } from '@/components/gantt/context';

vi.mock('@/components/gantt/context', () => ({
  useGanttContext: vi.fn(),
}));

vi.mock('@/components/gantt/utils/helpers', async () => {
  const actual = await vi.importActual('@/components/gantt/utils/helpers');
  return {
    ...actual,
    getVerticalScrolledPixels: vi.fn(),
  };
});

import { useGanttContext } from '@/components/gantt/context';

describe('useVerticalScrollUpdate', () => {
  const mockScrollTo = vi.fn();
  const mockGanttContentElement = {
    scrollTo: mockScrollTo,
  } as unknown as HTMLDivElement;

  const baseContextValue = {
    ganttContentElement: mockGanttContentElement,
  } as unknown as GanttContextValue;

  const wrapper = createGanttStoreProvider({ startTimeMs: 0 });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGanttContext).mockReturnValue(baseContextValue);
  });

  it('should update store and scroll element on scroll', () => {
    const scrolledPixels = 150;
    vi.mocked(helpers.getVerticalScrolledPixels).mockReturnValue(
      scrolledPixels,
    );

    const { result } = renderHook(
      () => ({
        hook: useVerticalScrollUpdate(),
        store: useGanttStoreApi(),
      }),
      { wrapper },
    );

    const mockEvent = {} as UIEvent<HTMLDivElement>;
    result.current.hook.onScroll(mockEvent);

    expect(result.current.store.getState().currentRowScrollPx).toBe(
      scrolledPixels,
    );
    expect(mockScrollTo).toHaveBeenCalledWith({ top: scrolledPixels });
  });
});
