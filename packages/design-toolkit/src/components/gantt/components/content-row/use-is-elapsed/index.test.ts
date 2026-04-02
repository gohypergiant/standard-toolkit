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
import { useIsElapsed } from './index';
import type { TemporalDataContextValue } from '@/components/gantt/context/temporal-data';

vi.mock('@/components/gantt/context/temporal-data', () => ({
  useTemporalDataContext: vi.fn(),
}));

import { useTemporalDataContext } from '@/components/gantt/context/temporal-data';

function setupContext(currentTimeMs: number) {
  vi.mocked(useTemporalDataContext).mockReturnValue({
    currentTimeMs,
  } as unknown as TemporalDataContextValue);
}

describe('useIsElapsed', () => {
  it('should return false when timeMs is undefined', () => {
    setupContext(5_000);

    const { result } = renderHook(() => useIsElapsed({ timeMs: undefined }));

    expect(result.current).toBe(false);
  });

  it('should return false when timeMs is after currentTimeMs', () => {
    setupContext(3_000);

    const { result } = renderHook(() => useIsElapsed({ timeMs: 5_000 }));

    expect(result.current).toBe(false);
  });

  it('should return true when timeMs equals currentTimeMs', () => {
    setupContext(5_000);

    const { result } = renderHook(() => useIsElapsed({ timeMs: 5_000 }));

    expect(result.current).toBe(true);
  });

  it('should return true when timeMs is before currentTimeMs', () => {
    setupContext(8_000);

    const { result } = renderHook(() => useIsElapsed({ timeMs: 5_000 }));

    expect(result.current).toBe(true);
  });
});
