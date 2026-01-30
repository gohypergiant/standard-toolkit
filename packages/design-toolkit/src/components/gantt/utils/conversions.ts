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

import { TIME_MARKER_WIDTH, TIMESCALE_MAPPING } from '../constants';
import type { Timescale } from '../types';

export function getMsPerPx(timescale: Timescale) {
  return TIMESCALE_MAPPING[timescale] / TIME_MARKER_WIDTH;
}

export function getTotalTimelineMs(startTimeMs: number, endTimeMs: number) {
  return endTimeMs - startTimeMs;
}

export function getTotalTimelineWidth(
  totalTimelineMs: number,
  msPerPx: number,
) {
  return totalTimelineMs / msPerPx;
}

export function getMsRepresentedInViewableRegion(
  viewableRegionWidth: number,
  msPerPx: number,
) {
  return viewableRegionWidth * msPerPx;
}
