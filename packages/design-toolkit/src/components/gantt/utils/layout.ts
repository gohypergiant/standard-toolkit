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

import { GANTT_ROW_HEIGHT_PX, ROW_VIRTUALIZATION_OVERSCAN } from '../constants';
import type { TimeBounds, TimelineChunkObject } from '../types';

export function deriveTranslateXValue(
  msPerPx: number,
  timelineChunks: TimelineChunkObject[],
  currentPositionMs: number,
) {
  const firstTimelineChunk = timelineChunks[0];

  if (!firstTimelineChunk) {
    return 0;
  }

  const timeOutsideViewableRegion =
    firstTimelineChunk.timestampMs - currentPositionMs;

  return timeOutsideViewableRegion / msPerPx;
}

function deriveElementTranslateX(
  renderedRegionBounds: TimeBounds,
  elementStartMs: number,
  totalBounds: TimeBounds,
  msPerPx: number,
) {
  const distanceFromTimelineStart =
    (elementStartMs - totalBounds.startMs) / msPerPx;
  const offsetMs = renderedRegionBounds.startMs - elementStartMs;
  const offsetPx = offsetMs > 0 ? offsetMs / msPerPx : 0;
  return distanceFromTimelineStart + offsetPx;
}

export function deriveRangeElementLayout(
  renderedRegionBounds: TimeBounds,
  rangeElementBounds: TimeBounds,
  totalBounds: TimeBounds,
  msPerPx: number,
) {
  const renderedStartMs = Math.max(
    renderedRegionBounds.startMs,
    rangeElementBounds.startMs,
  );
  const renderedEndMs = Math.min(
    renderedRegionBounds.endMs,
    rangeElementBounds.endMs,
  );

  const translateX = deriveElementTranslateX(
    renderedRegionBounds,
    rangeElementBounds.startMs,
    totalBounds,
    msPerPx,
  );

  const widthPx = (renderedEndMs - renderedStartMs) / msPerPx;

  return { translateX, widthPx };
}

export function derivePointElementLayout(
  renderedRegionBounds: TimeBounds,
  pointElementMs: number,
  totalBounds: TimeBounds,
  msPerPx: number,
) {
  const translateX = deriveElementTranslateX(
    renderedRegionBounds,
    pointElementMs,
    totalBounds,
    msPerPx,
  );

  return { translateX };
}

export function deriveRenderedSlice(
  scrollPx: number,
  viewableRegionHeightPx: number,
) {
  const startIndex = Math.floor(scrollPx / GANTT_ROW_HEIGHT_PX);

  const viewableItems = Math.ceil(viewableRegionHeightPx / GANTT_ROW_HEIGHT_PX);

  const proposedRenderedItemsCount =
    viewableItems + ROW_VIRTUALIZATION_OVERSCAN;

  const itemsCountEvent = proposedRenderedItemsCount % 2 === 0;
  const itemsCount = itemsCountEvent
    ? proposedRenderedItemsCount + 1
    : proposedRenderedItemsCount;

  return {
    start: startIndex,
    end: startIndex + itemsCount,
  };
}
