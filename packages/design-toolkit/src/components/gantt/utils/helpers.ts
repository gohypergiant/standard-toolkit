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

import { TIMELINE_CHUNK_WIDTH } from '../constants';
import type { UIEvent } from 'react';
import type { TimeBounds, TimelineChunkObject } from '../types';

export function getViewableRegionWidth(element: HTMLElement | null) {
  if (!element) {
    return 0;
  }

  return element.clientWidth;
}

export function getHorizontalScrolledPixels(event: UIEvent<HTMLDivElement>) {
  const { currentTarget } = event;

  return currentTarget.scrollLeft;
}

export function getVerticalScrolledPixels(event: UIEvent<HTMLDivElement>) {
  const { currentTarget } = event;

  return currentTarget.scrollTop;
}

export function getRenderedRegionBoundsMs(
  timeMarkers: TimelineChunkObject[],
  msPerPx: number,
): TimeBounds {
  if (timeMarkers.length === 0) {
    return { startMs: 0, endMs: 0 };
  }

  const firstMarker = timeMarkers[0] as TimelineChunkObject;
  const lastMarker = timeMarkers[timeMarkers.length - 1] as TimelineChunkObject;

  return {
    startMs: firstMarker.timestampMs,
    endMs: lastMarker.timestampMs + TIMELINE_CHUNK_WIDTH * msPerPx,
  };
}

export function shouldRenderRangeElement(
  renderedRegionBoundary: TimeBounds,
  rangeElementTimeBounds: TimeBounds,
) {
  const { startMs: blockStartMs, endMs: blockEndMs } = rangeElementTimeBounds;
  const { startMs, endMs } = renderedRegionBoundary;

  const startsBeforeRegionStart =
    blockStartMs < startMs && blockEndMs > startMs;
  const isEntirelyWithinRegion = blockStartMs >= startMs && blockEndMs <= endMs;
  const endsAftgerRegionEnd = blockStartMs < endMs && blockEndMs > endMs;
  return (
    startsBeforeRegionStart || isEntirelyWithinRegion || endsAftgerRegionEnd
  );
}
