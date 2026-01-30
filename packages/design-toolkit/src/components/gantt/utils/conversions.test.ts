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

import { describe, expect, it } from 'vitest';
import { MS_PER_HOUR, MS_PER_MINUTE, TIME_MARKER_WIDTH } from '../constants';
import {
  getMsPerPx,
  getMsRepresentedInViewableRegion,
  getTotalTimelineMs,
  getTotalTimelineWidth,
} from './conversions';

describe('getMsPerPx', () => {
  it('should calculate milliseconds per pixel for 1 hour timescale', () => {
    const timescale = '1h';
    const result = getMsPerPx(timescale);
    expect(result).toBe(MS_PER_HOUR / TIME_MARKER_WIDTH);
  });
});

describe('getTotalTimelineMs', () => {
  it('should handle same start and end time', () => {
    const startTimeMs = 1000;
    const endTimeMs = 1000;
    const result = getTotalTimelineMs(startTimeMs, endTimeMs);
    expect(result).toBe(0);
  });

  it('should calculate duration across days', () => {
    const startTimeMs = new Date('2026-01-01T12:00:00Z').getTime();
    const endTimeMs = new Date('2026-01-03T18:00:00Z').getTime();
    const result = getTotalTimelineMs(startTimeMs, endTimeMs);
    expect(result).toBe(MS_PER_HOUR * 54);
  });
});

describe('getTotalTimelineWidth', () => {
  it('should calculate width for 24 hour timeline', () => {
    const totalTimelineMs = MS_PER_HOUR * 24;
    const msPerPx = MS_PER_HOUR;
    const result = getTotalTimelineWidth(totalTimelineMs, msPerPx);
    expect(result).toBe(24);
  });
});

describe('getMsRepresentedInViewableRegion', () => {
  it('should calculate milliseconds for typical viewport width', () => {
    const viewableRegionWidth = 1920;
    const msPerPx = MS_PER_MINUTE;
    const result = getMsRepresentedInViewableRegion(
      viewableRegionWidth,
      msPerPx,
    );
    expect(result).toBe(1920 * MS_PER_MINUTE);
  });
});
