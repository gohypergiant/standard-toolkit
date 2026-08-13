// __private-exports
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

import { TIMELINE_CHUNK_WIDTH_PX } from '../constants';
import type { UIEvent } from 'react';
import type { GanttTimeBounds, GanttTimelineChunkObject } from '../types';

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
  timeMarkers: GanttTimelineChunkObject[],
  msPerPx: number,
): GanttTimeBounds {
  if (timeMarkers.length === 0) {
    return { startMs: 0, endMs: 0 };
  }

  const firstMarker = timeMarkers[0] as GanttTimelineChunkObject;
  const lastMarker = timeMarkers[
    timeMarkers.length - 1
  ] as GanttTimelineChunkObject;

  return {
    startMs: firstMarker.timestampMs,
    endMs: lastMarker.timestampMs + TIMELINE_CHUNK_WIDTH_PX * msPerPx,
  };
}

export function shouldRenderRangeElement(
  renderedRegionBoundary: GanttTimeBounds,
  rangeElementTimeBounds: GanttTimeBounds,
) {
  const { startMs: rangeStartMs, endMs: rangeEndMs } = rangeElementTimeBounds;
  const { startMs, endMs } = renderedRegionBoundary;

  const startsBeforeRegionStart =
    rangeStartMs < startMs && rangeEndMs > startMs;
  const isEntirelyWithinRegion = rangeStartMs >= startMs && rangeEndMs <= endMs;
  const endsAfterRegionEnd = rangeStartMs < endMs && rangeEndMs > endMs;
  return (
    startsBeforeRegionStart || isEntirelyWithinRegion || endsAfterRegionEnd
  );
}

export function timestampWithinBounds(
  timestampMs: number,
  bounds: GanttTimeBounds,
) {
  return timestampMs >= bounds.startMs && timestampMs <= bounds.endMs;
}

export function shouldRenderCurrentTime(
  currentTimeMs: number,
  renderedRegionBounds: GanttTimeBounds,
) {
  return timestampWithinBounds(currentTimeMs, renderedRegionBounds);
}
