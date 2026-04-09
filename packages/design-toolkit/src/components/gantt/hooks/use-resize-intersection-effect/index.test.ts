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

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useResizeIntersectionEffect } from './index';
import type { GanttTimelineChunkObject } from '../../types';

describe('useResizeIntersectionEffect', () => {
  const observeMock = vi.fn();
  const disconnectMock = vi.fn();
  let intersectionObserverCallback: IntersectionObserverCallback;

  const expansionThresholdChunk = { timestampMs: 3000 };
  const contractionThresholdChunk = { timestampMs: 1000 };
  const timelineChunks: GanttTimelineChunkObject[] = [
    contractionThresholdChunk,
    { timestampMs: 2000 },
    expansionThresholdChunk,
  ];

  beforeEach(() => {
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        intersectionObserverCallback = callback;
      }
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = vi.fn();
      takeRecords = vi.fn();
      root = null;
      rootMargin = '';
      thresholds = [];
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('does not set up observer when container element is null', () => {
    renderHook(() =>
      useResizeIntersectionEffect({
        timelineContainerElement: null,
        timelineChunks,
      }),
    );

    expect(observeMock).not.toHaveBeenCalled();
  });

  it('does not set up observer when threshold elements are missing', () => {
    const container = document.createElement('div');

    renderHook(() =>
      useResizeIntersectionEffect({
        timelineContainerElement: container,
        timelineChunks,
      }),
    );

    expect(observeMock).not.toHaveBeenCalled();
  });

  it('sets up observer and observes expansion and contraction elements', () => {
    const container = document.createElement('div');

    const expansionElement = document.createElement('div');
    expansionElement.setAttribute(
      'data-timestamp',
      `${expansionThresholdChunk.timestampMs}`,
    );
    const contractionElement = document.createElement('div');
    contractionElement.setAttribute(
      'data-timestamp',
      `${contractionThresholdChunk.timestampMs}`,
    );

    container.append(expansionElement, contractionElement);
    document.body.appendChild(container);

    renderHook(() =>
      useResizeIntersectionEffect({
        timelineContainerElement: container,
        timelineChunks,
      }),
    );

    expect(observeMock).toHaveBeenCalledTimes(2);
    expect(observeMock).toHaveBeenCalledWith(expansionElement);
    expect(observeMock).toHaveBeenCalledWith(contractionElement);
  });

  it('triggers re-render when expansion element intersects', () => {
    const container = document.createElement('div');

    const expansionElement = document.createElement('div');
    expansionElement.setAttribute(
      'data-timestamp',
      `${expansionThresholdChunk.timestampMs}`,
    );

    const contractionElement = document.createElement('div');
    contractionElement.setAttribute(
      'data-timestamp',
      `${contractionThresholdChunk.timestampMs}`,
    );

    container.append(expansionElement, contractionElement);
    document.body.appendChild(container);

    let renderCount = 0;
    renderHook(() => {
      renderCount++;
      useResizeIntersectionEffect({
        timelineContainerElement: container,
        timelineChunks,
      });
    });

    const renderCountAfterMount = renderCount;

    act(() => {
      intersectionObserverCallback(
        [
          {
            target: expansionElement,
            isIntersecting: true,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRatio: 1,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: 0,
          },
        ],
        {} as IntersectionObserver,
      );
    });

    expect(renderCount).toBeGreaterThan(renderCountAfterMount);
  });

  it('triggers re-render when contraction element stops intersecting', () => {
    const container = document.createElement('div');

    const expansionElement = document.createElement('div');
    expansionElement.setAttribute('data-timestamp', '3000');

    const contractionElement = document.createElement('div');
    contractionElement.setAttribute('data-timestamp', '1000');

    container.append(expansionElement, contractionElement);
    document.body.appendChild(container);

    let renderCount = 0;
    renderHook(() => {
      renderCount++;
      useResizeIntersectionEffect({
        timelineContainerElement: container,
        timelineChunks,
      });
    });

    const renderCountAfterMount = renderCount;

    act(() => {
      intersectionObserverCallback(
        [
          {
            target: contractionElement,
            isIntersecting: false,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRatio: 0,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: 0,
          },
        ],
        {} as IntersectionObserver,
      );
    });

    expect(renderCount).toBeGreaterThan(renderCountAfterMount);
  });

  it('disconnects observer on cleanup', () => {
    const container = document.createElement('div');

    const expansionElement = document.createElement('div');
    expansionElement.setAttribute('data-timestamp', '3000');

    const contractionElement = document.createElement('div');
    contractionElement.setAttribute('data-timestamp', '1000');

    container.append(expansionElement, contractionElement);
    document.body.appendChild(container);

    const { unmount } = renderHook(() =>
      useResizeIntersectionEffect({
        timelineContainerElement: container,
        timelineChunks,
      }),
    );

    unmount();
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});
