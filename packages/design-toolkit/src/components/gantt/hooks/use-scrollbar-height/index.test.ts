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
import { describe, expect, it, vi } from 'vitest';
import { useScrollbarHeight } from './index';

vi.mock('@/components/gantt/context', () => ({
  useGanttContext: vi.fn(),
}));

import { type GanttContextValue, useGanttContext } from '../../context';

describe('useScrollbarHeight', () => {
  it('returns 0 when ganttContentElement is null', () => {
    vi.mocked(useGanttContext).mockReturnValue({
      ganttContentElement: null,
    } as unknown as GanttContextValue);

    const { result } = renderHook(() => useScrollbarHeight());
    expect(result.current).toBe(0);
  });

  it('calculates scrollbar height correctly when ganttContentElement exists', () => {
    const mockElement = {
      offsetHeight: 100,
      clientHeight: 90,
    } as HTMLDivElement;

    vi.mocked(useGanttContext).mockReturnValue({
      ganttContentElement: mockElement,
    } as unknown as GanttContextValue);

    const { result } = renderHook(() => useScrollbarHeight());

    // The scrollbar height should be offsetHeight - clientHeight = 10
    expect(result.current).toBe(10);
  });
});
