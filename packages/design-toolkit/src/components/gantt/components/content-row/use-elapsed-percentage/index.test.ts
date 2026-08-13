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
import { useElapsedPercentage } from './index';
import type { TemporalDataContextValue } from '@/components/gantt/context/temporal-data';

vi.mock('@/components/gantt/context/temporal-data', () => ({
  useTemporalDataContext: vi.fn(),
}));

import { useTemporalDataContext } from '@/components/gantt/context/temporal-data';

const mockRenderedRegionBounds = { startMs: 0, endMs: 10_000 };

function setupContext(currentTimeMs: number) {
  vi.mocked(useTemporalDataContext).mockReturnValue({
    currentTimeMs,
    renderedRegionBounds: mockRenderedRegionBounds,
  } as unknown as TemporalDataContextValue);
}

describe('useElapsedPercentage', () => {
  it('should return 0 when time is before the element start', () => {
    setupContext(1_000);

    const { result } = renderHook(() =>
      useElapsedPercentage({ startMs: 2_000, endMs: 6_000 }),
    );

    expect(result.current).toBe(0);
  });

  it('should return 100 when time is after the element end', () => {
    setupContext(8_000);

    const { result } = renderHook(() =>
      useElapsedPercentage({ startMs: 2_000, endMs: 6_000 }),
    );

    expect(result.current).toBe(100);
  });

  it('should return the correct percentage when time is within the element', () => {
    setupContext(4_000);

    const { result } = renderHook(() =>
      useElapsedPercentage({ startMs: 2_000, endMs: 6_000 }),
    );

    expect(result.current).toBe(50);
  });

  it('should clamp startMs to renderedRegionBounds.startMs when element starts before rendered region', () => {
    vi.mocked(useTemporalDataContext).mockReturnValue({
      currentTimeMs: 2_000,
      renderedRegionBounds: { startMs: 1_000, endMs: 10_000 },
    } as unknown as TemporalDataContextValue);

    // Element starts at 0 but rendered region starts at 1000, so effective start is 1000.
    // currentTime 2000 is 1000ms into a 4000ms span → 25%.
    const { result } = renderHook(() =>
      useElapsedPercentage({ startMs: 0, endMs: 5_000 }),
    );

    expect(result.current).toBe(25);
  });

  it('should clamp endMs to renderedRegionBounds.endMs when element ends after rendered region', () => {
    vi.mocked(useTemporalDataContext).mockReturnValue({
      currentTimeMs: 6_000,
      renderedRegionBounds: { startMs: 0, endMs: 8_000 },
    } as unknown as TemporalDataContextValue);

    // Element ends at 10000 but rendered region ends at 8000, so effective end is 8000.
    // currentTime 6000 is 6000ms into a 8000ms span → 75%.
    const { result } = renderHook(() =>
      useElapsedPercentage({ startMs: 0, endMs: 10_000 }),
    );

    expect(result.current).toBe(75);
  });

  it('should return 0 when effective duration is zero', () => {
    vi.mocked(useTemporalDataContext).mockReturnValue({
      currentTimeMs: 5_000,
      renderedRegionBounds: { startMs: 3_000, endMs: 3_000 },
    } as unknown as TemporalDataContextValue);

    const { result } = renderHook(() =>
      useElapsedPercentage({ startMs: 0, endMs: 10_000 }),
    );

    expect(result.current).toBe(0);
  });
});
