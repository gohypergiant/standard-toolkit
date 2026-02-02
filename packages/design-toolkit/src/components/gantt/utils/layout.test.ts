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
import { MS_PER_HOUR, TIME_MARKER_WIDTH } from '../constants';
import { deriveTranslateXValue } from './layout';
import type { TimeMarkerObject } from '../types';

describe('deriveTranslateXValue', () => {
  describe('empty time markers', () => {
    it('should return 0 when timeMarkers array is empty', () => {
      const result = deriveTranslateXValue(MS_PER_HOUR, [], 0);
      expect(result).toBe(0);
    });
  });

  describe('basic translation calculation', () => {
    // The value for translateX will always be negative because we handle generating
    // time markers before the current position. currentPositionMs will never be less than timeMarkers[0].timestampMs
    it('should calculate negative translateX when first marker is before current position', () => {
      const currentPositionMs = 1000;
      const msPerPx = 10;
      const timeMarkers: TimeMarkerObject[] = [{ timestampMs: 500 }];

      const result = deriveTranslateXValue(
        msPerPx,
        timeMarkers,
        currentPositionMs,
      );

      expect(result).toBe(-50);
    });
  });

  describe('realistic scenarios with hours', () => {
    const msPerPx = MS_PER_HOUR / TIME_MARKER_WIDTH;

    it('should calculate translation for 1 hour offset', () => {
      const currentPositionMs = new Date('2026-02-01T13:00:00.000Z').getTime();
      const firstMarkerMs = new Date('2026-02-01T12:00:00.000Z').getTime();
      const timeMarkers: TimeMarkerObject[] = [{ timestampMs: firstMarkerMs }];

      const result = deriveTranslateXValue(
        msPerPx,
        timeMarkers,
        currentPositionMs,
      );

      expect(result).toBe(-TIME_MARKER_WIDTH);
    });
  });

  describe('precision', () => {
    it('should maintain precision with millisecond-level differences', () => {
      const currentPositionMs = 1001;
      const firstMarkerMs = 1000;
      const msPerPx = 1;
      const timeMarkers: TimeMarkerObject[] = [{ timestampMs: firstMarkerMs }];

      const result = deriveTranslateXValue(
        msPerPx,
        timeMarkers,
        currentPositionMs,
      );

      expect(result).toBe(-1);
    });
  });
});
