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

import { HOURS_MAPPING, MINUTES_MAPPING } from './constants';
import type { TimeMarkerObject } from './types';

export function deriveTranslateXValue(
  msPerPx: number,
  timeMarkers: TimeMarkerObject[],
  currentPositionMs: number,
) {
  const firstTimeMarker = timeMarkers[0];

  if (!firstTimeMarker) {
    return 0;
  }

  // const offsetMs = viewableRegionTimeMs / 2;
  // const midpointMs = currentPositionMs + offsetMs;

  // const timestampAtStartOfViewableRegion =

  const timeOutsideViewableRegion =
    firstTimeMarker.timestampMs - currentPositionMs;
  return timeOutsideViewableRegion / msPerPx;
}

function msToSeconds(valueMs: number) {
  return valueMs / 1000;
}

function msToMinutes(valueMs: number) {
  return msToSeconds(valueMs) / 60;
}

function msToHours(valueMs: number) {
  return msToMinutes(valueMs) / 60;
}

const hoursIntervals = Object.values(HOURS_MAPPING);
const minutesIntervals = Object.values(MINUTES_MAPPING);

export function roundDateToInterval(
  date: Date,
  selectedTimeIntervalMs: number,
) {
  const isHoursInterval = hoursIntervals.includes(selectedTimeIntervalMs);
  const isMinutesInterval = minutesIntervals.includes(selectedTimeIntervalMs);

  if (isHoursInterval) {
    const hour = date.getUTCHours();
    const differenceFromInterval = hour % msToHours(selectedTimeIntervalMs);

    date.setUTCHours(hour - differenceFromInterval);
    date.setUTCMinutes(0);
  }

  if (isMinutesInterval) {
    const minute = date.getUTCMinutes();
    const differenceFromInterval = minute % msToMinutes(selectedTimeIntervalMs);

    date.setUTCMinutes(minute - differenceFromInterval);
  }

  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
}
