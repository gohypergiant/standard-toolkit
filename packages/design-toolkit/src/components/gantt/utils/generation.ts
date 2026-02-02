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

import { OUT_OF_VIEW_MARKER_COUNT, TIME_MARKER_WIDTH } from '../constants';
import { getMsRepresentedInViewableRegion } from './conversions';
import { roundDateToInterval } from './dates';
import type { TimeMarkerObject } from '../types';

export function generateTimeMarkers(
  currentPositionMs: number,
  viewableRegionWidth: number,
  selectedTimeIntervalMs: number,
  msPerPx: number,
): TimeMarkerObject[] {
  if (viewableRegionWidth === 0) {
    return [];
  }

  const offsetMs =
    getMsRepresentedInViewableRegion(viewableRegionWidth, msPerPx) / 2;

  const proposedMarkerCount =
    Math.ceil(viewableRegionWidth / TIME_MARKER_WIDTH) +
    OUT_OF_VIEW_MARKER_COUNT;

  const markersInViewableRegion =
    proposedMarkerCount % 2 === 0
      ? proposedMarkerCount + 1
      : proposedMarkerCount;

  const midpointMs = currentPositionMs + offsetMs;
  const midpointIndex = Math.floor(markersInViewableRegion / 2);

  const workerDate = new Date(midpointMs);
  roundDateToInterval(workerDate, selectedTimeIntervalMs);
  const roundedMidpointMs = workerDate.getTime();

  const markers: TimeMarkerObject[] = [];

  for (let i = 0; i < markersInViewableRegion; i++) {
    const markerTimestampMs =
      roundedMidpointMs + selectedTimeIntervalMs * (i - midpointIndex);

    markers.push({
      timestampMs: markerTimestampMs,
    });
  }

  return markers;
}
