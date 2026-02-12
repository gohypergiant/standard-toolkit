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
import { useTimelineTransform } from './';
import type React from 'react';

const mocks = vi.hoisted(() => {
  const returnedTranslateXValue = -100;

  return {
    returnedTranslateXValue,
    deriveTranslateXValue: vi.fn(() => returnedTranslateXValue),
  };
});

vi.mock('../../../hooks/use-layout-subscription', () => ({
  useLayoutSubscription: vi.fn(),
}));

vi.mock('../../../utils/layout', () => ({
  deriveTranslateXValue: vi.fn(),
}));

const mockTimelineChunks = [
  { timestampMs: 1000 },
  { timestampMs: 1500 },
  { timestampMs: 2000 },
  { timestampMs: 2500 },
  { timestampMs: 3000 },
];

import { useLayoutSubscription } from '../../../hooks/use-layout-subscription';
import { deriveTranslateXValue } from '../../../utils/layout';

describe('useTimelineTransform', () => {
  const capturedCallbackHarness: { callback?: (ms: number) => void } = {};

  beforeEach(() => {
    vi.mocked(useLayoutSubscription).mockImplementation(
      ({ callback }: { callback: (ms: number) => void }) => {
        // Capture callback passed into useLayoutSubscription
        capturedCallbackHarness.callback = callback;
      },
    );

    vi.mocked(deriveTranslateXValue).mockImplementation(
      mocks.deriveTranslateXValue,
    );
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('updates element transform when subscription callback runs', () => {
    const div = document.createElement('div');
    const ref = { current: div } as React.RefObject<HTMLDivElement>;

    renderHook(() =>
      useTimelineTransform({
        timelineElementRef: ref,
        timelineChunks: mockTimelineChunks,
        msPerPx: 10,
      }),
    );

    const updatedTimestampMs = 775;

    // simulate store update that triggers the subscription callback
    capturedCallbackHarness.callback?.(updatedTimestampMs);

    expect(div.style.transform).toBe(
      `translateX(${mocks.returnedTranslateXValue}px)`,
    );
  });

  it('does nothing if elementRef.current is null', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;

    renderHook(() =>
      useTimelineTransform({
        timelineElementRef: ref,
        msPerPx: 10,
        timelineChunks: mockTimelineChunks,
      }),
    );

    expect(() => capturedCallbackHarness.callback?.(123)).not.toThrow();
    expect(mocks.deriveTranslateXValue).not.toHaveBeenCalled();
  });
});
