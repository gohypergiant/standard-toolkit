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
import { MS_PER_HOUR, TIMELINE_CHUNK_WIDTH } from '../constants';
import { deriveRangeElementLayout, deriveTranslateXValue } from './layout';
import type { TimelineChunkObject } from '../types';

describe('deriveTranslateXValue', () => {
  describe('empty timeline chunks', () => {
    it('should return 0 when timelineChunks array is empty', () => {
      const result = deriveTranslateXValue(MS_PER_HOUR, [], 0);
      expect(result).toBe(0);
    });
  });

  describe('basic translation calculation', () => {
    // The value for translateX will always be negative because we handle generating
    // timeline chunks before the current position. currentPositionMs will never be less than timelineChunks[0].timestampMs
    it('should calculate negative translateX when first chunk is before current position', () => {
      const currentPositionMs = 1000;
      const msPerPx = 10;
      const timelineChunks: TimelineChunkObject[] = [{ timestampMs: 500 }];
      const result = deriveTranslateXValue(
        msPerPx,
        timelineChunks,
        currentPositionMs,
      );

      expect(result).toBe(-50);
    });
  });

  describe('realistic scenarios with hours', () => {
    const msPerPx = MS_PER_HOUR / TIMELINE_CHUNK_WIDTH;

    it('should calculate translation for 1 hour offset', () => {
      const currentPositionMs = new Date('2026-02-01T13:00:00.000Z').getTime();
      const firstChunkMs = new Date('2026-02-01T12:00:00.000Z').getTime();
      const timelineChunks: TimelineChunkObject[] = [
        { timestampMs: firstChunkMs },
      ];

      const result = deriveTranslateXValue(
        msPerPx,
        timelineChunks,
        currentPositionMs,
      );

      expect(result).toBe(-TIMELINE_CHUNK_WIDTH);
    });
  });

  describe('precision', () => {
    it('should maintain precision with millisecond-level differences', () => {
      const currentPositionMs = 1001;
      const firstChunkMs = 1000;
      const msPerPx = 1;
      const timelineChunks: TimelineChunkObject[] = [
        { timestampMs: firstChunkMs },
      ];

      const result = deriveTranslateXValue(
        msPerPx,
        timelineChunks,
        currentPositionMs,
      );

      expect(result).toBe(-1);
    });
  });

  describe('deriveRangeElementLayout', () => {
    const currentPositionMs = 1200;
    const renderedRegion = { startMs: 1000, endMs: 2000 };
    const msPerPx = 10;

    it('calculates translateX and width for a range fully inside the rendered region', () => {
      const elementRange = {
        startMs: 1100,
        endMs: 1500,
      };

      const { translateX, widthPx } = deriveRangeElementLayout(
        renderedRegion,
        elementRange,
        msPerPx,
        currentPositionMs,
      );

      expect(translateX).toBe(
        (elementRange.startMs - currentPositionMs) / msPerPx,
      );
      expect(widthPx).toBe(40);
    });

    it('handles a range that starts before the rendered region', () => {
      const elementRange = {
        startMs: 900,
        endMs: 1500,
      };

      const { translateX, widthPx } = deriveRangeElementLayout(
        renderedRegion,
        elementRange,
        msPerPx,
        currentPositionMs,
      );

      expect(translateX).toBe(
        (renderedRegion.startMs - currentPositionMs) / msPerPx,
      );
      expect(widthPx).toBe(50);
    });

    it('handles a range that ends after the rendered region', () => {
      const elementRange = {
        startMs: 1900,
        endMs: 2200,
      };

      const { translateX, widthPx } = deriveRangeElementLayout(
        renderedRegion,
        elementRange,
        msPerPx,
        currentPositionMs,
      );

      expect(translateX).toBe(
        (elementRange.startMs - currentPositionMs) / msPerPx,
      );
      expect(widthPx).toBe(10);
    });
  });
});
