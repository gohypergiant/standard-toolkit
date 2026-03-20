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
import { useRootElementHeight } from './';

vi.mock('@/components/gantt/context', () => ({
  useGanttContext: vi.fn(),
}));

import {
  type GanttContextValue,
  useGanttContext,
} from '@/components/gantt/context';

describe('useRootElementHeight', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 0 when rootElement is null', () => {
    vi.mocked(useGanttContext).mockReturnValue({
      rootElement: null,
    } as unknown as GanttContextValue);

    const { result } = renderHook(() => useRootElementHeight());

    expect(result.current).toBe(0);
  });

  it('should return clientHeight when rootElement exists', () => {
    const mockElement = { clientHeight: 500 } as HTMLDivElement;
    vi.mocked(useGanttContext).mockReturnValue({
      rootElement: mockElement,
    } as unknown as GanttContextValue);

    const { result } = renderHook(() => useRootElementHeight());

    expect(result.current).toBe(500);
  });
});
