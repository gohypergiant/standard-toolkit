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

import { BUFFERED_CHUNK_COUNT, TIMELINE_CHUNK_WIDTH } from '../constants';
import { getMsRepresentedInViewableRegion } from './conversions';
import { roundDateToInterval } from './dates';
import type { TimelineChunkObject } from '../types';

export function generateTimelineChunks(
  currentPositionMs: number,
  viewableRegionWidth: number,
  selectedTimeIntervalMs: number,
  msPerPx: number,
): TimelineChunkObject[] {
  if (viewableRegionWidth === 0) {
    return [];
  }

  const offsetMs =
    getMsRepresentedInViewableRegion(viewableRegionWidth, msPerPx) / 2;

  const proposedChunkCount =
    Math.ceil(viewableRegionWidth / TIMELINE_CHUNK_WIDTH) +
    BUFFERED_CHUNK_COUNT;

  const chunksInViewableRegion =
    proposedChunkCount % 2 === 0 ? proposedChunkCount + 1 : proposedChunkCount;

  const midpointMs = currentPositionMs + offsetMs;
  const midpointIndex = Math.floor(chunksInViewableRegion / 2);

  const workerDate = new Date(midpointMs);
  roundDateToInterval(workerDate, selectedTimeIntervalMs);
  const roundedMidpointMs = workerDate.getTime();

  const chunks: TimelineChunkObject[] = [];

  for (let i = 0; i < chunksInViewableRegion; i++) {
    const chunkTimestampMs =
      roundedMidpointMs + selectedTimeIntervalMs * (i - midpointIndex);

    chunks.push({
      timestampMs: chunkTimestampMs,
    });
  }

  return chunks;
}
