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

import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useEnterExitAnimation } from './index';

describe('useEnterExitAnimation', () => {
  it('should initialize with no animation states on first render', () => {
    const { result } = renderHook(() => useEnterExitAnimation(false));

    expect(result.current.isEntering).toBe(false);
    expect(result.current.isExiting).toBe(false);
  });

  it('should set isEntering when transitioning from closed to open', async () => {
    const { result, rerender } = renderHook(
      ({ isOpen }) => useEnterExitAnimation(isOpen, { duration: 100 }),
      { initialProps: { isOpen: false } },
    );

    // Initial state
    expect(result.current.isEntering).toBe(false);
    expect(result.current.isExiting).toBe(false);

    // Trigger opening
    rerender({ isOpen: true });

    // Should be entering
    expect(result.current.isEntering).toBe(true);
    expect(result.current.isExiting).toBe(false);

    // Wait for animation to complete
    await waitFor(
      () => {
        expect(result.current.isEntering).toBe(false);
      },
      { timeout: 200 },
    );
  });

  it('should set isExiting when transitioning from open to closed', async () => {
    const { result, rerender } = renderHook(
      ({ isOpen }) => useEnterExitAnimation(isOpen, { duration: 100 }),
      { initialProps: { isOpen: true } },
    );

    // Wait a tick for initialization
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Trigger closing
    rerender({ isOpen: false });

    // Should be exiting
    expect(result.current.isEntering).toBe(false);
    expect(result.current.isExiting).toBe(true);

    // Wait for animation to complete
    await waitFor(
      () => {
        expect(result.current.isExiting).toBe(false);
      },
      { timeout: 200 },
    );
  });

  it('should respect custom duration', async () => {
    const customDuration = 50;
    const { result, rerender } = renderHook(
      ({ isOpen }) =>
        useEnterExitAnimation(isOpen, { duration: customDuration }),
      { initialProps: { isOpen: false } },
    );

    rerender({ isOpen: true });

    expect(result.current.isEntering).toBe(true);

    // Should still be entering after half the duration
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, customDuration / 2));
    });
    expect(result.current.isEntering).toBe(true);

    // Should be done after the full duration
    await waitFor(
      () => {
        expect(result.current.isEntering).toBe(false);
      },
      { timeout: customDuration * 2 },
    );
  });

  it('should skip animation on initial mount by default', () => {
    const { result } = renderHook(() => useEnterExitAnimation(true));

    // Should not be entering even though starting as open
    expect(result.current.isEntering).toBe(false);
    expect(result.current.isExiting).toBe(false);
  });

  it('should not skip animation on initial mount when skipInitialMount is false', async () => {
    const { result } = renderHook(() =>
      useEnterExitAnimation(true, { skipInitialMount: false, duration: 100 }),
    );

    // Should be entering since starting as open
    expect(result.current.isEntering).toBe(true);
    expect(result.current.isExiting).toBe(false);

    // Wait for animation to complete
    await waitFor(
      () => {
        expect(result.current.isEntering).toBe(false);
      },
      { timeout: 200 },
    );
  });

  it('should clean up timeouts on unmount', () => {
    vi.useFakeTimers();

    const { result, rerender, unmount } = renderHook(
      ({ isOpen }) => useEnterExitAnimation(isOpen, { duration: 200 }),
      { initialProps: { isOpen: false } },
    );

    rerender({ isOpen: true });
    expect(result.current.isEntering).toBe(true);

    // Unmount before timer completes
    unmount();

    // Advance timers - should not cause errors
    vi.advanceTimersByTime(300);

    vi.useRealTimers();
  });

  it('should handle rapid open/close transitions', async () => {
    const { result, rerender } = renderHook(
      ({ isOpen }) => useEnterExitAnimation(isOpen, { duration: 100 }),
      { initialProps: { isOpen: false } },
    );

    // Open
    rerender({ isOpen: true });
    expect(result.current.isEntering).toBe(true);
    expect(result.current.isExiting).toBe(false);

    // Immediately close before enter animation completes
    rerender({ isOpen: false });
    expect(result.current.isEntering).toBe(false);
    expect(result.current.isExiting).toBe(true);

    // Wait for exit animation to complete
    await waitFor(
      () => {
        expect(result.current.isExiting).toBe(false);
      },
      { timeout: 200 },
    );
  });
});
