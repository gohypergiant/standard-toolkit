/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDeferredCollection } from './index';

describe('useDeferredCollection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start with isReady as false', () => {
    const { result } = renderHook(() => useDeferredCollection());
    expect(result.current.isReady).toBe(false);
  });

  it('should become ready after default 2 animation frames', () => {
    const { result } = renderHook(() => useDeferredCollection());

    expect(result.current.isReady).toBe(false);

    // First frame
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    expect(result.current.isReady).toBe(false);

    // Second frame
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    expect(result.current.isReady).toBe(true);
  });

  it('should respect custom deferFrames option', () => {
    const { result } = renderHook(() =>
      useDeferredCollection({ deferFrames: 3 }),
    );

    expect(result.current.isReady).toBe(false);

    // Advance 2 frames - still not ready
    act(() => {
      vi.advanceTimersToNextFrame();
      vi.advanceTimersToNextFrame();
    });
    expect(result.current.isReady).toBe(false);

    // Third frame - now ready
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    expect(result.current.isReady).toBe(true);
  });

  it('should cleanup animation frame on unmount', () => {
    const cancelSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
    const { unmount } = renderHook(() => useDeferredCollection());

    unmount();

    expect(cancelSpy).toHaveBeenCalled();
    cancelSpy.mockRestore();
  });
});
